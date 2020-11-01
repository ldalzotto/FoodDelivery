import { Observable } from "../framework/binding/Binding.js";
import { LComponent } from "../framework/component/LComponent.js";
import { RevertButton } from "../modules_graphic/RevertButton.js";
import { UpdateDot } from "../modules_graphic/UpdateDot.js";
import { ImageService, ImageUrl } from "../services/Image.js";
import { GlobalStyle } from "../Style.js";
import { UpdatableElement } from "./UpdatablePanel.js";

enum ImageSelection_Module
{
    UPDATE_DOT = 0,
    REVERT_BUTTON = 1
}

class ImageSelection_Html
{

    public static readonly imageId: string = "image";
    public static readonly imageLabelId: string = "image-label";
    public static readonly updateDotId: string = "update-dot";
    public static readonly revertButtonId: string = "revert-button";

    public static html(p_update_dot_element: string, p_revert_button_element: string): string
    {
        return `
        <${ImageSelection.Type}>
            <div class="row inherit-wh">
            <input class="file" type=file id="file" />
            <label id="${ImageSelection_Html.imageLabelId}" for="file" class="column one inherit-wh file-label">
                <img id="${ImageSelection_Html.imageId}" class="inherit-wh" src="${ImageUrl.buildUrlForId(1).url}"/>
                <div id="image-absolute-container">
                    ${p_update_dot_element}
                    ${p_revert_button_element}
                </div>
            </label>
            </div>
        </${ImageSelection.Type}>
        `;
    }

    public static updatedot_html(): string
    {
        return `
            <div id="${ImageSelection_Html.updateDotId}" class="update-dot-base top-right"></div>
        `;
    }

    public static revertbutton_html(): string
    {
        return `
            <div id="${ImageSelection_Html.revertButtonId}" style="position: absolute; width: 17px; height: 17px; right: -9px; top: 11px;">
                <span>↻</span>
            </div>
        `;
    }
}

class ImageSelection_Style
{
    public static style(): string
    {
        return `
            ${ImageSelection.Type}
            {
                height: 150px;
                width: 150px;
            }

            ${ImageSelection.Type} >* input.file
            {
                display: none;
            }

            ${ImageSelection.Type} >* label.file-label
            {
                cursor: pointer;
                position: relative;
            }
        `;
    }
}

class ImageSelection extends LComponent<ImageSelection_Module>
{
    static readonly Type: string = "image-selection";

    type(): string
    {
        return ImageSelection.Type;
    }

    private readOnly: Observable<boolean>;

    private image: HTMLImageElement;
    private intput: HTMLInputElement;
    public getInput() { return this.intput; }

    private selectedImageId: number;
    public getSelectedImageId() { return this.selectedImageId; }

    private onInputChanged_chain_callback: () => void;

    constructor(p_root: HTMLElement, p_modules: ImageSelection_Module[],
        p_is_read_only: boolean, p_onInputChanged_chain_callback: () => void = null)
    {
        super(p_root, p_modules);
        
        this.readOnly = new Observable<boolean>(p_is_read_only);
        this.image = this._root.querySelector(`#${ImageSelection_Html.imageId}`);
        this.intput = this._root.querySelector(`input`);
        this.onInputChanged_chain_callback = p_onInputChanged_chain_callback;

        this.selectedImageId = 1;

        this.intput.addEventListener("change", () => { this.onInputChange(); });
        this.readOnly.subscribe_withInit(() => { this.onReadOnlyChange(); });
    }

    html(): string
    {
        let l_revertelement_str: string = this._modules.has(ImageSelection_Module.REVERT_BUTTON) ? ImageSelection_Html.revertbutton_html() : "";
        let l_udpatedot_str: string = this._modules.has(ImageSelection_Module.UPDATE_DOT) ? ImageSelection_Html.updatedot_html() : "";
        return ImageSelection_Html.html(l_udpatedot_str, l_revertelement_str);
    }

    style(): string
    {
        return ImageSelection_Style.style();
    }

    module(p_key: ImageSelection_Module): void
    {
        switch (p_key)
        {
            case ImageSelection_Module.UPDATE_DOT:
                this._modules.set(ImageSelection_Module.UPDATE_DOT, new UpdateDot(this._root.querySelector(`#${ImageSelection_Html.updateDotId}`)));
                break;
            case ImageSelection_Module.REVERT_BUTTON:
                this._modules.set(ImageSelection_Module.REVERT_BUTTON, new RevertButton(this._root.querySelector(`#${ImageSelection_Html.revertButtonId}`)));
                break;
        }
    }

    public setReadOnly(p_value: boolean)
    {
        this.readOnly.value = p_value;
    }

    public setImageId(p_imageId: number)
    {
        this.selectedImageId = p_imageId;
        this.image.src = ImageUrl.buildUrlForId(this.selectedImageId).url;

        //This is to reset the file list.
        this.intput.type = "text";
        this.intput.type = "file";

        if (this.onInputChanged_chain_callback)
        {
            this.onInputChanged_chain_callback();
        }
    }

    private onInputChange()
    {
        if (this.intput.files && this.intput.files.length > 0)
        {
            ImageService.postImage(this.intput.files[0],
                (p_image: ImageUrl) =>
                {
                    this.selectedImageId = p_image.image_id;
                    this.image.src = p_image.url;

                    if (this.onInputChanged_chain_callback)
                    {
                        this.onInputChanged_chain_callback();
                    }

                }, null);
        }
        else
        {
            this.selectedImageId = 1;
            this.image.src = ImageUrl.buildUrlForId(this.selectedImageId).url;

            if (this.onInputChanged_chain_callback)
            {
                this.onInputChanged_chain_callback();
            }
        }
    }

    private onReadOnlyChange()
    {
        if (this.readOnly.value)
        {
            this.intput.addEventListener("click", ImageSelection.handleEvent_preventImageSelection);
        }
        else
        {
            this.intput.removeEventListener("click", ImageSelection.handleEvent_preventImageSelection);
        }
    }

    public module_UpdateDot(): UpdateDot
    {
        return this._modules.get(ImageSelection_Module.UPDATE_DOT) as UpdateDot;
    }

    public module_RevertButton(): RevertButton
    {
        return this._modules.get(ImageSelection_Module.REVERT_BUTTON) as RevertButton;
    }

    private static handleEvent_preventImageSelection(p_event: Event)
    {
        p_event.preventDefault();
    }
}

class ImageSelectionUpdateElement implements UpdatableElement
{

    private imageSelection: ImageSelection;
    public getImageSelection() { return this.imageSelection; }

    private initialImageId: number;

    constructor(p_root: HTMLElement)
    {
        this.imageSelection = new ImageSelection(p_root, [ImageSelection_Module.REVERT_BUTTON, ImageSelection_Module.UPDATE_DOT], true,
            () => { this.onInputChanged(); });
        this.initialImageId = this.imageSelection.getSelectedImageId();
        this.imageSelection.module_RevertButton().revertClickCallback = () => { this.onRevertClicked(); };
        this.onInputChanged();
    }

    private onInputChanged()
    {
        if (this.initialImageId != this.imageSelection.getSelectedImageId())
        {
            this.imageSelection.module_UpdateDot().setEnabled(true);
        }
        else
        {
            this.imageSelection.module_UpdateDot().setEnabled(false);
        }
    }

    private onRevertClicked()
    {
        this.setImageId(this.initialImageId);
    }

    public setImageId(p_image_id: number)
    {
        this.imageSelection.setImageId(p_image_id);
    }

    enableModifications(): void
    {
        this.imageSelection.setReadOnly(false);
    }

    disableModifications(): void
    {
        this.imageSelection.setReadOnly(true);
    }

    setCurrentAsInitialValue(): void
    {
        this.initialImageId = this.imageSelection.getSelectedImageId();
        this.onInputChanged();
    }

    hasChanged(): boolean
    {
        return (this.initialImageId != this.imageSelection.getSelectedImageId());
    }

}

export { ImageSelection, ImageSelection_Module, ImageSelectionUpdateElement }
