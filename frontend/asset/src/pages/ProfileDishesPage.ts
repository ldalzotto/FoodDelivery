import { PageHeader } from "../components/PageHeader.js";
import { ProfileDishes } from "../components/ProfileDishes.js";
import { ProfileSelector } from "../components/ProfileSelector.js";

class ProfileDishesPage extends HTMLElement
{
    static readonly Type: string = "profile-dishes-page";

    constructor()
    {
        super();      
        this.appendChild((document.getElementById(ProfileDishesPage.Type) as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));  
        new ProfileSelector(this.querySelector(ProfileSelector.Type));
        new ProfileDishes(this.querySelector(ProfileDishes.Type));
    }
}

customElements.define(ProfileDishesPage.Type, ProfileDishesPage);

export {ProfileDishesPage}