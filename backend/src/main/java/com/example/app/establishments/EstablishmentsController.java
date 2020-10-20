package com.example.app.establishments;

import com.example.app.establishments.domain.EstablishmentAddress;
import com.example.app.establishments.domain.EstablishmentWithAddress;
import com.example.app.establishments.domain.EstablishmentWithAddressDelta;
import com.example.app.session.SessionErrorHandler;
import com.example.app.session.SessionService;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping(value = "/")
public class EstablishmentsController {

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishment", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> CreateEstablishment(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("establishment") String p_establishment,
            @RequestParam(value = "establishment_thumb", required = false) MultipartFile p_thumbImage) {

        EstablishmentWithAddress l_establishment = EstablishmentWithAddress.parse(p_establishment);

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
        l_establishment.establishment.user_id = p_user_id;
        return ResponseEntity.ok().body(EstablishmentService.InsertEstablishment(l_establishment, p_thumbImage));
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
            @RequestParam("establishment_delta") String p_establishmentDelta) {

        EstablishmentWithAddressDelta l_establishmentDelta = EstablishmentWithAddressDelta.parse(p_establishmentDelta);
        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        EstablishmentService.UpdateEstablishment(p_establishment_id, l_establishmentDelta);
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
