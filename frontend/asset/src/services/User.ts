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
    static PostUser(p_user : PostUserInput, p_ok ?: (err : User)=>void, p_err ?: (err : ServerError)=>void)
    {
        Server.SendRequest("POST", "http://localhost:8080/user", p_user, 
            (p_insertedUser : User) => {
                GUserState.user = p_insertedUser;
                if(p_ok){p_ok(p_insertedUser);}
            },
            p_err
        );
    }
}

export {UserService}