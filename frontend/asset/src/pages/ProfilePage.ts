import {ProfileContextContent, ProfileSelector, ProfileSelector_SelectionEvent, ProfileSelector_SelectedSection} from "../components/ProfileSelector.js"

class ProfilePage extends HTMLElement
{
    private profileContextContent : ProfileContextContent;

    constructor()
    {
        super();        
        this.appendChild((document.getElementById("profile-page") as HTMLTemplateElement).content.cloneNode(true));

        let l_selector : ProfileSelector = this.querySelector(ProfileSelector.Type) as ProfileSelector;
        l_selector.addEventListener(ProfileSelector_SelectionEvent.Type, (p_event : ProfileSelector_SelectionEvent) => { this.onProfileSelectedSectionChanged(p_event); })
        this.profileContextContent = this.querySelector(ProfileContextContent.Type) as ProfileContextContent;
    }

    onProfileSelectedSectionChanged(p_event : ProfileSelector_SelectionEvent)
    {
        this.profileContextContent.displaySection(p_event.Section);
    }
}

customElements.define('profile-page', ProfilePage);

export {ProfilePage}