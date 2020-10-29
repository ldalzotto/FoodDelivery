import {BindingUtils, Observable} from "../binding/Binding.js"

class SelectFetch<T>
{
    static readonly Type: string = "select-festch-v2";

    private _input : HTMLInputElement;
    public get input(){return this._input;}
    public readOnly : Observable<boolean>;

    private _dynamicSelection : HTMLDataListElement;
    public get dynamicSelection(){return this._dynamicSelection;}
    private _selection : T[];
    public get selection(){return this._selection;}

    private inputValue_observable : Observable<string>;
    private _selectedKey_observable : Observable<number>;
    public get selectedKey_observable(){return this._selectedKey_observable;}

    private refreshTimerState : RefreshTimerState = RefreshTimerState.WAITING_FOR_INPUT;
    private refreshTimer : number;
    private onRefreshValue : string | null;
    private refreshProcessing : boolean;

    private fetchSelectList : (p_rawInput : string, p_onComplented : (p_fetched : T[] | null)  => void) => (void);
    private selectedEntryPreicate : (p_input : string, p_index : number) => boolean;
    private onSelectedKeyChanged : (p_key : number) => (void);
    private onReadOnlyChangedFn : (() => (void)) | null;

    constructor(p_parent: HTMLElement, p_inputElement: HTMLElement, p_readOnly: boolean)
    {
        this.inputValue_observable = new Observable<string>("");
        this._selectedKey_observable = new Observable(-1);
        this.readOnly = new Observable<boolean>(p_readOnly);

        let l_template : HTMLTemplateElement = document.getElementById(SelectFetch.Type) as HTMLTemplateElement;
        p_parent.appendChild(l_template.content.cloneNode(true));

        p_parent.querySelector("#input-container").appendChild(p_inputElement);

        this._dynamicSelection = p_parent.querySelector("datalist") as HTMLDataListElement;
        this._dynamicSelection.id = Date.now().toString();

        this._input = p_parent.querySelector("input") as HTMLInputElement;
        this._input.setAttribute("list", this._dynamicSelection.id);
    }

    public bind(p_fetchSelectList : (p_rawInput : string, p_onComplented : (p_fetched : T[] | null)  => void) => (void),
    p_selectedEntryPredicate : (p_input : string, p_index : number) => boolean, p_onSelectedKeyChanged : (p_key : number) => (void),
    p_onReadOnlyChanged ?: () => (void))
    {
        this.fetchSelectList = p_fetchSelectList;
        this.selectedEntryPreicate = p_selectedEntryPredicate;
        this.onSelectedKeyChanged = p_onSelectedKeyChanged;
        this.onReadOnlyChangedFn = p_onReadOnlyChanged;

        this.inputValue_observable.subscribe((p_new) => {this.onInputValueChanged(p_new);});
        this._selectedKey_observable.subscribe_withInit((p_new) => {this.onSelectedKeyChanged(p_new);});
        this.readOnly.subscribe_withInit((p_new) => {this.onReadOnlyChange(p_new);});
        
        BindingUtils.bindInputText(this._input, this.inputValue_observable);
        BindingUtils.bindToInputText(this.inputValue_observable, this._input);
    }

    public getSelectedElement() : T | null
    {
        if(this._selectedKey_observable.value > -1)
        {
            return this._selection[this._selectedKey_observable.value]; 
        }
        return null;
    }

    public forceInputValue(p_value : string)
    {
        this._selectedKey_observable.value = -1; //This is to trigger onSelectedKeyChanged events
        this.inputValue_observable.value = p_value;
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
        if(!this.readOnly.value)
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
    }

    refreshSelection()
    {
        if(!this.readOnly.value)
        {
            if(this.onRefreshValue != null && !this.refreshProcessing)
            {
                let l_refreshValue : string = this.onRefreshValue;
                this.onRefreshValue = null;
    
                this.refreshProcessing = true;
    
                this.fetchSelectList(l_refreshValue, (p_fetched : T[] | null) => {
                    if(p_fetched && p_fetched.length > 0)
                    {
                        this._selection = [];
                        
                        for(let i = 0;i<p_fetched.length;i++)
                        {
                            this._selection.push(p_fetched[i]);
                        }
    
                        let l_selectedKey : number = -1;
                        for(let i = 0;i<this._selection.length;i++)
                        {
                            if(this.selectedEntryPreicate(this.inputValue_observable.value, i))
                            {
                                l_selectedKey = i;
                                break;
                            }
                        }
                        this._selectedKey_observable.value = l_selectedKey;
                    }
                    else
                    {
                        this._selection = [];
                    }
                    this.refreshProcessing = false;
                    this.refreshSelection();
                });
            }
        }
    }

    onReadOnlyChange(p_readOnly : boolean)
    {
        this._input.readOnly = p_readOnly;
        if(!p_readOnly)
        {
            this.onInputValueChanged(this.inputValue_observable.value);
        }
        if(this.onReadOnlyChangedFn)
        {
            this.onReadOnlyChangedFn();
        }
    }
}


enum RefreshTimerState
{
    WAITING_FOR_INPUT,
    COUTING,
}

export {SelectFetch}