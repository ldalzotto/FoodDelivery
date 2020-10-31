import { Observable, BindingUtils } from "../framework/binding/Binding.js";
import { LoginInput, LoginService, PostLogin_ErrorCodes, ServerError } from "../services/Login.js"
import { GUserState } from "../UserState.js"
import { BindingIndex } from "../framework/binding/Binding.js"

class UserLogin_LoggedInEvent extends Event {
    static readonly Type = 'logged-in';
    constructor() {
        super(UserLogin_LoggedInEvent.Type);
    }
}


class UserLogin extends HTMLElement {
    static readonly Type: string = "user-login";

    private NotLoggedInelement: HTMLDivElement;
    private AlreadyLoggedInElement: HTMLDivElement;

    private LoginInput: HTMLInputElement;
    private PasswordInput: HTMLInputElement;
    private LogButton: HTMLButtonElement;

    private LoginErrorMessage: HTMLElement;
    private PasswordErrorMessage: HTMLElement;

    private LoginObservable: Observable<string>;
    private PasswordObservable: Observable<string>;

    private LoginErrorMessage_Visible: Observable<boolean>;
    private PasswordErrorMessage_Visible: Observable<boolean>;

    private GState_IsLoggedIn_handle: BindingIndex;

    constructor() {
        super();

        let l_template: HTMLTemplateElement = document.getElementById(UserLogin.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));

        this.NotLoggedInelement = this.querySelector("#not-logged-in-element") as HTMLDivElement;
        this.AlreadyLoggedInElement = this.querySelector("#logged-in-element") as HTMLDivElement;

        this.LoginInput = this.querySelector("#login") as HTMLInputElement;
        this.PasswordInput = this.querySelector("#password") as HTMLInputElement;
        this.LogButton = this.querySelector("#log-button") as HTMLButtonElement;

        this.LoginErrorMessage = this.querySelector("#login-error-message");
        this.PasswordErrorMessage = this.querySelector("#password-error-message");

        this.LogButton.onclick = () => { this.onLogButtonClick(); };

        this.LoginObservable = new Observable("");
        this.PasswordObservable = new Observable("");

        this.LoginErrorMessage_Visible = new Observable(false);
        this.PasswordErrorMessage_Visible = new Observable(false);

        BindingUtils.bindDisplayStyle(this.LoginErrorMessage, this.LoginErrorMessage_Visible);
        BindingUtils.bindDisplayStyle(this.PasswordErrorMessage, this.PasswordErrorMessage_Visible);

        BindingUtils.bindInputText(this.LoginInput, this.LoginObservable);
        BindingUtils.bindInputText(this.PasswordInput, this.PasswordObservable);

        this.GState_IsLoggedIn_handle = GUserState.isLoggedIn_watcher.subscribe_withInit((p_old: boolean, p_new: boolean) => { this.onUserLoggedInChanged(p_old, p_new); });
    }

    disconnectedCallback() {
        GUserState.isLoggedIn_watcher.unsubscribe(this.GState_IsLoggedIn_handle);
    }

    onLogButtonClick() {
        let l_loginInput: LoginInput = new LoginInput();
        l_loginInput.username = this.LoginObservable.value;
        l_loginInput.password = this.PasswordObservable.value;
        this.LoginErrorMessage_Visible.value = false;
        this.PasswordErrorMessage_Visible.value = false;

        LoginService.LoginUser(l_loginInput, (err: ServerError) => {
            if (!err) {
                console.log("OK");
            }
            else {
                switch (err.code) {
                    case PostLogin_ErrorCodes.UserNotFound:
                        {
                            this.LoginErrorMessage_Visible.value = true;
                        }
                        break;
                    case PostLogin_ErrorCodes.IncorrectPassword:
                        {
                            this.PasswordErrorMessage_Visible.value = true;
                        }
                        break
                }
            }
        });
    }

    onUserLoggedInChanged(p_old: boolean, p_new: boolean) {
        this.NotLoggedInelement.style.display = !p_new ? "" : "none";
        this.AlreadyLoggedInElement.style.display = p_new ? "" : "none";

        if (!p_old && p_new) {
            this.dispatchEvent(new UserLogin_LoggedInEvent());
        }
    }

}

function userLogin_init() {
    customElements.define(UserLogin.Type, UserLogin);
}

export { userLogin_init, UserLogin, UserLogin_LoggedInEvent };