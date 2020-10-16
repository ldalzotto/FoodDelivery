import { LoadingButton } from "../components_graphic/LoadingButton.js"
import { ServerError } from "../server/Server.js";
import {
    EstablishmentService, Establishment, EstablishmentAddress, EstablishmentWithAddress,
    EstablishmentDelta, EstablishmentAddressDelta
} from "../services/Establishment.js"
import { BindingUtils, Observable } from "../binding/Binding.js"
import { CitySelection } from "./CitySelection.js";
import { City } from "../services/Geo.js";
import { MapSelection, MapSelectionUpdate } from "../components_graphic/MapSelection.js"
import { InputTextUpdateElement } from "../components_graphic/InputTextUpdateElement.js"


class ProfileEstablishmentContext extends HTMLElement {
    static readonly Type: string = "profile-establishment-context";

    private establishmentRegistration: EstablishmentRegistration;
    private establishmentListsElement: HTMLElement;

    static Initialize() {
        customElements.define(ProfileEstablishmentContext.Type, ProfileEstablishmentContext);
        customElements.define(EstablishmentRegistration.Type, EstablishmentRegistration);
        customElements.define(EstablishementDisplay.Type, EstablishementDisplay);
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
            (p_establishments: EstablishmentWithAddress[]) => {
                for (let i = 0; i < p_establishments.length; i++) {
                    let l_establishmentDisplay: EstablishementDisplay = EstablishementDisplay.build(p_establishments[i]);
                    this.establishmentListsElement.appendChild(l_establishmentDisplay);
                    l_establishmentDisplay.addEventListener(EstablishementDisplay_AskToReload_Event.Type, () => {this.reloadEstablishments();});
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
        this.citySelection = this.querySelector("#city") as CitySelection;
        this.latLngMap = new MapSelection(this.querySelector("#latlng"), 0, 0);
        this.inputPhone = this.querySelector("#phone") as HTMLInputElement;

        this.inputNameObservable = new Observable<string>("");
        this.inputAddressStreetNameObservable = new Observable<string>("");
        this.inputPhoneObservable = new Observable<string>("");

        BindingUtils.bindInputText(this.inputName, this.inputNameObservable);
        BindingUtils.bindInputText(this.inputAddressStreetName, this.inputAddressStreetNameObservable);
        BindingUtils.bindInputText(this.inputPhone, this.inputPhoneObservable);

        this.createEstablishmentButton = this.querySelector("#establishment-creation") as LoadingButton;
        this.createEstablishmentButton.new((p_onCompleted) => { this.createEstablishment(p_onCompleted); });
    }

    onAddEstablishmentButtonClick() {
        this.addEstablishmentFormDisplayed.value = !this.addEstablishmentFormDisplayed.value;
    }

    createEstablishment(p_onCompleted: () => void) {
        let l_city: City | null = this.citySelection.getSelectedCity();
        let l_establishment: Establishment = new Establishment(this.inputNameObservable.value, this.inputPhoneObservable.value);
        let l_establishmentAddress: EstablishmentAddress = new EstablishmentAddress();
        l_establishmentAddress.street_full_name = this.inputAddressStreetNameObservable.value;
        l_establishmentAddress.lat = this.latLngMap.latLng._Lat;
        l_establishmentAddress.lng = this.latLngMap.latLng._Lng;

        if (l_city) {
            l_establishmentAddress.city_id = l_city.id;
        }

        EstablishmentService.CreateEstablishment_With_Address(
            l_establishment, l_establishmentAddress,
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

class EstablishementDisplay extends HTMLElement {
    static readonly Type: string = "establishment-display";

    private nameElement: InputTextUpdateElement;
    private addressElement: InputTextUpdateElement;
    private pointElement: MapSelectionUpdate;
    private phoneElement: InputTextUpdateElement;

    private modificationUnlockButton: HTMLButtonElement;
    private submitChangeButton: HTMLButtonElement;
    private deleteButton: HTMLButtonElement;

    private isModificationEnabled: Observable<boolean>;
    private modificationButtonText: Observable<string>;

    private establishmentServer: EstablishmentWithAddress;

    private establishmentUpdateDelta: EstablishmentDelta;
    private establishmentAddressUpdateDelta: EstablishmentAddressDelta;

    public static build(p_sourceEstablishment: EstablishmentWithAddress): EstablishementDisplay {
        let l_establihsmentDisplay: EstablishementDisplay = new EstablishementDisplay();

        l_establihsmentDisplay.establishmentServer = p_sourceEstablishment;
        l_establihsmentDisplay.isModificationEnabled = new Observable<boolean>(false);
        l_establihsmentDisplay.modificationButtonText = new Observable<string>("");

        l_establihsmentDisplay.nameElement = new InputTextUpdateElement(l_establihsmentDisplay.querySelector("#name"));
        l_establihsmentDisplay.nameElement.init(p_sourceEstablishment.establishment.name);

        l_establihsmentDisplay.addressElement = new InputTextUpdateElement(l_establihsmentDisplay.querySelector("#address"));
        l_establihsmentDisplay.addressElement.init(p_sourceEstablishment.establishment_address.street_full_name);

        l_establihsmentDisplay.pointElement = new MapSelectionUpdate(l_establihsmentDisplay.querySelector("#point"), p_sourceEstablishment.establishment_address.lat, p_sourceEstablishment.establishment_address.lng);

        l_establihsmentDisplay.phoneElement = new InputTextUpdateElement(l_establihsmentDisplay.querySelector("#phone"));
        l_establihsmentDisplay.phoneElement.init(p_sourceEstablishment.establishment.phone);

        l_establihsmentDisplay.modificationUnlockButton = l_establihsmentDisplay.querySelector("#modification-unlock");
        l_establihsmentDisplay.submitChangeButton = l_establihsmentDisplay.querySelector("#submit") as HTMLButtonElement;
        l_establihsmentDisplay.deleteButton = l_establihsmentDisplay.querySelector("#delete") as HTMLButtonElement;

        l_establihsmentDisplay.modificationButtonText.subscribe((arg0) => { l_establihsmentDisplay.modificationUnlockButton.textContent = arg0 });

        l_establihsmentDisplay.isModificationEnabled.subscribe_withInit((arg0) => { l_establihsmentDisplay.onIsModificationEnabledChanged(arg0); })
        l_establihsmentDisplay.modificationUnlockButton.addEventListener("click", () => { l_establihsmentDisplay.isModificationEnabled.value = !l_establihsmentDisplay.isModificationEnabled.value });

        l_establihsmentDisplay.submitChangeButton.addEventListener("click", () => { l_establihsmentDisplay.onSubmitPressed(); });
        l_establihsmentDisplay.deleteButton.addEventListener("click", () => { l_establihsmentDisplay.onDeletePressed(); })

        return l_establihsmentDisplay;
    }

    constructor() {
        super()

        let l_template: HTMLTemplateElement = document.getElementById(EstablishementDisplay.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));
    }

    onIsModificationEnabledChanged(p_isModificationEnabled: boolean) {
        if (p_isModificationEnabled) {
            this.nameElement.enableModifications();
            this.addressElement.enableModifications();
            this.phoneElement.enableModifications();
            this.pointElement.enableModifications();
            this.modificationButtonText.value = "LOCK MODIFICATIONS";
            this.submitChangeButton.disabled = false;
            this.deleteButton.disabled = false;
        }
        else {
            this.nameElement.disableModifications();
            this.addressElement.disableModifications();
            this.phoneElement.disableModifications();
            this.pointElement.disableModifications();
            this.modificationButtonText.value = "UNLOCK MODIFICATIONS";
            this.submitChangeButton.disabled = true;
            this.deleteButton.disabled = true;
        }
    }

    onSubmitPressed() {
        let l_establishmentDelta: EstablishmentDelta | null;
        let l_establishmentAddressDelta: EstablishmentAddressDelta | null;
        if (this.nameElement.hasChanged.value || this.phoneElement.hasChanged.value) {
            l_establishmentDelta = new EstablishmentDelta();
            if (this.nameElement.hasChanged.value) { l_establishmentDelta.name = this.nameElement.input.value; }
            if (this.phoneElement.hasChanged.value) { l_establishmentDelta.phone = this.phoneElement.input.value; }
        }

        if (this.addressElement.hasChanged.value || this.pointElement.hasChanged.value) {
            l_establishmentAddressDelta = new EstablishmentAddressDelta();
            if (this.addressElement.hasChanged.value) { l_establishmentAddressDelta.street_full_name = this.addressElement.input.value; }
            if (this.pointElement.hasChanged.value) {
                l_establishmentAddressDelta.lat = this.pointElement.latLng._Lat;
                l_establishmentAddressDelta.lng = this.pointElement.latLng._Lng;
            }
        }

        EstablishmentService.UpdateEstablishment_Widht_Address(this.establishmentServer.establishment.id, l_establishmentDelta, l_establishmentAddressDelta,
            () => {
                this.nameElement.setCurrentAsInitialValue();
                this.addressElement.setCurrentAsInitialValue();
                this.phoneElement.setCurrentAsInitialValue();
                this.pointElement.setCurrentAsInitialValue();
                this.isModificationEnabled.value = false;
            }
            , null);
    }


    onDeletePressed() {
        EstablishmentService.DeleteEstablishment(this.establishmentServer.establishment.id, 
            () => {
                this.dispatchEvent(new EstablishementDisplay_AskToReload_Event());
            }, null);
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
