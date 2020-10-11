import {MWatcher} from './binding/Binding.js'

class UserState
{
    private _isLoggedIn : boolean;
    public isLoggedIn_watcher : MWatcher<boolean>;
    private _user : User;

    constructor()
    {
        this._isLoggedIn = false;
        this.isLoggedIn_watcher = new MWatcher<boolean>(false);
    }

    get isLoggedIn(){return this._isLoggedIn;}
    set isLoggedIn(p_value : boolean){
        this._isLoggedIn = p_value;
        this.isLoggedIn_watcher.value = this._isLoggedIn;
    }

    set user(p_user : User) { this._user = p_user; }
    get user() : User {return this._user;}
}

class User
{
    public id : number;
    public username : string;
    public password : string;
    public email : string;
    public isValidated : boolean;
}

var GUserState : UserState = new UserState();

export {GUserState, User};