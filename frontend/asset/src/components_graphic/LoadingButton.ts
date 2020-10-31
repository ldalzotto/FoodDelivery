class LoadingButton
{
    static readonly Type : string = "loading-button";
    private static Html(p_text : string) : string { return `<button>${p_text}</button>`; } ; 

    private _root : HTMLElement;

    private asyncOperationOnClick : ( p_onCompleted : ()=>void ) => void;

    private _button : HTMLButtonElement;
    public get button(){return this._button;}

    constructor(p_parent : HTMLElement,
        p_asyncOperationOnClick : ( p_onCompleted : ()=>void ) => void)
    {
        this._root = p_parent;
        this._root.innerHTML = LoadingButton.Html(this._root.getAttribute("button-text"));
        this._button = this._root.querySelector("button");
        this._button.addEventListener("click", () => {this.onButtonClicked();});
        this.asyncOperationOnClick = p_asyncOperationOnClick;
    }

    onButtonClicked()
    {
        this._button.disabled = true;
        this.asyncOperationOnClick( () => {this._button.disabled = false;} )
    }
}

class LoadingElement
{
    public isEnabled: boolean = true;
    private isProcessing: boolean = false;

    private asyncOperationOnClick: (p_onCompleted: () => void) => void;

    constructor(p_element: HTMLElement,
        p_asyncOperationOnClick: (p_onCompleted: () => void) => void)
    {
        this.asyncOperationOnClick = p_asyncOperationOnClick;
        p_element.addEventListener("click", () => { this.onClicked(); });
    }

    onClicked()
    {
        if (this.isEnabled)
        {
            if (!this.isProcessing)
            {
                this.isProcessing = true;
                this.asyncOperationOnClick(() => { this.isProcessing = false; })
            }
        }
    }
}

export { LoadingButton, LoadingElement }