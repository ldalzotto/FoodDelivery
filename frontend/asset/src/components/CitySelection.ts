import { ServerError } from "../server/Server.js";
import {GeoService, City} from "../services/Geo.js"
import {Observable, BindingUtils} from "../binding/Binding.js"

class CitySelection_SelectedEvent extends Event
{
    public static readonly Type : string = "on-selected";

    public SelectedCity : City | null;

    constructor(p_selectedCity : City | null)
    {
        super(CitySelection_SelectedEvent.Type);
        this.SelectedCity = p_selectedCity;
    }
}

class CitySelection extends HTMLElement
{
    static readonly Type : string = "city-selection";

    private cityInput : HTMLInputElement;
    private cityDynamicSelection : HTMLDataListElement;
    private citiesSelection : CitySelection_Entry[];

    private inputValue_observable : Observable<string>;
    private selectedKey_observable : Observable<number>;
    
    private refreshTimerState : RefreshTimerState = RefreshTimerState.WAITING_FOR_INPUT;
    private refreshTimer : number;
    private onRefreshValue : string | null;
    private refreshProcessing : boolean;
    
    constructor()
    {
        super();

        this.inputValue_observable = new Observable<string>("");
        this.selectedKey_observable = new Observable(-1);

        let l_template : HTMLTemplateElement = document.getElementById(CitySelection.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));

        this.cityDynamicSelection = this.querySelector("datalist") as HTMLDataListElement;
        this.cityDynamicSelection.id = Date.now().toString();

        this.cityInput = this.querySelector("#input") as HTMLInputElement;
        this.cityInput.setAttribute("list", this.cityDynamicSelection.id);

        
        this.inputValue_observable.subscribe((p_new) => {this.onInputValueChanged(p_new);});
        this.selectedKey_observable.subscribe_withInit((p_new) => {this.onSelectedKeyChanged(p_new);});
        BindingUtils.bindInputText(this.cityInput, this.inputValue_observable);
        BindingUtils.bindToInputText(this.inputValue_observable, this.cityInput);
    }
 
    public static Initialize()
    {
        customElements.define(CitySelection.Type, CitySelection);
    }

    onInputValueChanged(p_new:string)
    {
        switch(this.refreshTimerState)
        {
            case RefreshTimerState.WAITING_FOR_INPUT:
                {
                    this.refreshTimerState = RefreshTimerState.COUTING;
                    this.createRefreshTimer();
                }
                break;
            case RefreshTimerState.COUTING:
                {
                    clearTimeout(this.refreshTimer);
                    this.createRefreshTimer();
                }
                break;
        }
    }

    createRefreshTimer()
    {
        this.refreshTimer = setTimeout(() => {
            if(this.onRefreshValue==null)
            {
                this.onRefreshValue = this.inputValue_observable.value;
                this.refreshSelection();
            }
            else
            {
                this.onRefreshValue = this.inputValue_observable.value;
            }
            
            this.refreshTimerState = RefreshTimerState.WAITING_FOR_INPUT;
        }, 200);
    }

    refreshSelection()
    {
        if(this.onRefreshValue != null && !this.refreshProcessing)
        {
            let l_refreshValue : string = this.onRefreshValue;
            this.onRefreshValue = null;

            this.refreshProcessing = true;
            GeoService.GetAllCitiesMatching(l_refreshValue, 5, (p_cities:City[], p_err:ServerError)=>{
                if(p_cities)
                {
                    console.log(p_cities);
                    this.citiesSelection = [];
                    this.cityDynamicSelection.innerHTML = "";
                    for(let i = 0;i<p_cities.length;i++)
                    {
                        this.citiesSelection.push(new CitySelection_Entry(this.cityDynamicSelection, p_cities[i], i));
                    }

                    let l_selectedKey : number = -1;
                    for(let i = 0;i<this.citiesSelection.length;i++)
                    {
                        if(this.citiesSelection[i].city.name === this.inputValue_observable.value)
                        {
                            l_selectedKey = this.citiesSelection[i].keyAttribute;
                        }
                    }
                    this.selectedKey_observable.value = l_selectedKey;
                }
                else
                {
                    this.citiesSelection = [];
                }
                this.refreshProcessing = false;
                this.refreshSelection();
            });

        }
    }

    onSelectedKeyChanged(p_key : number)
    {
        if(p_key!=-1)
        {
            this.cityInput.style.backgroundColor = "green";
            this.dispatchEvent(new CitySelection_SelectedEvent(this.citiesSelection[this.selectedKey_observable.value].city))
        }
        else
        {
            this.cityInput.style.backgroundColor = "red";
            this.dispatchEvent(new CitySelection_SelectedEvent(null))
        }

    }
}

class CitySelection_Entry
{
    private _root : HTMLOptionElement;

    private _city : City;
    private _keyAttribute : number;

    public get city(){return this._city;}
    public get keyAttribute(){return this._keyAttribute;}

    constructor(p_parent : HTMLElement, p_city : City, p_key : number)
    {
        this._root = document.createElement("option");
        p_parent.appendChild(this._root);

        this._city = p_city;
        this._keyAttribute = p_key;

        this._root.value = this._city.name;
    }
}

enum RefreshTimerState
{
    WAITING_FOR_INPUT,
    COUTING,
}


export {CitySelection, CitySelection_SelectedEvent}