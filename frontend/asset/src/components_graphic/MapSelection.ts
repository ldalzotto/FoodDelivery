import { Observable } from "../framework/binding/Binding.js";
import { LComponent } from "../framework/component/LComponent.js";
import { RevertButton } from "../modules_graphic/RevertButton.js";
import { UpdateDot } from "../modules_graphic/UpdateDot.js";
import { LatLng } from "../services/Geo.js";
import {WindowElement, WindowElement_ResizeEvent} from "../Window.js"
import { UpdatableElement } from "./UpdatablePanel.js";

declare namespace L
{
    function map(params:HTMLElement, options : any):any;
    function tileLayer(p_url:string, p_cond : any):any;
    function marker(platlong:any):any;
}

class MapSelectionV2_Html
{
    public static readonly MapContainerId = "map-container";
    public static readonly UpdateDotId = "update-dot";
    public static readonly RevertButtonId = "revert-button";

    public static build(p_update_dot_element: string, p_revert_button_element: string): string
    {
        return `
            <${MapSelectionV2.Type} class="inherit-wh inherit-mp">
                <div class="inherit-wh inherit-mp" style="position: relative;">
                    <div id="${MapSelectionV2_Html.MapContainerId}" class="inherit-wh"></div>
                    ${p_update_dot_element}
                    ${p_revert_button_element}
                </div>
            </${MapSelectionV2.Type}>
        `;
    }

    public static updateDot(): string
    {
        return `
            <div id="${MapSelectionV2_Html.UpdateDotId}" class="update-dot-base top-right" style="z-index: 999999;"></div>
        `;
    }

    public static revertbutton_html(): string
    {
        return `
            <div id="${MapSelectionV2_Html.RevertButtonId}" style="position: absolute; width: 17px; height: 17px; right: -9px; top: 11px; z-index: 999999;">
                <span>↻</span>
            </div>
        `;
    }
}

enum MapSelectionV2_Modules
{
    UPDATE_DOT = 0,
    REVERT_BUTTON = 1
}

class MapSelectionV2 extends LComponent<MapSelectionV2_Modules>
{
    static readonly Type: string = "map-selection";

    public readonly: boolean = false;

    private map: any;

    protected _LatLng: LatLng = new LatLng();
    public get latLng() { return this._LatLng; }

    public onLatLngChanged: Observable<null> = new Observable<null>(null);

    private displayedMarker: any;
    private isFocused: boolean;

    private mapContainer: HTMLElement;


    type(): string
    {
        return MapSelectionV2.Type;
    }

    constructor(p_root: HTMLElement, p_modules: MapSelectionV2_Modules[])
    {
        super(p_root, p_modules);
        this.mapContainer = this._root.querySelector(`#${MapSelectionV2_Html.MapContainerId}`);
    }

    html(): string
    {
        let l_updatedot_str = this._modules.has(MapSelectionV2_Modules.UPDATE_DOT) ? MapSelectionV2_Html.updateDot() : "";
        let l_revert_button_str = this._modules.has(MapSelectionV2_Modules.REVERT_BUTTON) ? MapSelectionV2_Html.revertbutton_html() : "";
        return MapSelectionV2_Html.build(l_updatedot_str, l_revert_button_str);
    }

    style(): string { return null; }

    module(p_key: MapSelectionV2_Modules): void
    {
        switch (p_key)
        {
            case MapSelectionV2_Modules.UPDATE_DOT:
                {
                    let l_update_dot = new UpdateDot(this._root.querySelector(`#${MapSelectionV2_Html.UpdateDotId}`));
                    l_update_dot.setEnabled(false);
                    this._modules.set(MapSelectionV2_Modules.UPDATE_DOT, l_update_dot);
                }
                break;
            case MapSelectionV2_Modules.REVERT_BUTTON:
                {
                    let l_revert_button = new RevertButton(this._root.querySelector(`#${MapSelectionV2_Html.RevertButtonId}`));
                    this._modules.set(MapSelectionV2_Modules.REVERT_BUTTON, l_revert_button);
                }
                break;
        }
    }

    public init(p_initialLat: number, p_initialLng: number)
    {
        this.latLng.lat = p_initialLat;
        this.latLng.lng = p_initialLng;
        
        setTimeout(() =>
        {
            this.isFocused = false;
            this.map = L.map(this.mapContainer, { scrollWheelZoom: false }).setView([this.latLng.lat, this.latLng.lng], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGxvbWJhIiwiYSI6ImNrZzgwcnZ2OTA2NXcyd215bDhveXc2dmYifQ.40bIOrEnYw6UTl9TKkZJOw',
                {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'your.mapbox.access.token'
                }).addTo(this.map);
            this.map.on('click', (event: any) => { this.onMapClick(event); });
            this.setSelectionMarker(this.latLng.lat, this.latLng.lng, true);

            this.map.on('focus', () => { this.onMapFocus(); });
            this.map.on('blur', () => { this.onMapBlur(); });
            this.onLatLngChanged.subscribe((p_null) => { this.onLatLngChangedFn(); })

            WindowElement.addEventListener(WindowElement_ResizeEvent, () => { this.onWindowResize(); });
        }, 0);
    }

    public setSelectionMarker(plat: number, p_long: number, p_moveTo: boolean)
    {
        if (this.displayedMarker != undefined)
        {
            this.map.removeLayer(this.displayedMarker);
        };

        this.displayedMarker = L.marker([plat, p_long]).addTo(this.map);

        if (p_moveTo)
        {
            this.map.setView([plat, p_long], 13);
        }
    }

    public invalidateSize() 
    {
        this.map.invalidateSize(false);
    }

    onMapClick(event: any)
    {
        if (this.isFocused)
        {
            if (!this.readonly)
            {
                this.setLatLng(event.latlng.lat, event.latlng.lng);
            }
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

    setLatLng(plat: number, p_long: number)
    {
        if (this.latLng.lat !== plat || this.latLng.lng !== p_long)
            {
                this.latLng.lat = plat;
                this.latLng.lng = p_long;

                this.onLatLngChanged.notify();
            }
    }

    onLatLngChangedFn()
    {
        this.setSelectionMarker(this.latLng.lat, this.latLng.lng, false);
    }

    public module_UpdateDot(): UpdateDot
    {
        return this._modules.get(MapSelectionV2_Modules.UPDATE_DOT);
    }
    public module_RevertButton(): RevertButton
    {
        return this._modules.get(MapSelectionV2_Modules.REVERT_BUTTON);
    }
}

class MapSelectionUpdate implements UpdatableElement
{
    
    private _initialValue: LatLng;

    private mapSelection: MapSelectionV2;
    private _hasChanged: Observable<boolean>;

    constructor(p_root: HTMLElement)
    {
        this.mapSelection = new MapSelectionV2(p_root, [MapSelectionV2_Modules.UPDATE_DOT, MapSelectionV2_Modules.REVERT_BUTTON]);

        this._initialValue = new LatLng();

        this._hasChanged = new Observable<boolean>(false);

        this.mapSelection.onLatLngChanged.subscribe(() => { this.onLatLngChangedUpdate(); });
        this._hasChanged.subscribe(() => { this.onHasChanged_change(this._hasChanged.value); });

        this.mapSelection.module_RevertButton().revertClickCallback = () => { this.onRevertClicked(); };
    }

    public init(p_initialLat: number, p_initialLng: number)
    {
        this.mapSelection.init(p_initialLat, p_initialLng);
        this._initialValue.lat = p_initialLat;
        this._initialValue.lng = p_initialLng;
    }

    public enableModifications()
    {
        this.mapSelection.readonly = false;
    }

    public disableModifications()
    {
        this.mapSelection.readonly = true;
    }

    public setCurrentAsInitialValue()
    {
        this._initialValue.lat = this.mapSelection.latLng.lat;
        this._initialValue.lng = this.mapSelection.latLng.lng;
        this.onLatLngChangedUpdate();
    }

    public hasChanged(): boolean
    {
        return this._hasChanged.value;
    }

    onLatLngChangedUpdate()
    {
        if (this._initialValue.lat !== this.mapSelection.latLng.lat || this._initialValue.lng !== this.mapSelection.latLng.lng)
        {
            this._hasChanged.value = true;
        }
        else
        {
            this._hasChanged.value = false;
        }
    }

    private onRevertClicked()
    {
        this.mapSelection.setLatLng(this._initialValue.lat, this._initialValue.lng);
        this.onLatLngChangedUpdate();
    }

    private onHasChanged_change(p_hasChanged: boolean)
    {
        if (p_hasChanged)
        {
            this.mapSelection.module_UpdateDot().setEnabled(true);
        }
        else
        {
            this.mapSelection.module_UpdateDot().setEnabled(false);
        }
    }

    public getLatLng()
    {
        return this.mapSelection.latLng;
    }
}



export { MapSelectionV2, MapSelectionUpdate }