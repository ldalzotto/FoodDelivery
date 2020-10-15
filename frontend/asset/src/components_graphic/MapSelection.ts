declare namespace L
{
    function map(params:HTMLElement):any;
    function tileLayer(p_url:string, p_cond : any):any;
    function marker(p_latlong:any):any;
}

class MapSelection extends HTMLElement
{
    static readonly Type : string = "map-selection";

    private mapDiv : HTMLElement;

    private map : any;

    private _selectedLat : number = 0;
    public get selectedLat():number{return this._selectedLat;}
    private _selectedLong : number = 0;
    public get selectedLong():number{return this._selectedLong;}
    private displayedMarker : any;

    constructor()
    {
        super();

        this.mapDiv = document.createElement("div");
        this.mapDiv = this.appendChild(this.mapDiv);
        this.mapDiv.style.width = "300px";
        this.mapDiv.style.height = "300px";
    }

    public static Initialize()
    {
        customElements.define(MapSelection.Type, MapSelection);
    }

    connectedCallback() {

        this.map = L.map(this.mapDiv).setView([this._selectedLat, this.selectedLong], 13);
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