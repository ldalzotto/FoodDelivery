
class LoginInput
{
    username;
    password;
}

const LoginUser = function(p_loginInput, c_on200, c_on400, c_on500, c_else)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onreadystatechange = function()
    {
        if(this.readyState == XMLHttpRequest.DONE)
        {
            if(this.status == 200)
            {
                c_on200(xhr.response);
            }
            else if(this.status == 400)
            {
                if(c_on400)
                {
                    c_on400(xhr.response);
                }
            }
            else if(this.status == 500)
            {
                if(c_on500)
                {
                    c_on500(xhr.response);
                }
            }
            else
            {
                if(c_else)
                {
                    c_else(xhr.response);
                }
            }
        }
    }

    xhr.send(JSON.stringify(p_loginInput));
}

export {LoginInput, LoginUser}