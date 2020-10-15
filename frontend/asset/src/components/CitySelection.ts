import { ServerError } from "../server/Server.js";
import {GeoService, City} from "../services/Geo.js"
import {SelectFetch} from "../components_graphic/SelectFetch.js"

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

    private SelectFetch : SelectFetch<CitySelection_Entry>;

    constructor()
    {
        super();
        this.SelectFetch = new SelectFetch<CitySelection_Entry>(this);
        this.SelectFetch.bind((arg0, arg1) => this.fetchSelectList(arg0, arg1), 
            (arg0, arg1) => this.selectionPredicate(arg0, arg1),
            (arg0) => this.onSelectedKeyChanged(arg0));
    }
 
    public static Initialize()
    {
        customElements.define(CitySelection.Type, CitySelection);
    }

    public getSelectedCity() : City | null
    {
        let l_city = this.SelectFetch.getSelectedElement();
        if(l_city)
        {
            return l_city.city;
        }
        else return null;
    }

    fetchSelectList(p_input : string, p_onComplented : (p_fetched : CitySelection_Entry[] | null)  => void)
    {
        GeoService.GetAllCitiesMatching(p_input, 5, (p_cities:City[], p_err:ServerError)=>{
            this.SelectFetch.dynamicSelection.innerHTML = "";
            let l_entries : CitySelection_Entry[] = [];
            if(p_cities)
            {
                for(let i = 0;i<p_cities.length;i++)
                {
                    l_entries.push(new CitySelection_Entry(this.SelectFetch.dynamicSelection, p_cities[i], i));
                }
            }
            p_onComplented(l_entries);
        });
    }

    selectionPredicate(p_input : string, p_index : number) : boolean
    {
        return this.SelectFetch.selection[p_index].city.name === p_input;
    }

    onSelectedKeyChanged(p_key : number)
    {
        if(p_key!=-1)
        {
            this.SelectFetch.input.style.backgroundColor = "green";
            this.dispatchEvent(new CitySelection_SelectedEvent(this.SelectFetch.selection[this.SelectFetch.selectedKey_observable.value].city))
        }
        else
        {
            this.SelectFetch.input.style.backgroundColor = "red";
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

export {CitySelection, CitySelection_SelectedEvent}