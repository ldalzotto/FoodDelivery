import {MWatcher} from "../binding/Binding.js"
import { ProfileNavigation } from "../services/Navigation.js";
import {ProfileEstablishmentContext} from "./ProfileEstablishments.js"

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
    ESTABLISHMENT,
    DISH
}

class ProfileSelector
{
    static readonly Type : string = "profile-selector";

    private _root : HTMLElement;
    public get root(){return this._root;}
    private establishmentButton : HTMLElement;
    private dishButton : HTMLElement;

    private selectedSection : ProfileSelector_SelectedSection = ProfileSelector_SelectedSection.NONE;
    private selectedSection_watcher : MWatcher<ProfileSelector_SelectedSection>;

    constructor(p_root : HTMLElement){
        this._root = p_root;

        let l_template : HTMLTemplateElement = document.getElementById(ProfileSelector.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));
        
        this.establishmentButton = this._root.querySelector("#establishment-button");
        this.dishButton = this._root.querySelector("#dish-button");

        this.establishmentButton.addEventListener("click", () => {this.onEstablishmentButtonClick();});
        this.dishButton.addEventListener("click", () => {this.onDishButtonClick();});
        

        this.selectedSection_watcher = new MWatcher(ProfileSelector_SelectedSection.NONE);
        this.selectedSection_watcher.subscribe((p_old, p_new) => this.onSelectedSectionChanged(p_old, p_new));
    }
 
    onEstablishmentButtonClick()
    {
        this.setSelectedSection(ProfileSelector_SelectedSection.ESTABLISHMENT);
        ProfileNavigation.MoveToEstablishment();
    }

    onDishButtonClick() {
        this.setSelectedSection(ProfileSelector_SelectedSection.DISH);
        ProfileNavigation.MoveToDishes();
    }

    private setSelectedSection(p_section : ProfileSelector_SelectedSection)
    {
        this.selectedSection = p_section;
        this.selectedSection_watcher.value = p_section;
    }
    
    private onSelectedSectionChanged(p_old : ProfileSelector_SelectedSection, p_new : ProfileSelector_SelectedSection)
    {
        this._root.dispatchEvent(new ProfileSelector_SelectionEvent(p_new));
    }
}


export {ProfileSelector, ProfileSelector_SelectionEvent, ProfileSelector_SelectedSection};