import {userLogin_init} from "./UserLogin.js"
import {UserRegister} from "./UserRegister.js"
import {ProfileSelector} from "./ProfileSelector.js"
import {ProfileEstablishmentContext} from "./ProfileContextContent.js"
import {CitySelection} from "./CitySelection.js"

function RegisterComponents()
{
    userLogin_init();
    UserRegister.Initialize();
    ProfileEstablishmentContext.Initialize();
    // ProfileSelector.Initialize();
    // ProfileContextContent.Initialize();
}

export {RegisterComponents}