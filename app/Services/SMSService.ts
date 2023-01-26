import ErrorService, { errorCodes } from "./ErrorService";
import log from "./LogService";
import twilio from "twilio";
import { MessageListInstanceCreateOptions } from "twilio/lib/rest/api/v2010/account/message";

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const twilioNumber = process.env.TWILIO_NUMBER
const client = twilio(accountSid, authToken, { logLevel: 'debug' })
// const client = new twilio (accountSid, authToken, {
//     logLevel: 'debug'
//   });


export default class SMSService {
    recipient: string;
    message: string
    log: log;
    errorService: ErrorService;

    constructor(props) {
        this.message = props.message
        this.recipient = props.recipient
        this.log = new log(this)
        this.errorService = new ErrorService();
    }

    async sendSMS() {
        const msgData: MessageListInstanceCreateOptions = {
            from: twilioNumber,
            to: this.recipient,
            body: this.message,
        };

        if (!this.recipient) {
            this.log.error("No Recipients specified")
            return new ErrorService().returnError(errorCodes.SMS_NO_RECIPIENTS)
        }

        this.log.info(`SMS Message Request for ${this.recipient.toString()}`)

        try {
            const twil = new Promise((resolve, reject) => {
                client.messages
                    .create(msgData)
                    .then(output => {
                        this.log.info(output)
                        resolve(output);
                    })
                    .catch(msg => {
                        reject(msg)
                    })
            })

            const res = await twil;
            return res;
        } catch (e) {
            this.log.error("Error on sending SMS")
            this.log.error(e)
            return new ErrorService().returnError(errorCodes.SMS_SERVICE_ERROR, e)
        }
    }
}