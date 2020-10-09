package com.example.app.establishments;
import com.example.main.FunctionalError;
import com.example.main.ValidationMessage;

public class Establishment {
    public long id;
    public String name;
    public String address;
    public String phone;
    public long user_id;

    public Establishment copy()
    {
        Establishment l_return = new Establishment();
        l_return.id = this.id;
        l_return.name = this.name;
        l_return.address = this.address;
        l_return.phone = this.phone;
        l_return.user_id = this.user_id;
        return l_return;
    }

    public boolean validate(FunctionalError in_out_validationFunctionalError)
    {
        if(ValidationMessage.string_nullOrEmpty(this.name))
        {
            in_out_validationFunctionalError.code = "ESTABLISHMENT_NAME_EMPTY";
            return false;
        }
        else if(ValidationMessage.string_nullOrEmpty(this.address))
        {
            in_out_validationFunctionalError.code = "ESTABLISHMENT_ADDRESS_EMPTY";
            return false;
        }
        else if(ValidationMessage.string_nullOrEmpty(this.phone))
        {
            in_out_validationFunctionalError.code = "ESTABLISHMENT_PHONE_EMPTY";
            return false;
        }

        return true;
    }
}
