import {UserLogin_initialize} from "./components/UserLogin.js"

class MainApp extends HTMLElement
{
    constructor()
    {
        super();        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(document.getElementById("main-app").content.cloneNode(true));
    }
}

customElements.define('main-app', MainApp);

UserLogin_initialize();
