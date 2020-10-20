import { LoadingButton } from "../components_graphic/LoadingButton.js"
import { ServerError } from "../server/Server.js";
import {
    EstablishmentService, Establishment, EstablishmentAddress, EstablishmentWithAddress, EstablishmentWithDependenciesV2,
    EstablishmentDelta, EstablishmentAddressDelta, EstablishmentCalculationType
} from "../services/Establishment.js"
import { BindingUtils, Observable } from "../binding/Binding.js"
import { CitySelection, CitySelectionUpdate } from "./CitySelection.js";
import { City, GeoService } from "../services/Geo.js";
import { MapSelection, MapSelectionUpdate } from "../components_graphic/MapSelection.js"
import { InputTextUpdateElement } from "../components_graphic/InputTextUpdateElement.js"


class ProfileEstablishmentContext extends HTMLElement {
    static readonly Type: string = "profile-establishment-context";

    private establishmentRegistration: EstablishmentRegistration;
    private establishmentListsElement: HTMLElement;

    static Initialize() {
        customElements.define(ProfileEstablishmentContext.Type, ProfileEstablishmentContext);
        customElements.define(EstablishmentRegistration.Type, EstablishmentRegistration);
    }

    constructor() {
        super()

        let l_template: HTMLTemplateElement = document.getElementById(ProfileEstablishmentContext.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));

        this.establishmentRegistration = this.querySelector(EstablishmentRegistration.Type);
        this.establishmentRegistration.addEventListener(EstablishmentRegistration_AddedEstablishment.Type, () => { this.reloadEstablishments(); });

        this.establishmentListsElement = this.querySelector("#establishments-list");
        this.reloadEstablishments();
    }

    public reloadEstablishments() {
        this.establishmentListsElement.innerHTML = "";
        EstablishmentService.GetEstablishments(
            [EstablishmentCalculationType.RETRIEVE_CITIES],
            (p_establishments: EstablishmentWithDependenciesV2) => {
                for (let i = 0; i < p_establishments.establishments.length; i++) {
                    let l_establishmentDisplay_root = document.createElement("div");
                    this.establishmentListsElement.appendChild(l_establishmentDisplay_root);

                    let l_establishmentDisplay: EstablishementDisplay = EstablishementDisplay.build(l_establishmentDisplay_root, p_establishments.establishments[i], p_establishments.establishment_addresses[i],
                         p_establishments.cities[p_establishments.establishment_address_TO_city[i]]);
                    l_establishmentDisplay.root.addEventListener(EstablishementDisplay_AskToReload_Event.Type, () => {this.reloadEstablishments();});
                }
            }, null
        );
    }
}

class EstablishmentRegistration_AddedEstablishment extends Event {
    public static readonly Type = 'added-establishment';

    constructor() {
        super(EstablishmentRegistration_AddedEstablishment.Type);
    }
}

//TODO -> Adding support for zip code ?
class EstablishmentRegistration extends HTMLElement {
    static readonly Type: string = "establishment-creation";

    private addEstablishmentButton: HTMLButtonElement;

    private addEstablishmentForm: HTMLElement;
    private addEstablishmentFormDisplayed: Observable<boolean>;

    private inputName: HTMLInputElement;
    private inputAddressStreetName: HTMLInputElement;
    private citySelection: CitySelection;
    private latLngMap: MapSelection;
    private inputPhone: HTMLInputElement;
    private inputThumbImage : HTMLInputElement;

    private inputNameObservable: Observable<string>;

    private inputAddressStreetNameObservable: Observable<string>;

    private inputPhoneObservable: Observable<string>;

    private createEstablishmentButton: LoadingButton;

    constructor() {
        super()

        let l_template: HTMLTemplateElement = document.getElementById(EstablishmentRegistration.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));

        this.addEstablishmentButton = this.querySelector("#add-establishment-button") as HTMLButtonElement;
        this.addEstablishmentButton.addEventListener("click", () => { this.onAddEstablishmentButtonClick(); });

        this.addEstablishmentForm = this.querySelector("#add-establishment-form") as HTMLElement;
        this.addEstablishmentFormDisplayed = new Observable<boolean>(false);
        BindingUtils.bindDisplayStyle(this.addEstablishmentForm, this.addEstablishmentFormDisplayed);

        this.inputName = this.querySelector("#name") as HTMLInputElement;
        this.inputAddressStreetName = this.querySelector("#street-name") as HTMLInputElement;
        this.citySelection = new CitySelection(this.querySelector("#city"));
        this.latLngMap = new MapSelection(this.querySelector("#latlng"), 48.85, 2.35);
        this.inputPhone = this.querySelector("#phone") as HTMLInputElement;
        this.inputThumbImage = this.querySelector("#thumb") as HTMLInputElement;

        this.inputNameObservable = new Observable<string>("");
        this.inputAddressStreetNameObservable = new Observable<string>("");
        this.inputPhoneObservable = new Observable<string>("");

        BindingUtils.bindInputText(this.inputName, this.inputNameObservable);
        BindingUtils.bindInputText(this.inputAddressStreetName, this.inputAddressStreetNameObservable);
        BindingUtils.bindInputText(this.inputPhone, this.inputPhoneObservable);

        this.createEstablishmentButton = new LoadingButton(this.querySelector("#establishment-creation"), (p_onCompleted) => { this.createEstablishment(p_onCompleted); });
    }

    onAddEstablishmentButtonClick() {
        this.addEstablishmentFormDisplayed.value = !this.addEstablishmentFormDisplayed.value;
        if(this.addEstablishmentFormDisplayed.value)
        {
            this.latLngMap.invalidateSize();
        }
    }

    createEstablishment(p_onCompleted: () => void) {
        let l_city: City | null = this.citySelection.getSelectedCity();
        let l_establishment: Establishment = new Establishment(this.inputNameObservable.value, this.inputPhoneObservable.value);
        let l_establishmentAddress: EstablishmentAddress = new EstablishmentAddress();
        l_establishmentAddress.street_full_name = this.inputAddressStreetNameObservable.value;
        l_establishmentAddress.lat = this.latLngMap.latLng.lat;
        l_establishmentAddress.lng = this.latLngMap.latLng.lng;

        if (l_city) {
            l_establishmentAddress.city_id = l_city.id;
        }

        EstablishmentService.CreateEstablishment_With_Address(
            l_establishment, l_establishmentAddress, this.inputThumbImage.files[0],
            () => {
                this.dispatchEvent(new EstablishmentRegistration_AddedEstablishment());
                p_onCompleted();
            },
            (err: ServerError) => {
                console.error(`${err.code} ${err.message}`);
                p_onCompleted();
            }
        );

    }
}

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

    public static build(p_root : HTMLElement, p_sourceEstablishment : Establishment, p_sourceEstablishmentAddress : EstablishmentAddress, p_city : City): EstablishementDisplay {
        let l_establihsmentDisplay: EstablishementDisplay = new EstablishementDisplay();

        l_establihsmentDisplay._root = p_root;
        
        let l_template: HTMLTemplateElement = document.getElementById(EstablishementDisplay.Type) as HTMLTemplateElement;
        l_establihsmentDisplay._root.appendChild(l_template.content.cloneNode(true));

        l_establihsmentDisplay.establishmentServer = p_sourceEstablishment;
        l_establihsmentDisplay.isModificationEnabled = new Observable<boolean>(false);
        l_establihsmentDisplay.modificationButtonText = new Observable<string>("");

        l_establihsmentDisplay.nameElement = new InputTextUpdateElement(l_establihsmentDisplay._root.querySelector("#name"));
        l_establihsmentDisplay.nameElement.init(p_sourceEstablishment.name);

        l_establihsmentDisplay.addressElement = new InputTextUpdateElement(l_establihsmentDisplay._root.querySelector("#address"));
        l_establihsmentDisplay.addressElement.init(p_sourceEstablishmentAddress.street_full_name);

        l_establihsmentDisplay.cityElement = new CitySelectionUpdate(l_establihsmentDisplay._root.querySelector("#city"));
        l_establihsmentDisplay.cityElement.setInitialValue(p_city);

        l_establihsmentDisplay.pointElement = new MapSelectionUpdate(l_establihsmentDisplay._root.querySelector("#point"), p_sourceEstablishmentAddress.lat, p_sourceEstablishmentAddress.lng);

        l_establihsmentDisplay.phoneElement = new InputTextUpdateElement(l_establihsmentDisplay._root.querySelector("#phone"));
        l_establihsmentDisplay.phoneElement.init(p_sourceEstablishment.phone);

        l_establihsmentDisplay.modificationUnlockButton = l_establihsmentDisplay._root.querySelector("#modification-unlock");
        l_establihsmentDisplay.submitChangeButton = new LoadingButton(l_establihsmentDisplay._root.querySelector("#submit"), (p_onCompleted) => {l_establihsmentDisplay.onSubmitPressed(p_onCompleted)} );

        l_establihsmentDisplay.deleteButton = new LoadingButton(l_establihsmentDisplay._root.querySelector("#delete"), (p_onCompleted) => {l_establihsmentDisplay.onDeletePressed(p_onCompleted)});

        l_establihsmentDisplay.modificationButtonText.subscribe((arg0) => { l_establihsmentDisplay.modificationUnlockButton.textContent = arg0 });

        l_establihsmentDisplay.isModificationEnabled.subscribe_withInit((arg0) => { l_establihsmentDisplay.onIsModificationEnabledChanged(arg0); })
        l_establihsmentDisplay.modificationUnlockButton.addEventListener("click", () => { l_establihsmentDisplay.isModificationEnabled.value = !l_establihsmentDisplay.isModificationEnabled.value });

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
        if (this.nameElement.hasChanged.value || this.phoneElement.hasChanged.value) {
            l_establishmentDelta = new EstablishmentDelta();
            if (this.nameElement.hasChanged.value) { l_establishmentDelta.name = this.nameElement.input.value; }
            if (this.phoneElement.hasChanged.value) { l_establishmentDelta.phone = this.phoneElement.input.value; }
        }

        if (this.addressElement.hasChanged.value || this.pointElement.hasChanged.value || this.cityElement.hasChanged.value) {
            l_establishmentAddressDelta = new EstablishmentAddressDelta();
            if (this.addressElement.hasChanged.value) { l_establishmentAddressDelta.street_full_name = this.addressElement.input.value; }
            if (this.pointElement.hasChanged.value) {
                l_establishmentAddressDelta.lat = this.pointElement.latLng.lat;
                l_establishmentAddressDelta.lng = this.pointElement.latLng.lng;
            }
            if (this.cityElement.hasChanged.value) { 
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
                this._root.dispatchEvent(new EstablishementDisplay_AskToReload_Event());
                p_onCompleted();
            }, () => {
                p_onCompleted();
            });
    }
}


class EstablishementDisplay_AskToReload_Event extends Event
{
    public static readonly Type : string = "ask-reload";
    constructor()
    {
        super(EstablishementDisplay_AskToReload_Event.Type);
    }
}


export { ProfileEstablishmentContext }
