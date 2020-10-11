import {Navigation} from "../services/Navigation.js"

class RegisterPage extends HTMLElement
{
    static readonly Type : string = "register-page";

    constructor()
    {
        super();        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append((document.getElementById(RegisterPage.Type) as HTMLTemplateElement).content.cloneNode(true));
    }
}

customElements.define(RegisterPage.Type, RegisterPage);

export {RegisterPage}