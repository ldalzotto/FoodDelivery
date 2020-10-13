import {LoadingButtonV2} from "../components_graphic/LoadingButton.js"
import { ServerError } from "../server/Server.js";
import {EstablishmentService} from "../services/Establishment.js"


class ProfileEstablishmentContext extends HTMLElement
{
    static readonly Type : string = "profile-establishment-context";

    private createEstablishmentButton : LoadingButtonV2;

    static Initialize()
    {
        customElements.define(ProfileEstablishmentContext.Type, ProfileEstablishmentContext);
    }

    constructor()
    {
        super()

        this.attachShadow({mode: 'open'});
        let l_template : HTMLTemplateElement = document.getElementById(ProfileEstablishmentContext.Type) as HTMLTemplateElement;
        this.shadowRoot.append(l_template.content.cloneNode(true));
        this.createEstablishmentButton = new LoadingButtonV2(this.shadowRoot.querySelector(`${LoadingButtonV2.Type}#establishment-creation`), (p_onCompleted) => {this.createEstablishment(p_onCompleted);});   
    }

    createEstablishment(p_onCompleted : ()=>void)
    {
        console.log("onCreateEstablishmentButtonClicked");
        EstablishmentService.CreateEstablishment("fafaf", "efafaef", "egfgagg", 
        p_onCompleted, 
        (err : ServerError) => { 
            console.error(`${err.code} ${err.message}`);
            p_onCompleted(); 
        }
        );
        
    }

}

export {ProfileEstablishmentContext}
