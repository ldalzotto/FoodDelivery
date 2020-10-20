package com.example.app.establishments.domain;
import com.example.main.FunctionalError;
import com.example.main.ValidationMessage;
import org.springframework.boot.json.BasicJsonParser;

import java.util.HashMap;
import java.util.Map;

public class Establishment {
    public long id;
    public String name;
    public long address_id;
    public String phone;
    public Long thumb_id;
    public long user_id;

    public Establishment copy()
    {
        Establishment l_return = new Establishment();
        l_return.id = this.id;
        l_return.name = this.name;
        l_return.address_id = this.address_id;
        l_return.phone = this.phone;
        l_return.thumb_id = this.thumb_id;
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
        else if(ValidationMessage.string_nullOrEmpty(this.phone))
        {
            in_out_validationFunctionalError.code = "ESTABLISHMENT_PHONE_EMPTY";
            return false;
        }

        return true;
    }

    public static Establishment parse(HashMap<String, Object> p_parsedJson)
    {
        if(p_parsedJson!=null)
        {
            Establishment l_establishment = new Establishment();
            l_establishment.id = (long)p_parsedJson.getOrDefault("id", 0L);
            l_establishment.name = (String) p_parsedJson.getOrDefault("name", null);
            l_establishment.address_id = (long)p_parsedJson.getOrDefault("address_id", 0L);
            l_establishment.thumb_id = (Long) p_parsedJson.getOrDefault("thumb_id", null);
            l_establishment.phone = (String) p_parsedJson.getOrDefault("phone", null);
            return l_establishment;
        }
        return null;
    }
}
