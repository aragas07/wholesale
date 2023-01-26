// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Attachment from "App/Models/Attachment";
import Listing from "App/Models/Listing";
import ErrorService, {errorCodes} from "./ErrorService";
import  log  from './LogService'

interface message {
    body: string
    conversationId: number
    listingId: number
}

export default class MessagingService {
   message:message

    constructor(props){
        this.messageParam = props.messageParam

    }

    async fetch(){
        this.log.info(`Get user details ${this.queryUser.id} | ${this.queryUser.email} | ${this.queryUser.type}`)
        
        var userInstance;
        if(this.queryUser.type == "email"){
            userInstance = await User.findBy('email', this.queryUser.email)
        }
        if(this.queryUser.type == "id"){
            userInstance = await User.find(this.queryUser.id)
        }

        if(!userInstance){
            this.log.error(`User ${this.queryUser.email || this.queryUser.id} cannot be found.`)
            this.errorService.returnError(errorCodes.ERROR_USER_NOT_FOUND, null)
            return false;
        }
    }
}
