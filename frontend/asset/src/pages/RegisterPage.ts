import { PageHeader } from "../components/PageHeader.js";
import {Navigation} from "../services/Navigation.js"

class RegisterPage extends HTMLElement
{
    static readonly Type : string = "register-page";

    constructor()
    {
        super();        
        this.appendChild((document.getElementById(RegisterPage.Type) as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));
    }
}

customElements.define(RegisterPage.Type, RegisterPage);

export {RegisterPage}