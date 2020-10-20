package com.example.app.establishments.domain;

import org.springframework.boot.json.BasicJsonParser;

import java.util.HashMap;
import java.util.Map;

public class EstablishmentWithAddress {
    public Establishment establishment;
    public EstablishmentAddress establishment_address;

    public static EstablishmentWithAddress parse(String p_jsonstr)
    {
        Map<String, Object> l_parsedObject = new BasicJsonParser().parseMap(p_jsonstr);
        EstablishmentWithAddress l_establishmentWithAddress = new EstablishmentWithAddress();
        l_establishmentWithAddress.establishment = Establishment.parse((HashMap<String, Object>) l_parsedObject.getOrDefault("establishment", null));
        l_establishmentWithAddress.establishment_address = EstablishmentAddress.parse((HashMap<String, Object>)l_parsedObject.getOrDefault("establishment_address", null));
        return l_establishmentWithAddress;
    }
}
