import { Observable } from "../binding/Binding.js";

declare namespace L
{
    function map(params:HTMLElement):any;
    function tileLayer(p_url:string, p_cond : any):any;
    function marker(p_latlong:any):any;
}

class MapSelection
{
    static readonly Type : string = "map-selection";

    protected _root : HTMLElement;
    public readonly : boolean = false;

    private map : any;

    protected _latLng : LatLng = new LatLng();
    public get latLng(){return this._latLng;}

    public onLatLngChanged : Observable<null> = new Observable<null>(null);

    private displayedMarker : any;

    constructor(p_parent : HTMLElement, p_initialLat : number, p_initialLng : number)
    {
        this._latLng._Lat = p_initialLat;
        this._latLng._Lng = p_initialLng;

        this._root = document.createElement("div");

        this._root = p_parent.appendChild(this._root);

        this._root.style.width = "inherit";
        this._root.style.height = "inherit";
        this._root.style.margin = "inherit";
        this._root.style.padding = "inherit";

        setTimeout(() => {
            this.map = L.map(this._root).setView([this._latLng._Lat, this._latLng._Lng], 13);
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
            this.setSelectionMarker(this._latLng._Lat, this._latLng._Lng, true);

            this.onLatLngChanged.subscribe((p_null) => {this.onLatLngChangedFn();})
        }, 0);

    }
    
    public setSelectionMarker(p_lat : number, p_long : number, p_moveTo : boolean)
    {
            if (this.displayedMarker != undefined) {
                this.map.removeLayer(this.displayedMarker);
            };
    
            this.displayedMarker = L.marker([p_lat, p_long]).addTo(this.map);

            if(p_moveTo)
            {
                this.map.setView([p_lat, p_long], 13);
            }
    }

    onMapClick(event:any)
    {
        this.setLatLng(event.latlng.lat, event.latlng.lng);
    }

    setLatLng(p_lat : number, p_long : number)
    {
        if(!this.readonly)
        {
            if(this._latLng._Lat !== p_lat || this._latLng._Lng !== p_long)
            {
                this._latLng._Lat = p_lat;
                this._latLng._Lng = p_long;
    
                this.onLatLngChanged.notify();
            }
        }
    }
    
    onLatLngChangedFn()
    {
        this.setSelectionMarker(this._latLng._Lat, this._latLng._Lng, false);
    }
}

class LatLng
{
    public _Lat : number = 0;
    public _Lng : number = 0;
}

class MapSelectionUpdate extends MapSelection
{
    
    private _initialValue : LatLng;

    private _hasChanged : Observable<boolean>;
    public get hasChanged(){return this._hasChanged;}

    constructor(p_parent : HTMLElement, p_initialLat : number, p_initialLng : number)
    {
        super(p_parent, p_initialLat, p_initialLng);

        this._initialValue = new LatLng();
        this._initialValue._Lat = p_initialLat;
        this._initialValue._Lng = p_initialLng;

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
        this._initialValue._Lat = this._latLng._Lat;
        this._initialValue._Lng = this._latLng._Lng;
        this.onLatLngChangedUpdate();
    }

    onLatLngChangedUpdate()
    {
        if(this._initialValue._Lat !== this._latLng._Lat || this._initialValue._Lng !== this._latLng._Lng)
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