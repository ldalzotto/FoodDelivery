import { Accordilon, AccordilonItemInput } from "../components_graphic/Accordilon.js";
import { ElementList, ElementListCallbacks } from "../components_graphic/ElementList.js";
import { LoadingButton } from "../components_graphic/LoadingButton.js";
import { Dish, DishCalculationType, DishGet, DishService } from "../services/DishService.js";
import { ImageUrl } from "../services/Image.js";
import { Navigation } from "../services/Navigation.js";

class ProfileDishes
{
    static readonly Type: string = "profile-dishes";

    private _root : HTMLElement;

    private dishCreationAccordilon : Accordilon;
    private dishCreation : DishCreation;
    private dishList : ElementList<DishPreview, DishGet, DishGet, DishListCallback>;

    constructor(p_root : HTMLElement)
    {
        this._root = p_root;
        let l_template: HTMLTemplateElement = document.getElementById(ProfileDishes.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        this.dishCreationAccordilon = new Accordilon(this._root.querySelector(DishCreation.Type), [
            AccordilonItemInput.build("Register new dish", (p_root : HTMLElement) => { 
                this.dishCreation = new DishCreation(p_root); 
                this.dishCreation.root.addEventListener(DishCreation_OnCreated.Type, () => {this.dishList.reload();});
            })
        ]);
        this.dishList = new ElementList(this._root.querySelector("#dish-list"), new DishListCallback());
        this.dishList.reload();
    }
}

class DishListCallback implements ElementListCallbacks<DishPreview, DishGet, DishGet>
{
    fetchElements(p_onSuccess: (p_fetch: DishGet) => void): null {
        DishService.GetDishesForUser([DishCalculationType.RETRIEVE_THUMBNAIL], p_onSuccess, null);
        return null;
    }
    forEachFetchedElements(p_fetch: DishGet, p_callback: (p_fetchElement: DishGet, p_index: number) => void): null {
        for(let i=0;i<p_fetch.dishes.length;i++)
        {
            p_callback(p_fetch, i);
        }
        return null;
    }
    buildElement(p_fetchElement: DishGet, p_index: number, p_itemHTMlRoot: HTMLElement): DishPreview {
        let l_dishPreview = new DishPreview(p_itemHTMlRoot, p_fetchElement.dishes[p_index], p_fetchElement.thumbnails[p_fetchElement.dish_TO_thumbnail[p_index]]);
        l_dishPreview.root.addEventListener("click", () => { Navigation.MoveToDishDetailPage(l_dishPreview.dish.id); });
        return l_dishPreview;
    }

}

class DishCreation 
{
    static readonly Type: string = "dish-creation";

    private _root : HTMLElement;
    public get root(){return this._root;}

    private dishName : HTMLInputElement;
    private dishPrice : HTMLInputElement;
    private thumbInput : HTMLInputElement;

    private createDishButton : LoadingButton;

    constructor(p_root : HTMLElement)
    {
        this._root = p_root;
        let l_template: HTMLTemplateElement = document.getElementById(DishCreation.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        this.dishName = this._root.querySelector("#name");
        this.dishPrice = this._root.querySelector("#price");
        this.thumbInput = this._root.querySelector("#thumb");

        this.createDishButton = new LoadingButton(this._root.querySelector(LoadingButton.Type), (p_onCompleted : () => void) => {
            let l_createdDish : Dish = new Dish();
            l_createdDish.name = this.dishName.textContent;
            l_createdDish.price = this.dishPrice.valueAsNumber;
            DishService.PostDish(l_createdDish, this.thumbInput.files[0], () => {
                this._root.dispatchEvent(new DishCreation_OnCreated());
                p_onCompleted();
            }, p_onCompleted);
        });
    }
}

class DishCreation_OnCreated extends Event
{
    static readonly Type: string = "dish-creation-on-created";

    constructor()
    {
        super(DishCreation_OnCreated.Type);
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