import Listing from "App/Models/Listing";
import Env from '@ioc:Adonis/Core/Env'
import ErrorService, {errorCodes} from "./ErrorService";
import log from "./LogService";
import NotificationService from "./NotificationService";
import FileUploadService from "./FileUploadService";

interface listing {
    name:string
    description:string
    address:string
    make_of_vehicle:string
    year_of_vehicle:string
    model:string
    trim:string
    mileage:string
    vin_number:string
    disclaimers:string
    user_id:number
}

interface error {
    httpCode: Number;
    message: String;
    details: Object;
    code: Object,
}
interface search {
    priceMin: number
    priceMax: number
    filter: object
    id: number
}
export default class ListingService {
    id: number
    page: number
    itemsPerRow: number
    returnData:Object
    log:log
    errorService: ErrorService
    data:listing;
    priceMin: number;
    priceMax: number;
    name: string
    maker: string
    searchParams: Object;
    images:Array<Object>;
    auth:Object
    action:string;

    constructor(props){
        this.id = props?.id;
        this.page = props?.page;
        this.data = props;
        this.itemsPerRow = props?.itemsPerRow;
        this.returnData = {}
        this.log = new log(this)
        this.errorService = new ErrorService
        this.auth = props?.auth;
        this.images = props?.images

        //search options
        this.priceMin = props?.priceMin
        this.priceMax = props?.priceMax
        this.name = props?.name
        this.maker = props?.maker
        this.searchParams = props;

        this.action = props?.action
    }

    async searchListing(){

    }

    async getExtension(path) {
        var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
                                                   // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf(".");       // get last position of `.`
    
        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)
    
        return basename.slice(pos + 1);            // extract extension ignoring `.`
    }
    
    async createListing(){
        console.log('create listing')
        console.log(this.data)

        let query = new Listing

        query.name = this.data.name;
        query.description = this.data.description;
        query.make_of_vehicle = this.data.make_of_vehicle;
        query.year_of_vehicle = this.data.year_of_vehicle;
        query.model = this.data.model;
        query.trim = this.data.trim;
        query.mileage = this.data.mileage;
        query.vin_number = this.data.vin_number;
        query.disclaimers = this.data.disclaimers;
        query.user_id = this.auth.user.id;
        query.hidden = true;
        query.status = "PENDING"

        await query.save();

        if(this.data.images){
            // console.log(this.data.images)
            this.data.images.map(async entry => {
                const filetype = await this.getExtension(entry.data.uri)
              let fileService = await new FileUploadService({
                  file: entry.data.base64,
                  type: entry.type,
                  filetype: filetype,
                  user_id: this.auth.user.id,
                  listing_id: query.id
              })  

              let results = await fileService.processBase64File()

              if(!results){
                  this.log.error("File creation failed")
              }
            })
        }
        



        console.log('created new listing')

        let notifBody = {
            message: "A Wholesaler has submitted a new entry and is pending approval.",
            listing_id: query.id,
            user_id: this.auth.user.id
        }
        var b = new NotificationService({notificationBody:notifBody})
        var c = b.newListingAdmin();

        this.log.info(c)

        return query;
    }

    async actionListing(){
        let query = await Listing.findOrFail(this.id)
        console.log(this.action)
        if(!query){
            this.log.info("Record not found");
            return false
            // this.error = this.errorService.details()
        }

        if(this.action == "HIDE"){
            query.hidden = true;
        }
        if(this.action == "SHOW"){
            query.hidden = false;
        }

        await query.save()

        return query
    }

    async updateListing(){
        let query = await Listing.findOrFail(this.id)
        if(!query){
            this.log.info("Record not found");
            this.error = this.errorService.details()
        }

        query.name = this.data.name;
        query.description = this.data.description;
        query.make_of_vehicle = this.data.make_of_vehicle;
        query.year_of_vehicle = this.data.year_of_vehicle;
        query.model = this.data.model;
        query.trim = this.data.trim;
        query.milage = this.data.mileage;
        query.vin_number = this.data.vin_number;
        query.disclaimers = this.data.disclaimers;

        await query.save();

        return query;
    }

    async deleteListing(){
        let query = await Listing.findOrFail(this.id)
        if(!query){
            this.log.info("Record not found");
            this.error = this.errorService.details()
        }
        if(Env.get('DELETE_PERM')){
            await query?.delete()
        }else{
            query.is_archived = true
            await query.save();
        }

        return query
    }

    async getListing(){
        let query = await Listing.find(this.id)

        if(!query){
            this.log.info("Record not found");
            this.errorService.returnError(errorCodes.LISTING_NOT_FOUND, null)
            return false
        }

        let attachments = await query?.load('attachments');

        var returndata = {
            attachments: attachments,
            listing: query
        }

        return returndata
    }

    async getListings(){
        try{
            let query = await Listing.query().preload('attachments').where('hidden', false).orderBy('updated_at', 'asc').paginate(this.page, this.itemsPerRow)
            let count = await Listing.query().count('id');
            this.returnData = {
                page: this.page,
                rowPerPage: this.itemsPerRow,
                maxItems: count,
                data: query
            }
            return this.returnData
        } catch (e){
            this.log.error(e)
            this.errorService.returnError(errorCodes.ERROR_UNKNOWN, e)
            return false
        }

    }

    //placeholders
    async getVin(){

    }

    
}