import { router, Navigation_Constants } from "../app.js";

class Navigation 
{
    static MoveToRootpage()
    {
        router.navigate(Navigation_Constants.RootPath);
    }
    
    static MoveToLoginPage()
    {
        router.navigate(Navigation_Constants.LoginPath);
    }
    
    static MoveToProfilePage()
    {
        router.navigate(Navigation_Constants.ProfilePath);
    }
    
    static MoveToRegisterPage()
    {
        router.navigate(Navigation_Constants.RegisterPath);
    }

    static MoveToEatPage()
    {
        router.navigate(Navigation_Constants.EatPath);
    }
}


export {Navigation}