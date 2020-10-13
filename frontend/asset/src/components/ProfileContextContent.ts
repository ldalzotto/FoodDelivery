import {LoadingButtonV2} from "../components_graphic/LoadingButton.js"
import { ServerError } from "../server/Server.js";
import {EstablishmentService, Establishment} from "../services/Establishment.js"
import {BindingUtils, Observable} from "../binding/Binding.js"


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

        this.attachShadow({mode: 'open'});
        let l_template : HTMLTemplateElement = document.getElementById(ProfileEstablishmentContext.Type) as HTMLTemplateElement;
        this.shadowRoot.append(l_template.content.cloneNode(true));

        this.establishmentRegistration = this.shadowRoot.querySelector(EstablishmentRegistration.Type);
        this.establishmentRegistration.addEventListener(EstablishmentRegistration_AddedEstablishment.Type, () => {this.reloadEstablishments();});

        this.establishmentListsElement = this.shadowRoot.getElementById("establishments-list");
        this.reloadEstablishments();
    }

    public reloadEstablishments()
    {
        this.establishmentListsElement.innerHTML = "";
        EstablishmentService.GetEstablishments(
            (p_establishments : Establishment[]) => {
                for(let i=0;i<p_establishments.length;i++)
                {
                    let l_establishmentDisplay : EstablishementDisplay = document.createElement(EstablishementDisplay.Type) as EstablishementDisplay;
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

class EstablishmentRegistration extends HTMLElement
{
    static readonly Type : string = "establishment-creation";

    private addEstablishmentButton : HTMLButtonElement;

    private addEstablishmentForm : HTMLElement;
    private addEstablishmentFormDisplayed : Observable<boolean>;

    private inputName : HTMLInputElement;
    private inputAddress : HTMLInputElement;
    private inputPhone : HTMLInputElement;

    private inputNameObservable : Observable<string>;
    private inputAddressObservable : Observable<string>;
    private inputPhoneObservable : Observable<string>;

    private createEstablishmentButton : LoadingButtonV2;

    constructor()
    {
        super()

        this.attachShadow({mode: 'open'});
        let l_template : HTMLTemplateElement = document.getElementById(EstablishmentRegistration.Type) as HTMLTemplateElement;
        this.shadowRoot.append(l_template.content.cloneNode(true));

        this.addEstablishmentButton = this.shadowRoot.getElementById("add-establishment-button") as HTMLButtonElement;
        this.addEstablishmentButton.addEventListener("click", () => {this.onAddEstablishmentButtonClick();});

        this.addEstablishmentForm = this.shadowRoot.getElementById("add-establishment-form") as HTMLElement;
        this.addEstablishmentFormDisplayed = new Observable<boolean>(false);
        BindingUtils.bindDisplayStyle(this.addEstablishmentForm, this.addEstablishmentFormDisplayed);

        this.inputName = this.shadowRoot.getElementById("name") as HTMLInputElement;
        this.inputAddress = this.shadowRoot.getElementById("address") as HTMLInputElement;
        this.inputPhone = this.shadowRoot.getElementById("phone") as HTMLInputElement;

        this.inputNameObservable = new Observable<string>("");
        this.inputAddressObservable = new Observable<string>("");
        this.inputPhoneObservable = new Observable<string>("");

        BindingUtils.bindInputText(this.inputName, this.inputNameObservable);
        BindingUtils.bindInputText(this.inputAddress, this.inputAddressObservable);
        BindingUtils.bindInputText(this.inputPhone, this.inputPhoneObservable);

        this.createEstablishmentButton = new LoadingButtonV2(this.shadowRoot.querySelector(`${LoadingButtonV2.Type}#establishment-creation`), (p_onCompleted) => {this.createEstablishment(p_onCompleted);});   
    }

    onAddEstablishmentButtonClick()
    {
        this.addEstablishmentFormDisplayed.value = !this.addEstablishmentFormDisplayed.value;
    }

    createEstablishment(p_onCompleted : ()=>void)
    {
        console.log("onCreateEstablishmentButtonClicked");
        EstablishmentService.CreateEstablishment(this.inputNameObservable.value, this.inputAddressObservable.value, this.inputPhoneObservable.value, 
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

    private nameElement : HTMLDivElement;
    private addressElement : HTMLDivElement;
    private phoneElement : HTMLDivElement;

    constructor()
    {
        super()

        this.attachShadow({mode: 'open'});
        let l_template : HTMLTemplateElement = document.getElementById(EstablishementDisplay.Type) as HTMLTemplateElement;
        this.shadowRoot.append(l_template.content.cloneNode(true));

        this.nameElement = this.shadowRoot.getElementById("name") as HTMLDivElement;
        this.addressElement = this.shadowRoot.getElementById("address") as HTMLDivElement;
        this.phoneElement = this.shadowRoot.getElementById("phone") as HTMLDivElement;
    }

    public populateEstablishment(p_establishment : Establishment)
    {
        this.nameElement.innerText = p_establishment.name;
        this.addressElement.innerText = p_establishment.address;
        this.phoneElement.innerText = p_establishment.phone;
    }
}

/*
    <template id="establishment-display">
      <div>
        <div>Name : </div> <div id="name"></div>
        <div>Address : </div> <div id="address"></div>
        <div>Phone : </div> <div id="phone"></div>
      </div>
    </template>
*/

export {ProfileEstablishmentContext}
