package com.example.app.establishments.domain;

import org.springframework.boot.json.BasicJsonParser;

import java.util.HashMap;
import java.util.Map;

public class EstablishmentAddress {
    public long id;
    public String street_full_name;
    public long city_id;
    public double lat;
    public double lng;

    public EstablishmentAddress copy()
    {
        EstablishmentAddress l_addr = new EstablishmentAddress();
        l_addr.id = this.id;
        l_addr.street_full_name = this.street_full_name;
        l_addr.city_id = this.city_id;
        l_addr.lat = this.lat;
        l_addr.lng = this.lng;
        return l_addr;
    }

    public static EstablishmentAddress parse(HashMap<String, Object> p_parsedJson)
    {
        if(p_parsedJson!=null)
        {
            EstablishmentAddress l_establishment = new EstablishmentAddress();
            l_establishment.id = (long)p_parsedJson.getOrDefault("id", 0L);
            l_establishment.street_full_name = (String) p_parsedJson.getOrDefault("street_full_name", null);
            l_establishment.city_id = (long)p_parsedJson.getOrDefault("city_id", 0L);
            l_establishment.lat = (double) p_parsedJson.getOrDefault("lat", 0.0d);
            l_establishment.lng = (double) p_parsedJson.getOrDefault("lng", 0.0d);
            return l_establishment;
        }
        return null;
    }
}
