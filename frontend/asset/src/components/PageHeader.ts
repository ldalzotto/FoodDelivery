import {GUserState} from "../UserState.js"
import {BindingIndex, BindingUtils, Observable} from "../binding/Binding.js"
import {Navigation} from "../services/Navigation.js"
import {LoginService} from "../services/Login.js"

class PageHeader extends HTMLElement
{
    private loginButton : HTMLButtonElement;
    private logoutButton : HTMLButtonElement;
    private registerButton : HTMLButtonElement;
    private profileButton : HTMLButtonElement;

    private GState_IsLoggedIn_handle : BindingIndex;

    private loginButtonDisplayed : Observable<boolean>;
    private logoutButtonDisplayed : Observable<boolean>;
    private registerButtonDisplayed : Observable<boolean>;
    private profileButtonDisplayed : Observable<boolean>;

    constructor()
    {
        super();

        this.attachShadow({mode: 'open'});
        let l_template : HTMLTemplateElement = document.getElementById("page-header") as HTMLTemplateElement;
        this.shadowRoot.append(l_template.content.cloneNode(true));

        this.loginButton = this.shadowRoot.getElementById("login-button") as HTMLButtonElement;
        this.loginButton.addEventListener('click', () => {this.onLoginButtonClick();});

        this.logoutButton = this.shadowRoot.getElementById("logout-button") as HTMLButtonElement;
        this.logoutButton.addEventListener('click', () => {this.onLogoutButtonClick();});

        this.registerButton = this.shadowRoot.getElementById("register-button") as HTMLButtonElement;
        this.registerButton.addEventListener('click', () => { this.onRegisterButtonClick(); });

        this.profileButton = this.shadowRoot.getElementById("profile-button") as HTMLButtonElement;
        this.profileButton.addEventListener('click', () => {this.onProfileButtonClick();});


        this.loginButtonDisplayed = new Observable<boolean>(false);
        BindingUtils.bindDisplayStyle(this.loginButton, this.loginButtonDisplayed)
        this.logoutButtonDisplayed = new Observable<boolean>(false);
        BindingUtils.bindDisplayStyle(this.logoutButton, this.logoutButtonDisplayed)
        this.registerButtonDisplayed = new Observable<boolean>(false);
        BindingUtils.bindDisplayStyle(this.registerButton, this.registerButtonDisplayed)
        this.profileButtonDisplayed = new Observable<boolean>(false);
        BindingUtils.bindDisplayStyle(this.profileButton, this.profileButtonDisplayed)

        this.GState_IsLoggedIn_handle = GUserState.isLoggedIn_watcher.subscribe_withInit((p_old, p_new) => {this.onIsLoggenInChanged(p_old, p_new);});

    }
   
    disconnectedCallback()
    {
        GUserState.isLoggedIn_watcher.unsubscribe(this.GState_IsLoggedIn_handle);
    }

    onIsLoggenInChanged(p_old : boolean, p_new : boolean)
    {
        this.loginButtonDisplayed.value = !p_new;
        this.logoutButtonDisplayed.value = p_new;
        this.registerButtonDisplayed.value = !p_new;
        this.profileButtonDisplayed.value = p_new;
    }

    onLoginButtonClick()
    {
        Navigation.MoveToLoginPage();
    }

    onLogoutButtonClick()
    {
        LoginService.Logoutuser(
            () => {
                Navigation.MoveToRootpage();
            }
        )
    }

    onRegisterButtonClick() 
    {
        Navigation.MoveToRegisterPage();
    }

    onProfileButtonClick()
    {
        Navigation.MoveToProfilePage();
    }
}

function pageHeader_init()
{
    customElements.define('page-header', PageHeader);
}

export {pageHeader_init}