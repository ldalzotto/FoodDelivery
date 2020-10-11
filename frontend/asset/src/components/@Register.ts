import {userLogin_init} from "./UserLogin.js"
import {pageHeader_init} from "./PageHeader.js"
import {UserRegister} from "./UserRegister.js"

function RegisterComponents()
{
    userLogin_init();
    pageHeader_init();
    UserRegister.Initialize();
}

export {RegisterComponents}