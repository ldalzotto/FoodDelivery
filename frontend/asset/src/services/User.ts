import {ServerError, Server} from "../server/Server.js"
import {GUserState, User} from "../UserState.js"

class PostUserInput
{
    public username:string;
    public password:string;
    public email:string;
}



class UserService
{
    static PostUser(p_user : PostUserInput, p_ok ?: (p_user : User)=>void, p_err ?: (err : ServerError)=>void)
    {
        Server.SendRequest("POST", "http://localhost:8080/user/register", p_user, false, 
            (pp_user : User) => {
                if(p_ok){p_ok(pp_user);}
            },
            p_err
        );
    }

    static GetUser(p_ok ?: (p_user : User)=>void, p_err ?: (err : ServerError)=>void)
    {
        Server.SendRequest("GET", "http://localhost:8080/user", null, true, p_ok, p_err);
    }

    static Validate(p_userId : string, p_sessionToken : string, p_ok ?: ()=>void, p_err ?: (err:ServerError)=>void)
    {
        Server.SendRequest("POST", `http://localhost:8080/user/validate?userId=${p_userId}&sessionToken=${p_sessionToken}`, null, false,
            p_ok, p_err);
    }
}

export {UserService}