class ServerError
{
    public status : number;
    public code : string;
    public message : string;
}

class Server
{
    static SendRequest(p_verb : string, p_url : string, p_input : any, ok_callback ?: (p_responsebody : any)=>void, error_callback ?: (p_serverError : ServerError)=>void)
    {
        let xhr : XMLHttpRequest = new XMLHttpRequest();
        xhr.open(p_verb, p_url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        
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
}

export {ServerError, Server}