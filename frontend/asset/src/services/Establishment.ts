import {Server, ServerError} from "../server/Server.js"

class EstablishmentService
{

    public static CreateEstablishment_With_Address(p_establishment : Establishment, p_address : EstablishmentAddress,
        p_okCallback ?: (arg0 : null)=>(void), p_errorCallback ?: (p_serverError : ServerError)=>(void))
    {
        Server.SendRequest("POST", "http://localhost:8080/establishment", new EstablishmentWithAddress(p_establishment, p_address), true, 
            p_okCallback, p_errorCallback
        );
    }

    public static GetEstablishments(p_okCallback : (p_establishments : EstablishmentWithAddress[]) => void, p_errorCallback : (p_serverError : ServerError)=>(void))
    {
        Server.SendRequest("GET", "http://localhost:8080/establishments", null, true,
           p_okCallback, p_errorCallback
        );
    }

    public static UpdateEstablishment_Widht_Address(p_establishmentId : number, p_establishmentDelta : EstablishmentDelta | null, p_addressDelta : EstablishmentAddressDelta | null,
        p_okCallback ?: (arg0 : null)=>(void), p_errorCallback ?: (p_serverError : ServerError)=>(void))
    {
        let l_delta = new EstablishmentWithAddressDelta();
        l_delta.establishment = p_establishmentDelta;
        l_delta.establishment_address = p_addressDelta;
        Server.SendRequest("POST", `http://localhost:8080/establishment/update?establishment_id=${p_establishmentId}`, l_delta, true, p_okCallback, p_errorCallback);
    }

    public static DeleteEstablishment(p_establishmentId : number, p_okCallback ?: (arg0 : null)=>(void), p_errorCallback ?: (p_serverError : ServerError)=>(void))
    {
        Server.SendRequest("POST", `http://localhost:8080/establishment/delete?establishment_id=${p_establishmentId}`, null, true, p_okCallback, p_errorCallback);
    }

}

class Establishment
{
    public id : number;
    public name : string;
    public address_id : number;
    public phone : string;
    public user_id : number;

    constructor(p_name : string, p_phone : string)
    {
        this.name = p_name;
        this.phone = p_phone;
    }
}

class EstablishmentAddress
{
    public id : number;
    public street_full_name : string;
    public city_id : number;
    public lat : number;
    public lng : number;

    public static build(p_streetFullname : string, p_cityId : number) : EstablishmentAddress
    {
        let l_establishmentAddress = new EstablishmentAddress();
        l_establishmentAddress.street_full_name = p_streetFullname;
        l_establishmentAddress.city_id = p_cityId;
        return l_establishmentAddress;
    }
}

class EstablishmentWithAddress 
{
    public establishment : Establishment;
    public establishment_address : EstablishmentAddress;

    constructor(p_establishment : Establishment, p_address : EstablishmentAddress)
    {
        this.establishment = p_establishment;
        this.establishment_address = p_address;
    }
}

class EstablishmentDelta
{
    public name : string | null;
    public phone : string | null;
}

class EstablishmentAddressDelta
{
    public street_full_name : string | null;
    public city_id : number | null;
    public lat : number | null;
    public lng : number | null;
}

class EstablishmentWithAddressDelta
{
    public establishment : EstablishmentDelta | null;
    public establishment_address : EstablishmentAddressDelta | null;
}

export {EstablishmentService, Establishment, EstablishmentAddress, EstablishmentWithAddress, EstablishmentDelta, EstablishmentAddressDelta}