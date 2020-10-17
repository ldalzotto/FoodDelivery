package com.example.app.establishments;

import com.example.app.establishments.domain.EstablishmentWithAddress;
import com.example.app.establishments.domain.EstablishmentWithAddressDelta;
import com.example.app.session.SessionErrorHandler;
import com.example.app.session.SessionService;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/")
public class EstablishmentsController {

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishment", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> CreateEstablishment(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestBody EstablishmentWithAddress p_establishment) {

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
        p_establishment.establishment.user_id = p_user_id;
        return ResponseEntity.ok().body(EstablishmentService.InsertEstablishment(p_establishment));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishments", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetEstablishments(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        return ResponseEntity.ok().body(EstablishmentService.GetEstablishments(p_user_id));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/establishment/update", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> UpdateEstablishment(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestParam("establishment_id") long p_establishment_id,
            @RequestBody EstablishmentWithAddressDelta p_establishmentDelta) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        EstablishmentService.UpdateEstablishment(p_establishment_id, p_establishmentDelta);
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
