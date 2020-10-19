import { Establishment, EstablishmentCalculationType, EstablishmentService, EstablishmentWithDependenciesV2 } from "../services/Establishment.js";
import { LatLng } from "../services/Geo.js";

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
        EstablishmentService.GetEstablishments_Near([EstablishmentCalculationType.RETRIEVE_CITIES, EstablishmentCalculationType.DELIVERY_CHARGE], p_latlng,
            (p_establishments : EstablishmentWithDependenciesV2) => {
                for(let i = 0;i<p_establishments.establishment_addresses.length;i++)
                {
                    let l_container = document.createElement("div");
                    this._root.appendChild(l_container);
                    let l_thumb = new EstablishmentOrderingTumb(l_container, this.establishmentTumbs.length);
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

    constructor(p_root : HTMLElement, p_key : number)
    {
        this._root = p_root;
        this.arrayKey = p_key;
        let l_template : HTMLTemplateElement = document.getElementById(EstablishmentOrderingTumb.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));
    }
}

export {NearestEstablishments}