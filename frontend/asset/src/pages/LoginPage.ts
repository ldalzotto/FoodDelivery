import {UserLogin, UserLogin_LoggedInEvent} from "../components/UserLogin.js"
import {Navigation} from "../services/Navigation.js"

class LoginPage extends HTMLElement
{
    static readonly Type : string = "login-page";

    private userLogin : UserLogin;

    constructor()
    {
        super();        
        this.appendChild((document.getElementById(LoginPage.Type) as HTMLTemplateElement).content.cloneNode(true));

        this.userLogin = this.querySelector(UserLogin.Type);
        this.userLogin.addEventListener(UserLogin_LoggedInEvent.Type, () => {
            Navigation.MoveToRootpage();
        });
    }
}

customElements.define(LoginPage.Type, LoginPage);

export {LoginPage}