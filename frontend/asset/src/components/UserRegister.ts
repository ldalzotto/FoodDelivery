import {BindingUtils} from "../binding/Binding.js"
import {Observable} from "../binding/Binding.js"
import {UserService} from "../services/User.js"
import { User } from "../UserState.js";
import {GUserState} from "../UserState.js"

class UserRegister extends HTMLElement
{
    static readonly Type : string = "user-register";

    static Initialize()
    {
        customElements.define(UserRegister.Type, UserRegister);
    }

    private usernameInput : HTMLInputElement;
    private passwordInput : HTMLInputElement;
    private emailInput : HTMLInputElement;
    private submitButton : HTMLButtonElement;
    private submitMessage : HTMLDivElement;

    private usernameObservable : Observable<string>;
    private passwordObservable : Observable<string>;
    private emailObservable : Observable<string>;
    private submitMessageVisible : Observable<boolean>;
    private submitButtonVisible : Observable<boolean>;

    constructor()
    {
        super()

        this.attachShadow({mode: 'open'});
        let l_template : HTMLTemplateElement = document.getElementById(UserRegister.Type) as HTMLTemplateElement;
        this.shadowRoot.append(l_template.content.cloneNode(true));
        
        this.usernameInput = this.shadowRoot.getElementById("username") as HTMLInputElement;
        this.passwordInput = this.shadowRoot.getElementById("password") as HTMLInputElement;
        this.emailInput = this.shadowRoot.getElementById("email") as HTMLInputElement;
        this.submitButton = this.shadowRoot.getElementById("submit") as HTMLButtonElement;
        this.submitMessage = this.shadowRoot.getElementById("submit-message") as HTMLDivElement;

        this.usernameObservable = new Observable<string>("");
        this.passwordObservable = new Observable<string>("");
        this.emailObservable = new Observable<string>("");
        this.submitMessageVisible = new Observable<boolean>(false);
        this.submitButtonVisible = new Observable<boolean>(true);

        BindingUtils.bindInputText(this.usernameInput, this.usernameObservable);
        BindingUtils.bindInputText(this.passwordInput, this.passwordObservable);
        BindingUtils.bindInputText(this.emailInput, this.emailObservable);

        BindingUtils.bindDisplayStyle(this.submitMessage, this.submitMessageVisible);
        BindingUtils.bindDisplayStyle(this.submitButton, this.submitButtonVisible);

        this.submitButton.addEventListener('click', () => {this.onSubmitClicked();});
    }


    onSubmitClicked()
    {
        this.submitButtonVisible.value = false;
        this.submitMessageVisible.value = false;

        UserService.PostUser(
            {username: this.usernameObservable.value, password: this.passwordObservable.value, email: this.emailObservable.value},
            (p_user : User) => {
                // GUserState.user.
                GUserState.user.pushValue(p_user);
                GUserState.user.getValue((pp_user : User) => {
                    if(!pp_user.isValidated)
                    {
                        this.submitMessageVisible.value = true;
                        this.submitMessage.textContent = "Registration successful. Confirm your email by clicking the link we have provided to you in your mailbox.";
                    }
                });
            },
            (err) => {
                this.submitMessageVisible.value = true;
                this.submitMessage.textContent = "An error has occured.";

                this.submitButtonVisible.value = true;
            });
    }

}

export {UserRegister}
