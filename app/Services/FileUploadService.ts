import User from "App/Models/User";
import Attachment from "App/Models/Attachment";
import drive from "Config/drive";
import log from "./LogService";
import fs from 'fs'
import ErrorService, {errorCodes} from "./ErrorService";

const { v4: uuidv4, validate } = require("uuid");

export default class FileUploadService {
    file:string
    type:string | null
    fileType:string
    user_id:number
    log:log
    status:string | null | void
    base64Data:string | undefined
    errorService:ErrorService
    message_id:number
    listing_id:number

    constructor(props){
        this.file = props.file
        this.type = props.type!=null ? props.type : "general"
        this.fileType = props.filetype
        this.user_id = props.user_id
        this.log = new log(this)
        this.status = null
        this.base64Data = this.file.split(";base64").pop();
        this.errorService = new ErrorService();
        this.message_id = props.message_id;
        this.listing_id = props.listing_id;
    }

    async processBase64File(){
        // console.log('Processbase64file')
        if(this.base64Data==null){
            this.log.error("Missing file data!")
            this.errorService.returnError(errorCodes.ERROR_INVALID_FILE_UPLOAD, "No file data!")
            return false;
        }
        const name = uuidv4();
        var status = false;
        let dir = `public/${this.type}`
        let uri_path = `${this.type}`
        try{
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir)
            }
            await fs.writeFileSync(`${dir}/${name}.${this.fileType}`, this.base64Data, {encoding:'base64'})
            status = true;
        } catch(e){
            this.log.error(e)
        }

        if(status){
            let b = new Attachment;
            b.filename = name;
            b.path = `${dir}/${name}.${this.fileType}`
            b.uri_path = `${this.type}/${name}.${this.fileType}`
            b.uploaded_by = this.user_id
            b.message_id = this.message_id
            b.listing_id = this.listing_id

            await b.save()
            this.log.info(`File Database Update - ${b.filename}`)

            return true;
        }else{
            this.log.error("Something unknown happened")
            this.errorService.returnError(errorCodes.ERROR_UNKNOWN, null)
            return false;
        }
    }
}