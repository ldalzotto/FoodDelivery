import { PageHeader } from "../components/PageHeader.js";
import { ProfileSelector, ProfileSelector_SelectionEvent, ProfileSelector_SelectedSection} from "../components/ProfileSelector.js"

class ProfilePage extends HTMLElement
{
    constructor()
    {
        super();      
        this.appendChild((document.getElementById("profile-page") as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));  
        new ProfileSelector(this.querySelector(ProfileSelector.Type));
    }

}

customElements.define('profile-page', ProfilePage);

export {ProfilePage}