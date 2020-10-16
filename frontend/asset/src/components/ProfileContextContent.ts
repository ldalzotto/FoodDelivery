import {LoadingButton} from "../components_graphic/LoadingButton.js"
import { ServerError } from "../server/Server.js";
import {EstablishmentService, Establishment, EstablishmentAddress, EstablishmentWithAddress, 
        EstablishmentDelta, EstablishmentAddressDelta} from "../services/Establishment.js"
import {BindingUtils, Observable} from "../binding/Binding.js"
import { CitySelection } from "./CitySelection.js";
import { City } from "../services/Geo.js";
import {MapSelection} from "../components_graphic/MapSelection.js"
import {InputTextUpdateElement} from "../components_graphic/InputTextUpdateElement.js"


class ProfileEstablishmentContext extends HTMLElement
{
    static readonly Type : string = "profile-establishment-context";

    private establishmentRegistration : EstablishmentRegistration;
    private establishmentListsElement : HTMLElement;

    static Initialize()
    {
        customElements.define(ProfileEstablishmentContext.Type, ProfileEstablishmentContext);
        customElements.define(EstablishmentRegistration.Type, EstablishmentRegistration);
        customElements.define(EstablishementDisplay.Type, EstablishementDisplay);
    }

    constructor()
    {
        super()

        let l_template : HTMLTemplateElement = document.getElementById(ProfileEstablishmentContext.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));

        this.establishmentRegistration = this.querySelector(EstablishmentRegistration.Type);
        this.establishmentRegistration.addEventListener(EstablishmentRegistration_AddedEstablishment.Type, () => {this.reloadEstablishments();});

        this.establishmentListsElement = this.querySelector("#establishments-list");
        this.reloadEstablishments();
    }

    public reloadEstablishments()
    {
        this.establishmentListsElement.innerHTML = "";
        EstablishmentService.GetEstablishments(
            (p_establishments : EstablishmentWithAddress[]) => {
                for(let i=0;i<p_establishments.length;i++)
                {
                    let l_establishmentDisplay : EstablishementDisplay = new EstablishementDisplay();
                    this.establishmentListsElement.appendChild(l_establishmentDisplay);
                    l_establishmentDisplay.populateEstablishment(p_establishments[i]);
                }
            }, null
        );
    }
}

class EstablishmentRegistration_AddedEstablishment extends Event
{
    public static readonly Type = 'added-establishment';

    constructor()
    {
        super(EstablishmentRegistration_AddedEstablishment.Type);
    }
}

//TODO -> Adding support for zip code ?
class EstablishmentRegistration extends HTMLElement
{
    static readonly Type : string = "establishment-creation";

    private addEstablishmentButton : HTMLButtonElement;

    private addEstablishmentForm : HTMLElement;
    private addEstablishmentFormDisplayed : Observable<boolean>;

    private inputName : HTMLInputElement;
    private inputAddressStreetName : HTMLInputElement;
    private citySelection : CitySelection;
    private latLngMap : MapSelection;
    private inputPhone : HTMLInputElement;

    private inputNameObservable : Observable<string>;
    
    private inputAddressStreetNameObservable : Observable<string>;

    private inputPhoneObservable : Observable<string>;

    private createEstablishmentButton : LoadingButton;

    constructor()
    {
        super()

        let l_template : HTMLTemplateElement = document.getElementById(EstablishmentRegistration.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));

        this.addEstablishmentButton = this.querySelector("#add-establishment-button") as HTMLButtonElement;
        this.addEstablishmentButton.addEventListener("click", () => {this.onAddEstablishmentButtonClick();});

        this.addEstablishmentForm = this.querySelector("#add-establishment-form") as HTMLElement;
        this.addEstablishmentFormDisplayed = new Observable<boolean>(false);
        BindingUtils.bindDisplayStyle(this.addEstablishmentForm, this.addEstablishmentFormDisplayed);

        this.inputName = this.querySelector("#name") as HTMLInputElement;
        this.inputAddressStreetName = this.querySelector("#street-name") as HTMLInputElement;
        this.citySelection = this.querySelector("#city") as CitySelection;
        this.latLngMap = this.querySelector("#latlng") as MapSelection;
        this.inputPhone = this.querySelector("#phone") as HTMLInputElement;

        this.inputNameObservable = new Observable<string>("");
        this.inputAddressStreetNameObservable = new Observable<string>("");
        this.inputPhoneObservable = new Observable<string>("");

        BindingUtils.bindInputText(this.inputName, this.inputNameObservable);
        BindingUtils.bindInputText(this.inputAddressStreetName, this.inputAddressStreetNameObservable);
        BindingUtils.bindInputText(this.inputPhone, this.inputPhoneObservable);

        this.createEstablishmentButton = this.querySelector("#establishment-creation") as LoadingButton;
        this.createEstablishmentButton.new((p_onCompleted) => {this.createEstablishment(p_onCompleted);});
    }

    onAddEstablishmentButtonClick()
    {
        this.addEstablishmentFormDisplayed.value = !this.addEstablishmentFormDisplayed.value;
    }

    createEstablishment(p_onCompleted : ()=>void)
    {
        let l_city : City | null = this.citySelection.getSelectedCity();
        let l_establishment : Establishment = new Establishment(this.inputNameObservable.value, this.inputPhoneObservable.value);
        let l_establishmentAddress : EstablishmentAddress = new EstablishmentAddress();
        l_establishmentAddress.street_full_name = this.inputAddressStreetNameObservable.value;
        l_establishmentAddress.lat = this.latLngMap.selectedLat;
        l_establishmentAddress.lng = this.latLngMap.selectedLong;
        
        if(l_city)
        {
            l_establishmentAddress.city_id = l_city.id;
        }

        EstablishmentService.CreateEstablishment_With_Address(
            l_establishment, l_establishmentAddress, 
        () => {
            this.dispatchEvent(new EstablishmentRegistration_AddedEstablishment());
            p_onCompleted();
        } , 
        (err : ServerError) => { 
            console.error(`${err.code} ${err.message}`);
            p_onCompleted(); 
        }
        );
        
    }
}

class EstablishementDisplay extends HTMLElement
{
    static readonly Type : string = "establishment-display";

    private nameElement : InputTextUpdateElement;
    private addressElement : InputTextUpdateElement;
    private pointElement : MapSelection;
    private phoneElement : InputTextUpdateElement;

    private modificationUnlockButton : HTMLButtonElement;
    private submitChangeButton : HTMLButtonElement;

    private isModificationEnabled : Observable<boolean>;
    private modificationButtonText : Observable<string>;

    private establishmentServer : EstablishmentWithAddress;

    private establishmentUpdateDelta : EstablishmentDelta;
    private establishmentAddressUpdateDelta : EstablishmentAddressDelta;

    constructor()
    {
        super()

        let l_template : HTMLTemplateElement = document.getElementById(EstablishementDisplay.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));

        this.isModificationEnabled = new Observable<boolean>(false);
        this.modificationButtonText = new Observable<string>("");
        
        this.nameElement = new InputTextUpdateElement(this.querySelector("#name"));
        
        this.addressElement = new InputTextUpdateElement(this.querySelector("#address"));
        
        this.pointElement = this.querySelector("#point") as MapSelection;
        this.phoneElement = new InputTextUpdateElement(this.querySelector("#phone"));
        
        this.modificationUnlockButton = this.querySelector("#modification-unlock");
        this.submitChangeButton = this.querySelector("#submit") as HTMLButtonElement;
        
        this.modificationButtonText.subscribe((arg0)=>{this.modificationUnlockButton.textContent = arg0});

        this.isModificationEnabled.subscribe_withInit((arg0)=>{this.onIsModificationEnabledChanged(arg0);})
        this.modificationUnlockButton.addEventListener("click", () => {this.isModificationEnabled.value = !this.isModificationEnabled.value});
    
        this.submitChangeButton.addEventListener("click", () => {this.onSubmitPressed();});
    }

    public populateEstablishment(p_establishment : EstablishmentWithAddress)
    {
        this.establishmentServer = p_establishment;
        this.nameElement.init(p_establishment.establishment.name);
        this.addressElement.init(p_establishment.establishment_address.street_full_name);
        this.pointElement.setSelectionMarker(p_establishment.establishment_address.lat, p_establishment.establishment_address.lng, true);
        this.phoneElement.init(p_establishment.establishment.phone);
    }

    onIsModificationEnabledChanged(p_isModificationEnabled : boolean)
    {
        if(p_isModificationEnabled)
        {
            this.nameElement.enableModifications();
            this.addressElement.enableModifications();
            this.phoneElement.enableModifications();
            this.modificationButtonText.value = "LOCK MODIFICATIONS";
        }
        else
        {
            this.nameElement.disableModifications();
            this.addressElement.disableModifications();
            this.phoneElement.disableModifications();
            this.modificationButtonText.value = "UNLOCK MODIFICATIONS";
        }
    }

    onSubmitPressed()
    {
        console.log("Submit");
        let l_establishmentDelta : EstablishmentDelta | null;
        let l_establishmentAddressDelta : EstablishmentAddressDelta | null;
        if(this.nameElement.hasChanged.value || this.phoneElement.hasChanged.value)
        {
            l_establishmentDelta = new EstablishmentDelta();
            if(this.nameElement.hasChanged.value){l_establishmentDelta.name = this.nameElement.input.value;}
            if(this.phoneElement.hasChanged.value){l_establishmentDelta.phone = this.phoneElement.input.value;}
        }

        if(this.addressElement.hasChanged.value)
        {
            l_establishmentAddressDelta = new EstablishmentAddressDelta();
            if(this.addressElement.hasChanged.value){l_establishmentAddressDelta.street_full_name = this.addressElement.input.value;}
        }

        EstablishmentService.UpdateEstablishment_Widht_Address(this.establishmentServer.establishment.id, l_establishmentDelta, l_establishmentAddressDelta, 
            () => {
                this.nameElement.setCurrentAsInitialValue();
                this.addressElement.setCurrentAsInitialValue();
                this.phoneElement.setCurrentAsInitialValue();
                this.isModificationEnabled.value = false;
            }
            , null);
        // console.log(this.phoneElement.hasChanged);
    }
}

export {ProfileEstablishmentContext}
