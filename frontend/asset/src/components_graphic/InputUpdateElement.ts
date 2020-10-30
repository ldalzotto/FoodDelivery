import {Observable} from "../binding/Binding.js"
import { EnhancedInput, EnhancedInput_Module } from "./EnhancedInput.js";
import { UpdatableElement } from "./UpdatablePanel.js";

class InputUpdateElement implements UpdatableElement
{
    static readonly Type : string = "input-text-update";
    
    private _root : HTMLElement;
    private _input : HTMLInputElement;
    public get input() {return this._input;}
    private _initialValue : string;

    private enhancedInput: EnhancedInput;

    private _hasChanged : Observable<boolean>;
    
    private list : InputUpdateElement_KeyUpEventListener;

    constructor(p_parent : HTMLElement, p_inputType : InputElementType)
    {
        this._root = document.createElement("div");
        this.enhancedInput = new EnhancedInput(this._root, [EnhancedInput_Module.REVERT_BUTTON, EnhancedInput_Module.UPDATE_DOT]);

        this._input = this._root.querySelector("input") as HTMLInputElement;
        this._input.type = p_inputType;
        p_parent.appendChild(this._root);

        this.list = new InputUpdateElement_KeyUpEventListener(this);

        this.enhancedInput.getModule_RevertButton().onResetClicked = () => { this.onResetClicked(); };

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

    public hasChanged() : boolean
    {
        return this._hasChanged.value;
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
        this.enhancedInput.getModule_UpdateDot().setUpdateDotDisplayed(p_hasChanged);
    }

    private onResetClicked()
    {
        this.input.value = this._initialValue;
        this.onValueChanged();
    }

}

class InputUpdateElement_KeyUpEventListener implements EventListenerObject
{
    private InputUpdateElement : InputUpdateElement;

    constructor(p_inputText : InputUpdateElement)
    {
        this.InputUpdateElement = p_inputText;
    }

    handleEvent(evt: Event): void {
        this.InputUpdateElement.onValueChanged();
    }
}

class InputImageUpdateElement implements UpdatableElement
{
    private _root: HTMLElement;
    private _input: HTMLInputElement;
    public get input() { return this._input; }

    private _initialValue: File;

    private _hasChanged: Observable<boolean>;
    private list: InputImageUpdateElement_EventListener;

    constructor(p_parent: HTMLElement)
    {
        this._root = document.createElement("input");
        this._input = this._root as HTMLInputElement;
        this._input.type = "file";
        p_parent.appendChild(this._root);
        this._input.readOnly = false;
        this.list = new InputImageUpdateElement_EventListener(this);

        this._hasChanged = new Observable<boolean>(false);
        this._hasChanged.subscribe_withInit(() => { this.onHasChanged_change(this._hasChanged.value); });
    }

    public init(p_initialValue: File)
    {
        this.setInitialValue(p_initialValue);
        this._input.files[0] = p_initialValue;
    }

    public setInitialValue(p_initialValue: File)
    {
        this._initialValue = p_initialValue;
    }

    enableModifications(): void
    {
        if (this._input.readOnly)
        {
            this._input.readOnly = false;
            this._input.style.pointerEvents = "";
            this._input.addEventListener("change", this.list);
        }
    }
    disableModifications(): void
    {
        if (!this._input.readOnly)
        {
            this._input.readOnly = true;
            this._input.style.pointerEvents = "none";
            this._input.removeEventListener("change", this.list);
        }
    }
    setCurrentAsInitialValue(): void
    {
        this.setInitialValue(this._input.files[0]);
        this.onValueChanged();
    }

    hasChanged(): boolean
    {
        return this._hasChanged.value;
    }

    private onHasChanged_change(p_hasChanged: boolean)
    {
        if (p_hasChanged)
        {
            this._input.style.backgroundColor = "orange";
        }
        else
        {
            this._input.style.backgroundColor = "";
        }
    }

    public onValueChanged()
    {
        if (this._initialValue !== this._input.files[0])
        {
            this._hasChanged.value = true;
        }
        else
        {
            this._hasChanged.value = false;
        }
    }

}

class InputImageUpdateElement_EventListener implements EventListenerObject
{
    private InputUpdateElement: InputImageUpdateElement;

    constructor(p_inputText: InputImageUpdateElement)
    {
        this.InputUpdateElement = p_inputText;
    }

    handleEvent(evt: Event): void
    {
        this.InputUpdateElement.onValueChanged();
    }
}

enum InputElementType
{
    TEXT = "text",
    NUMBER = "number"
};



export { InputUpdateElement, InputElementType, InputImageUpdateElement }