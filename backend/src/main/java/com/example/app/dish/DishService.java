package com.example.app.dish;

import com.example.app.dish.domain.Dish;
import com.example.app.dish.domain.DishDelta;
import com.example.app.dish.domain.DishGet;
import com.example.app.image.ImageQuery;
import com.example.app.image.domain.ImageCreated;
import com.example.app.image.domain.ImageUrl;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class DishService {
    public static DishGet GetDishes_FromEstablishmentId(long p_establishementId, List<DishCalculationType> p_calculations)
    {
        DishGet l_dishGet = new DishGet();
        l_dishGet.setDishes(DishQuery.GetDishes_From_Establishment(p_establishementId));
        DishService.processEstablishmentGetCalculations(l_dishGet, p_calculations);
        return l_dishGet;
    }
    public static DishGet GetDishes_FromUserId(long p_userId, List<DishCalculationType> p_calculations)
    {
        DishGet l_dishGet = new DishGet();
        l_dishGet.setDishes(DishQuery.GetDishes_From_User(p_userId));
        DishService.processEstablishmentGetCalculations(l_dishGet, p_calculations);
        return l_dishGet;
    }
    public static void CreateDish(Dish p_dish, MultipartFile p_dishThumb)
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
        DishQuery.InsertDish(p_dish);
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

    public static void processEstablishmentGetCalculations(DishGet p_dishGet, List<DishCalculationType> p_calculations)
    {
        for(int i=0;i<p_calculations.size();i++)
        {
            switch(p_calculations.get(i))
            {
                case RETRIEVE_THUMBNAIL:
                {
                    if(p_dishGet !=null)
                    {
                        List<Dish> l_dishes = p_dishGet.getDishes();
                        if(l_dishes!=null)
                        {
                            Set<Long> l_distinctThumbnails = new HashSet<>();
                            for(int j=0;j<l_dishes.size();j++)
                            {
                                if(l_dishes.get(j).thumb_id != null)
                                {
                                    l_distinctThumbnails.add(l_dishes.get(j).thumb_id);
                                }
                            }

                            if(l_distinctThumbnails.size() > 0)
                            {
                                List<ImageUrl> l_establishmentThumb = new ArrayList<>();
                                for(Long l_thumbId : l_distinctThumbnails)
                                {
                                    l_establishmentThumb.add(new ImageUrl(l_thumbId));
                                }
                                p_dishGet.setThumbnails(l_establishmentThumb);

                                long[] l_dish_TO_thumb = new long[l_dishes.size()];

                                for(int j=0;j<l_dishes.size();j++) {
                                    Dish l_dish = l_dishes.get(j);
                                    if(l_dish.thumb_id!=null)
                                    {
                                        for(int k=0;k<l_establishmentThumb.size();k++)
                                        {
                                            if(l_establishmentThumb.get(k).image_id == l_dish.thumb_id)
                                            {
                                                l_dish_TO_thumb[j] = k;
                                                break;
                                            }
                                            l_dish_TO_thumb[j] = -1;
                                        }
                                    }
                                    else
                                    {
                                        l_dish_TO_thumb[j] = -1;
                                    }
                                }

                                p_dishGet.setDishToThumbnail(l_dish_TO_thumb);
                            }
                        }
                    }
                }
                break;
            }
        }
    }
}
