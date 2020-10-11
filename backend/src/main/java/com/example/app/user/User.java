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
        this.copyTo(l_cpy);
        return l_cpy;
    }

    public void copyTo(User p_target)
    {
        p_target.id = this.id;
        p_target.username = this.username;
        p_target.password = this.password;
        p_target.email = this.email;
        p_target.isValidated = this.isValidated;
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
        else if(!ValidationMessage.string_isValidEmail(this.email))
        {
            in_out_validationFunctionalError.code = "USER_EMAIL_INVALIDFORMAT";
            return false;
        }
        return true;
    }
}
