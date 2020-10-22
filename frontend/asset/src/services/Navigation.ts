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

    static MoveToEstablishmentDetailPage(p_establishmentId : number)
    {
        router.navigate(`${Navigation_Constants.Profile_EstablishmentDetailPath}?establishmentId=${p_establishmentId}`);
    }

    static MoveToEatPage()
    {
        router.navigate(Navigation_Constants.EatPath);
    }
}

class ProfileNavigation{

    static MoveToEstablishment()
    {
        router.navigate(Navigation_Constants.Profile_EstablishmentsPath);
    }
    
    static MoveToDishes()
    {
        router.navigate(Navigation_Constants.Profile_DishesPath);
    }
}


export {Navigation, ProfileNavigation}