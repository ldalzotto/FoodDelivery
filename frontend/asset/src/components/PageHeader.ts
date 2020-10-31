import {GUserState} from "../UserState.js"
import { BindingIndex, BindingUtils, Observable } from "../framework/binding/Binding.js"
import {Navigation} from "../services/Navigation.js"
import {LoginService} from "../services/Login.js"

class PageHeader
{
    public static readonly Type : string = "page-header";
    private _root : HTMLElement;

    private loginButton : HTMLElement;
    private logoutButton : HTMLElement;
    private registerButton : HTMLElement;
    private profileButton : HTMLElement;
    private eatButton : HTMLElement;

    private GState_IsLoggedIn_handle : BindingIndex;

    private loginButtonDisplayed : Observable<boolean>;
    private logoutButtonDisplayed : Observable<boolean>;
    private registerButtonDisplayed : Observable<boolean>;
    private profileButtonDisplayed : Observable<boolean>;

    constructor(p_root : HTMLElement)
    {
        this._root = p_root;

        let l_template : HTMLTemplateElement = document.getElementById(PageHeader.Type) as HTMLTemplateElement;
        this._root.appendChild(l_template.content.cloneNode(true));

        this.loginButton = this._root.querySelector("#login-button");
        this.loginButton.addEventListener('click', () => {this.onLoginButtonClick();});

        this.logoutButton = this._root.querySelector("#logout-button");
        this.logoutButton.addEventListener('click', () => {this.onLogoutButtonClick();});

        this.registerButton = this._root.querySelector("#register-button");
        this.registerButton.addEventListener('click', () => { this.onRegisterButtonClick(); });

        this.profileButton = this._root.querySelector("#profile-button");
        this.profileButton.addEventListener('click', () => {this.onProfileButtonClick();});

        this.eatButton = this._root.querySelector("#eat-button");
        this.eatButton.addEventListener('click', () => {this.onEatButtonClick();});


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

    
    onEatButtonClick() 
    {
        Navigation.MoveToEatPage();
    }
}


export {PageHeader}