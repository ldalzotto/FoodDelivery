import {MObservable} from './binding/Binding.js'

class UserState
{
    public isLoggedIn : MObservable<boolean>;
    public user_id : number;

    constructor()
    {
        this.isLoggedIn = new MObservable<boolean>(false);
    }
}

var GUserState : UserState = new UserState();

export {GUserState};