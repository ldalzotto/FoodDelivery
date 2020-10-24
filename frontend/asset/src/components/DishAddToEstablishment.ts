import { Observable } from "../binding/Binding.js";
import { ScrollablePanel } from "../components_graphic/ScrollablePanel.js";
import { DishCalculationType, DishGet, DishService } from "../services/DishService.js";
import { EstablishmentDishExecutionType, EstablishmentService } from "../services/Establishment.js";
import { DishPreview } from "./ProfileDishes.js";

class DishAddToEstablishment
{
    static readonly Type: string = "dish-add-to-establishment";

    private _root : HTMLElement;
    private l_ownedDishesSelectable : DishPreviewSelectable[];
    private l_notOwnedDishesSelectable : DishPreviewSelectable[];
    private establishmentId : number;

    constructor(p_root : HTMLElement, p_establishmentId : number)
    {
        this._root = p_root;
        this.establishmentId = p_establishmentId;
        this.l_ownedDishesSelectable = [];
        this.l_notOwnedDishesSelectable = [];

        let l_template: HTMLTemplateElement = document.getElementById(DishAddToEstablishment.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        let l_ownedDishes = new ScrollablePanel(this._root.querySelector("#owned-dishes"));
        let l_notOwnedDishes = new ScrollablePanel(this._root.querySelector("#not-owned-dishes"));

        this._root.querySelector("#add").addEventListener("click", () => {this.onAddSelectedClick();});

        DishService.GetDishesWithExcluded([DishCalculationType.RETRIEVE_THUMBNAIL], p_establishmentId, (p_dishes : DishGet) => {
            for(let i= 0;i<p_dishes.dishes_included_in_establishment.length;i++)
            {
                let l_div = document.createElement("div");
                l_ownedDishes.container.appendChild(l_div);
                let l_dishIndex : number = p_dishes.dishes_included_in_establishment[i];
                this.l_ownedDishesSelectable.push(
                    new DishPreviewSelectable(
                        new DishPreview(l_div, 
                        p_dishes.dishes[l_dishIndex], 
                        p_dishes.thumbnails[p_dishes.dish_TO_thumbnail[l_dishIndex]] 
                    ))
                );
            }
            for(let i= 0;i<p_dishes.dishes_excluded_in_establishment.length;i++)
            {
                let l_div = document.createElement("div");
                l_notOwnedDishes.container.appendChild(l_div);
                let l_dishIndex : number = p_dishes.dishes_excluded_in_establishment[i];
                this.l_notOwnedDishesSelectable.push(
                    new DishPreviewSelectable(
                        new DishPreview(l_div, 
                        p_dishes.dishes[l_dishIndex], 
                        p_dishes.thumbnails[p_dishes.dish_TO_thumbnail[l_dishIndex]] 
                    ))
                );
            }
        }, null);
    }

    onAddSelectedClick() 
    {
        let l_addedDishes : number[] = [];
        for(let i=0;i<this.l_notOwnedDishesSelectable.length;i++)
        {
            let l_dishSelectable : DishPreviewSelectable = this.l_notOwnedDishesSelectable[i];
            if(l_dishSelectable.isSelected.value)
            {
                l_addedDishes.push(l_dishSelectable.dishPreview.dish.id);
            }
        }
        if(l_addedDishes.length > 0)
        {
            //TODO -> what to do on success ?
            EstablishmentService.LinkEstablishmentDishUpdate(this.establishmentId, EstablishmentDishExecutionType.ADD, l_addedDishes, null, null);
        }
    }
}

/*
    <template id="dish-add-to-establishment">
      <div class="row">
        <div class="column half dish-modification-owned">
          <div class="row">
            <button id="remove">REMOVE SELECTED</button>
          </div>
          <div id="owned-dishes"></div>
        </div>
        <div class="column half dish-modification-not-owned">
          <div class="row">
            <button id="add">ADD SELECTED</button>
          </div>
          <div id="not-owned-dishes"></div>
        </div>
      </div>
    </template>
*/

class DishPreviewSelectable
{
    private _dishPreview : DishPreview;
    public get dishPreview() { return this._dishPreview; }

    private _isSelected : Observable<boolean>;
    public get isSelected(){return this._isSelected;}

    constructor(p_dishPreview : DishPreview)
    {
        this._dishPreview = p_dishPreview;
        this._isSelected = new Observable<boolean>(false);
        this._isSelected.subscribe((arg0:boolean)=>{this.onIsSelectedChange();});
        p_dishPreview.root.addEventListener("click", () => {this.onClick();});
    }
   
    private onClick()
    {
        this._isSelected.value = !this._isSelected.value;
    }

    onIsSelectedChange() 
    {
        if(this._isSelected.value)
        {
            this._dishPreview.root.style.borderStyle = "dashed";
            this._dishPreview.root.style.borderColor = "orange";
        }
        else
        {
            this._dishPreview.root.style.borderStyle = "";
            this._dishPreview.root.style.borderColor = "";
        }
    }
}


export {DishAddToEstablishment}