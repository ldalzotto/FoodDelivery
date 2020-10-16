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

    private _root : HTMLElement;

    private map : any;

    private _selectedLat : number = 0;
    public get selectedLat():number{return this._selectedLat;}
    private _selectedLong : number = 0;
    public get selectedLong():number{return this._selectedLong;}
    private displayedMarker : any;

    constructor(p_parent : HTMLElement, p_initialLat : number, p_initialLng : number)
    {
        this._selectedLat = p_initialLat;
        this._selectedLong = p_initialLng;

        this._root = document.createElement("div");

        this._root = p_parent.appendChild(this._root);

        this._root.style.width = "300px";
        this._root.style.height = "300px";

        setTimeout(() => {
            this.map = L.map(this._root).setView([this._selectedLat, this.selectedLong], 13);
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
            this.setSelectionMarker(this._selectedLat, this.selectedLong, true);
        }, 0);

    }

    public static Initialize()
    {
        // customElements.define(MapSelection.Type, MapSelection);
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
        this._selectedLat = event.latlng.lat;
        this._selectedLong = event.latlng.lng;

        this.setSelectionMarker(this._selectedLat, this._selectedLong, false);
    }
}

export {MapSelection}