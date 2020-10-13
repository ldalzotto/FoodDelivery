class RootPage extends HTMLElement
{
    constructor()
    {
        super();        
        this.appendChild((document.getElementById("root-page") as HTMLTemplateElement).content.cloneNode(true));
    }
}
customElements.define('root-page', RootPage);

export {RootPage}