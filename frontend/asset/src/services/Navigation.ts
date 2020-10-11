import { router, Navigation_Constants } from "../app.js";

function MoveToRootpage()
{
    router.navigate(Navigation_Constants.RootPath);
}

function MoveToLoginPage()
{
    router.navigate(Navigation_Constants.LoginPath);
}

function MoveToProfilePage()
{
    router.navigate(Navigation_Constants.ProfilePath);
}

export {Navigation_Constants, MoveToRootpage, MoveToLoginPage, MoveToProfilePage}