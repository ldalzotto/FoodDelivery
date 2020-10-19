package com.example.app.user;

import com.example.app.session.SessionErrorHandler;
import com.example.app.session.SessionService;
import com.example.app.user.inter.InsertUserReturn;
import com.example.main.FunctionalError;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Controller
@RequestMapping(value = "/")
public class UserController {

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"}, allowCredentials = "true")
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public @ResponseBody ResponseEntity<?> GetUser(
            @CookieValue("session_token") String p_sessionToken,
            @CookieValue("session_user_id") long p_user_id
    )
    {
        FunctionalError l_error = new FunctionalError();

        if (!SessionErrorHandler.HandleSessionValidationToken(
                SessionService.validateSessionToken(p_sessionToken, p_user_id), l_error)) {
            return ResponseEntity.badRequest().body(l_error);
        }

        User l_user = UserService.findUser_by_id(p_user_id);
        if(l_user==null) {
            l_error.code = UserControllerErrorHandler.USER_NOT_FOUND;
            return ResponseEntity.badRequest().body(l_error);
        }
        return ResponseEntity.ok(new UserInterface(l_user));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/user/register", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> RegisterUser(@RequestBody User p_user) {
        FunctionalError l_error = new FunctionalError();
        if (!p_user.validate(l_error))
        {
            return ResponseEntity.badRequest().body(l_error);
        }

        InsertUserReturn l_insertedUser = UserService.insertUser(p_user);
        if(!UserControllerErrorHandler.HandleInsertUserReturn(l_insertedUser, l_error))
        {
            return ResponseEntity.badRequest().body(l_error);
        }

        String l_mailToken = UserService.generateUserVerification(l_insertedUser.User);

        if(!this.sendConfirmationEmail(l_insertedUser.User, l_mailToken))
        {
            l_error.code = UserControllerErrorHandler.MAIl_SEND_ERROR;
            return ResponseEntity.badRequest().body(l_error);
        }

        return ResponseEntity.ok(new UserInterface(l_insertedUser.User));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/user/validate", method = RequestMethod.POST)
    public ResponseEntity<?> ValidateUser(
            @RequestParam("userId") long p_uerId,
            @RequestParam("sessionToken") String p_mailToken) {

        FunctionalError l_error = new FunctionalError();
        if(!UserControllerErrorHandler.HandleValidateUserReturn(UserService.validateUser(p_uerId, p_mailToken), l_error))
        {
            return ResponseEntity.badRequest().body(l_error);
        }

        return ResponseEntity.ok(null);
    }

    boolean sendConfirmationEmail(User p_user, String p_mailToken) {
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
            //TODO -> renaming sessionToken to emailtoken
            String l_url = String.format("http://localhost:8081/register/validation?userId=%d&sessionToken=%s", p_user.id, p_mailToken);
            l_message.setText("To validate, click here : " + l_url);
            Transport.send(l_message);
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }


}

class UserInterface
{
    public long id;
    public boolean isValidated;

    public UserInterface(User p_user) {
        this.id = p_user.id;
        this.isValidated = p_user.isValidated;
    }
}