
import {GUserState_Init} from "./UserStateInit.js"
import {Router, Route} from "./router/Router.js"

let appElement : HTMLElement = document.getElementById("app");

import {RegisterComponents} from "./components/Register.js"

import {RootPage} from "./pages/Root.js"
import {LoginPage} from "./pages/LoginPage.js"
import {ProfilePage} from "./pages/ProfilePage.js"


RegisterComponents();
GUserState_Init();

var router : Router = new Router();

class Navigation_Constants
{
    static readonly RootPath : string = "/";
    static readonly LoginPath : string = "/login";
    static readonly ProfilePath : string = "/profile";
}

router.add(new Route(Navigation_Constants.LoginPath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new LoginPage());
    console.log("LOGIN");
}));

router.add(new Route(Navigation_Constants.ProfilePath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new ProfilePage());
    console.log("PROFILE");
}));

router.add(new Route(Navigation_Constants.RootPath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new RootPage());
    console.log("ROOT");
}));

router.interpretCurrentUrl();

export {router, Navigation_Constants};
