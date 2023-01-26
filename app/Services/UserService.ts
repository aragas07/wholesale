// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Attachment from "App/Models/Attachment";
import ErrorService, {errorCodes} from "./ErrorService";
import  log  from './LogService'
import Listing from "App/Models/Listing";
import Notification from "App/Models/Notification";
import SMSService from "./SMSService";
import _ from 'lodash'
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

interface registrationDetails{
    firstname: string;
    middlename: string;
    lastname: string;
    phone_number: string;
    address: string;
    company_address: string;
    user_type: string;
}
export default class UserService {
    email:string;
    password:string;
    details:string;
    error: error;
    log: log;
    errorService: ErrorService;
    registrationDetails: registrationDetails
    queryUser : queryUser
    auth: any;
    id: number;
    notification_id: number;


    constructor(props){
        this.notification_id = props.notification_id;
        this.id = props.id
        this.email = props.email
        this.password = props.password
        this.details = props.details ? props.details.split(':') : props.details
        this.log = new log(this);
        this.errorService = new ErrorService()
        this.auth = props.auth

        this.registrationDetails = props.registrationDetails
    }

    async login(authObject){
        this.log.info("User Login: " + this.details[0]);
        
        if(this.details.length < 2){
            return new ErrorService().returnError(errorCodes.ERROR_AUTH_PARSE)
        }
        this.email = this.details[0]
        this.password = this.details[1]

        var results;
        try{
            results = await authObject.use('api').attempt(this.email, this.password)
        }catch(e){
            // console.log(e)
            if(e.message=="E_INVALID_AUTH_PASSWORD: Password mis-match" || e.message == "E_INVALID_AUTH_UID: User not found"){
                this.error = this.errorService.returnError(errorCodes.ERROR_INVALID_LOGIN, e ? e : results);
                this.log.warn("User Failed to Login: " + this.error.message)
            }else{
                this.log.error("Unexpected error has occured")
                this.log.error(this.error)
                this.error = this.errorService.returnError(errorCodes.ERROR_UNKNOWN, e)
            }
            return false
        }
        
        const uDetails = {
            user : results.user,
            type: results.type,
            token: results.token
        }

        return uDetails
    }

    async logout(){
        let res;
        if(this.auth){
            res = await this.auth.logout()
        }

        return res;
    }

    async register(){
        this.email = this.details[0]
        this.password = this.details[1]
        this.log.info("User Registration: " + this.email)

        var userInstance = await User.findBy('email', this.email)
        if(userInstance){
            this.error =  this.errorService.returnError(errorCodes.ERROR_USER_ALREADY_EXISTS, null)
            this.log.warn("User already exists: " + this.email)
            return false;
        }

        userInstance = new User()
        userInstance.email = this.email
        userInstance.password = this.password
        userInstance.firstname = this.registrationDetails.firstname
        userInstance.lastname = this.registrationDetails.lastname
        userInstance.middlename = this.registrationDetails.middlename
        userInstance.phone_number = this.registrationDetails.phone_number
        userInstance.company_address = this.registrationDetails.company_address

        try{
            var res = await userInstance.save();

            const smsService = new SMSService({recipient: userInstance?.phone_number, 
                message: `An Administrator has created you an account for WholeSaler App. \n E:${userInstance?.email}\n P:${this.password[1]}\n Do NOT share these information.`});
            const smsServ = await smsService.sendSMS()

            var returnData = {
                user: res,
                smsFail: false,
            }
            if(!smsServ){
                returnData.smsFail = true;
                returnData.errorDetails = smsServ.details;
            }

            return res;
        } catch (e){
            this.log.error("User registration failed for "+ this.email)
            this.log.error(e)

            this.error = this.errorService.returnError(errorCodes.INTERNAL_SERVER_ERROR, e)
            return false;
        }

    }

    async action(){
        this.log.info(`Set Admin Action`)

        var userInstance = await User.find(this.queryUser.id)

    }

    async getUser(){
        console.log(this)
        this.log.info(`Get user details ${this.id}`)
        var userInstance;
        if(this.id){
            userInstance = await User.find(this.id)
        }

        console.log(userInstance)
 
        if(!userInstance){
            this.log.error(`User ${this.queryUser.email || this.queryUser.id} cannot be found.`)
            this.errorService.returnError(errorCodes.ERROR_USER_NOT_FOUND, null)
            return false;
        }

        return userInstance;
    }

    async getUsers(){
        console.log(this)
        this.log.info(`Get Users`)
        // var userInstance;
        // if(this.id){
        const userInstance = await User.query().orderBy('firstname').orderBy('lastname')
        // }

        console.log(userInstance)
 
        if(!userInstance){
            this.log.error(`Admin Query Error`)
            this.errorService.returnError(errorCodes.ERROR_USER_NOT_FOUND, null)
            return false;
        }

        return {data:userInstance};
    }

    async getUserWithBids(){
        console.log(this)
        if(this.id){
            let userInstance = await User.find(this.id)

            console.log(userInstance)

            var returnData = {
                user: userInstance,
                listings: null,
            }

 
            if(!userInstance){
                this.log.error(`User ${this.queryUser.email || this.queryUser.id} cannot be found.`)
                this.errorService.returnError(errorCodes.ERROR_USER_NOT_FOUND, null)
                return false;
            }

            if(userInstance?.user_type=="customer" || userInstance.user_type=="ADMIN"){
                var q = await userInstance.load('bids', q => {
                    q.preload('listings')
                })

                console.log(q)
                
                returnData.user = userInstance;
                returnData.bids = q;
                return returnData;
            }else{
                returnData.user = userInstance;
                return returnData;
            }
        }

        //else if shit happens
        this.errorService.returnError(errorCodes.INVALID_REQUEST, null)
        return false;
    }

    async getUserWithListings(){
        console.log(this)
        // this.log.info(`Get user details ${this.id}`)
        // var userInstance;
        // var listings;
        if(this.id){
            let userInstance = await User.find(this.id)

            console.log(userInstance)

            var returnData = {
                user: userInstance,
                listings: null,
            }

 
            if(!userInstance){
                this.log.error(`User ${this.queryUser.email || this.queryUser.id} cannot be found.`)
                this.errorService.returnError(errorCodes.ERROR_USER_NOT_FOUND, null)
                return false;
            }

            if(userInstance?.user_type=="wholesaler" || userInstance.user_type=="ADMIN"){
                var q = await userInstance.load('listings', q => {
                    q.preload('attachments').orderBy('created_at', 'desc')
                })

                console.log(q)
                
                returnData.user = userInstance;
                returnData.listings = q;
                return returnData;
            }else{
                returnData.user = userInstance;
                return returnData;
            }
        }

        //else if shit happens
        this.errorService.returnError(errorCodes.INVALID_REQUEST, null)
        return false;
    }
}
