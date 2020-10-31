import { NearestEstablishments } from "../components/NearestEstablishments.js";
import { PageHeader } from "../components/PageHeader.js";
import { UserLocation, UserLocationSubmit_Event } from "../components/UserLocation.js";
import { ServerError } from "../framework/server/Server.js";
import { GUserState, User } from "../UserState.js"

class EatPage extends HTMLElement {
    static readonly Type: string = "eat-page";

    private contentElement : HTMLElement;

    constructor() {
        super();
        this.appendChild((document.getElementById(EatPage.Type) as HTMLTemplateElement).content.cloneNode(true));
        new PageHeader(this.querySelector(PageHeader.Type));
        this.contentElement = this.querySelector("#content");
        this.refresh();
    }

    private refresh()
    {
        this.contentElement.innerHTML = "";
    

        if (GUserState.isLoggedIn) {
            GUserState.user.getValue((p_user: User, p_err: ServerError | null) => {
                if (!p_user.coords) {
                    this.askUserLocation((p_event: UserLocationSubmit_Event) => {
                        p_user.coords = p_event.LatLng;
                        GUserState.user.pushValue(p_user);
                    });
                }
            });
        }
        else {
            if (!GUserState.localUserAddress) {
                this.askUserLocation((p_event: UserLocationSubmit_Event) => {
                    GUserState.localUserAddress = p_event.LatLng;
                    this.refresh();
                });
            }
            else
            {
                new NearestEstablishments(this.contentElement, GUserState.localUserAddress);
            }
        }
    }

    private askUserLocation(p_onLocationSubmitted: (p_event: UserLocationSubmit_Event) => void) {
        new UserLocation(this.contentElement);
        this.contentElement.addEventListener(UserLocationSubmit_Event.Type, p_onLocationSubmitted);
    }
}

customElements.define(EatPage.Type, EatPage);

export { EatPage }