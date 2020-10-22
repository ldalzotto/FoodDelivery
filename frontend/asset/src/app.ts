
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
import { EatPage } from "./pages/EatPage.js";
import { Profile_EstablishmentPage } from "./pages/Profile_EstablishmentPage.js";
import { EstablishmentDetailPage } from "./pages/ProfileEstablishmentDetailPage.js";
import { ProfileDishesPage } from "./pages/ProfileDishesPage.js";

RegisterComponentsGraphic();
RegisterComponents();
GUserState_Init();

var router : Router = new Router();

class Navigation_Constants
{
    static readonly RootPath : string = "/";
    static readonly LoginPath : string = "/login";
    static readonly ProfilePath : string = "/profile";
    static readonly Profile_EstablishmentsPath : string = "/profile/establishments";
    static readonly Profile_EstablishmentDetailPath : string = "/profile/establishment-detail";
    static readonly Profile_DishesPath : string = "/profile/dishes";
    static readonly RegisterPath : string = "/register";
    static readonly RegisterValidatePath : string = "/register/validation";
    static readonly EatPath : string = "/eat";
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

router.add(new Route(Navigation_Constants.Profile_EstablishmentsPath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new Profile_EstablishmentPage());
    console.log("PROFILE_ESTABLISHMENT");
    return true;
}));

router.add(new Route(Navigation_Constants.Profile_EstablishmentDetailPath, (p_url : string) => {
    appElement.innerHTML = "";
    let l_queryParams = Router.extractQueryParams(p_url);
    appElement.appendChild(new EstablishmentDetailPage(parseInt(l_queryParams["establishmentId"])));
    console.log("PROFILE_ESTABLISHMENT_DETAIL");
    return true;
}));

router.add(new Route(Navigation_Constants.Profile_DishesPath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new ProfileDishesPage());
    console.log("PROFILE_DISHES");
    return true;
}));

router.add(new Route(Navigation_Constants.ProfilePath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new ProfilePage());
    console.log("PROFILE");
    return true;
}));

router.add(new Route(Navigation_Constants.EatPath, () => {
    appElement.innerHTML = "";
    appElement.appendChild(new EatPage());
    console.log("EAT");
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
