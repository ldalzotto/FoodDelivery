
import {WindowElement, WindowElement_ResizeEvent} from "./Window.js"
import {GUserState_Init} from "./UserStateInit.js"
import {Router, Route} from "./router/Router.js"

let appElement : HTMLElement = document.getElementById("app");

import {RegisterComponents} from "./components/@Register.js"
import {RegisterComponentsGraphic} from "./components_graphic/@Register.js"

import {RootPage} from "./pages/Root.js"
import {LoginPage} from "./pages/LoginPage.js"
import {ProfilePage} from "./pages/ProfilePage.js"
import {RegisterPage} from "./pages/RegisterPage.js"
import {RegisterValidationPage} from "./pages/RegisterValidationPage.js"

RegisterComponentsGraphic();
RegisterComponents();
GUserState_Init();

var router : Router = new Router();

class Navigation_Constants
{
    static readonly RootPath : string = "/";
    static readonly LoginPath : string = "/login";
    static readonly ProfilePath : string = "/profile";
    static readonly RegisterPath : string = "/register";
    static readonly RegisterValidatePath : string = "/register/validation";
}

router.add(new Route(Navigation_Constants.LoginPath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new LoginPage());
    console.log("LOGIN");
    return true;
}));

router.add(new Route(Navigation_Constants.RegisterValidatePath, (p_url : string) => {

    let l_queryParams = Router.extractQueryParams(p_url);

    appElement.innerHTML = "";
    appElement.appendChild(new RegisterValidationPage(l_queryParams["userId"], l_queryParams["sessionToken"]));
    console.log("REGISTER_VALIDATION");
    return true;
}));

router.add(new Route(Navigation_Constants.RegisterPath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new RegisterPage());
    console.log("REGISTER");
    return true;
}));

router.add(new Route(Navigation_Constants.ProfilePath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new ProfilePage());
    console.log("PROFILE");
    return true;
}));

router.add(new Route(Navigation_Constants.RootPath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new RootPage());
    console.log("ROOT");
    return true;
}));

router.interpretCurrentUrl();

export {router, Navigation_Constants};
