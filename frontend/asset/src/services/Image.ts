import { Server } from "../server/Server.js";

class ImageUrl {
    public image_id : number;
    public url : string;

    public static buildUrlForId(p_image_id: number): ImageUrl
    {
        let l_image_url: ImageUrl = new ImageUrl();
        l_image_url.image_id = p_image_id;
        l_image_url.url = `http://localhost:8080/image?image_id=${l_image_url.image_id}`;
        return l_image_url;
    }
}

class ImageService
{
    public static postImage(p_image: File, p_onCompleted: (p_image: ImageUrl) => void, p_error: () => (void))
    {
        let l_formData: FormData = new FormData();
        l_formData.append("file", p_image);
        Server.SendRequest_Form("POST", "http://localhost:8080/image", l_formData, false, p_onCompleted, p_error);
    }
}

export { ImageUrl, ImageService }