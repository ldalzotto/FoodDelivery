import { BindingUtils, Observable } from "../binding/Binding.js";

class EnhancedInput
{
    static readonly Type: string = "input-enhanced";

    private _root: HTMLElement;

    private _yesIcon: HTMLElement;
    private _noIcon: HTMLElement;

    private updateDot: HTMLElement;
    private updateDotDisplayed: Observable<boolean>;

    private validationPassed: Observable<boolean>;

    public onResetClicked: (() => void) | null;

    constructor(p_root: HTMLElement)
    {
        this._root = p_root;
        let l_template: HTMLTemplateElement = document.getElementById(EnhancedInput.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));
        this._yesIcon = this._root.querySelector("#yes-icon");
        this._noIcon = this._root.querySelector("#no-icon");
        this.updateDot = this._root.querySelector("#update-dot");

        this.validationPassed = new Observable<boolean>(false);
        this.validationPassed.subscribe_withInit((arg0: boolean) => { this.onValidationpassedChanged(); });

        this.updateDotDisplayed = new Observable<boolean>(false);
        BindingUtils.bindDisplayStyle(this.updateDot, this.updateDotDisplayed);
        this.updateDotDisplayed.value = false;

        this._root.querySelector("#reset-button").addEventListener("click", () => { if (this.onResetClicked) { this.onResetClicked(); } });
    }

    public setValidationPassed(p_value: boolean)
    {
        this.validationPassed.value = p_value;
    }

    private onValidationpassedChanged()
    {
        if (this.validationPassed.value)
        {
            this._yesIcon.style.display = "";
            this._noIcon.style.display = "none";
        }
        else
        {
            this._yesIcon.style.display = "none";
            this._noIcon.style.display = "";
        }
    }

    public setUpdateDotDisplayed(p_value: boolean)
    {
        this.updateDotDisplayed.value = p_value;
    }
}

export { EnhancedInput }

