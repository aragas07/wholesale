// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Attachment from "App/Models/Attachment";
import ErrorService, {errorCodes} from "./ErrorService";
import  log  from './LogService'
import Listing from "App/Models/Listing";
import Notification from "App/Models/Notification";

interface error {
    httpCode: Number;
    message: String;
    details: Object;
    code: Object,
}

interface queryUser{
    id: number,
    email: string
    type: string,
    action: "disable" | "verified" | "warn",
    message: string,
    listingId: number,
}

export default class AdminService {
    email:string;
    password:string;
    details:string;
    error: error;
    log: log;
    errorService: ErrorService;
    // registrationDetails: registrationDetails
    queryUser : queryUser
    auth: any;
    id: number;
    notification_id: number;
    user_id: number;
    listing_id: number;
    action_string: string;
    page: number;
    itemsPerRow: number;
    returnData: {}


    constructor(props){
        this.notification_id = props.notification_id;
        this.user_id = props.user_id;
        this.listing_id = props.listing_id;
        this.action_string = props.action_string;
        this.log = new log(this);
        this.errorService = new ErrorService()
        this.auth = props.auth
        this.page = props.page
        this.returnData = {}
    }

    async getUsers(){
        try{
            var x = await User.query().orderBy('firstname').orderBy('lastname')
            let returnData = {
                data : x
            }
            console.log('wtf')
            return {returnData};
        } catch(e){
            this.log.error("AdminService error")
            this.log.error(e)
            this.errorService.returnError(errorCodes.ERROR_UNKNOWN, {message: "Admin Service Error", details:e})
            return false;
        }
    }

    async getListings(){
        try{
            let query = await Listing.query().preload('attachments').orderBy('updated_at', 'asc').paginate(this.page, this.itemsPerRow)
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

    // async action(){
    //     var res;
    //     switch(this.action_string){
    //         case "DELETE_LISTING": res = await this.actionListing();
    //             break;
    //         case "HIDE_LISTING": res = await this.actionListing();
    //         //put more actionable items for users
    //     }
    // }


    // async actionUser(){

    // }

    // async actionListing(){
        
    // }
}
