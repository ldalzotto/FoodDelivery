import {Server, ServerError} from "../server/Server.js"
import { QueryParamBuilder } from "../utils/QueryParamsBuilder.js";
import { City, LatLng } from "./Geo.js";
import { ImageUrl } from "./Image.js";

class EstablishmentService
{

    public static CreateEstablishment_With_Address(p_establishment : Establishment, p_address : EstablishmentAddress, p_thumbImage : File | null,
        p_okCallback ?: (arg0 : null)=>(void), p_errorCallback ?: (p_serverError : ServerError)=>(void))
    {
        let l_form : FormData = new FormData();
        l_form.append("establishment", JSON.stringify(p_establishment));
        l_form.append("establishment_address", JSON.stringify(p_address));
        if(p_thumbImage)
        {
            l_form.append("establishment_thumb", p_thumbImage);
        }
        Server.SendRequest_Form("POST", "http://localhost:8080/establishment",l_form, true, p_okCallback, p_errorCallback);
    }

    public static GetEstablishment(p_establishmentId : number, 
        l_calculationTypes : EstablishmentCalculationType[] | null, p_okCallback : (p_establishments : EstablishmentGet) => void, p_errorCallback : (p_serverError : ServerError)=>(void))
        {
            let l_queryParams = new QueryParamBuilder();
            if(l_calculationTypes)
            {
                l_queryParams.addParam("calculations", l_calculationTypes.toString());
                l_queryParams.addParam("establishment_id", p_establishmentId.toString());
            }
            Server.SendRequest_Json("GET", `http://localhost:8080/establishment${l_queryParams.params}`, null, true,
               p_okCallback, p_errorCallback
            );
        }

    public static GetEstablishments(l_calculationTypes : EstablishmentCalculationType[] | null, p_okCallback : (p_establishments : EstablishmentGet) => void, p_errorCallback : (p_serverError : ServerError)=>(void))
    {
        let l_queryParams = new QueryParamBuilder();
        if(l_calculationTypes)
        {
            l_queryParams.addParam("calculations", l_calculationTypes.toString());
        }
        Server.SendRequest_Json("GET", `http://localhost:8080/establishments${l_queryParams.params}`, null, true,
           p_okCallback, p_errorCallback
        );
    }

    public static GetEstablishments_Near(l_calculationTypes : EstablishmentCalculationType[] | null, p_latlng : LatLng,
        p_okCallback : (p_establishments : EstablishmentGet) => void, p_errorCallback : (p_serverError : ServerError)=>(void))
    {
        let l_queryParams = new QueryParamBuilder();
        l_queryParams.addParam("lat", p_latlng.lat.toString());
        l_queryParams.addParam("lng", p_latlng.lng.toString());
        if(l_calculationTypes)
        {
            l_queryParams.addParam("calculations", l_calculationTypes.toString());
        }
        Server.SendRequest_Json("GET", `http://localhost:8080/establishments/near${l_queryParams.params}`, null, false, p_okCallback, p_errorCallback);
    }

    public static GetEstablishmentsFromDishId_WithExcluded(p_dish_id: number, l_calculationTypes: EstablishmentCalculationType[] | null,
        p_okCallback: (p_establishments: EstablishmentGet) => void, p_errorCallback: (p_serverError: ServerError) => (void))
    {
        let l_queryParams = new QueryParamBuilder();
        l_queryParams.addParam("dish_id", p_dish_id.toString());
        if (l_calculationTypes)
        {
            l_queryParams.addParam("calculations", l_calculationTypes.toString());
        }
        Server.SendRequest_Json("GET", `http://localhost:8080/establishments-with-excluded${l_queryParams.params}`, null, true, p_okCallback, p_errorCallback);
    }

    public static UpdateEstablishment_Widht_Address(p_establishmentId : number, p_establishmentDelta : EstablishmentDelta | null, p_addressDelta : EstablishmentAddressDelta | null,
        p_okCallback ?: (arg0 : null)=>(void), p_errorCallback ?: (p_serverError : ServerError)=>(void))
    {
        let l_form : FormData = new FormData();
        l_form.append("establishment_id", JSON.stringify(p_establishmentId));
        if(p_establishmentDelta){l_form.append("establishment_delta", JSON.stringify(p_establishmentDelta));}
        if(p_addressDelta){l_form.append("establishment_address_delta", JSON.stringify(p_addressDelta));}
        Server.SendRequest_Form("POST", `http://localhost:8080/establishment/update`, l_form, true, p_okCallback, p_errorCallback);
    }

    public static DeleteEstablishment(p_establishmentId : number, p_okCallback ?: (arg0 : null)=>(void), p_errorCallback ?: (p_serverError : ServerError)=>(void))
    {
        Server.SendRequest_Json("POST", `http://localhost:8080/establishment/delete?establishment_id=${p_establishmentId}`, null, true, p_okCallback, p_errorCallback);
    }

    public static LinkEstablishmentDishUpdate(p_establishmentId : number, p_executionType : EstablishmentDishExecutionType,
         p_linkedDishes : number[], p_okCallback : (arg0 : null)=>(void), p_errorCallback ?: (p_serverError : ServerError)=>(void))
    {
        Server.SendRequest_Json("POST", `http://localhost:8080/establishment/dish-update?establishment_id=${p_establishmentId}&calculation=${p_executionType}`, p_linkedDishes, true, p_okCallback, p_errorCallback);
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

class EstablishmentGet
{
    public establishments : Establishment[];
    public establishment_addresses : EstablishmentAddress[];
    public cities : City[];
    public establishment_address_TO_city : number[];
    public delivery_charges : number[] | null;
    public thumbnails : ImageUrl[] | null;
    public establishment_TO_thumbnail : number[] | null;
    public establishments_included_in_dish: number[] | null;
    public establishments_excluded_in_dish: number[] | null;
}



enum EstablishmentCalculationType
{
    RETRIEVE_CITIES = "RETRIEVE_CITIES",
    DELIVERY_CHARGE = "DELIVERY_CHARGE",
    RETRIEVE_THUMBNAIL = "RETRIEVE_THUMBNAIL"
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

enum EstablishmentDishExecutionType
{
    ADD = 0,
    REMOVE = 1
}

export {EstablishmentService, Establishment, EstablishmentAddress, EstablishmentGet, EstablishmentDelta, EstablishmentAddressDelta, EstablishmentCalculationType, EstablishmentDishExecutionType}