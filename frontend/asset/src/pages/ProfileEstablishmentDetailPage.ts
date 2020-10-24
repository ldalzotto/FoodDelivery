import {UserLogin} from "../components/UserLogin.js"
import {PageHeader} from "../components/PageHeader.js"
import { EstablishementDisplay } from "../components/EstablishmentDetailDisplay.js";
import { Accordilon, AccordilonItemInput } from "../components_graphic/Accordilon.js";
import { DishAddToEstablishment } from "../components/DishAddToEstablishment.js";

class ProfileEstablishmentDetailPage extends HTMLElement
{
    static readonly Type : string = "establishment-detail-page";


    constructor(p_establishment_id : number)
    {
        super();  
        this.appendChild((document.getElementById(ProfileEstablishmentDetailPage.Type) as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));
        new Accordilon(this.querySelector("#detail"), [
            AccordilonItemInput.build("General informations : ", (p_root : HTMLElement) => {EstablishementDisplay.build(p_root, p_establishment_id);}),
            AccordilonItemInput.build("Dishes : ", (p_root : HTMLElement) => {new DishAddToEstablishment(p_root, p_establishment_id);})
        ]); 
    }
}

customElements.define(ProfileEstablishmentDetailPage.Type, ProfileEstablishmentDetailPage);

export {ProfileEstablishmentDetailPage as EstablishmentDetailPage}