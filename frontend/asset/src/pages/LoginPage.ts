import {UserLogin, UserLogin_LoggedInEvent} from "../components/UserLogin.js"
import {Navigation} from "../services/Navigation.js"
import {PageHeader} from "../components/PageHeader.js"

class LoginPage extends HTMLElement
{
    static readonly Type : string = "login-page";

    private userLogin : UserLogin;

    constructor()
    {
        super();  
        this.appendChild((document.getElementById(LoginPage.Type) as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));   

        this.userLogin = this.querySelector(UserLogin.Type);
        this.userLogin.addEventListener(UserLogin_LoggedInEvent.Type, () => {
            Navigation.MoveToRootpage();
        });
    }
}

customElements.define(LoginPage.Type, LoginPage);

export {LoginPage}