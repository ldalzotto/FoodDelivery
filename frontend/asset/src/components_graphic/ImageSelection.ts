import { Observable } from "../binding/Binding.js";
import { ImageService, ImageUrl } from "../services/Image.js";
import { UpdatableElement } from "./UpdatablePanel.js";

enum ImageSelection_Module
{
    UPDATE_DOT = 0,
    REVERT_BUTTON = 1
}

interface ImageSelection_Modules
{
    [module: number]: any
}

class ImageSelection_Html
{

    public static readonly imageId: string = "image";
    public static readonly imageLabelId: string = "image-label";
    public static readonly updateDotId: string = "update-dot";
    public static readonly revertButtonId: string = "revert-button";

    private static html(p_update_dot_element: string, p_revert_button_element: string): string
    {
        return `
        <image-selection>
            <div class="row inherit-wh">
            <input class="file" type=file id="file" />
            <label id="${ImageSelection_Html.imageLabelId}" for="file" class="column one file-label">
                <img id="${ImageSelection_Html.imageId}" src="${ImageUrl.buildUrlForId(1).url}"/>
                <div id="image-absolute-container">
                    ${p_update_dot_element}
                    ${p_revert_button_element}
                </div>
            </label>
            </div>
        </image-selection>
        `;
    }

    private static updatedot_html(): string
    {
        return `
            <div id="${ImageSelection_Html.updateDotId}" class="update-dot-base top-right"></div>
        `;
    }

    private static revertbutton_html(): string
    {
        return `
            <div id="${ImageSelection_Html.revertButtonId}" style="position: absolute; width: 17px; height: 17px; right: -9px; top: 11px;">
                <span>↻</span>
            </div>
        `;
    }

    public static build(p_modules: ImageSelection_Module[]): string
    {
        if (p_modules)
        {
            let l_upatedot = false;
            let l_revert = false;

            for (let i = 0; i < p_modules.length; i++)
            {
                switch (p_modules[i])
                {
                    case ImageSelection_Module.UPDATE_DOT:
                        {
                            l_upatedot = true;
                        }
                        break;
                    case ImageSelection_Module.REVERT_BUTTON:
                        {
                            l_revert = true;
                        }
                        break;
                }
            }

            let l_revertelement_str: string = l_revert ? ImageSelection_Html.revertbutton_html() : "";
            let l_udpatedot_str: string = l_upatedot ? ImageSelection_Html.updatedot_html() : "";
            return ImageSelection_Html.html(l_udpatedot_str, l_revertelement_str);
        }

        return "";
    }
}

class ImageSelection
{
    static readonly Type: string = "image-selection";

    private _root: HTMLElement;
    public get root() { return this._root; }

    private readOnly: Observable<boolean>;

    private image: HTMLImageElement;
    private imageLabel: HTMLImageElement;
    private intput: HTMLInputElement;
    public getInput() { return this.intput; }

    private selectedImageId: number;
    public getSelectedImageId() { return this.selectedImageId; }

    private onInputChanged_chain_callback: () => void;

    private modules: ImageSelection_Modules;

    constructor(p_root: HTMLElement, p_modules: ImageSelection_Module[],
        p_is_read_only: boolean, p_onInputChanged_chain_callback: () => void = null)
    {
        this._root = p_root;
        this._root.appendChild(document.createRange().createContextualFragment(ImageSelection_Html.build(p_modules)));

        this.readOnly = new Observable<boolean>(p_is_read_only);
        this.image = this._root.querySelector(`#${ImageSelection_Html.imageId}`);
        this.imageLabel = this._root.querySelector(`#${ImageSelection_Html.imageLabelId}`);
        this.intput = this._root.querySelector(`input`);
        this.onInputChanged_chain_callback = p_onInputChanged_chain_callback;

        this.selectedImageId = 1;
        this.modules = {};
        if (p_modules)
        {
            for (let i = 0; i < p_modules.length; i++)
            {
                switch (p_modules[i])
                {
                    case ImageSelection_Module.UPDATE_DOT:
                        this.modules[ImageSelection_Module.UPDATE_DOT] = new ImageSelection_UpdateDot(this);
                        break;
                    case ImageSelection_Module.REVERT_BUTTON:
                        this.modules[ImageSelection_Module.REVERT_BUTTON] = new ImageSelection_RevertButton(this);
                        break;
                }
            }
        }

        this.intput.addEventListener("change", () => { this.onInputChange(); });
        this.readOnly.subscribe_withInit(() => { this.onReadOnlyChange(); });
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

    public module_UpdateDot(): ImageSelection_UpdateDot
    {
        return this.modules[ImageSelection_Module.UPDATE_DOT] as ImageSelection_UpdateDot;
    }

    public module_RevertButton(): ImageSelection_RevertButton
    {
        return this.modules[ImageSelection_Module.REVERT_BUTTON] as ImageSelection_RevertButton;
    }


    private static handleEvent_preventImageSelection(p_event: Event)
    {
        p_event.preventDefault();
    }
}


class ImageSelection_UpdateDot
{
    private imageSelection: ImageSelection;

    private updateDotElement: HTMLElement;

    constructor(p_imageSelection: ImageSelection)
    {
        this.imageSelection = p_imageSelection;
        this.updateDotElement = this.imageSelection.root.querySelector(`#${ImageSelection_Html.updateDotId}`);
    }

    public setEnabled(p_value: boolean)
    {
        this.updateDotElement.style.display = p_value ? "" : "none";
    }
}

class ImageSelection_RevertButton
{
    private imageSelection: ImageSelection;

    public revertClickCallback: () => void;

    constructor(p_imageSelection: ImageSelection)
    {
        this.imageSelection = p_imageSelection;
        this.imageSelection.root.querySelector(`#${ImageSelection_Html.revertButtonId}`).addEventListener("click", (p_event) => { this.onRevertClicked(p_event); });
    }

    private onRevertClicked(p_event: Event)
    {
        p_event.stopPropagation();
        p_event.preventDefault();
        this.revertClickCallback();
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
        this.imageSelection.setImageId(this.initialImageId);
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
