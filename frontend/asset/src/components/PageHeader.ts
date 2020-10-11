import {GUserState} from "../UserState.js"
import {BindingIndex} from "../binding/Binding.js"
import {MoveToLoginPage, MoveToProfilePage} from "../services/Navigation.js"

class PageHeader extends HTMLElement
{
    private loginButton : HTMLButtonElement;
    private profileButton : HTMLButtonElement;

    private GState_IsLoggedIn_handle : BindingIndex;

    constructor()
    {
        super();

        this.attachShadow({mode: 'open'});
        let l_template : HTMLTemplateElement = document.getElementById("page-header") as HTMLTemplateElement;
        this.shadowRoot.append(l_template.content.cloneNode(true));

        this.loginButton = this.shadowRoot.getElementById("login-button") as HTMLButtonElement;
        this.loginButton.addEventListener('click', () => {this.onLoginButtonClick();});

        this.profileButton = this.shadowRoot.getElementById("profile-button") as HTMLButtonElement;
        this.profileButton.addEventListener('click', () => {this.onProfileButtonClick();});

        this.GState_IsLoggedIn_handle = GUserState.isLoggedIn_watcher.subscribe_withInit((p_old, p_new) => {this.onIsLoggenInChanged(p_old, p_new);});
    }

    disconnectedCallback()
    {
        GUserState.isLoggedIn_watcher.unsubscribe(this.GState_IsLoggedIn_handle);
    }

    onIsLoggenInChanged(p_old : boolean, p_new : boolean)
    {
        this.loginButton.style.display = !p_new ? "" : "none";
        this.profileButton.style.display = p_new ? "" : "none";
    }

    onLoginButtonClick()
    {
        MoveToLoginPage();
    }

    onProfileButtonClick()
    {
        MoveToProfilePage();
    }
}

function pageHeader_init()
{
    customElements.define('page-header', PageHeader);
}

export {pageHeader_init}