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

function PushLoginCookie(p_loginResponse : LoginResponse)
{
    document.cookie = "session_token="+p_loginResponse.token+"; expires=" + new Date(p_loginResponse.expiration_time).toUTCString() + ";";
    document.cookie = "session_user_id="+p_loginResponse.user_id+"; expires=" + new Date(p_loginResponse.expiration_time).toUTCString() + ";";
}

class Session 
{
    public token : string;
    public user_id : string;
}

function getCookie(cname : string) {
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

function GetSessionFromCookie() : Session
{
    let l_session : Session = new Session();
    l_session.token = getCookie("session_token");
    l_session.user_id = getCookie("session_user_id");
    return l_session;
}

function LoginUser(p_loginInput : LoginInput, onCompleted : (err : ServerError) => (void))
{
    if(!GUserState.isLoggedIn)
    {
        Server.SendRequest("POST", "http://localhost:8080/login", p_loginInput,
            (res : LoginResponse) => {
                PushLoginCookie(res);
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

export {ServerError, LoginInput, LoginUser, GetSessionFromCookie}