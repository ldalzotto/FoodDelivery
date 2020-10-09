package com.example.app.user;

import com.example.main.ConfigurationBeans;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Controller
@RequestMapping(value = "/")
public class UserController {

    @RequestMapping(value = "/user", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> CreateUser(@RequestBody User p_user) {
        FunctionalError l_error = new FunctionalError();
        if (!p_user.validate(l_error)) {
            return ResponseEntity.badRequest().body(l_error);
        }

        User l_insertedUser = UserService.insertUser(p_user);
        String l_mailToken = UserService.generateUserVerification(l_insertedUser);
        this.sendConfirmationEmail(l_insertedUser, l_mailToken);
        return ResponseEntity.ok(l_insertedUser);
    }

    @RequestMapping(value = "/user-validate", method = RequestMethod.GET)
    public ResponseEntity<?> ValidateUser(@RequestParam(name = "user_id") long p_uerId, @RequestParam(name = "mail_token") String p_mailToken) {
        switch (this.validateUser(p_uerId, p_mailToken)) {
            case USER_NOT_FOUND: {
                FunctionalError l_error = new FunctionalError();
                l_error.code = "VALIDATE_USER_NOT_FOUND";
                return ResponseEntity.badRequest().body(l_error);
            }
            case MAIL_TOKEN_VALIDATION: {
                FunctionalError l_error = new FunctionalError();
                l_error.code = "VALIDATE_CANNOT_VALIDATE_MAIL_TOKEN";
                return ResponseEntity.badRequest().body(l_error);
            }
        }


        return ResponseEntity.ok(null);
    }


    @Transactional
    boolean validateUserAgainstMailToken(long p_userId, String p_mailToken) {
        int l_count = ConfigurationBeans.jdbcTemplate.queryForObject("" +
                "select count(*) from user_validation\n" +
                "where user_validation.user_id == ?\n" +
                "and user_validation.mail_token == ?;", new Object[]{p_userId, p_mailToken}, Integer.class);
        if (l_count > 0) {
            ConfigurationBeans.jdbcTemplate.update("delete from user_validation\n" +
                    "where user_validation.user_id == ?\n" +
                    "and user_validation.mail_token == ?;\n", p_userId, p_mailToken);

            ConfigurationBeans.jdbcTemplate.update("update users\n" +
                    "          set is_validated = ?\n" +
                    "          where id == ?;", 1, p_userId);

            return true;
        }

        return false;
    }

    void sendConfirmationEmail(User p_user, String p_mailToken) {
        Properties l_properties = System.getProperties();
        l_properties.setProperty("mail.smtp.host", "smtp.gmail.com");
        l_properties.setProperty("mail.smtp.port", "587");
        l_properties.setProperty("mail.smtp.auth", "true");
        l_properties.setProperty("mail.smtp.starttls.enable", "true"); //TLS

        Session l_mailSession = Session.getInstance(l_properties,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication("smtp.email.test.124@gmail.com", "Abc01234");
                    }
                });

        MimeMessage l_message = new MimeMessage(l_mailSession);

        try {
            l_message.setFrom("test@outlook.fr");
            l_message.addRecipient(Message.RecipientType.TO, new InternetAddress(p_user.email));
            l_message.setSubject("validation");
            String l_url = String.format("http://localhost:8080/user-validate?user_id=%d&mail_token=%s", p_user.id, p_mailToken);
            l_message.setText("To validate, click here : " + l_url);
            Transport.send(l_message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    VALIDATE_USER_RETURN_CODE validateUser(long p_userId, String p_mailToken) {
        User l_foundUser = UserService.findUser_by_id(p_userId);
        if (l_foundUser == null) {
            return VALIDATE_USER_RETURN_CODE.USER_NOT_FOUND;
        }
        if (!this.validateUserAgainstMailToken(p_userId, p_mailToken)) {
            return VALIDATE_USER_RETURN_CODE.MAIL_TOKEN_VALIDATION;
        }

        return VALIDATE_USER_RETURN_CODE.OK;
    }
}

enum VALIDATE_USER_RETURN_CODE {
    OK,
    USER_NOT_FOUND,
    MAIL_TOKEN_VALIDATION
}