package com.example.app.establishments.domain;

import org.springframework.boot.json.BasicJsonParser;

import java.util.HashMap;
import java.util.Map;

public class EstablishmentWithAddressDelta {
    public EstablishmentDelta establishment;
    public EstablishmentAddressDelta establishment_address;

    public static EstablishmentWithAddressDelta parse(String p_establishmentDelta)
    {
        Map<String, Object> l_parsedObject = new BasicJsonParser().parseMap(p_establishmentDelta);
        EstablishmentWithAddressDelta l_delta = new EstablishmentWithAddressDelta();
        l_delta.establishment = EstablishmentDelta.parse((HashMap<String, Object>)l_parsedObject.getOrDefault("establishment", null));
        l_delta.establishment_address = EstablishmentAddressDelta.parse((HashMap<String, Object>)l_parsedObject.getOrDefault("establishment_address", null));
        return l_delta;
    }
}
