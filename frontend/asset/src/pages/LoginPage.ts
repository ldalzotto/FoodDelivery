import {UserLogin, UserLogin_LoggedInEvent} from "../components/UserLogin.js"
import {MoveToRootpage} from "../services/Navigation.js"

class LoginPage extends HTMLElement
{
    static readonly Type : string = "login-page";

    private userLogin : UserLogin;

    constructor()
    {
        super();        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append((document.getElementById(LoginPage.Type) as HTMLTemplateElement).content.cloneNode(true));

        this.userLogin = this.shadowRoot.querySelector(UserLogin.Type);
        this.userLogin.addEventListener(UserLogin_LoggedInEvent.Type, () => {
            MoveToRootpage();
        });
    }
}

customElements.define(LoginPage.Type, LoginPage);

export {LoginPage}