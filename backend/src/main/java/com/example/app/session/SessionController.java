package com.example.app.session;

import com.example.app.user.User;
import com.example.app.user.UserService;
import com.example.main.ConfigurationBeans;
import com.example.main.FunctionalError;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Controller
@RequestMapping(value = "/")
public class SessionController {

    @CrossOrigin(origins = "http://localhost:8081")
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

        Session l_session = this.createSession(l_foundUser.id);
        HttpHeaders l_headers = new HttpHeaders();
        l_headers.set(SessionConstants.TOKEN, l_session.token);
        l_headers.set(SessionConstants.USER_ID, Long.toString(l_session.user_id));
        return ResponseEntity.ok().headers(l_headers).body(null);
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

    Session createSession(long p_userId) {
        Session l_session = new Session();
        l_session.token = UUID.randomUUID().toString();
        l_session.user_id = p_userId;
        l_session.expiration_time = System.currentTimeMillis() + 3600000;
        ConfigurationBeans.jdbcTemplate.update("insert into sessions(token, user_id, expiration_time) VALUES (?, ?, ?);", l_session.token,
                l_session.user_id, l_session.expiration_time);
        return l_session;
    }


}

class LoginInput {
    public String username;
    public String password;
}

