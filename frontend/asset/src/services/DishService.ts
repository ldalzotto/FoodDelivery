import { Server, ServerError } from "../server/Server.js";
import { QueryParamBuilder } from "../utils/QueryParamsBuilder.js";
import { ImageUrl } from "./Image.js";

class DishService
{
    public static GetDishesForUser(p_dishCalculation : DishCalculationType[] | null, p_onCompleted : (p_dishesGet : DishGet) => void, p_onError : (err : ServerError) => void)  
    {
        let l_queryParams = new QueryParamBuilder();
        if(p_dishCalculation)
        {
            l_queryParams.addParam("calculations", p_dishCalculation.toString());
        }
        Server.SendRequest_Json("GET", `http://localhost:8080/dishes${l_queryParams.params}`, null, true, p_onCompleted, p_onError);
    }

    public static GetDishesWithExcluded(p_dishCalculation : DishCalculationType[] | null, p_establishmentId : number, p_onCompleted : (p_dishesGet : DishGet) => void, p_onError : (err : ServerError) => void)
    {
        let l_queryParams = new QueryParamBuilder();
        l_queryParams.addParam("establishment_id", p_establishmentId.toString());
        if(p_dishCalculation)
        {
            l_queryParams.addParam("calculations", p_dishCalculation.toString());
        }
        Server.SendRequest_Json("GET", `http://localhost:8080/dishes-with-excluded${l_queryParams.params}`, null, true, p_onCompleted, p_onError);
    }
}

class Dish
{
    public id : number;
    public name : string;
    public price : number;
    public thumb_id : number;
    public user_id : number;
}

class DishGet
{
    public dishes : Dish[];
    public thumbnails : ImageUrl[];
    public dish_TO_thumbnail : number[];
    public dishes_included_in_establishment : number[];
    public dishes_excluded_in_establishment : number[];
}

enum DishCalculationType
{
    RETRIEVE_THUMBNAIL = "RETRIEVE_THUMBNAIL"
}

export {Dish, DishGet, DishService, DishCalculationType}