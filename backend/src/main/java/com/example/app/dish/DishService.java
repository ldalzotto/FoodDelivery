package com.example.app.dish;

import com.example.app.dish.domain.*;
import com.example.app.establishments.EstablishmentQuery;
import com.example.app.image.ImageQuery;
import com.example.app.image.domain.ImageCreated;
import com.example.app.image.domain.ImageUrl;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

public class DishService {

    public static DishGet GetDish(long p_dishId, List<DishCalculationType> p_calculations)
    {
        DishGet l_dishGet = new DishGet();
        List<Dish> l_dishes = new ArrayList<>(1);
        l_dishes.add(DishQuery.GetDish(p_dishId));
        l_dishGet.setDishes(l_dishes);
        DishService.processEstablishmentGetCalculations(l_dishGet, p_calculations);
        return l_dishGet;
    }

    public static DishGet GetDishes_FromEstablishmentId(long p_establishementId, List<DishCalculationType> p_calculations)
    {
        DishGet l_dishGet = new DishGet();
        l_dishGet.setDishes(DishQuery.GetDishes_From_Establishment(p_establishementId));
        DishService.processEstablishmentGetCalculations(l_dishGet, p_calculations);
        return l_dishGet;
    }

    public static DishGet GetDished_FromEstablishmentId_Including_AssociatedUserId(long p_establishmentId, long p_userId,
                                                                                   List<DishCalculationType> p_calculations)
    {
        DishGet l_dishGet = new DishGet();
        l_dishGet.setDishes(DishQuery.GetDishes_From_User(p_userId));

        EstablishmentToDishes l_establishmentToDishes = EstablishmentQuery.GetEstablishmentToDish(p_establishmentId);
        List<Dish> l_all_dishes = l_dishGet.getDishes();

        long[] l_establishment_included_dishes = new long[l_establishmentToDishes.dish_id.size()];
        long[] l_establishment_excluded_dishes = new long[l_all_dishes.size() - l_establishmentToDishes.dish_id.size()];

        int l_establishment_included_dishes_counter = 0;
        int l_establishment_excluded_dishes_counter = 0;

        for(int j=0;j<l_all_dishes.size();j++) {
            Dish l_dish = l_all_dishes.get(j);
            boolean l_dishMatched = false;
            for(int i = 0; i< l_establishmentToDishes.dish_id.size(); i++)
            {
                if(l_establishmentToDishes.dish_id.get(i) == l_dish.id)
                {
                    l_dishMatched = true;
                    break;
                }
            }
            if(l_dishMatched)
            {
                l_establishment_included_dishes[l_establishment_included_dishes_counter] = j;
                l_establishment_included_dishes_counter += 1;
            }
            else
            {
                l_establishment_excluded_dishes[l_establishment_excluded_dishes_counter] = j;
                l_establishment_excluded_dishes_counter += 1;
            }
        }

        l_dishGet.setDishesIncludedInEstablishment(l_establishment_included_dishes);
        l_dishGet.setDishesExcludedInEstablishment(l_establishment_excluded_dishes);

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

    public static void UpdateDish(long p_dish_id, DishDelta p_dishDelta, byte[] l_dishThumb)
    {
        Dish l_dish = DishQuery.GetDish(p_dish_id);
        if(p_dishDelta.name!=null){ l_dish.name = p_dishDelta.name; }
        if(p_dishDelta.price != null) { l_dish.price = p_dishDelta.price; }
        if(l_dishThumb!=null)
        {
            ImageCreated l_dishThumb_created = ImageQuery.PostImage(l_dishThumb);
            l_dish.thumb_id = l_dishThumb_created.image_id;
        }
        DishQuery.UpdateDish(l_dish);
    }

    public static void DeleteDish(long p_dish_id)
    {
        DishQuery.DeleteDish(p_dish_id);
    }

    public static void AddLinkDishAndEstablishment(long p_dish_id, Long[] p_establishments_id)
    {
        if(p_establishments_id != null)
        {
            if(DishQuery.DoesDishExists(p_dish_id))
            {
                List<Long> p_establishments = EstablishmentQuery.CheckEstablishmentsExistence(Arrays.asList(p_establishments_id));
                DishToEstablishments l_dish_to_establishments = DishQuery.GetDishToEstablishments(p_dish_id);
                List<Long> l_added_establishments = new ArrayList<>();
                for(int i=0;i<p_establishments.size();i++)
                {
                    if(!l_dish_to_establishments.establishment_id.contains(p_establishments.get(i)))
                    {
                        l_added_establishments.add(p_establishments.get(i));
                    }
                }

                if(l_added_establishments.size() > 0)
                {
                    DishQuery.CreateLinkBetween_Dish_And_Establishment_Bulk(p_dish_id, l_added_establishments);
                }
            }
        }
    }

    public static void RemoveLinkDishAndEstablishment(long p_dish_id, Long[] p_establishments_id)
    {
        if(p_establishments_id != null)
        {
            DishQuery.DeleteLinkBetween_Dish_And_Establishment_Bulk(p_dish_id, Arrays.asList(p_establishments_id));
        }
    }

    public static void processEstablishmentGetCalculations(DishGet p_dishGet, List<DishCalculationType> p_calculations)
    {
        if(p_calculations!=null)
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
}
