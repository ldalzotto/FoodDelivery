
import { TwoWaySelectionPanel } from "../components_graphic/TwoWaySelectionPanel.js";
import { DishService } from "../services/DishService.js";
import { EstablishmentCalculationType, EstablishmentDishExecutionType, EstablishmentGet, EstablishmentService } from "../services/Establishment.js";
import { EstablishementDisplayPreview } from "./ProfileEstablishments.js";

class EstablishmentAddToDish
{
    static readonly Type: string = "establishment-add-to-dish";

    private _root: HTMLElement;

    private dish_id: number;

    private l_selectionPanel: TwoWaySelectionPanel<EstablishementDisplayPreview>;

    constructor(p_root: HTMLElement, p_dish_id: number)
    {
        this._root = p_root;
        this.dish_id = p_dish_id;

        let l_template: HTMLTemplateElement = document.getElementById(EstablishmentAddToDish.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        this.l_selectionPanel = new TwoWaySelectionPanel<EstablishementDisplayPreview>(this._root.querySelector(TwoWaySelectionPanel.Type),
            (arg0) => { this.onRemoveSelectedClick(arg0) }, (arg0) => { this.onAddSelectedClick(arg0) });

        EstablishmentService.GetEstablishmentsFromDishId_WithExcluded(this.dish_id, [EstablishmentCalculationType.RETRIEVE_CITIES, EstablishmentCalculationType.RETRIEVE_THUMBNAIL],
            (p_establishment: EstablishmentGet) =>
            {
                for (let i = 0; i < p_establishment.establishments_included_in_dish.length; i++)
                {
                    let l_div = document.createElement("div");
                    let l_establishment_index: number = p_establishment.establishments_included_in_dish[i];
                    this.l_selectionPanel.pushSelectableElementToLeft(
                        EstablishementDisplayPreview.build(l_div,
                            p_establishment.establishments[l_establishment_index],
                            p_establishment.establishment_addresses[l_establishment_index],
                            p_establishment.cities[p_establishment.establishment_address_TO_city[l_establishment_index]],
                            p_establishment.thumbnails[p_establishment.establishment_TO_thumbnail[l_establishment_index]]
                        ), l_div);
                }


                for (let i = 0; i < p_establishment.establishments_excluded_in_dish.length; i++)
                {
                    let l_div = document.createElement("div");
                    let l_establishment_index: number = p_establishment.establishments_excluded_in_dish[i];
                    this.l_selectionPanel.pushSelectableElementToRight(
                        EstablishementDisplayPreview.build(l_div,
                            p_establishment.establishments[l_establishment_index],
                            p_establishment.establishment_addresses[l_establishment_index],
                            p_establishment.cities[p_establishment.establishment_address_TO_city[l_establishment_index]],
                            p_establishment.thumbnails[p_establishment.establishment_TO_thumbnail[l_establishment_index]]
                        ), l_div);
                }
            }, null);
    }

    onAddSelectedClick(p_onCompleted: () => void) 
    {
        let l_addedEstablishments: number[] = [];
        for (let i = 0; i < this.l_selectionPanel.rightElements.length; i++)
        {
            let l_selectionPanelElement = this.l_selectionPanel.rightElements[i];
            if (l_selectionPanelElement.isSelected.value)
            {
                l_addedEstablishments.push(l_selectionPanelElement.userDefined.establishment.id);
            }
        }
        if (l_addedEstablishments.length > 0)
        {
            DishService.LinkDishToEstablishmentUpdate(this.dish_id, l_addedEstablishments, EstablishmentDishExecutionType.ADD, () =>
            {
                this.l_selectionPanel.moveRightToLeft();
                p_onCompleted();
            }, p_onCompleted);
        }
        else
        {
            p_onCompleted();
        }
    }

    onRemoveSelectedClick(p_onCompleted: () => void) 
    {
        let l_addedEstablishments: number[] = [];
        for (let i = 0; i < this.l_selectionPanel.leftElements.length; i++)
        {
            let l_selectionPanelElement = this.l_selectionPanel.leftElements[i];
            if (l_selectionPanelElement.isSelected.value)
            {
                l_addedEstablishments.push(l_selectionPanelElement.userDefined.establishment.id);
            }
        }
        if (l_addedEstablishments.length > 0)
        {
            DishService.LinkDishToEstablishmentUpdate(this.dish_id, l_addedEstablishments, EstablishmentDishExecutionType.REMOVE, () =>
            {
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

export { EstablishmentAddToDish }