package com.example.app.establishments;

import com.example.app.session.SessionErrorHandler;
import com.example.app.session.SessionService;
import com.example.main.ConfigurationBeans;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
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
        return ResponseEntity.ok().body(this.InsertEstablishment(p_establishment));
    }

    @Transactional
    public Establishment InsertEstablishment(Establishment p_establishment) {
        Establishment l_return = p_establishment.copy();

        KeyHolder keyHolder = new GeneratedKeyHolder();

        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("insert into establishments(name, address, phone, user_id) VALUES (?, ?, ?, ?)");
            l_ps.setString(1, p_establishment.name);
            l_ps.setString(2, p_establishment.address);
            l_ps.setString(3, p_establishment.phone);
            l_ps.setLong(4, p_establishment.user_id);
            return l_ps;
        }, keyHolder);

        l_return.id = keyHolder.getKey().longValue();

        return l_return;
    }


}
