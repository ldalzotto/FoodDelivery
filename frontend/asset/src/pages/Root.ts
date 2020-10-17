import { PageHeader } from "../components/PageHeader.js";

class RootPage extends HTMLElement
{
    constructor()
    {
        super();        
        this.appendChild((document.getElementById("root-page") as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));
    }
}
customElements.define('root-page', RootPage);

export {RootPage}