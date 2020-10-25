import { ServerError } from "../server/Server.js";
import {GeoService, City} from "../services/Geo.js"
import {SelectFetch} from "../components_graphic/SelectFetch.js"
import { Observable } from "../binding/Binding.js";

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

class CitySelection
{
    static readonly Type : string = "city-selection";

    protected _root : HTMLElement;
    protected selectFetch : SelectFetch<CitySelection_Entry>;

    protected onSelectedKeyChanged_chainCallback : ((p_key : number)=>void) | null;

    constructor(p_root : HTMLElement, p_readOnly : boolean = false)
    {
        this._root = p_root;
        this.selectFetch = new SelectFetch<CitySelection_Entry>(this._root, p_readOnly);
        this.selectFetch.bind((arg0, arg1) => this.fetchSelectList(arg0, arg1), 
            (arg0, arg1) => this.selectionPredicate(arg0, arg1),
            (arg0) => this.onSelectedKeyChanged(arg0),
            () => this.onReadOnlyChange());
    }

    public forceCity(p_city : City)
    {
        this.selectFetch.forceInputValue(p_city.name);
    }

    public getSelectedCity() : City | null
    {
        let l_city = this.selectFetch.getSelectedElement();
        if(l_city)
        {
            return l_city.city;
        }
        else return null;
    }

    fetchSelectList(p_input : string, p_onComplented : (p_fetched : CitySelection_Entry[] | null)  => void)
    {
        GeoService.GetAllCitiesMatching(p_input, 5, (p_cities:City[], p_err:ServerError)=>{
            this.selectFetch.dynamicSelection.innerHTML = "";
            let l_entries : CitySelection_Entry[] = [];
            if(p_cities)
            {
                for(let i = 0;i<p_cities.length;i++)
                {
                    l_entries.push(new CitySelection_Entry(this.selectFetch.dynamicSelection, p_cities[i], i));
                }
            }
            p_onComplented(l_entries);
        });
    }

    selectionPredicate(p_input : string, p_index : number) : boolean
    {
        return this.selectFetch.selection[p_index].city.name === p_input;
    }

    onSelectedKeyChanged(p_key : number)
    {
        if(p_key!=-1)
        {
            this.selectFetch.input.style.backgroundColor = "green";
            this._root.dispatchEvent(new CitySelection_SelectedEvent(this.selectFetch.selection[this.selectFetch.selectedKey_observable.value].city))
        }
        else
        {
            this.selectFetch.input.style.backgroundColor = "red";
            this._root.dispatchEvent(new CitySelection_SelectedEvent(null))
        }

        if(this.onSelectedKeyChanged_chainCallback)
        {
            this.onSelectedKeyChanged_chainCallback(p_key);
        }
    }

    onReadOnlyChange() {
        if(this.selectFetch.readOnly.value)
        {
            this.selectFetch.input.style.backgroundColor = "";
        }
    }
}

class CitySelectionUpdate extends CitySelection
{
    
    constructor(p_root : HTMLElement)
    {
        super(p_root, true);
        this._hasChanged = new Observable<boolean>(false);
        this.onSelectedKeyChanged_chainCallback = this.onSelectedKeyChanged_update;
        this._hasChanged.subscribe_withInit(() => {this.onHasChanged_change(this._hasChanged.value);});
    }

    private _initialValue : City;

    private _hasChanged : Observable<boolean>;

    public setInitialValue(p_city : City)
    {
        this._initialValue = p_city;
        this.forceCity(this._initialValue);
    }

    public setCurrentAsInitialValue()
    {
        let l_selectedElement = this.selectFetch.getSelectedElement();
        if(l_selectedElement)
        {
            this._initialValue = l_selectedElement.city;
        }
        this.onSelectedKeyChanged_update();
    }

    public enableModifications()
    {
        this.selectFetch.readOnly.value = false;
    }

    public disableModifications()
    {
        this.selectFetch.readOnly.value = true;
    }

    public hasChanged() : boolean
    {
        return this._hasChanged.value;
    }

    onSelectedKeyChanged_update()
    {
        let l_selectedElement = this.selectFetch.getSelectedElement();
        if(l_selectedElement)
        {
            if(l_selectedElement.city.id !== this._initialValue.id)
            {
                this._hasChanged.value = true;
            }
            else
            {
                this._hasChanged.value = false;
            }
        }
    }

    onHasChanged_change(p_hasChanged : boolean)
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

export {CitySelection, CitySelection_SelectedEvent, CitySelectionUpdate}