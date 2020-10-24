package com.example.app.dish.domain;

import com.example.app.image.domain.ImageUrl;

import java.util.HashMap;
import java.util.List;

public class DishGet extends HashMap<String, Object> {
    public void setDishes(List<Dish> p_dishes)
    {
        this.put("dishes", p_dishes);
    }
    public List<Dish> getDishes()
    {
        return (List<Dish>)this.getOrDefault("dishes", null);
    }

    public void setDishesIncludedInEstablishment(long[] p_dishesIncludedInEstablishment)
    {
        this.put("dishes_included_in_establishment", p_dishesIncludedInEstablishment);
    }
    public void setDishesExcludedInEstablishment(long[] p_dishesIncludedInEstablishment)
    {
        this.put("dishes_excluded_in_establishment", p_dishesIncludedInEstablishment);
    }

    public void setThumbnails(List<ImageUrl> p_thumbs)
    {
        this.put("thumbnails", p_thumbs);
    }

    public List<ImageUrl> getThumbnails()
    {
        return (List<ImageUrl>) this.getOrDefault("thumbnails", null);
    }

    public void setDishToThumbnail(long[] p_dishToThumb)
    {
        this.put("dish_TO_thumbnail", p_dishToThumb);
    }
    public long[] getDishToThumbnail()
    {
        return (long[])this.getOrDefault("dish_TO_thumbnail", null);
    }
}
