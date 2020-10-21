package com.example.app.dish;

import com.example.app.dish.domain.Dish;
import com.example.app.session.SessionErrorHandler;
import com.example.app.session.SessionService;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping(value = "/")
public class DishController {

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/dishes", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetDishes(
            @RequestParam("establishment_id") long p_establishmentId) {
        return ResponseEntity.ok().body(DishService.GetDishes(p_establishmentId));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/dish", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> PostDish(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("establishment_id") long p_establishmentId,
            @RequestParam(value = "dish_thumb", required = false) MultipartFile p_dishThumb,
            @RequestParam("dish") String p_dish
            ) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        Dish l_dish = Dish.parse(p_dish);
        l_dish.user_id = p_user_id;

        DishService.CreateDish(l_dish, p_establishmentId, p_dishThumb);
        return ResponseEntity.ok().body(null);
    }
}
