import { Establishment, EstablishmentCalculationType, EstablishmentService, EstablishmentGet } from "../services/Establishment.js";
import { LatLng } from "../services/Geo.js";
import { ImageUrl } from "../services/Image.js";

class NearestEstablishments
{
    public static readonly Type : string = "nearest-establishments";

    private _root : HTMLElement;

    private establishmentList : HTMLElement;

    private establishmentTumbs: EstablishmentOrderingTumb[];

    constructor(p_root : HTMLElement, p_latlng : LatLng)
    {
        this._root = p_root;

        let l_template : HTMLTemplateElement = document.getElementById(NearestEstablishments.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        this.establishmentList = this._root.querySelector("#establishment-list");
        this.establishmentTumbs = [];
        EstablishmentService.GetEstablishments_Near([EstablishmentCalculationType.RETRIEVE_CITIES, EstablishmentCalculationType.DELIVERY_CHARGE, EstablishmentCalculationType.RETRIEVE_THUMBNAIL], p_latlng,
            (p_establishments : EstablishmentGet) => {
                for(let i = 0;i<p_establishments.establishment_addresses.length;i++)
                {
                    let l_container = document.createElement("div");
                    this._root.appendChild(l_container);
                    let l_thumb = new EstablishmentOrderingTumb(l_container, this.establishmentTumbs.length, 
                        p_establishments.establishments[i], 
                        p_establishments.thumbnails[p_establishments.establishment_TO_thumbnail[i]], 
                        p_establishments.delivery_charges[i]);
                    this.establishmentTumbs.push(l_thumb);
                }
            },
            null);
    }
}

class EstablishmentOrderingTumb
{
    public static readonly Type : string = "establishments-thumb";

    private _root : HTMLElement;
    private arrayKey : number;

    constructor(p_root : HTMLElement, p_key : number, p_establishment : Establishment, p_imageUrl : ImageUrl, p_deliveryCharge : number)
    {
        this._root = p_root;
        this.arrayKey = p_key;
        let l_template : HTMLTemplateElement = document.querySelector(`template#${EstablishmentOrderingTumb.Type}`) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));
        
        let l_nameElement = this._root.querySelector("#name");
        l_nameElement.textContent = p_establishment.name;

        let l_deliveryChageElement = this._root.querySelector("#delivery-charge");
        l_deliveryChageElement.textContent = `Delivery charge : ${p_deliveryCharge} €€`;

        let l_thumbImage = this._root.querySelector("#thumb") as HTMLImageElement;
        l_thumbImage.src = p_imageUrl.url;
    }
}


export {NearestEstablishments}