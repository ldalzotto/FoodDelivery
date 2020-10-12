import {MWatcher} from './binding/Binding.js'
import {Cached} from "./binding/CachedValude.js"
import {UserService} from "./services/User.js"

class UserState
{
    private _isLoggedIn : boolean;
    public isLoggedIn_watcher : MWatcher<boolean>;
    private _user : UserCached;

    constructor()
    {
        this._isLoggedIn = false;
        this.isLoggedIn_watcher = new MWatcher<boolean>(false);
        this._user = new UserCached();
    }

    get isLoggedIn(){return this._isLoggedIn;}
    set isLoggedIn(p_value : boolean){
        this._isLoggedIn = p_value;
        this.isLoggedIn_watcher.value = this._isLoggedIn;
    }

    get user() : UserCached {return this._user;}
    
}

class User
{
    public id : number;
    public isValidated : boolean;
}

class UserCached
{
    private _value : User;
    private _isValid : boolean;

    getValue(p_callback : (p_user : User) => void)
    {
        if(!this._isValid)
        {
            UserService.GetUser(
                (p_retrievedUser : User) => {
                    this._value = p_retrievedUser;
                    p_callback(this._value);
                }
                , null);
            this._isValid = true;
        }
        else
        {
            p_callback(this._value);
        }
    }

    pushValue(p_user : User)
    {
        this._value = p_user;
        this._isValid = true;
    }
}

var GUserState : UserState = new UserState();

export {GUserState, User};