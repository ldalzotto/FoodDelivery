package com.example.app.dish;

import com.example.app.dish.domain.Dish;
import com.example.app.image.ImageQuery;
import com.example.app.image.domain.ImageCreated;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public class DishService {
    public static List<Dish> GetDishes(long p_establishementId)
    {
        return DishQuery.GetDishes_From_Establishment(p_establishementId);
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
}
