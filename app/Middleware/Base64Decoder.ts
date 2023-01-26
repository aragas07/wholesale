import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Base64 } from 'js-base64';

export default class Base64Decoder {
  public async handle({request, auth, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const headers = request.headers()
    const decodeList = [
      "details"
    ]
    decodeList.forEach(element => {
      if(headers.hasOwnProperty(element)){
        headers[element] = Base64.decode(headers[element]);
      }
    });
    await next()
  }
}