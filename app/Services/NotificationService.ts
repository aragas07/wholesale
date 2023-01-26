import  log  from './LogService'
import Notification from "App/Models/Notification";
import ErrorService, {errorCodes} from "./ErrorService";

interface error {
    httpCode: Number;
    message: String;
    details: Object;
    code: Object,
}
export default class NotificationService {
    notification_id: number;
    errorService: ErrorService;
    log: log;
    auth: any;
    error: error;
    notificationBody: Notification;

    constructor(props){
        this.notification_id = props.notification_id
        this.auth = props.auth
        this.notificationBody = props.notificationBody;
    }

    async countNoti(){

    }

    async newListingAdmin(){
        this.notificationBody.notification_type = "ADMIN_GLOBAL"
        await this.createNotification()
    }

    async createNotification(){
        var notif = new Notification;
        notif.notification_type = this.notificationBody.notification_type;
        notif.message = this.notificationBody.message;
        notif.listing_id = this.notificationBody.listing_id;
        notif.notification_user_id = this.notificationBody.notification_user_id;
        notif.user_id = this.notificationBody.user_id;
        
        await notif.save();

        return notif;
    }

    async getNotifications(){
        // console.log(this.auth)
        // var notif = await Notification.query().where('user_id', this.auth.user.id).where(build => {
        //     if(this.auth.user.user_type == "ADMIN"){
        //         build.where('notification_type', 'ADMIN_GLOBAL')
        //         build.orWhere('notification_type', '')
        //     }
        //     if(this.auth.user.user_type != "ADMIN"){
        //         //do something.
        //     }
        // })

        var notif = await Notification.query().where(builder => {
            if(this.auth.user.user_type == "ADMIN"){
                builder.where('user_id', this.auth.user.id).orderBy('created_at', 'desc');
                builder.where('notification_type', 'ADMIN_GLOBAL').orWhere('notification_type', null).orderBy('created_at', 'desc');
            }
            if(this.auth.user.user_type == "CUSTOMER" || this.auth.user.user_type == "WHOLESALER" ){
                builder.where('user_id', this.auth.user.id).orderBy('created_at');
            }
        })

        // if(this.auth.user.user_type == "ADMIN") 

        if(!notif){
            this.log.error(`Get notifications error`)
            return new ErrorService().returnError(errorCodes.ERROR_GET_NOTIFICATIONS, null)
            return false;
        }

        let returndata = {
            data: notif
        }

        return returndata;
    }

    async readAllNotifications(){
        var notif = await Notification.query().where('user_id', this.auth.user.id).where("is_read", false)
        if(!notif){
            this.log.error(`Get notifications error`)
            return new ErrorService().returnError(errorCodes.ERROR_GET_NOTIFICATIONS, null)
            return false;
        }

        notif.map(async entry => {
            const x = await Notification.find(entry.id);
            if(x!=null){
                x.is_read = true;
                await x?.save();
            }
        })

        let returndata = {
            results: "Saved."
        }

        return returndata;
    }

    async readNotification(){
        var notif = await Notification.find(this.notification_id)
        if(!notif){
            this.log.error(`Get notifications error`)
            return new ErrorService().returnError(errorCodes.ERROR_GET_NOTIFICATIONS, null)
            return false;
        }

        notif.is_read = true;
        await notif.save();

        let returndata = {
            data: notif
        }

        return returndata;
    }   
}