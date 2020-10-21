import {UserLogin} from "../components/UserLogin.js"
import {PageHeader} from "../components/PageHeader.js"
import { EstablishementDisplay } from "../components/EstablishmentDetailDisplay.js";

class ProfileEstablishmentDetailPage extends HTMLElement
{
    static readonly Type : string = "establishment-detail-page";
    
    constructor(p_establishment_id : number)
    {
        super();  
        this.appendChild((document.getElementById(ProfileEstablishmentDetailPage.Type) as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));   
        EstablishementDisplay.build(this.querySelector("#detail"), p_establishment_id); 
    }
}

customElements.define(ProfileEstablishmentDetailPage.Type, ProfileEstablishmentDetailPage);

export {ProfileEstablishmentDetailPage as EstablishmentDetailPage}