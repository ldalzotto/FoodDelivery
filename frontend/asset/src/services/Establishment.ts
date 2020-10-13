import {Server, ServerError} from "../server/Server.js"

class EstablishmentService
{

    public static CreateEstablishment(p_name : string, p_address : string, p_phone : string, 
        p_okCallback ?: (arg0 : null)=>(void), p_errorCallback ?: (p_serverError : ServerError)=>(void))
    {
        Server.SendRequest("POST", "http://localhost:8080/establishment", new Establishment(p_name, p_address, p_phone), true, 
            p_okCallback, p_errorCallback
        );
    }

}

class Establishment
{
    public id : number;
    public name : string;
    public address : string;
    public phone : string;
    public user_id : number;

    constructor(p_name : string, p_address : string, p_phone : string)
    {
        this.name = p_name;
        this.address = p_address;
        this.phone = p_phone;
    }
}

export {EstablishmentService}