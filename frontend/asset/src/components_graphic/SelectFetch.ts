import {BindingUtils, Observable} from "../binding/Binding.js"

/**
 * //TODO ->
 * A more sophisticated version can be created by creating a position absolute div : 
 * <html>
    <head>
        <style>
            .wrapper
            {
                
            }
            .list-container
            {
                background-color: aqua;
                width: 30%;
                position: absolute;
            }
        </style>
        <script>
            var l_textInput;
            var l_listContainer;

            var updatePosition = function()
            {
                var l_rect = l_textInput.getBoundingClientRect();
                l_listContainer.style.top = l_rect.bottom;
                l_listContainer.style.left = l_rect.left;
                l_listContainer.style.width = l_rect.width;
            }

            setTimeout(() => {
                l_textInput = document.getElementById("text-input");
                l_listContainer = document.getElementById("list-container");

                updatePosition();
                window.onresize = updatePosition;
                // l_listContainer.style.height = 0
            }, 0);
        </script>
    </head>
    <body>
        <div style="display: flex;">
            <div style="background-color: blue;">TEST</div>
            <div class="wrapper">
                <input id="text-input" type="text">
                <div id="list-container" class="list-container">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                </div>
            </div>
        </div>
        
    </body>
</html>

 */

 /** */
class SelectFetch<T>
{
    static readonly Type : string = "select-festch";

    private _input : HTMLInputElement;
    public get input(){return this._input;}
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

    constructor(p_parent : HTMLElement)
    {
        this.inputValue_observable = new Observable<string>("");
        this._selectedKey_observable = new Observable(-1);

        let l_template : HTMLTemplateElement = document.getElementById(SelectFetch.Type) as HTMLTemplateElement;
        p_parent.appendChild(l_template.content.cloneNode(true));

        this._dynamicSelection = p_parent.querySelector("datalist") as HTMLDataListElement;
        this._dynamicSelection.id = Date.now().toString();

        this._input = p_parent.querySelector("#input") as HTMLInputElement;
        this._input.setAttribute("list", this._dynamicSelection.id);
    }

    public bind(p_fetchSelectList : (p_rawInput : string, p_onComplented : (p_fetched : T[] | null)  => void) => (void),
    p_selectedEntryPredicate : (p_input : string, p_index : number) => boolean, p_onSelectedKeyChanged : (p_key : number) => (void))
    {
        this.fetchSelectList = p_fetchSelectList;
        this.selectedEntryPreicate = p_selectedEntryPredicate;
        this.onSelectedKeyChanged = p_onSelectedKeyChanged;

        this.inputValue_observable.subscribe((p_new) => {this.onInputValueChanged(p_new);});
        this._selectedKey_observable.subscribe_withInit((p_new) => {this.onSelectedKeyChanged(p_new);});
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


enum RefreshTimerState
{
    WAITING_FOR_INPUT,
    COUTING,
}

export {SelectFetch}