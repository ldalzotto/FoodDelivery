import {MWatcher} from './binding/Binding.js'

class UserState
{
    private _isLoggedIn : boolean;
    public isLoggedIn_watcher : MWatcher<boolean>;
    public user_id : number;

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
}

var GUserState : UserState = new UserState();

export {GUserState};