import { Dish, DishCalculationType, DishGet, DishService } from "../services/DishService.js";
import { ImageUrl } from "../services/Image.js";

class ProfileDishes
{
    static readonly Type: string = "profile-dishes";

    private _root : HTMLElement;

    constructor(p_root : HTMLElement)
    {
        this._root = p_root;
        let l_template: HTMLTemplateElement = document.getElementById(ProfileDishes.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        DishService.GetDishesForUser([DishCalculationType.RETRIEVE_THUMBNAIL], 
            (p_dishGet : DishGet) => {
                for(let i=0;i<p_dishGet.dishes.length;i++)
                {
                    let l_element = document.createElement("div");
                    this._root.appendChild(l_element);
                    new DishPreview(l_element, p_dishGet.dishes[i], p_dishGet.thumbnails[p_dishGet.dish_TO_thumbnail[i]]);
                }
            }, null);
    }
}

class DishPreview
{
    static readonly Type: string = "dish-preview";

    private _root : HTMLElement;
    public get root(){return this._root;}

    private _dish : Dish;
    public get dish(){return this._dish;}

    constructor(p_root : HTMLElement, p_dish : Dish, p_thumb : ImageUrl)
    {
        this._dish = p_dish;

        this._root = p_root;
        let l_template: HTMLTemplateElement = document.getElementById(DishPreview.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        if(p_thumb)
        {
            (this._root.querySelector("#thumb") as HTMLImageElement).src = p_thumb.url;
        }
        this._root.querySelector("#name").textContent = p_dish.name;
        this._root.querySelector("#price").textContent = `${p_dish.price.toString()} €€`;
    }
}

export {ProfileDishes, DishPreview}