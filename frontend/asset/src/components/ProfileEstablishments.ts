import { LoadingButton } from "../components_graphic/LoadingButton.js"
import { ServerError } from "../framework/server/Server.js";
import {
    EstablishmentService, Establishment, EstablishmentAddress, EstablishmentGet, EstablishmentCalculationType
} from "../services/Establishment.js"
import { BindingUtils, Observable } from "../framework/binding/Binding.js"
import { CitySelection } from "./CitySelection.js";
import { City } from "../services/Geo.js";
import { MapSelectionV2 } from "../components_graphic/MapSelection.js"
import { ImageUrl } from "../services/Image.js";
import { Navigation } from "../services/Navigation.js";
import { ElementList, ElementListCallbacks } from "../components_graphic/ElementList.js";


class ProfileEstablishmentContext extends HTMLElement {
    static readonly Type: string = "profile-establishments";

    private establishmentRegistration: EstablishmentRegistration;
    private establishmentListsElementV2: ElementList<EstablishementDisplayPreview, EstablishmentGet, EstablishmentGet, ProfileEstablishmentListCallbacks>;

    static Initialize() {
        customElements.define(ProfileEstablishmentContext.Type, ProfileEstablishmentContext);
        customElements.define(EstablishmentRegistration.Type, EstablishmentRegistration);
    }

    constructor() {
        super()

        let l_template: HTMLTemplateElement = document.getElementById(ProfileEstablishmentContext.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));

    
        this.establishmentRegistration = this.querySelector(EstablishmentRegistration.Type);
        this.establishmentRegistration.addEventListener(EstablishmentRegistration_AddedEstablishment.Type, () => { this.establishmentListsElementV2.reload(); });

        this.establishmentListsElementV2 = new ElementList(this.querySelector("#establishments-list"), new ProfileEstablishmentListCallbacks());
        this.establishmentListsElementV2.reload();
    }

}

class ProfileEstablishmentListCallbacks implements ElementListCallbacks<EstablishementDisplayPreview, EstablishmentGet, EstablishmentGet>
{
    fetchElements(p_onSuccess: (p_fetch: EstablishmentGet) => void): null {
        EstablishmentService.GetEstablishments(
            [EstablishmentCalculationType.RETRIEVE_CITIES, EstablishmentCalculationType.RETRIEVE_THUMBNAIL], p_onSuccess, null);
        return null;
    }
    forEachFetchedElements(p_fetch: EstablishmentGet, p_callback: (p_fetchElement: EstablishmentGet, p_index: number) => void): null {
        for (let i = 0; i < p_fetch.establishments.length; i++)
        {
            p_callback(p_fetch, i);
        }
        return null;
    }
    buildElement(p_fetchElement: EstablishmentGet, p_index: number, p_itemHTMlRoot: HTMLElement): EstablishementDisplayPreview {

        /*
                l_dishPreview.root.classList.add("column");
        l_dishPreview.root.classList.add("dyn-grid");
        */

        let l_root = document.createElement("div");
        p_itemHTMlRoot.appendChild(l_root);
        l_root.classList.add("column");
        l_root.classList.add("dyn-grid");

        let l_establishmentDisplay: EstablishementDisplayPreview = EstablishementDisplayPreview.build(l_root, p_fetchElement.establishments[p_index], p_fetchElement.establishment_addresses[p_index],
            p_fetchElement.cities[p_fetchElement.establishment_address_TO_city[p_index]],
            p_fetchElement.thumbnails[p_fetchElement.establishment_TO_thumbnail[p_index]]);
       l_establishmentDisplay.root.addEventListener(EstablishementDisplayV2_Click.Type, 
           (p_event : EstablishementDisplayV2_Click) => {Navigation.MoveToEstablishmentDetailPage(p_event.establishment_id);});
        return l_establishmentDisplay;
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
    private latLngMap: MapSelectionV2;
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
        this.latLngMap = new MapSelectionV2(this.querySelector("#latlng"), null);
        this.latLngMap.init(48.85, 2.35);
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

class EstablishementDisplayV2_Click extends Event{
    static readonly Type: string = "establishment-display-preview-click";
    public establishment_id : number;
    constructor(p_establishment_id : number)
    {
        super(EstablishementDisplayV2_Click.Type);
        this.establishment_id = p_establishment_id;
    }
}

class EstablishementDisplayPreview {
    static readonly Type: string = "establishment-display-preview";

    private _root : HTMLElement;
    public get root(){return this._root;}

    private _establishment: Establishment;
    public get establishment() { return this._establishment; }

    public static build(p_root : HTMLElement, p_sourceEstablishment : Establishment, p_sourceEstablishmentAddress : EstablishmentAddress, p_city : City, p_thumbImage : ImageUrl) : EstablishementDisplayPreview
    {
        let l_establihsmentDisplay = new EstablishementDisplayPreview();
        l_establihsmentDisplay._root = p_root;
        l_establihsmentDisplay._establishment = p_sourceEstablishment;
        
        let l_template: HTMLTemplateElement = document.getElementById(EstablishementDisplayPreview.Type) as HTMLTemplateElement;
        l_establihsmentDisplay._root.appendChild(l_template.content.cloneNode(true));

        let l_image =l_establihsmentDisplay._root.querySelector("#thumb") as HTMLImageElement; 
        l_image.src = p_thumbImage.url;
        let l_name = l_establihsmentDisplay._root.querySelector("#name");
        l_name.textContent = p_sourceEstablishment.name;
        let l_address = l_establihsmentDisplay._root.querySelector("#address");
        l_address.textContent = p_city.name + ", " + p_sourceEstablishmentAddress.street_full_name;

        l_establihsmentDisplay._root.addEventListener("click", () => {l_establihsmentDisplay._root.dispatchEvent(new EstablishementDisplayV2_Click(p_sourceEstablishment.id))});

        return l_establihsmentDisplay;
    }
}

export { ProfileEstablishmentContext, EstablishementDisplayPreview }
