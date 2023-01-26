// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminService from "App/Services/AdminService";
import ListingService from "App/Services/ListingService";
export default class ListingsController {

    async getListings({auth, params, response}){
        var listService = new ListingService(null)
        var LS = await listService.getListings();
        if(!LS){
            return response.status(LS.error.httpCode).send({message: LS.error.message, details: LS.error.details, code: LS.error.code})
        }
        response.send(LS)
    }

    async actionListing({request, response}){
        let {id, action} = request.all()
        var listService = new ListingService({id, action})
        var LS = await listService.actionListing();
        if(!LS){
            return response.status(LS.error.httpCode).send({message: LS.error.message, details: LS.error.details, code: LS.error.code})
        }
        response.send(LS)
    }

    async getListingsAdmin({auth, params, response}){
        var adminService = new AdminService({id:params.id})
        var LS = await adminService.getListings();
        if(!LS){
            return response.status(LS.error.httpCode).send({message: LS.error.message, details: LS.error.details, code: LS.error.code})
        }
        response.send(LS)
    }

    async getListing({auth, params, response}){
        var listService = new ListingService({id:params.id})
        var LS = await listService.getListing();
        if(!LS){
            return response.status(LS.error.httpCode).send({message: LS.error.message, details: LS.error.details, code: LS.error.code})
        }
        response.send(LS)
    }

    async createListing({request, auth, response}){
        // let { input } = request.all();
        let input = request.all()
        input.auth = auth
        var bb = new ListingService(input)
        var listService = await bb.createListing();
        if(!listService){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(listService)
    }

    async search({request, response}){

    }
}
