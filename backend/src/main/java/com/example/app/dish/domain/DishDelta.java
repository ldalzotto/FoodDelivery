package com.example.app.dish.domain;

import org.springframework.boot.json.BasicJsonParser;

import java.util.HashMap;

public class DishDelta {
    public String name;
    public Double price;

    public static DishDelta parse(HashMap<String, Object> p_parsedJson)
    {
        if(p_parsedJson!=null)
        {
            DishDelta l_dish = new DishDelta();
            l_dish.name = (String) p_parsedJson.getOrDefault("name", null);
            l_dish.price = (Double)p_parsedJson.getOrDefault("price", null);
            return l_dish;
        }
        return null;
    }

    public static DishDelta parse(String p_jsonString)
    {
        return DishDelta.parse((HashMap<String, Object>)new BasicJsonParser().parseMap(p_jsonString));
    }
}
