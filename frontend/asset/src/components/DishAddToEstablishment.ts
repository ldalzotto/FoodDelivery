import { Observable } from "../binding/Binding.js";
import { LoadingButton } from "../components_graphic/LoadingButton.js";
import { ScrollablePanel } from "../components_graphic/ScrollablePanel.js";
import { TwoWaySelectionPanel } from "../components_graphic/TwoWaySelectionPanel.js";
import { DishCalculationType, DishGet, DishService } from "../services/DishService.js";
import { EstablishmentDishExecutionType, EstablishmentService } from "../services/Establishment.js";
import { DishPreview } from "./ProfileDishes.js";

class DishAddToEstablishment
{
    static readonly Type: string = "dish-add-to-establishment";

    private _root : HTMLElement;

    private establishmentId : number;

    private l_selectionPanel : TwoWaySelectionPanel<DishPreview>;

    constructor(p_root : HTMLElement, p_establishmentId : number)
    {
        this._root = p_root;
        this.establishmentId = p_establishmentId;

        let l_template: HTMLTemplateElement = document.getElementById(DishAddToEstablishment.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        this.l_selectionPanel = new TwoWaySelectionPanel<DishPreview>(this._root.querySelector(TwoWaySelectionPanel.Type), 
                    (arg0)=>{this.onRemoveSelectedClick(arg0)}, (arg0) => {this.onAddSelectedClick(arg0)});

        DishService.GetDishesWithExcluded([DishCalculationType.RETRIEVE_THUMBNAIL], p_establishmentId, (p_dishes : DishGet) => {
            for(let i= 0;i<p_dishes.dishes_included_in_establishment.length;i++)
            {
                let l_div = document.createElement("div");
                let l_dishIndex : number = p_dishes.dishes_included_in_establishment[i];
                this.l_selectionPanel.pushSelectableElementToLeft(
                    new DishPreview(l_div, 
                        p_dishes.dishes[l_dishIndex], 
                        p_dishes.thumbnails[p_dishes.dish_TO_thumbnail[l_dishIndex]]), l_div
                );
            }
            for(let i= 0;i<p_dishes.dishes_excluded_in_establishment.length;i++)
            {
                let l_div = document.createElement("div");
                let l_dishIndex : number = p_dishes.dishes_excluded_in_establishment[i];
                this.l_selectionPanel.pushSelectableElementToRight(
                    new DishPreview(l_div, 
                        p_dishes.dishes[l_dishIndex], 
                        p_dishes.thumbnails[p_dishes.dish_TO_thumbnail[l_dishIndex]] ), l_div
                );
            }
        }, null);
    }

    onAddSelectedClick(p_onCompleted : ()=>void) 
    {
        let l_addedDishes : number[] = [];
        for(let i=0;i<this.l_selectionPanel.rightElements.length;i++)
        {
            let l_selectionPanelElement = this.l_selectionPanel.rightElements[i];
            if(l_selectionPanelElement.isSelected.value)
            {
                l_addedDishes.push(l_selectionPanelElement.userDefined.dish.id);
            }
        }
        if(l_addedDishes.length > 0)
        {
            EstablishmentService.LinkEstablishmentDishUpdate(this.establishmentId, EstablishmentDishExecutionType.ADD, l_addedDishes,
                () => {
                    this.l_selectionPanel.moveRightToLeft();
                    p_onCompleted();
                }, p_onCompleted);
        }
        else
        {
            p_onCompleted();
        }
    }

    onRemoveSelectedClick(p_onCompleted : ()=>void) 
    {
        let l_removedDishes : number[] = [];
        for(let i=0;i<this.l_selectionPanel.leftElements.length;i++)
        {
            let l_selectionPanelElement = this.l_selectionPanel.leftElements[i];
            if(l_selectionPanelElement.isSelected.value)
            {
                l_removedDishes.push(l_selectionPanelElement.userDefined.dish.id);
            }
        }
        if(l_removedDishes.length > 0)
        {
            EstablishmentService.LinkEstablishmentDishUpdate(this.establishmentId, EstablishmentDishExecutionType.REMOVE, l_removedDishes,
                () => {
                    this.l_selectionPanel.moveLeftToRight();
                    p_onCompleted();
                }, p_onCompleted);
        }
        else
        {
            p_onCompleted();
        }
    }
}

export {DishAddToEstablishment}