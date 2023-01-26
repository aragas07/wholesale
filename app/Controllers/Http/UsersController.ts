// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotificationService from "App/Services/NotificationService";
import UserService from "App/Services/UserService";
export default class UsersController {
    async login({request, auth, response}){
        // console.log(auth)
        var bb = new UserService({details: request.headers().details})
        var UserServ = await bb.login(auth);
        if(!UserServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(UserServ)
    }

    async getNotifications({auth, response}){
        var bb = new NotificationService({auth})
        // console.log("AUTH AUTH AUTH")
        // console.log(auth.user)
        // console.log(" END AUTH ")
        var notifServ = await bb.getNotifications();
        if(!notifServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(notifServ)
    }

    async readNotification({params, response}){
        var bb = new NotificationService(params)
        console.log(params)
        var notifServ = await bb.readNotification();
        if(!notifServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(notifServ)
    }

    async register({request, response}){
        console.log(request.all())
        console.log('A?')
        let registrationDetails = request.all() 
        
        var bb = new UserService({details: request.headers().details, registrationDetails})
        var UserServ = await bb.register();
        if(!UserServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(UserServ)
    }

    async get({params, response}){
        var bb = new UserService(params)
        console.log(params)
        var UserServ = await bb.getUser();
        if(!UserServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(UserServ)
    }

    async adminGetUsers({params, response}){
        var bb = new UserService(params)
        console.log(params)
        var UserServ = await bb.getUsers();
        if(!UserServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(UserServ)
    }

    async getUserWithListings({params, response}){
        var bb = new UserService(params)
        console.log(params)
        var UserServ = await bb.getUserWithListings();
        if(!UserServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(UserServ)
    }

    async action({request, auth, response}){
        // var bb = new UserService({})
    }

    async logout({auth, response}){
        var bb = new UserService({auth})
        var UserServ = await bb.logout()

        if(!UserServ){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(UserServ)
    }

    // async uploadProfilePic({request, response}){

    // }
}
