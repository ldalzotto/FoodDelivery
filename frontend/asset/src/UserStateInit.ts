import {GUserState} from './UserState.js'
import {LoginService} from './services/Login.js'

function GUserState_Init()
{
    if(!GUserState.isLoggedIn)
    {
        LoginService.LoginUser_FromCookies();
    }
}

export {GUserState_Init}