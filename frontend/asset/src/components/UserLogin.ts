import {Observable, bindValue_inputElement} from "../binding/Binding.js";
import {LoginInput, LoginUser, ServerError} from "../services/Login.js"
import {GUserState} from "../UserState.js"
import {MObservableIndex} from "../binding/Binding.js"

class UserLogin extends HTMLElement
{
    private LoginInput : HTMLInputElement;
    private PasswordInput : HTMLInputElement;
    private LogButton : HTMLButtonElement;

    private LoginObservable : Observable<string>;
    private PasswordObservable : Observable<string>;

    private GState_IsLoggedIn_handle : MObservableIndex;

    constructor(){
        super();

        this.GState_IsLoggedIn_handle = GUserState.isLoggedIn.subscribe_withInit((p_value : boolean) => { this.onUserLoggedInChanged(p_value); });

        this.attachShadow({mode: 'open'});
        let l_template : HTMLTemplateElement = document.getElementById("user-login") as HTMLTemplateElement;
        this.shadowRoot.append(l_template.content.cloneNode(true));

        this.LoginInput = this.shadowRoot.getElementById("login") as HTMLInputElement;
        this.PasswordInput = this.shadowRoot.getElementById("password") as HTMLInputElement;
        this.LogButton = this.shadowRoot.getElementById("log-button") as HTMLButtonElement;
        this.LogButton.onclick = () => {this.onLogButtonClick();};

        this.LoginObservable = new Observable("");
        this.PasswordObservable = new Observable("");

        bindValue_inputElement(this.LoginInput, this.LoginObservable);
        bindValue_inputElement(this.PasswordInput, this.PasswordObservable);
    }

    disconnectedCallback() {
        GUserState.isLoggedIn.unsubscribe(this.GState_IsLoggedIn_handle);
    }

    onLogButtonClick()
    {
        let l_loginInput : LoginInput = new LoginInput();
        l_loginInput.username = this.LoginObservable.value;
        l_loginInput.password = this.PasswordObservable.value;
        LoginUser(l_loginInput, (err : ServerError) => {
            if(!err)
            {
                console.log("OK"); 
            }
            else
            {
                console.log(err.code);
            }
        });
    }

    onUserLoggedInChanged(p_isLoggedIn : boolean)
    {
        if(p_isLoggedIn)
        {
            this.remove();
            // this.parentElement.removeChild(this);
        }
    }

}

function UserLogin_initialize()
{
    customElements.define('user-login', UserLogin);
};

export {UserLogin_initialize}