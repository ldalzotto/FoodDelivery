class LoadingButton extends HTMLElement
{
    static readonly Type : string = "loading-button";
    private static Html(p_text : string) : string { return `<button>${p_text}</button>`; } ; 

    private asyncOperationOnClick : ( p_onCompleted : ()=>void ) => void;

    private button : HTMLButtonElement;

    constructor()
    {
        super()
        this.innerHTML = LoadingButton.Html(this.getAttribute("button-text"));
        this.button = this.querySelector("button");
        this.button.addEventListener("click", () => {this.onButtonClicked();});
    }

    public new(p_asyncOperationOnClick : ( p_onCompleted : ()=>void ) => void)
    {
        this.asyncOperationOnClick = p_asyncOperationOnClick;
    }

    public static Initialize()
    {
        customElements.define(LoadingButton.Type, LoadingButton);
    }

    onButtonClicked()
    {
        this.button.disabled = true;
        this.asyncOperationOnClick( () => {this.button.disabled = false;} )
    }
}

class LoadingButtonV2 
{
    static readonly Type : string = "loading-button-v2";
    
    private _rootElement : HTMLButtonElement;
    public get rootElement(){return this._rootElement;}

    private parentElement : HTMLElement;

    private asyncOperationOnClick : ( p_onCompleted : ()=>void ) => void;

    constructor(p_rootElement : HTMLElement, p_asyncOperationOnClick : ( p_onCompleted : ()=>void ) => void)
    {
        this.parentElement = p_rootElement;
        this._rootElement = document.createElement("button");
        this._rootElement.textContent = p_rootElement.getAttribute("button-text");
        this.asyncOperationOnClick = p_asyncOperationOnClick;
        this._rootElement.addEventListener("click", () => {this.onButtonClicked();});
        this.parentElement.appendChild(this._rootElement);
    }

    onButtonClicked()
    {
        this._rootElement.disabled = true;
        this.asyncOperationOnClick( () => {this._rootElement.disabled = false;} )
    }
}

export {LoadingButton, LoadingButtonV2}