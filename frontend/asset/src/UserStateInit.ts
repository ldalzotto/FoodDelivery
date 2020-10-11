import {GUserState} from './UserState.js'
import {GetSessionFromCookie} from './services/Login.js'

function GUserState_Init()
{
    if(!GUserState.isLoggedIn)
    {
        let l_session = GetSessionFromCookie();
        if(l_session.token && l_session.token.length !== 0 && l_session.user_id && l_session.user_id.length !== 0)
        {
            GUserState.isLoggedIn = true;
        }
    }
}

export {GUserState_Init}