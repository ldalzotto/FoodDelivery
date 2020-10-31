import { Server, ServerError } from "../framework/server/Server.js";
import { QueryParamBuilder } from "../framework/utils/QueryParamsBuilder.js";
import { EstablishmentDishExecutionType } from "./Establishment.js";
import { ImageUrl } from "./Image.js";

class DishService
{
    public static GetDish(p_dish_id : number, p_dishCalculation : DishCalculationType[] | null, p_onCompleted : (p_dishesGet : DishGet) => void, p_onError : (err : ServerError) => void)
    {
        let l_queryParams = new QueryParamBuilder();
        l_queryParams.addParam("dish_id", p_dish_id.toString());
        if(p_dishCalculation)
        {
            l_queryParams.addParam("calculations", p_dishCalculation.toString());
        }
        Server.SendRequest_Json("GET", `http://localhost:8080/dish${l_queryParams.params}`, null, false, p_onCompleted, p_onError);
    }

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

    public static PostDish(p_dish : Dish, p_thumb : File | null, p_onCompleted : () => void, p_onError : (err : ServerError) => void)
    {
        let l_form : FormData = new FormData();
        l_form.append("dish", JSON.stringify(p_dish));
        if(p_thumb)
        {
            l_form.append("dish_thumb", p_thumb);
        }
        Server.SendRequest_Form("POST", `http://localhost:8080/dish`, l_form, true, p_onCompleted, p_onError);
    }

    public static UpdateDish(p_dish_id: number, p_dishDelta: DishDelta, p_dish_thumb: File | null, p_onCompleted: () => void, p_onError: (err: ServerError) => void)
    {
        let l_form : FormData = new FormData();
        l_form.append("dish_id", p_dish_id.toString());
        l_form.append("dish", JSON.stringify(p_dishDelta));
        if (p_dish_thumb)
        {
            l_form.append("dish_thumb", p_dish_thumb);
        }
        Server.SendRequest_Form("POST", `http://localhost:8080/dish/update`, l_form, true, p_onCompleted, p_onError);
    }

    public static DeleteDish(p_dish_id : number, p_onCompleted : () => void, p_onError : (err : ServerError) => void)
    {
        let l_queryParams = new QueryParamBuilder();
        l_queryParams.addParam("dish_id", p_dish_id.toString());
        Server.SendRequest_Json("POST", `http://localhost:8080/dish/delete${l_queryParams.params}`, null, true, p_onCompleted, p_onError);
    }

    public static LinkDishToEstablishmentUpdate(p_dish_id: number, p_establishments_id: number[], p_executionType: EstablishmentDishExecutionType, p_onCompleted: () => void, p_onError: (err: ServerError) => void)
    {
        let l_queryParams = new QueryParamBuilder();
        l_queryParams.addParam("dish_id", p_dish_id.toString());
        l_queryParams.addParam("calculation", p_executionType.toString());
        Server.SendRequest_Json("POST", `http://localhost:8080/dish/establishment-update${l_queryParams.params}`, p_establishments_id, true, p_onCompleted, p_onError);
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

class DishDelta
{
    public name : string;
    public price : number;
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

export {Dish, DishGet, DishDelta, DishService, DishCalculationType}