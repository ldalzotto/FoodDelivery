package com.example.app.session;

import com.example.app.user.User;
import com.example.app.user.UserService;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import java.util.UUID;

@Controller
@RequestMapping(value = "/")
public class SessionController {

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> Login(@RequestBody LoginInput p_login) {
        User l_foundUser = UserService.findUser_by_username(p_login.username);
        if (l_foundUser == null) {
            FunctionalError l_error = new FunctionalError();
            l_error.code = "LOGIN_USER_NOT_FOUND";
            return ResponseEntity.badRequest().body(l_error);
        }

        if (!l_foundUser.password.equals(p_login.password)) {
            FunctionalError l_error = new FunctionalError();
            l_error.code = "LOGIN_INCORRECT_PASSWORD";
            return ResponseEntity.badRequest().body(l_error);
        }

        Session l_session = SessionService.createSession(l_foundUser.id);
        return ResponseEntity.ok(l_session);
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> Logout(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id
    ) {
        FunctionalError l_Functional_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_Functional_error)) {
            return ResponseEntity.badRequest().body(l_Functional_error);
        }

        SessionService.disableSession(p_user_id);

        return ResponseEntity.ok().body(null);
    }

    @RequestMapping(value = "/session-check", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> SessionCheck(
            @RequestHeader("session_token") String p_sessionToken,
            @RequestHeader("session_user_id") long p_user_id) {

        FunctionalError l_error = new FunctionalError();
        if (!SessionErrorHandler.HandleSessionValidationToken(SessionService.validateSessionToken(p_sessionToken, p_user_id), l_error)) {
            return ResponseEntity.badRequest().body(l_error);
        }

        return ResponseEntity.ok().body(null);
    }



}

class LoginInput {
    public String username;
    public String password;
}