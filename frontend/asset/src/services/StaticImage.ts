import { Server, ServerError } from "../server/Server.js";

class StaticImageService
{
    /* 
    public static PostStaticImage(p_file : File, p_onSuccess : (p_staticImage : StaticImage) => void, p_onError : (p_error : ServerError) => void )
    {
        let l_formData : FormData = new FormData();
        l_formData.append("image", p_file);
        Server.SendRequest_Form("POST", "http://localhost:80800/image", l_formData, false, p_onSuccess, p_onError);
    }
    */
}

class StaticImage
{
    public image_id : number;
}

export {StaticImageService, StaticImage}