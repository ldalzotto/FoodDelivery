package com.example.app.establishments;

import com.example.app.session.SessionErrorHandler;
import com.example.app.session.SessionService;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.PreparedStatement;

@Controller
@RequestMapping(value = "/")
public class EstablishmentsController {

    @CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
    @RequestMapping(value = "/establishment", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> CreateEstablishment(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id,
            @RequestBody Establishment p_establishment) {

        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }
        if (!p_establishment.validate(l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }
        p_establishment.user_id = p_user_id;
        return ResponseEntity.ok().body(EstablishmentService.InsertEstablishment(p_establishment));
    }

    @CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
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


}
