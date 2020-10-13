import {BindingUtils} from "../binding/Binding.js"
import {Observable} from "../binding/Binding.js"
import {UserService} from "../services/User.js"
import { User } from "../UserState.js";
import {GUserState} from "../UserState.js"
import {LoadingButton} from "../components_graphic/LoadingButton.js"

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
    private submitButton : LoadingButton;
    private submitMessage : HTMLDivElement;

    private usernameObservable : Observable<string>;
    private passwordObservable : Observable<string>;
    private emailObservable : Observable<string>;
    private submitMessageVisible : Observable<boolean>;

    constructor()
    {
        super()

        let l_template : HTMLTemplateElement = document.getElementById(UserRegister.Type) as HTMLTemplateElement;
        this.appendChild(l_template.content.cloneNode(true));
        
        this.usernameInput = this.querySelector("#username") as HTMLInputElement;
        this.passwordInput = this.querySelector("#password") as HTMLInputElement;
        this.emailInput = this.querySelector("#email") as HTMLInputElement;
        this.submitButton = this.querySelector("#submit") as LoadingButton;
        this.submitButton.new((p_onComplented) => {this.sumitRegistration(p_onComplented);} );

        this.submitMessage = this.querySelector("#submit-message") as HTMLDivElement;

        this.usernameObservable = new Observable<string>("");
        this.passwordObservable = new Observable<string>("");
        this.emailObservable = new Observable<string>("");
        this.submitMessageVisible = new Observable<boolean>(false);

        BindingUtils.bindInputText(this.usernameInput, this.usernameObservable);
        BindingUtils.bindInputText(this.passwordInput, this.passwordObservable);
        BindingUtils.bindInputText(this.emailInput, this.emailObservable);

        BindingUtils.bindDisplayStyle(this.submitMessage, this.submitMessageVisible);

    }


    sumitRegistration(p_onCompleted: () => void)
    {
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
                        p_onCompleted();
                    }
                });
            },
            (err) => {
                this.submitMessageVisible.value = true;
                this.submitMessage.textContent = "An error has occured.";
                p_onCompleted();
            });
    }

}

export {UserRegister}
