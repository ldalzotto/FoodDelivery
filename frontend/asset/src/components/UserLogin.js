import {Observable, bindValue_inputElement} from "../binding/Binding.js";
import {LoginInput, LoginUser} from "../services/Login.js"

class UserLogin extends HTMLElement
{
    LoginInput;
    PasswordInput;
    LogButton;

    LoginObservable; PasswordObservable;

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(document.getElementById("user-login").content.cloneNode(true));

        this.LoginInput = this.shadowRoot.getElementById("login");
        this.PasswordInput = this.shadowRoot.getElementById("password");
        this.LogButton = this.shadowRoot.getElementById("log-button");
        this.LogButton.onclick = () => {this.onLogButtonClick();};

        this.LoginObservable = new Observable("");
        this.PasswordObservable = new Observable("");

        bindValue_inputElement(this.LoginInput, this.LoginObservable);
        bindValue_inputElement(this.PasswordInput, this.PasswordObservable);
    }

    onLogButtonClick()
    {
        let l_loginInput = new LoginInput();
        l_loginInput.username = this.LoginObservable.value;
        l_loginInput.password = this.PasswordObservable.value;
        LoginUser(l_loginInput, (res) => { console.log("OK"); })
    }

}

var UserLogin_initialize = function(){
    customElements.define('user-login', UserLogin);
};

export {UserLogin_initialize}