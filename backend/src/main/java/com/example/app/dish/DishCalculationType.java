package com.example.app.dish;

import java.util.ArrayList;
import java.util.List;


public enum DishCalculationType {
    RETRIEVE_THUMBNAIL;

    public static List<DishCalculationType> parseString(String p_types)
    {
        if(p_types!=null)
        {
            String[] l_str = p_types.split(",");
            if(l_str.length > 0)
            {
                List<DishCalculationType> l_calcuations = new ArrayList<>(l_str.length);

                for(int i=0;i<l_str.length;i++)
                {
                    l_calcuations.add(DishCalculationType.valueOf(l_str[i]));
                }

                return l_calcuations;
            }
        }

        return null;
    }
}

