import {UserService} from "../services/User.js"
import {Navigation} from "../services/Navigation.js"
import {Observable, BindingUtils} from "../binding/Binding.js"

class RegisterValidationPage extends HTMLElement
{
    static readonly Type : string = "register-validation-page";

    private errorMessageElement : HTMLDivElement;

    private errorMessageElementVisible : Observable<boolean>;

    constructor(p_userId : string, p_sessionToken : string)
    {
        super();        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append((document.getElementById(RegisterValidationPage.Type) as HTMLTemplateElement).content.cloneNode(true));

        this.errorMessageElementVisible = new Observable(false);
        this.errorMessageElement = this.shadowRoot.getElementById("error-message") as HTMLDivElement;

        BindingUtils.bindDisplayStyle(this.errorMessageElement, this.errorMessageElementVisible);


        UserService.Validate(p_userId, p_sessionToken, 
                () => {
                    Navigation.MoveToLoginPage();
                },
                () => {
                    this.errorMessageElementVisible.value = true;
                    this.errorMessageElement.textContent = "An error has occured while validating.";
                }
            );
    }
}

customElements.define(RegisterValidationPage.Type, RegisterValidationPage);

export {RegisterValidationPage}