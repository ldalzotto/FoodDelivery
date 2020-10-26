import { DishDetailDisplay } from "../components/DishDetailDisplay.js";
import { PageHeader } from "../components/PageHeader.js";
import { Accordilon, AccordilonItemInput } from "../components_graphic/Accordilon.js";

class ProfileDishDetailPage extends HTMLElement
{
    static readonly Type : string = "dish-detail-page";

    constructor(p_dish_id : number)
    {
        super();  
        this.appendChild((document.getElementById(ProfileDishDetailPage.Type) as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));
        new Accordilon(this.querySelector("#detail"), [
            AccordilonItemInput.build("General informations : ", (p_root : HTMLElement) => {DishDetailDisplay.build(p_root, p_dish_id);})
        ]); 
    }
}

customElements.define(ProfileDishDetailPage.Type, ProfileDishDetailPage);

export {ProfileDishDetailPage}