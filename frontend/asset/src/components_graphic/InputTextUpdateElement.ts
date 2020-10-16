import {Observable} from "../binding/Binding.js"

class InputTextUpdateElement
{
    static readonly Type : string = "input-text-update";
    
    private _root : HTMLElement;
    private _input : HTMLInputElement;
    public get input() {return this._input;}
    private _initialValue : string;

    private _hasChanged : Observable<boolean>;
    public get hasChanged(){return this._hasChanged;}

    private list : InputTextUpdateElement_KeyUpEventListener;

    constructor(p_root : HTMLElement)
    {
        this._root = p_root;

        this._input = document.createElement("input") as HTMLInputElement;
        this._root.appendChild(this._input);
        this.list = new InputTextUpdateElement_KeyUpEventListener(this);
        this._input.readOnly = false;

        this._hasChanged = new Observable<boolean>(false);
        this._hasChanged.subscribe_withInit(() => {this.onHasChanged_change(this._hasChanged.value);});
    }

    public init(p_initialValue : string)
    {
        this.setInitialValue(p_initialValue);
        this._input.value = p_initialValue;
    }

    public setInitialValue(p_initialValue : string)
    {
        this._initialValue = p_initialValue;
    }

    public setCurrentAsInitialValue()
    {
        this.setInitialValue(this._input.value);
        this.onValueChanged();
    }

    public enableModifications()
    {
        if(this._input.readOnly)
        {
            this._input.readOnly = false;
            this._input.addEventListener("keyup", this.list);
        }
    }

    public disableModifications()
    {
        if(!this._input.readOnly)
        {
            this._input.readOnly = true;
            this._input.removeEventListener("keyup", this.list);
        }
    }

    public onValueChanged()
    {
        if(this._initialValue !== this._input.value)
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
            this._input.style.backgroundColor = "orange";
        }
        else
        {
            this._input.style.backgroundColor = "";
        }
    }

}

class InputTextUpdateElement_KeyUpEventListener implements EventListenerObject
{
    private inputTextUpdateElement : InputTextUpdateElement;

    constructor(p_inputText : InputTextUpdateElement)
    {
        this.inputTextUpdateElement = p_inputText;
    }

    handleEvent(evt: Event): void {
        this.inputTextUpdateElement.onValueChanged();
    }
}

export {InputTextUpdateElement}