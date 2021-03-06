class ServerError
{
    public status : number;
    public code : string;
    public message : string;
}

class Server
{
    public static SendRequest_Json(p_verb : string, p_url : string, p_input : any, p_withCredentials ?: boolean, ok_callback ?: (p_responsebody : any)=>void, error_callback ?: (p_serverError : ServerError)=>void)
    {
        let xhr : XMLHttpRequest = new XMLHttpRequest();
        xhr.open(p_verb, p_url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        if(p_withCredentials)
        {
            xhr.withCredentials = true;
        }
        
        xhr.onreadystatechange = function()
        {
            if(this.readyState == XMLHttpRequest.DONE)
            {

                if(this.status == 200)
                {
                    if(ok_callback)
                    {
                        if((xhr.response as string).length == 0)
                        {
                            ok_callback(null);
                        }
                        else
                        {
                            ok_callback(JSON.parse(xhr.response));
                        }
                        
                    }
                }
                else
                {
                    if(error_callback)
                    {
                        let l_error : ServerError = null;
                        if((xhr.response as string).length == 0)
                        {
                            l_error = new ServerError();
                        }
                        else
                        {
                            l_error = JSON.parse(xhr.response);
                        }
                        
                        l_error.status = xhr.status;
                        error_callback(l_error);
                    }
                }
            }
        }
    
        xhr.send(JSON.stringify(p_input));
    }


    public static SendRequest_Form(p_verb : string, p_url : string, p_formData : FormData, p_withCredentials ?: boolean, ok_callback ?: (p_responsebody : any)=>void, error_callback ?: (p_serverError : ServerError)=>void)
    {
        let xhr : XMLHttpRequest = new XMLHttpRequest();
        xhr.open(p_verb, p_url, true);
        if(p_withCredentials)
        {
            xhr.withCredentials = true;
        }
        
        xhr.onreadystatechange = function()
        {
            if(this.readyState == XMLHttpRequest.DONE)
            {

                if(this.status == 200)
                {
                    if(ok_callback)
                    {
                        if((xhr.response as string).length == 0)
                        {
                            ok_callback(null);
                        }
                        else
                        {
                            ok_callback(JSON.parse(xhr.response));
                        }
                        
                    }
                }
                else
                {
                    if(error_callback)
                    {
                        let l_error : ServerError = null;
                        if((xhr.response as string).length == 0)
                        {
                            l_error = new ServerError();
                        }
                        else
                        {
                            l_error = JSON.parse(xhr.response);
                        }
                        
                        l_error.status = xhr.status;
                        error_callback(l_error);
                    }
                }
            }
        }
    
        xhr.send(p_formData);
    }
}

export {ServerError, Server}