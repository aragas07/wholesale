/*
    Simple Error Responder for AdonisJS / Node
    Roland Kim Andre Solon (solon.rolandkimandre@gmail.com)
*/

const mainErrorCode = {
    10012: "Bid Error",
    10011: "SMS Service Error.",
    10010: "Error getting notifications",
    10009: "Listing not found",
    10008: "Invalid Request",
    10007: "No SMS recipients specified",
    10006: "Missing submitted file data",
    10005: "Cannot find user",
    10004: "Internal Server Error",
    10003: "User Already Exists!",
    10002: "Invalid Authentication Parsing",
    10001: "Invalid Login Credentials",
    10000: "Unknown Error"
}

export const errorCodes = {
    BID_ERROR:                  {message: mainErrorCode[10012], httpcode: 400, code: 10012},
    SMS_SERVICE_ERROR:          {message: mainErrorCode[10011], httpcode: 500, code: 10011},
    ERROR_GET_NOTIFICATIONS:    {message: mainErrorCode[10010], httpcode: 400, code: 10010},
    LISTING_NOT_FOUND:          {message: mainErrorCode[10009], httpcode: 404, code: 10009},
    INVALID_REQUEST:            {message: mainErrorCode[10008], httpcode: 400, code: 10008},
    SMS_NO_RECIPIENTS:          {message: mainErrorCode[10007], httpcode: 400, code: 10007},
    ERROR_INVALID_FILE_UPLOAD:  {message: mainErrorCode[10006], httpcode: 400, code: 10006},
    ERROR_USER_NOT_FOUND:       {message: mainErrorCode[10005], httpcode: 404, code: 10005},
    INTERNAL_SERVER_ERROR:      {message: mainErrorCode[10004], httpcode: 400, code: 10004},
    ERROR_USER_ALREADY_EXISTS:  {message: mainErrorCode[10003], httpcode: 400, code: 10003},
    ERROR_AUTH_PARSE:           {message: mainErrorCode[10002], httpcode: 400, code: 10002},
    ERROR_INVALID_LOGIN:        {message: mainErrorCode[10001], httpcode: 400, code: 10001},
    ERROR_UNKNOWN:              {message: mainErrorCode[10000], httpcode: 500, code: 10000},
}

export default class ErrorService {
    errorCode:Number
    errorMessage:String
    details: Object

    returnError(code, details?){
        const response = {
            message: code.message,
            httpCode: code.httpcode,
            code: code.code,
            details:Object,
        }
        if(details) response.details = details;
        return response;
    }
}