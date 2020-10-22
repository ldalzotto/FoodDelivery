package com.example.app.dish.domain;

import com.example.app.establishments.domain.Establishment;
import org.springframework.boot.json.BasicJsonParser;

import java.util.HashMap;

public class Dish {
    public long id;
    public String name;
    public double price;
    public long thumb_id;
    public long user_id;

    public static Dish parse(HashMap<String, Object> p_parsedJson)
    {
        if(p_parsedJson!=null)
        {
            Dish l_dish = new Dish();
            l_dish.id = (long)p_parsedJson.getOrDefault("id", 0L);
            l_dish.name = (String) p_parsedJson.getOrDefault("name", null);
            l_dish.price = (double)p_parsedJson.getOrDefault("price", 0D);
            l_dish.thumb_id = (long) p_parsedJson.getOrDefault("thumb_id", 0L);
            l_dish.user_id = (long) p_parsedJson.getOrDefault("user_id", 0L);
            return l_dish;
        }
        return null;
    }

    public static Dish parse(String p_jsonString)
    {
        return Dish.parse((HashMap<String, Object>)new BasicJsonParser().parseMap(p_jsonString));
    }
}
