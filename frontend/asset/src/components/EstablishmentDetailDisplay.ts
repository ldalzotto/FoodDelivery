import { InputElementType, InputImageUpdateElement, InputUpdateElement } from "../components_graphic/InputUpdateElement.js";
import { MapSelectionUpdate } from "../components_graphic/MapSelection.js";
import { UpdatableElement, UpdatablePanel, UpdatablePanelCallbacks } from "../components_graphic/UpdatablePanel.js";
import { Establishment, EstablishmentAddressDelta, EstablishmentCalculationType, EstablishmentDelta, EstablishmentGet, EstablishmentService } from "../services/Establishment.js";
import { CitySelectionUpdate } from "./CitySelection.js";


class EstablishementDisplay {
    static readonly Type: string = "establishment-display";

    private _root : HTMLElement;
    public get root(){return this._root;}

    public nameElement: InputUpdateElement;
    public addressElement: InputUpdateElement;
    public cityElement: CitySelectionUpdate;
    public pointElement: MapSelectionUpdate;
    public phoneElement: InputUpdateElement;
    public thumbImageElement: InputImageUpdateElement;

    public establishmentServer: Establishment;

    public updatablePanel : UpdatablePanel;

    public static build(p_root : HTMLElement, p_establishmentId : number): EstablishementDisplay {
        let l_establihsmentDisplay: EstablishementDisplay = new EstablishementDisplay();
        l_establihsmentDisplay._root = p_root;

        let l_template: HTMLTemplateElement = document.getElementById(EstablishementDisplay.Type) as HTMLTemplateElement;
        let l_modificationContentElement = l_template.content.cloneNode(true) as HTMLElement;
        l_establihsmentDisplay.nameElement = new InputUpdateElement(l_modificationContentElement.querySelector("#name"), InputElementType.TEXT);
        l_establihsmentDisplay.addressElement = new InputUpdateElement(l_modificationContentElement.querySelector("#address"), InputElementType.TEXT);
        l_establihsmentDisplay.cityElement = new CitySelectionUpdate(l_modificationContentElement.querySelector("#city"));
        l_establihsmentDisplay.pointElement = new MapSelectionUpdate(l_modificationContentElement.querySelector("#point"));
        l_establihsmentDisplay.phoneElement = new InputUpdateElement(l_modificationContentElement.querySelector("#phone"), InputElementType.TEXT);
        l_establihsmentDisplay.thumbImageElement = new InputImageUpdateElement(l_modificationContentElement.querySelector("#thumb"));

        let l_updatableElements: UpdatableElement[] = [
            l_establihsmentDisplay.nameElement,
            l_establihsmentDisplay.addressElement,
            l_establihsmentDisplay.cityElement,
            l_establihsmentDisplay.pointElement,
            l_establihsmentDisplay.phoneElement,
            l_establihsmentDisplay.thumbImageElement
        ];
        l_establihsmentDisplay.updatablePanel = new UpdatablePanel(l_establihsmentDisplay._root,
            new EstablishmentDisplayCallbacks(l_establihsmentDisplay), l_modificationContentElement, l_updatableElements);

        EstablishmentService.GetEstablishment(p_establishmentId, [EstablishmentCalculationType.RETRIEVE_CITIES, EstablishmentCalculationType.RETRIEVE_THUMBNAIL],
            (p_establishmentGet: EstablishmentGet) =>
            {

                let l_establishment_address = p_establishmentGet.establishment_addresses[0];
                let l_city = p_establishmentGet.cities[p_establishmentGet.establishment_address_TO_city[0]];

                l_establihsmentDisplay.establishmentServer = p_establishmentGet.establishments[0];
                l_establihsmentDisplay.nameElement.init(l_establihsmentDisplay.establishmentServer.name);
                l_establihsmentDisplay.addressElement.init(l_establishment_address.street_full_name);
                l_establihsmentDisplay.cityElement.setInitialValue(l_city);
                l_establihsmentDisplay.pointElement.init(l_establishment_address.lat, l_establishment_address.lng);

                l_establihsmentDisplay.phoneElement.init(l_establihsmentDisplay.establishmentServer.phone);




             }, null);
        return l_establihsmentDisplay;
    }

}

class EstablishmentDisplayCallbacks implements UpdatablePanelCallbacks
{
    private establishmentDisplay : EstablishementDisplay;

    constructor(p_establishmentDisplay : EstablishementDisplay)
    {
        this.establishmentDisplay = p_establishmentDisplay;   
    }

    onSubmitPressed(p_onCompleted: () => void): void {
        let l_establishmentDelta: EstablishmentDelta | null;
        let l_establishmentAddressDelta: EstablishmentAddressDelta | null;
        let l_establishmentThumbDelta: File | null;

        if (this.establishmentDisplay.nameElement.hasChanged() || this.establishmentDisplay.phoneElement.hasChanged()) {
            l_establishmentDelta = new EstablishmentDelta();
            if (this.establishmentDisplay.nameElement.hasChanged()) { l_establishmentDelta.name = this.establishmentDisplay.nameElement.input.value; }
            if (this.establishmentDisplay.phoneElement.hasChanged()) { l_establishmentDelta.phone = this.establishmentDisplay.phoneElement.input.value; }
        }

        if (this.establishmentDisplay.addressElement.hasChanged() || this.establishmentDisplay.pointElement.hasChanged() || this.establishmentDisplay.cityElement.hasChanged()) {
            l_establishmentAddressDelta = new EstablishmentAddressDelta();
            if (this.establishmentDisplay.addressElement.hasChanged()) { l_establishmentAddressDelta.street_full_name = this.establishmentDisplay.addressElement.input.value; }
            if (this.establishmentDisplay.pointElement.hasChanged()) {
                l_establishmentAddressDelta.lat = this.establishmentDisplay.pointElement.latLng.lat;
                l_establishmentAddressDelta.lng = this.establishmentDisplay.pointElement.latLng.lng;
            }
            if (this.establishmentDisplay.cityElement.hasChanged()) { 
                let l_selectedCity = this.establishmentDisplay.cityElement.getSelectedCity();
                if(l_selectedCity)
                {
                    l_establishmentAddressDelta.city_id = this.establishmentDisplay.cityElement.getSelectedCity().id;
                }
            }
        }

        if (this.establishmentDisplay.thumbImageElement.hasChanged())
        {
            l_establishmentThumbDelta = this.establishmentDisplay.thumbImageElement.input.files[0];
        }

        EstablishmentService.UpdateEstablishment_Widht_Address(this.establishmentDisplay.establishmentServer.id, l_establishmentDelta, l_establishmentAddressDelta, l_establishmentThumbDelta,
            () => {
                this.establishmentDisplay.updatablePanel.clearChanges();
                p_onCompleted();
            }
            , () => {
                p_onCompleted();
            });
    };

    onDeletePressed(p_onCompleted: () => void): void {
        EstablishmentService.DeleteEstablishment(this.establishmentDisplay.establishmentServer.id, 
            () => {
                p_onCompleted();
            }, () => {
                p_onCompleted();
            });
    };
    
}

export {EstablishementDisplay}