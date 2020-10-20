package com.example.app.establishments;

import com.example.app.establishments.domain.*;
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
        l_establishment.user_id = p_user_id;
        EstablishmentService.InsertEstablishment(l_establishment, l_establishmentAddress, p_thumbImage);
        return ResponseEntity.ok().body(null);
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
            @RequestParam("establishment_delta") String p_establishmentDelta,
            @RequestParam("establishment_address_delta") String p_establishmentAddressDelta) {

        FunctionalError l_Functional_error = new FunctionalError();

        EstablishmentDelta l_establishmentDelta = EstablishmentDelta.parse(p_establishmentDelta);
        EstablishmentAddressDelta l_establishmentAddressDelta = EstablishmentAddressDelta.parse(p_establishmentAddressDelta);

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        EstablishmentService.UpdateEstablishment(p_establishment_id, l_establishmentDelta, l_establishmentAddressDelta);
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
