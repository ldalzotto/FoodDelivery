package com.example.app.dish;

import com.example.app.dish.domain.Dish;
import com.example.app.dish.domain.DishDelta;
import com.example.app.image.ImageQuery;
import com.example.app.image.domain.ImageCreated;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public class DishService {
    public static List<Dish> GetDishes_FromEstablishmentId(long p_establishementId)
    {
        return DishQuery.GetDishes_From_Establishment(p_establishementId);
    }
    public static List<Dish> GetDishes_FromUserId(long p_userId)
    {
        return DishQuery.GetDishes_From_User(p_userId);
    }
    public static void CreateDish(Dish p_dish, long p_establishmentId, MultipartFile p_dishThumb)
    {
        if(p_dishThumb != null)
        {
            try {
                ImageCreated l_imageCreated = ImageQuery.PostImage(p_dishThumb.getBytes());
                p_dish.thumb_id = l_imageCreated.image_id;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        DishQuery.InsertDish(p_dish, p_establishmentId);
    }

    public static void UpdateDish(long p_dish_id, DishDelta p_dishDelta)
    {
        Dish l_dish = DishQuery.GetDish(p_dish_id);
        if(p_dishDelta.name!=null){ l_dish.name = p_dishDelta.name; }
        if(p_dishDelta.price != null) { l_dish.price = p_dishDelta.price; }
        DishQuery.UpdateDish(l_dish);
    }

    public static void DeleteDish(long p_dish_id)
    {
        DishQuery.DeleteDish(p_dish_id);
    }
}
