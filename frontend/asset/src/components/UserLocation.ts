import { MapSelection } from "../components_graphic/MapSelection.js";
import { LatLng } from "../services/Geo.js";

class UserLocation
{
    static readonly Type : string = "user-location";

    private _root : HTMLElement;

    private _mapSelection : MapSelection;
    private _submitButton : HTMLElement;

    constructor(p_root : HTMLElement)
    {
        this._root = p_root;
        let l_template : HTMLTemplateElement = document.getElementById(UserLocation.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));
        this._mapSelection = new MapSelection(this._root.querySelector("#latlng"), 0, 0);
        this._submitButton = this._root.querySelector("#submit");
        this._submitButton.addEventListener("click", () => {this.onSubmitClick();});
    }

    onSubmitClick() 
    {
        this._root.dispatchEvent(new UserLocationSubmit_Event(this._mapSelection.latLng));
    }
}

class UserLocationSubmit_Event extends Event
{
    static readonly Type : string = "user-location-submit";

    public LatLng : LatLng;

    constructor(p_latLng : LatLng)
    {
        super(UserLocationSubmit_Event.Type);
        this.LatLng = p_latLng;
    }
}

export {UserLocation, UserLocationSubmit_Event}