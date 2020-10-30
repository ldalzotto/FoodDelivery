import { BindingUtils, Observable } from "../binding/Binding.js";

enum EnhancedInput_Module
{
    LEFT_CHECKMARK_VALIDATION = 0,
    UPDATE_DOT = 1,
    REVERT_BUTTON = 2
}


interface EnhancedInputModules
{
    [module: number]: any
}

class EnhancedInput
{

    static readonly Type: string = "input-enhanced";

    private _root: HTMLElement;
    public get root() { return this._root; }

    private modules: EnhancedInputModules;

    constructor(p_root: HTMLElement, p_modules: EnhancedInput_Module[] | null)
    {
        this._root = p_root;
        this.modules = {};
        this._root.appendChild(this.selectTemplateBasedOnModules(p_modules).content.cloneNode(true));

        if (p_modules)
        {
            for (let i = 0; i < p_modules.length; i++)
            {
                switch (p_modules[i])
                {
                    case EnhancedInput_Module.LEFT_CHECKMARK_VALIDATION:
                        {
                            this.modules[EnhancedInput_Module.LEFT_CHECKMARK_VALIDATION] = new EnhancedInput_LeftCheckMarkValidation(this);
                        }
                        break;
                    case EnhancedInput_Module.UPDATE_DOT:
                        {
                            this.modules[EnhancedInput_Module.UPDATE_DOT] = new EnhancedInput_UpdateDot(this);
                        }
                        break;
                    case EnhancedInput_Module.REVERT_BUTTON:
                        {
                            this.modules[EnhancedInput_Module.REVERT_BUTTON] = new EnhancedInput_RevertButton(this);
                        }
                        break;
                }
            }
        }


    }

    private selectTemplateBasedOnModules(p_modules: EnhancedInput_Module[] | null): HTMLTemplateElement
    {
        if (p_modules)
        {
            let l_checkvalidation: boolean = false;
            let l_updatedot: boolean = false;
            let l_revertbutton: boolean = false;

            for (let i = 0; i < p_modules.length; i++)
            {
                switch (p_modules[i])
                {
                    case EnhancedInput_Module.LEFT_CHECKMARK_VALIDATION:
                        {
                            l_checkvalidation = true;
                        }
                        break;
                    case EnhancedInput_Module.UPDATE_DOT:
                        {
                            l_updatedot = true;
                        }
                        break;
                    case EnhancedInput_Module.REVERT_BUTTON:
                        {
                            l_revertbutton = true;
                        }
                        break;
                }
            }

            if (l_checkvalidation && l_updatedot && l_revertbutton)
            {
                return document.getElementById("input-enhanced_valid_dot_revert") as HTMLTemplateElement;
            }
            else if (!l_checkvalidation && l_updatedot && l_revertbutton)
            {
                return document.getElementById("input-enhanced_dot_revert") as HTMLTemplateElement;
            }

            return null;

        }
    }

    public getModule_LeftCheckmarkValidation(): EnhancedInput_LeftCheckMarkValidation
    {
        return this.modules[EnhancedInput_Module.LEFT_CHECKMARK_VALIDATION] as EnhancedInput_LeftCheckMarkValidation;
    }

    public getModule_UpdateDot(): EnhancedInput_UpdateDot
    {
        return this.modules[EnhancedInput_Module.UPDATE_DOT] as EnhancedInput_UpdateDot;
    }

    public getModule_RevertButton(): EnhancedInput_RevertButton
    {
        return this.modules[EnhancedInput_Module.REVERT_BUTTON] as EnhancedInput_RevertButton;
    }
}

class EnhancedInput_LeftCheckMarkValidation
{
    private _yesIcon: HTMLElement;
    private _noIcon: HTMLElement;
    private validationPassed: Observable<boolean>;

    constructor(p_enhancedInput: EnhancedInput)
    {
        this._yesIcon = p_enhancedInput.root.querySelector("#yes-icon");
        this._noIcon = p_enhancedInput.root.querySelector("#no-icon");

        this.validationPassed = new Observable<boolean>(false);
        this.validationPassed.subscribe_withInit((arg0: boolean) => { this.onValidationpassedChanged(); });
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

    public setValidationPassed(p_value: boolean)
    {
        this.validationPassed.value = p_value;
    }

}

class EnhancedInput_UpdateDot
{
    private updateDot: HTMLElement;
    private updateDotDisplayed: Observable<boolean>;

    constructor(p_enhancedInput: EnhancedInput)
    {
        this.updateDot = p_enhancedInput.root.querySelector("#update-dot");
        this.updateDotDisplayed = new Observable<boolean>(false);
        BindingUtils.bindDisplayStyle(this.updateDot, this.updateDotDisplayed);
        this.updateDotDisplayed.value = false;
    }

    public setUpdateDotDisplayed(p_value: boolean)
    {
        this.updateDotDisplayed.value = p_value;
    }
}

class EnhancedInput_RevertButton
{
    private enhancedInput: EnhancedInput;

    public onResetClicked: (() => void) | null;

    constructor(p_enhancedInput: EnhancedInput)
    {
        p_enhancedInput.root.querySelector("#reset-button").addEventListener("click", () => { if (this.onResetClicked) { this.onResetClicked(); } });
    }

    public setUpdateDotDisplayed(p_value: boolean)
    {
        let l_updatedot_module = this.enhancedInput.getModule_UpdateDot();
        if (l_updatedot_module)
        {
            l_updatedot_module.setUpdateDotDisplayed(p_value);
        }
    }
}

export { EnhancedInput, EnhancedInput_Module }

