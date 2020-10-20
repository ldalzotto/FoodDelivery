import {GUserState} from '../UserState.js'
import {ServerError, Server} from "../server/Server.js"


class LoginInput
{
    public username : string;
    public password : string;
}

class LoginResponse
{
    public token : string;
    public user_id : number;
    public expiration_time : number;
}



class Session 
{
    public token : string;
    public user_id : string;

    public isValid() : boolean
    {
        return this.token && this.token.length !== 0 && this.user_id && this.user_id.length !== 0;
    }
}

class LoginService
{
    private static PushLoginCookie(p_loginResponse : LoginResponse)
    {
        document.cookie = "session_token="+p_loginResponse.token+"; expires=" + new Date(p_loginResponse.expiration_time).toUTCString() + ";";
        document.cookie = "session_user_id="+p_loginResponse.user_id+"; expires=" + new Date(p_loginResponse.expiration_time).toUTCString() + ";";
    }

    private static DeleteLoginCookie()
    {
        document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "session_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }

    private static getCookie(cname : string) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
    
    private static GetSessionFromCookie() : Session
    {
        let l_session : Session = new Session();
        l_session.token = LoginService.getCookie("session_token");
        l_session.user_id = LoginService.getCookie("session_user_id");
        return l_session;
    }
    
    public static LoginUser(p_loginInput : LoginInput, onCompleted : (err : ServerError) => (void))
    {
        if(!GUserState.isLoggedIn)
        {
            Server.SendRequest_Json("POST", "http://localhost:8080/login", p_loginInput, false,
                (res : LoginResponse) => {
                    LoginService.PushLoginCookie(res);
                    GUserState.isLoggedIn = true;
                    onCompleted(null);
                },
                (err : ServerError) => {
                    onCompleted(err);
                }
            );
        }
        else
        {
            onCompleted(null);
        }
    }

    public static LoginUser_FromCookies()
    {
        let l_session = LoginService.GetSessionFromCookie();
        if(l_session.isValid())
        {
            GUserState.isLoggedIn = true;
        }
    }

    public static Logoutuser(p_success ?: ()=>(void), p_error ?: (p_serverError : ServerError) => (void))
    {
        if(GUserState.isLoggedIn)
        {
            Server.SendRequest_Json("POST", "http://localhost:8080/logout", null, true,
            (res : null) => {
                GUserState.isLoggedIn = false;
                GUserState.user.invalidate();
                LoginService.DeleteLoginCookie();
                //TODO -> clear cookies
                if(p_success)
                {
                    p_success();
                }
            },
            (p_serverError : ServerError) => {
                if(p_error)
                {
                    p_error(p_serverError);
                }
            })
        }
    }
}

class PostLogin_ErrorCodes
{
    public static readonly UserNotFound = "LOGIN_USER_NOT_FOUND";
    public static readonly IncorrectPassword = "LOGIN_INCORRECT_PASSWORD";
}


export {ServerError, LoginInput, LoginService, PostLogin_ErrorCodes}