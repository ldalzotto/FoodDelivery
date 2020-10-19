package com.example.app.establishments;

import java.util.ArrayList;
import java.util.List;

public enum EstablishmentCalculationType {
        DELIVERY_CHARGE, RETRIEVE_CITIES;

    public static List<EstablishmentCalculationType> parseString(String p_types)
    {
        if(p_types!=null)
        {
            String[] l_str = p_types.split(",");
            if(l_str.length > 0)
            {
                List<EstablishmentCalculationType> l_calcuations = new ArrayList<>(l_str.length);

                for(int i=0;i<l_str.length;i++)
                {
                    l_calcuations.add(EstablishmentCalculationType.valueOf(l_str[i]));
                }

                return l_calcuations;
            }
        }

        return null;
    }
}

