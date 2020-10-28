package com.example.app.dish;

import com.example.app.dish.domain.Dish;
import com.example.app.dish.domain.DishDelta;
import com.example.app.dish.domain.DishGet;
import com.example.app.establishments.EstablishmentService;
import com.example.app.establishments.domain.EstablishmentDishExecutionType;
import com.example.app.session.SessionErrorHandler;
import com.example.app.session.SessionService;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping(value = "/")
public class DishController {

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/dishes", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetDishes(
            @CookieValue(value = "session_user_id", required = false) Long p_user_id,
            @RequestParam(value = "establishment_id", required = false) Long p_establishmentId,
            @RequestParam(value = "calculations", required = false) String p_calculations) {

        List<DishCalculationType> l_calculations = DishCalculationType.parseString(p_calculations);

        if(p_establishmentId!=null)
        {
            return ResponseEntity.ok().body(DishService.GetDishes_FromEstablishmentId(p_establishmentId, l_calculations));
        }
        else if(p_user_id!=null)
        {
            return ResponseEntity.ok().body(DishService.GetDishes_FromUserId(p_user_id, l_calculations));
        }
        else
        {
            return ResponseEntity.ok().body(null);
        }
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/dish", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetDish(
            @RequestParam(value = "dish_id", required = false) Long p_dish_id,
            @RequestParam(value = "calculations", required = false) String p_calculations) {

        List<DishCalculationType> l_calculations = DishCalculationType.parseString(p_calculations);

        if(p_dish_id!=null)
        {
            return ResponseEntity.ok().body(DishService.GetDish(p_dish_id, l_calculations));
        }
        else
        {
            return ResponseEntity.ok().body(null);
        }
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/dishes-with-excluded", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetDishesWithExcluded(
            @CookieValue(value = "session_user_id", required = false) Long p_user_id,
            @RequestParam("establishment_id") Long p_establishmentId,
            @RequestParam(value = "calculations", required = false) String p_calculations) {

        List<DishCalculationType> l_calculations = DishCalculationType.parseString(p_calculations);
        return ResponseEntity.ok().body(DishService.GetDished_FromEstablishmentId_Including_AssociatedUserId(p_establishmentId, p_user_id, l_calculations));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/dish", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> PostDish(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
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

        DishService.CreateDish(l_dish, p_dishThumb);
        return ResponseEntity.ok().body(null);
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/dish/update", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> UpdateDish(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("dish_id") long p_dish_id,
            @RequestParam(value = "dish_thumb", required = false) MultipartFile p_dishThumb,
            @RequestParam("dish") String p_dishDelta
    ) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        DishDelta l_dishDelta = DishDelta.parse(p_dishDelta);

        DishService.UpdateDish(p_dish_id, l_dishDelta);
        return ResponseEntity.ok().body(null);
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/dish/establishment-update", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> LinkDishToEstablishmentUpdate(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("dish_id") long p_dish_id,
            @RequestParam("calculation") int p_calculation,
            @RequestBody() Long[] p_linkedEstablishments) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        EstablishmentDishExecutionType l_calculation = EstablishmentDishExecutionType.fromInt(p_calculation);

        if(l_calculation == EstablishmentDishExecutionType.ADD)
        {
            DishService.AddLinkDishAndEstablishment(p_dish_id, p_linkedEstablishments);
        }
        else
        {
            DishService.RemoveLinkDishAndEstablishment(p_dish_id, p_linkedEstablishments);
        }

        return ResponseEntity.ok().body(null);
    }


    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/dish/delete", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> DeleteDish(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("dish_id") long p_dish_id
    ) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        DishService.DeleteDish(p_dish_id);
        return ResponseEntity.ok().body(null);
    }
}
