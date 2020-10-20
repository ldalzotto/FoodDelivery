import { PageHeader } from "../components/PageHeader.js";
import { ProfileSelector } from "../components/ProfileSelector.js";

class Profile_EstablishmentPage extends HTMLElement
{

    constructor()
    {
        super();      
        this.appendChild((document.getElementById("profile-establishment-page") as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));
        new ProfileSelector(this.querySelector(ProfileSelector.Type));
    }
}

 customElements.define('profile-establishment-page', Profile_EstablishmentPage);

export {Profile_EstablishmentPage}