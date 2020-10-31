import { UserService } from "../services/User.js"
import { Navigation } from "../services/Navigation.js"
import { Observable, BindingUtils } from "../framework/binding/Binding.js"
import { PageHeader } from "../components/PageHeader.js";

class RegisterValidationPage extends HTMLElement {
    static readonly Type: string = "register-validation-page";

    private errorMessageElement: HTMLDivElement;

    private errorMessageElementVisible: Observable<boolean>;

    constructor(p_userId: string, p_sessionToken: string) {
        super();
        this.appendChild((document.getElementById(RegisterValidationPage.Type) as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));

        this.errorMessageElementVisible = new Observable(false);
        this.errorMessageElement = this.querySelector("#error-message") as HTMLDivElement;

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

export { RegisterValidationPage }