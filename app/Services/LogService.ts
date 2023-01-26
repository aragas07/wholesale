/*
    Simple Logging Service for AdonisJS / Node
    Roland Kim Andre Solon (solon.rolandkimandre@gmail.com)
    
*/

export default class log{
    className:string;
    message:string;
    DateOutput: string;

    constructor(props){
        this.className = props.constructor.name;
        this.DateOutput = new Date().toISOString();
    }

    info(message){
        console.log(`${this.DateOutput}-INFO- ${this.className} - ${message}`);
    }

    warn(message){
        console.warn(`${this.DateOutput}-WARN- ${this.className} - ${message}`);
    }
    error(message){
        console.error(`${this.DateOutput}-ERROR- ${this.className} - ${message}`);
    }
    critical(message){
        console.error(`${this.DateOutput}-CRITICAL- ${this.className} - ${message}`);
    }
}