import { Observable } from "../binding/Binding.js";
import { LatLng } from "../services/Geo.js";
import {WindowElement, WindowElement_ResizeEvent} from "../Window.js"

declare namespace L
{
    function map(params:HTMLElement, options : any):any;
    function tileLayer(p_url:string, p_cond : any):any;
    function marker(platlong:any):any;
}

class MapSelection
{
    static readonly Type : string = "map-selection";

    protected _root : HTMLElement;
    public readonly : boolean = false;

    private map : any;

    protected _LatLng : LatLng = new LatLng();
    public get latLng(){return this._LatLng;}

    public onLatLngChanged : Observable<null> = new Observable<null>(null);

    private displayedMarker : any;
    private isFocused : boolean;

    constructor(p_parent : HTMLElement, p_initialLat : number, p_initialLng : number)
    {
        this.latLng.lat = p_initialLat;
        this.latLng.lng = p_initialLng;

        this._root = document.createElement("div");

        this._root = p_parent.appendChild(this._root);

        this._root.style.width = "inherit";
        this._root.style.height = "inherit";
        this._root.style.margin = "inherit";
        this._root.style.padding = "inherit";

        setTimeout(() => {
            this.isFocused = false;
            this.map = L.map(this._root, {scrollWheelZoom: false}).setView([this.latLng.lat, this.latLng.lng], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGxvbWJhIiwiYSI6ImNrZzgwcnZ2OTA2NXcyd215bDhveXc2dmYifQ.40bIOrEnYw6UTl9TKkZJOw',
            {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'your.mapbox.access.token'
            }).addTo(this.map);
            this.map.on('click', (event:any) => {this.onMapClick(event);} );
            this.setSelectionMarker(this.latLng.lat, this.latLng.lng, true);

            this.map.on('focus', () => {this.onMapFocus();});
            this.map.on('blur', () => {this.onMapBlur();});
            this.onLatLngChanged.subscribe((p_null) => {this.onLatLngChangedFn();})

            WindowElement.addEventListener(WindowElement_ResizeEvent, () => {this.onWindowResize();});
        }, 0);

    }
    
    public setSelectionMarker(plat : number, p_long : number, p_moveTo : boolean)
    {
            if (this.displayedMarker != undefined) {
                this.map.removeLayer(this.displayedMarker);
            };
    
            this.displayedMarker = L.marker([plat, p_long]).addTo(this.map);

            if(p_moveTo)
            {
                this.map.setView([plat, p_long], 13);
            }
    }

    public invalidateSize() 
    {
        this.map.invalidateSize(false);
    }

    onMapClick(event:any)
    {
        if(this.isFocused)
        {
            this.setLatLng(event.latlng.lat, event.latlng.lng);
        }
    }

    onMapFocus()
    {
        this.isFocused = true;
        this.map.scrollWheelZoom.enable();
    }

    onMapBlur()
    {
        this.isFocused = false;
        this.map.scrollWheelZoom.disable();
    }

    onWindowResize()
    {
        this.invalidateSize();
    }

    setLatLng(plat : number, p_long : number)
    {
        if(!this.readonly)
        {
            if(this.latLng.lat !== plat || this.latLng.lng !== p_long)
            {
                this.latLng.lat = plat;
                this.latLng.lng = p_long;
    
                this.onLatLngChanged.notify();
            }
        }
    }
    
    onLatLngChangedFn()
    {
        this.setSelectionMarker(this.latLng.lat, this.latLng.lng, false);
    }
}

class MapSelectionUpdate extends MapSelection
{
    
    private _initialValue : LatLng;

    private _hasChanged : Observable<boolean>;

    constructor(p_parent : HTMLElement, p_initialLat : number, p_initialLng : number)
    {
        super(p_parent, p_initialLat, p_initialLng);

        this._initialValue = new LatLng();
        this._initialValue.lat = p_initialLat;
        this._initialValue.lng = p_initialLng;

        this._hasChanged = new Observable<boolean>(false);

        this.onLatLngChanged.subscribe(() => {this.onLatLngChangedUpdate();});
        this._hasChanged.subscribe(() => {this.onHasChanged_change(this._hasChanged.value);});
    }

    public enableModifications()
    {
        this.readonly = false;
    }

    public disableModifications()
    {
        this.readonly = true;
    }

    public setCurrentAsInitialValue()
    {
        this._initialValue.lat = this.latLng.lat;
        this._initialValue.lng = this.latLng.lng;
        this.onLatLngChangedUpdate();
    }

    public hasChanged() : boolean
    {
        return this._hasChanged.value;
    }

    onLatLngChangedUpdate()
    {
        if(this._initialValue.lat !== this.latLng.lat || this._initialValue.lng !== this.latLng.lng)
            {
                this._hasChanged.value = true;
            }
            else
            {
                this._hasChanged.value = false;
            }
    }

    private onHasChanged_change(p_hasChanged : boolean)
    {
        if(p_hasChanged)
        {
            this._root.style.borderStyle = "dashed";
            this._root.style.borderColor = "orange";
        }
        else
        {
            this._root.style.borderStyle = "";
            this._root.style.borderColor = "";
        }
    }
}

export {MapSelection, MapSelectionUpdate}