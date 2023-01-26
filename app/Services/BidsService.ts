import Bid from "App/Models/Bid";
import Listing from "App/Models/Listing";
import env from "env";
import ErrorService, {errorCodes} from "./ErrorService";
import log from "./LogService";
import NotificationService from "./NotificationService";

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
    user_id: number;
    listing_id: number;
    bid_value:number;
    error:error

    constructor(props){
        this.id = props.id;
        this.page = props.page;
        this.data = props;
        this.itemsPerRow = props.itemsPerRow;
        this.bid_value = props.bid_value;
        this.listing_id = props.listing_id;
        this.user_id = props.user_id;
        this.returnData = {}
        this.log = new log(this)
        this.errorService = new ErrorService()
    }

    async getBidsByUser(){
        try{
            if(!this.user_id){
                this.errorService.returnError(errorCodes.INVALID_REQUEST, {message: "Invalid Request!"})
                return false
            }
            let x = await Bid.query().preload('listing', (query)=>{
                query.preload('cover')
            }).where('user_id', this.user_id).orderBy('created_at', 'desc');

            return x;
        }catch(e){
            this.log.error("BidService error")
            this.log.error(e)
            this.errorService.returnError(errorCodes.ERROR_UNKNOWN, {message: "Bid Service error", details:e})
            return false;
        }
    }

    async getBidsByListing(){
        try{
            let x = await Bid.query().preload('listing').preload('user').where('listing_id', this.listing_id).orderBy('created_at', 'desc');
            return {data:x};
        }catch(e){
            this.log.error("BidService error")
            this.log.error(e)
            this.errorService.returnError(errorCodes.ERROR_UNKNOWN, {message: "Bid Service error", details:e})
            return false;
        }
    }

    async bid(){
        let x = await Listing.find(this.listing_id)
        if(!x){
            this.log.info("Listing not found")
            this.error = this.errorService.returnError(errorCodes.LISTING_NOT_FOUND, null)
            return false;
        }

        let qBid = await Bid.query().where('listing_id', this.listing_id).orderBy('value', "desc");

        if(qBid && qBid.length > 0){
            if( this.bid_value <= qBid[0].value ){
                this.log.info("Bid error for item id:"+ this.listing_id +" by user_id: "+ this.user_id)
                this.error = this.errorService.returnError(errorCodes.BID_ERROR, {message: "You are bidding lesser than the minimum!"})
                return false;
            }
        }

        let nBid = new Bid()
        nBid.user_id = this.user_id;
        nBid.listing_id = this.listing_id;
        nBid.value = this.bid_value

        await nBid.save();

        let notif = new NotificationService({message: ""});

        return nBid;
    }
    
}