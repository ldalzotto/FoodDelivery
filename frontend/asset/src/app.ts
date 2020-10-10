import {UserLogin_initialize} from "./components/UserLogin.js"
import {GUserState_Init} from "./UserStateInit.js"

class MainApp extends HTMLElement
{
    constructor()
    {
        super();        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append((document.getElementById("main-app") as HTMLTemplateElement).content.cloneNode(true));
    }
}

customElements.define('main-app', MainApp);
UserLogin_initialize();




GUserState_Init();