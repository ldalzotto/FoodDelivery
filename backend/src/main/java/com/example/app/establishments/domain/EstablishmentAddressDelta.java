package com.example.app.establishments.domain;

import org.springframework.boot.json.BasicJsonParser;

import java.util.HashMap;

public class EstablishmentAddressDelta {
    public String street_full_name;
    public Long city_id;
    public Double lat;
    public Double lng;


    public static EstablishmentAddressDelta parse(HashMap<String, Object> p_parsedJson)
    {
        if(p_parsedJson!=null)
        {
            EstablishmentAddressDelta l_establishmentAddressDelta = new EstablishmentAddressDelta();
            l_establishmentAddressDelta.street_full_name = (String) p_parsedJson.getOrDefault("street_full_name", null);
            l_establishmentAddressDelta.city_id = (Long) p_parsedJson.getOrDefault("city_id", null);
            l_establishmentAddressDelta.lat = (Double) p_parsedJson.getOrDefault("lat", null);
            l_establishmentAddressDelta.lng = (Double) p_parsedJson.getOrDefault("lng", null);
            return l_establishmentAddressDelta;
        }
        return null;
    }

    public static EstablishmentAddressDelta parse(String p_parsedJson)
    {
        if(p_parsedJson != null)
        {
            return EstablishmentAddressDelta.parse((HashMap<String, Object>)new BasicJsonParser().parseMap(p_parsedJson));
        }
        return null;
    }

}
