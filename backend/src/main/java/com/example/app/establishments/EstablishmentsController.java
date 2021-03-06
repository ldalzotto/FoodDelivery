package com.example.app.establishments;

import com.example.app.establishments.domain.*;
import com.example.app.session.SessionErrorHandler;
import com.example.app.session.SessionService;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping(value = "/")
public class EstablishmentsController {

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishment", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> CreateEstablishment(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam(Establishment.JSON_KEY) String p_establishment,
            @RequestParam(EstablishmentAddress.JSON_KEY) String p_establishmentAddress,
            @RequestParam(value = "establishment_thumb", required = false) MultipartFile p_thumbImage) {

        Establishment l_establishment = Establishment.parse(p_establishment);
        EstablishmentAddress l_establishmentAddress = EstablishmentAddress.parse(p_establishmentAddress);

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }
        //TODO
        /*
        if (!p_establishment.validate(l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }
        */

        byte[] l_thumbImage = null;
        if(p_thumbImage != null)
        {
            try {
                l_thumbImage = p_thumbImage.getBytes();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        l_establishment.user_id = p_user_id;
        EstablishmentService.InsertEstablishment(l_establishment, l_establishmentAddress, l_thumbImage);
        return ResponseEntity.ok().body(null);
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishment", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetEstablishment(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("establishment_id") long p_establishment_id,
            @RequestParam(value = "calculations", required = false) String p_calculations) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        return ResponseEntity.ok().body(EstablishmentService.GetEstablishment(p_establishment_id, p_user_id,
                EstablishmentCalculationType.parseString(p_calculations)));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishments", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetEstablishments(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam(value = "calculations", required = false) String p_calculations) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        return ResponseEntity.ok().body(EstablishmentService.GetEstablishments(p_user_id,
                EstablishmentCalculationType.parseString(p_calculations)));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishments-with-excluded", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetEstablishments(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("dish_id") long p_dish_id,
            @RequestParam(value = "calculations", required = false) String p_calculations) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        return ResponseEntity.ok().body(EstablishmentService.GetEstablishments_From_DishId_WithEcludedEstablishments(p_user_id, p_dish_id,
                EstablishmentCalculationType.parseString(p_calculations)));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/establishments/near", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetEstablishmentsNear(
            @RequestParam("lat") float p_lat,
            @RequestParam("lng") float p_lng,
            @RequestParam(value = "calculations", required = false) String p_calculations) {

        FunctionalError l_Functional_error = new FunctionalError();
        return ResponseEntity.ok().body(EstablishmentService.GetEstablishmentsNear(
               EstablishmentCalculationType.parseString(p_calculations),
               p_lat, p_lng));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishment/update", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> UpdateEstablishment(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("establishment_id") long p_establishment_id,
            @RequestParam(value = "establishment_delta", required = false) String p_establishmentDelta,
            @RequestParam(value = "establishment_address_delta", required = false) String p_establishmentAddressDelta,
            @RequestParam(value = "establishment_thumb_delta", required = false) MultipartFile p_establishmentThumb) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        EstablishmentDelta l_establishmentDelta = EstablishmentDelta.parse(p_establishmentDelta);
        EstablishmentAddressDelta l_establishmentAddressDelta = EstablishmentAddressDelta.parse(p_establishmentAddressDelta);
        byte[] l_establishmentThumb = null;
        if(p_establishmentThumb!=null)
        {
            try {
                l_establishmentThumb = p_establishmentThumb.getBytes();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        EstablishmentService.UpdateEstablishment(p_establishment_id, l_establishmentDelta, l_establishmentAddressDelta, l_establishmentThumb);
        return ResponseEntity.ok().body(null);
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishment/dish-update", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> LinkEstablishmentDishUpdate(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("establishment_id") long p_establishment_id,
            @RequestParam("calculation") int p_calculation,
            @RequestBody() Long[] p_linkedDishes) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        EstablishmentDishExecutionType l_calculation = EstablishmentDishExecutionType.fromInt(p_calculation);

        if(l_calculation == EstablishmentDishExecutionType.ADD)
        {
            EstablishmentService.AddLinkEstablishmentAndDish(p_establishment_id, p_linkedDishes);
        }
        else
        {
            EstablishmentService.RemoveLinkEstablishmentAndDish(p_establishment_id, p_linkedDishes);
        }

        return ResponseEntity.ok().body(null);
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishment/delete", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> DeleteEstablishment(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("establishment_id") long p_establishment_id) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        EstablishmentService.DeleteEstablishment(p_establishment_id);
        return ResponseEntity.ok().body(null);
    }

}
