package com.example.app.user;

import com.example.main.FunctionalError;
import com.example.main.ValidationMessage;

public class User {
    public long id;
    public String username;
    public String password;
    public String email;
    public boolean isValidated;

    public User copy()
    {
        User l_cpy = new User();
        l_cpy.id = this.id;
        l_cpy.username = this.username;
        l_cpy.password = this.password;
        l_cpy.email = this.email;
        l_cpy.isValidated = this.isValidated;
        return l_cpy;
    }

    public boolean validate(FunctionalError in_out_validationFunctionalError)
    {
        if(ValidationMessage.string_nullOrEmpty(this.username))
        {
            in_out_validationFunctionalError.code = "USER_USERNAME_EMTPY";
            return false;
        }
        else if(ValidationMessage.string_nullOrEmpty(this.password))
        {
            in_out_validationFunctionalError.code = "USER_PASSWORD_EMTPY";
            return false;
        }
        else if(ValidationMessage.string_nullOrEmpty(this.email))
        {
            in_out_validationFunctionalError.code = "USER_EMAIL_EMTPY";
            return false;
        }
        return true;
    }
}
