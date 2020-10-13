import {MWatcher} from "../binding/Binding.js"
import {ProfileEstablishmentContext} from "./ProfileContextContent.js"

class ProfileSelector_SelectionEvent extends Event
{
    public static readonly Type = 'profileselection-event';

    public Section : ProfileSelector_SelectedSection;

    constructor(p_section : ProfileSelector_SelectedSection)
    {
        super(ProfileSelector_SelectionEvent.Type);
        this.Section = p_section;
    }
}

enum ProfileSelector_SelectedSection
{
    NONE,
    ESTABLISHMENT
}

class ProfileSelector extends HTMLElement
{
    static readonly Type : string = "profile-selector";

    private establishmentButton : HTMLButtonElement;

    private selectedSection : ProfileSelector_SelectedSection = ProfileSelector_SelectedSection.NONE;
    private selectedSection_watcher : MWatcher<ProfileSelector_SelectedSection>;

    constructor(){
        super();

        let l_template : HTMLTemplateElement = document.getElementById(ProfileSelector.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));
        
        this.establishmentButton = this.querySelector("#establishment-button") as HTMLButtonElement;
        this.establishmentButton.addEventListener("click", () => {this.onEstablishmentButtonClick();});

        this.selectedSection_watcher = new MWatcher(ProfileSelector_SelectedSection.NONE);
        this.selectedSection_watcher.subscribe((p_old, p_new) => this.onSelectedSectionChanged(p_old, p_new));
    }

    public static Initialize()
    {
        customElements.define(ProfileSelector.Type, ProfileSelector);
    }

    onEstablishmentButtonClick()
    {
        this.setSelectedSection(ProfileSelector_SelectedSection.ESTABLISHMENT);
    }

    private setSelectedSection(p_section : ProfileSelector_SelectedSection)
    {
        this.selectedSection = p_section;
        this.selectedSection_watcher.value = p_section;
    }

    private onSelectedSectionChanged(p_old : ProfileSelector_SelectedSection, p_new : ProfileSelector_SelectedSection)
    {
        this.dispatchEvent(new ProfileSelector_SelectionEvent(p_new));
    }
}

class ProfileContextContent extends HTMLElement
{
    static readonly Type : string = "profile-context-content";

    private currentContextContent : ProfileEstablishmentContext;

    constructor(){
        super();

        let l_template : HTMLTemplateElement = document.getElementById(ProfileContextContent.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));
    }

    public static Initialize()
    {
        customElements.define(ProfileContextContent.Type, ProfileContextContent);
    }

    public displaySection(p_section : ProfileSelector_SelectedSection)
    {
        switch(p_section)
        {
            case ProfileSelector_SelectedSection.ESTABLISHMENT:
                this.currentContextContent = new ProfileEstablishmentContext();
                this.appendChild(this.currentContextContent);
                break;
        }
    }
}


export {ProfileSelector, ProfileContextContent, ProfileSelector_SelectionEvent, ProfileSelector_SelectedSection};