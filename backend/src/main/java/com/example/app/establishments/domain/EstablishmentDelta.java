package com.example.app.establishments.domain;

import org.springframework.boot.json.BasicJsonParser;

import java.util.HashMap;

public class EstablishmentDelta {
    public String name;
    public String phone;

    public static EstablishmentDelta parse(HashMap<String, Object> p_parsedJson)
    {
        if(p_parsedJson!=null)
        {
            EstablishmentDelta l_establishmentDelta = new EstablishmentDelta();
            l_establishmentDelta.name = (String) p_parsedJson.getOrDefault("name", null);
            l_establishmentDelta.phone = (String) p_parsedJson.getOrDefault("phone", null);
            return l_establishmentDelta;
        }
        return null;
    }

    public static EstablishmentDelta parse(String p_parsedJson)
    {
        return EstablishmentDelta.parse((HashMap<String, Object>)new BasicJsonParser().parseMap(p_parsedJson));
    }
}
