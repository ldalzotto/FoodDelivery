import {Server, ServerError} from "../server/Server.js"
class GeoService
{
    public static GetAllCitiesMatching(p_matchingName : string, p_limit : number, p_onCompleted:(p_cities:City[] | null, p_err : ServerError | null)=>(void))
    {
        Server.SendRequest("GET", `http://localhost:8080/city/match?matchValue=${p_matchingName}&limit=${p_limit}`, null, false
        , (p_body:City[])=>{p_onCompleted(p_body, null)}, (p_err : ServerError)=>{p_onCompleted(null, p_err);});
    }

    public static GetCity(p_city_id : number, p_onCompleted:(p_city:City | null, p_err : ServerError | null)=>(void) )
    {
        Server.SendRequest("GET", `http://localhost:8080/city?city_id=${p_city_id}`, null, false, 
            (p_body:City) => {p_onCompleted(p_body, null);}, (p_err : ServerError)=>{p_onCompleted(null, p_err);});
    }
}

class City
{
    public id : number;
    public name : string;
    public numeric_id_0 : number;
    public country_id : number;
}

export {GeoService, City}