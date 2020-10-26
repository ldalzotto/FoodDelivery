import { Observable } from "../binding/Binding.js";
import { LoadingButton } from "./LoadingButton.js";

class UpdatablePanel
{
    static readonly Type : string = "updatable-panel";

    private _root : HTMLElement;

    private modificationUnlockButton: HTMLButtonElement;
    private submitChangeButton: LoadingButton;
    private deleteButton: LoadingButton;

    private isModificationEnabled: Observable<boolean>;
    private modificationButtonText: Observable<string>;

    private updatablaeElements : UpdatableElement[];

    constructor(p_root : HTMLElement, p_callbacks : UpdatablePanelCallbacks,
        p_content : HTMLElement, p_updatableElements : UpdatableElement[])
    {
        this._root = p_root;
        let l_template: HTMLTemplateElement = document.getElementById(UpdatablePanel.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        this.updatablaeElements = p_updatableElements;
        this._root.querySelector("#content").appendChild(p_content);

        this.modificationUnlockButton = this._root.querySelector("#modification-unlock");
        this.submitChangeButton = new LoadingButton(this._root.querySelector("#submit"), (p_onCompleted) => {p_callbacks.onSubmitPressed(p_onCompleted);});
        this.deleteButton = new LoadingButton(this._root.querySelector("#delete"), (p_onCompleted) => {p_callbacks.onDeletePressed(p_onCompleted);} );

        this.isModificationEnabled = new Observable<boolean>(false);
        this.modificationButtonText = new Observable<string>("");

        this.modificationButtonText.subscribe((arg0) => { this.modificationUnlockButton.textContent = arg0 });
        this.isModificationEnabled.subscribe_withInit((arg0) => { this.onIsModificationEnabledChanged(arg0); })
        this.modificationUnlockButton.addEventListener("click", () => { this.isModificationEnabled.value = !this.isModificationEnabled.value });
    }

    onIsModificationEnabledChanged(p_isModificationEnabled: boolean) {
        if (p_isModificationEnabled) {
            for(let i = 0;i<this.updatablaeElements.length;i++)
            {
                this.updatablaeElements[i].enableModifications();
            }
            this.modificationButtonText.value = "L";
            this.submitChangeButton.button.disabled = false;
            this.deleteButton.button.disabled = false;
        }
        else {
            for(let i = 0;i<this.updatablaeElements.length;i++)
            {
                this.updatablaeElements[i].disableModifications();
            }
            this.modificationButtonText.value = "U";
            this.submitChangeButton.button.disabled = true;
            this.deleteButton.button.disabled = true;
        }
    }

    clearChanges()
    {
        for(let i = 0;i<this.updatablaeElements.length;i++)
        {
            this.updatablaeElements[i].setCurrentAsInitialValue();
        }
        this.isModificationEnabled.value = false;
    }
};

interface UpdatablePanelCallbacks
{
    onSubmitPressed(p_onCompleted : () => void) : void;
    onDeletePressed(p_onCompleted : () => void) : void;
}

interface UpdatableElement
{
    enableModifications() : void;
    disableModifications() : void;
    setCurrentAsInitialValue() : void;
    hasChanged() : boolean;
}

export {UpdatablePanel, UpdatablePanelCallbacks, UpdatableElement}