class RootPage extends HTMLElement
{
    constructor()
    {
        super();        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append((document.getElementById("root-page") as HTMLTemplateElement).content.cloneNode(true));
    }
}
customElements.define('root-page', RootPage);

export {RootPage}