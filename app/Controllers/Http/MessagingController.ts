// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagingService from "App/Services/MessagingService";
export default class UsersController {
    async fetch({request, auth, response}){
        // console.log(auth)
        var bb = new MessagingService({details: request.headers().details})
        var MessageServ = await bb.fetch(auth);
        if(!MessageServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(MessageServ)
    }

    async send({request, response}){
        console.log(request)
        //console.log(auth)
        var bb = new MessagingService({queryUser: params})
        var MessageServ = await bb.getUser();
        if(!MessageServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(MessageServ)
    }
}
