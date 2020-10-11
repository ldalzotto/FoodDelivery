package com.example.app.user;

import com.example.app.user.inter.InsertUserReturn;
import com.example.database.DatabaseConstants;
import com.example.database.DatabaseError;
import com.example.database.DatabaseUniqueConstraintError;
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

    @CrossOrigin(origins = "http://localhost:8081")
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

        return ResponseEntity.ok(l_insertedUser.User);
    }

    @RequestMapping(value = "/user-validate", method = RequestMethod.GET)
    public ResponseEntity<?> ValidateUser(@RequestParam(name = "user_id") long p_uerId, @RequestParam(name = "mail_token") String p_mailToken) {

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
            String l_url = String.format("http://localhost:8080/user-validate?user_id=%d&mail_token=%s", p_user.id, p_mailToken);
            l_message.setText("To validate, click here : " + l_url);
            Transport.send(l_message);
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }


}
