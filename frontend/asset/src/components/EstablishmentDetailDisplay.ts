import { Observable } from "../binding/Binding.js";
import { InputTextUpdateElement } from "../components_graphic/InputTextUpdateElement.js";
import { LoadingButton } from "../components_graphic/LoadingButton.js";
import { MapSelectionUpdate } from "../components_graphic/MapSelection.js";
import { Establishment, EstablishmentAddress, EstablishmentAddressDelta, EstablishmentCalculationType, EstablishmentDelta, EstablishmentGet, EstablishmentService } from "../services/Establishment.js";
import { CitySelectionUpdate } from "./CitySelection.js";


class EstablishementDisplay {
    static readonly Type: string = "establishment-display";

    private _root : HTMLElement;
    public get root(){return this._root;}

    private nameElement: InputTextUpdateElement;
    private addressElement: InputTextUpdateElement;
    private cityElement: CitySelectionUpdate;
    private pointElement: MapSelectionUpdate;
    private phoneElement: InputTextUpdateElement;

    private modificationUnlockButton: HTMLButtonElement;
    private submitChangeButton: LoadingButton;
    private deleteButton: LoadingButton;

    private isModificationEnabled: Observable<boolean>;
    private modificationButtonText: Observable<string>;

    private establishmentServer: Establishment;

    private establishmentUpdateDelta: EstablishmentDelta;
    private establishmentAddressUpdateDelta: EstablishmentAddressDelta;

    public static build(p_root : HTMLElement, p_establishmentId : number): EstablishementDisplay {
        let l_establihsmentDisplay: EstablishementDisplay = new EstablishementDisplay();
        l_establihsmentDisplay._root = p_root;

        EstablishmentService.GetEstablishment(p_establishmentId, [EstablishmentCalculationType.RETRIEVE_CITIES, EstablishmentCalculationType.RETRIEVE_THUMBNAIL],
             (p_establishmentGet : EstablishmentGet) => {
                let l_template: HTMLTemplateElement = document.getElementById(EstablishementDisplay.Type) as HTMLTemplateElement;
                l_establihsmentDisplay._root.appendChild(l_template.content.cloneNode(true));
        
                let l_establishment_address = p_establishmentGet.establishment_addresses[0];
                let l_city = p_establishmentGet.cities[p_establishmentGet.establishment_address_TO_city[0]]; 

                l_establihsmentDisplay.establishmentServer = p_establishmentGet.establishments[0];
                l_establihsmentDisplay.isModificationEnabled = new Observable<boolean>(false);
                l_establihsmentDisplay.modificationButtonText = new Observable<string>("");
        
                l_establihsmentDisplay.nameElement = new InputTextUpdateElement(l_establihsmentDisplay._root.querySelector("#name"));
                l_establihsmentDisplay.nameElement.init(l_establihsmentDisplay.establishmentServer.name);
        
                l_establihsmentDisplay.addressElement = new InputTextUpdateElement(l_establihsmentDisplay._root.querySelector("#address"));
                l_establihsmentDisplay.addressElement.init(l_establishment_address.street_full_name);
        
                l_establihsmentDisplay.cityElement = new CitySelectionUpdate(l_establihsmentDisplay._root.querySelector("#city"));
                l_establihsmentDisplay.cityElement.setInitialValue(l_city);
        
                l_establihsmentDisplay.pointElement = new MapSelectionUpdate(l_establihsmentDisplay._root.querySelector("#point"), l_establishment_address.lat, l_establishment_address.lng);
        
                l_establihsmentDisplay.phoneElement = new InputTextUpdateElement(l_establihsmentDisplay._root.querySelector("#phone"));
                l_establihsmentDisplay.phoneElement.init(l_establihsmentDisplay.establishmentServer.phone);
        
                l_establihsmentDisplay.modificationUnlockButton = l_establihsmentDisplay._root.querySelector("#modification-unlock");
                l_establihsmentDisplay.submitChangeButton = new LoadingButton(l_establihsmentDisplay._root.querySelector("#submit"), (p_onCompleted) => {l_establihsmentDisplay.onSubmitPressed(p_onCompleted)} );
        
                l_establihsmentDisplay.deleteButton = new LoadingButton(l_establihsmentDisplay._root.querySelector("#delete"), (p_onCompleted) => {l_establihsmentDisplay.onDeletePressed(p_onCompleted)});
        
                l_establihsmentDisplay.modificationButtonText.subscribe((arg0) => { l_establihsmentDisplay.modificationUnlockButton.textContent = arg0 });
        
                l_establihsmentDisplay.isModificationEnabled.subscribe_withInit((arg0) => { l_establihsmentDisplay.onIsModificationEnabledChanged(arg0); })
                l_establihsmentDisplay.modificationUnlockButton.addEventListener("click", () => { l_establihsmentDisplay.isModificationEnabled.value = !l_establihsmentDisplay.isModificationEnabled.value });
        
             }, null);
        return l_establihsmentDisplay;
    }

    onIsModificationEnabledChanged(p_isModificationEnabled: boolean) {
        if (p_isModificationEnabled) {
            this.nameElement.enableModifications();
            this.addressElement.enableModifications();
            this.phoneElement.enableModifications();
            this.pointElement.enableModifications();
            this.cityElement.enableModifications();
            this.modificationButtonText.value = "L";
            this.submitChangeButton.button.disabled = false;
            this.deleteButton.button.disabled = false;
        }
        else {
            this.nameElement.disableModifications();
            this.addressElement.disableModifications();
            this.phoneElement.disableModifications();
            this.pointElement.disableModifications();
            this.cityElement.disableModifications();
            this.modificationButtonText.value = "U";
            this.submitChangeButton.button.disabled = true;
            this.deleteButton.button.disabled = true;
        }
    }

    onSubmitPressed(p_onCompleted : () => void) {
        let l_establishmentDelta: EstablishmentDelta | null;
        let l_establishmentAddressDelta: EstablishmentAddressDelta | null;
        if (this.nameElement.hasChanged() || this.phoneElement.hasChanged()) {
            l_establishmentDelta = new EstablishmentDelta();
            if (this.nameElement.hasChanged()) { l_establishmentDelta.name = this.nameElement.input.value; }
            if (this.phoneElement.hasChanged()) { l_establishmentDelta.phone = this.phoneElement.input.value; }
        }

        if (this.addressElement.hasChanged() || this.pointElement.hasChanged() || this.cityElement.hasChanged()) {
            l_establishmentAddressDelta = new EstablishmentAddressDelta();
            if (this.addressElement.hasChanged()) { l_establishmentAddressDelta.street_full_name = this.addressElement.input.value; }
            if (this.pointElement.hasChanged()) {
                l_establishmentAddressDelta.lat = this.pointElement.latLng.lat;
                l_establishmentAddressDelta.lng = this.pointElement.latLng.lng;
            }
            if (this.cityElement.hasChanged()) { 
                let l_selectedCity = this.cityElement.getSelectedCity();
                if(l_selectedCity)
                {
                    l_establishmentAddressDelta.city_id = this.cityElement.getSelectedCity().id;
                }
            }
        }

        EstablishmentService.UpdateEstablishment_Widht_Address(this.establishmentServer.id, l_establishmentDelta, l_establishmentAddressDelta,
            () => {
                this.nameElement.setCurrentAsInitialValue();
                this.addressElement.setCurrentAsInitialValue();
                this.phoneElement.setCurrentAsInitialValue();
                this.pointElement.setCurrentAsInitialValue();
                this.cityElement.setCurrentAsInitialValue();
                this.isModificationEnabled.value = false;
                p_onCompleted();
            }
            , () => {
                p_onCompleted();
            });
    }


    onDeletePressed(p_onCompleted : () => void) {
        EstablishmentService.DeleteEstablishment(this.establishmentServer.id, 
            () => {
                p_onCompleted();
            }, () => {
                p_onCompleted();
            });
    }
}

export {EstablishementDisplay}