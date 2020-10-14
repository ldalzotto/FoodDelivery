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

export {LoadingButton}