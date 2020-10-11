package com.example.app.user;

import com.example.app.user.inter.InsertUserReturn;
import com.example.app.user.inter.ValidateUserReturn;
import com.example.database.DatabaseError;
import com.example.error.IHandledError;
import com.example.main.ConfigurationBeans;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

public class UserService {


    public static InsertUserReturn insertUser(User p_user) {
        InsertUserReturn l_return = new InsertUserReturn();
        l_return.User = p_user.copy();

        KeyHolder keyHolder = new GeneratedKeyHolder();

        try
        {
            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("insert into users (username, email, password, is_validated) values (?, ?, ?, 0);");
                l_ps.setString(1, p_user.username);
                l_ps.setString(2, p_user.email);
                l_ps.setString(3, p_user.password);
                return l_ps;
            }, keyHolder);
        }
        catch (DataAccessException e)
        {
            e.printStackTrace();
            DatabaseError l_error = new DatabaseError();
            l_error.populateFromException(e);
            l_return.Error = l_error;
            return l_return;
        }

        l_return.User.id = keyHolder.getKey().longValue();

        return l_return;
    }

    public static String generateUserVerification(User p_user) {
        String l_mailToken = UUID.randomUUID().toString();
        ConfigurationBeans.jdbcTemplate.update("insert into user_validation (ts, user_id, mail_token) values (?, ?, ?)",
                System.currentTimeMillis(), p_user.id, l_mailToken);
        return l_mailToken;
    }

    public static User findUser_by_id(long p_userId) {
        List<User> l_foundUsers =
                ConfigurationBeans.jdbcTemplate.query("select * from users where users.id == ? ", new Object[]{p_userId},
                        new RowMapper<User>() {
                            @Override
                            public User mapRow(ResultSet rs, int rowNum) throws SQLException {
                                User l_user = new User();
                                l_user.id = rs.getLong(1);
                                l_user.username = rs.getString(2);
                                l_user.email = rs.getString(3);
                                l_user.password = rs.getString(4);
                                l_user.isValidated = rs.getBoolean(5);
                                return l_user;
                            }
                        });

        if (l_foundUsers.size() > 0) {
            return l_foundUsers.get(0);
        }

        return null;
    }

    public static User findUser_by_username(String p_username) {
        List<User> l_foundUsers =
                ConfigurationBeans.jdbcTemplate.query("select * from users where users.username == ? ", new Object[]{p_username},
                        new RowMapper<User>() {
                            @Override
                            public User mapRow(ResultSet rs, int rowNum) throws SQLException {
                                User l_user = new User();
                                l_user.id = rs.getLong(1);
                                l_user.username = rs.getString(2);
                                l_user.email = rs.getString(3);
                                l_user.password = rs.getString(4);
                                l_user.isValidated = rs.getBoolean(5);
                                return l_user;
                            }
                        });

        if (l_foundUsers.size() > 0) {
            return l_foundUsers.get(0);
        }

        return null;
    }

    public static ValidateUserReturn validateUser(long p_userId, String p_mailToken)
    {
        User l_foundUser = UserService.findUser_by_id(p_userId);
        if (l_foundUser == null) {
            return ValidateUserReturn.USER_NOT_FOUND;
        }
        if (!validateUserAgainstMailToken(p_userId, p_mailToken)) {
            return ValidateUserReturn.MAIL_TOKEN_VALIDATION;
        }

        return ValidateUserReturn.OK;
    }

    static boolean validateUserAgainstMailToken(long p_userId, String p_mailToken) {

        int l_count = ConfigurationBeans.jdbcTemplate.queryForObject("" +
                "select count(*) from user_validation\n" +
                "where user_validation.user_id == ?\n" +
                "and user_validation.mail_token == ?;", new Object[]{p_userId, p_mailToken}, Integer.class);


            if (l_count > 0) {

                TransactionDefinition l_transaction = new DefaultTransactionDefinition();
                TransactionStatus status = ConfigurationBeans.transactionManager.getTransaction( l_transaction );

                try
                {
                ConfigurationBeans.jdbcTemplate.update("delete from user_validation\n" +
                        "where user_validation.user_id == ?\n" +
                        "and user_validation.mail_token == ?;\n", p_userId, p_mailToken);

                ConfigurationBeans.jdbcTemplate.update("update users\n" +
                        "          set is_validated = ?\n" +
                        "          where id == ?;", 1, p_userId);

                    ConfigurationBeans.transactionManager.commit(status);
                return true;
                }
                catch (DataAccessException ex)
                {
                    ConfigurationBeans.transactionManager.rollback(status);
                    throw ex;
                }
            }

            return false;

    }

}

