// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BidsService from "App/Services/BidsService";
export default class ListingsController {

    async getBidsByListing({auth, params, response}){
        var BS = new BidsService({listing_id:params.id})
        var LS = await BS.getBidsByListing();
        if(!LS){
            return response.status(LS.error.httpCode).send({message: LS.error.message, details: LS.error.details, code: LS.error.code})
        }
        response.send(LS)
    }

    async getBidsByUser({auth, params, response}){
        console.log('getbidsbyuser')
        var userid = params.id !=null ? params.id : auth!=null? auth.user.id : null;
        var BS = new BidsService({user_id: userid})
        var LS = await BS.getBidsByUser();
        if(!LS){
            return response.status(LS.error.httpCode).send({message: LS.error.message, details: LS.error.details, code: LS.error.code})
        }
        response.send(LS)
    }

    async getMyBids({auth, params, response}){
        var BS = new BidsService({user_id:auth.user.id})
        var LS = await BS.getBidsByUser();
        if(!LS){
            return response.status(LS.error.httpCode).send({message: LS.error.message, details: LS.error.details, code: LS.error.code})
        }
        response.send(LS)
    }

    async bid({request, auth, response}){
        let { listing_id, bid_value} = request.all()
        let input = {
            listing_id,
            bid_value,
            user_id: auth.user.id,
        }
        var bb = new BidsService(input)
        var listService = await bb.bid();
        if(!listService){
            return response.status(bb.error.httpCode).send({message: bb.error.message, details: bb.error.details, code: bb.error.code})
        }
        response.send(listService)
    }
}
