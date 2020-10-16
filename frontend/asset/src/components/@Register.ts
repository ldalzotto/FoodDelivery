import {userLogin_init} from "./UserLogin.js"
import {pageHeader_init} from "./PageHeader.js"
import {UserRegister} from "./UserRegister.js"
import {ProfileSelector, ProfileContextContent} from "./ProfileSelector.js"
import {ProfileEstablishmentContext} from "./ProfileContextContent.js"
import {CitySelection} from "./CitySelection.js"

function RegisterComponents()
{
    userLogin_init();
    pageHeader_init();
    UserRegister.Initialize();
    ProfileEstablishmentContext.Initialize();
    ProfileSelector.Initialize();
    ProfileContextContent.Initialize();
}

export {RegisterComponents}