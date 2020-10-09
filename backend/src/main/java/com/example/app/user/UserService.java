package com.example.app.user;

import com.example.main.ConfigurationBeans;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

public class UserService {
   public static User insertUser(User p_user)
    {
        User l_return = p_user.copy();
        KeyHolder keyHolder = new GeneratedKeyHolder();

        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("insert into users (username, email, password, is_validated) values (?, ?, ?, 0);");
            l_ps.setString(1, p_user.username);
            l_ps.setString(2, p_user.email);
            l_ps.setString(3, p_user.password);
            return l_ps;
        }, keyHolder);

        l_return.id = keyHolder.getKey().longValue();


        return l_return;
    }

    public static String generateUserVerification(User p_user)
    {
        String l_mailToken = UUID.randomUUID().toString();
        ConfigurationBeans.jdbcTemplate.update("insert into user_validation (ts, user_id, mail_token) values (?, ?, ?)",
                System.currentTimeMillis(), p_user.id, l_mailToken);
        return l_mailToken;
    }

    public static User findUser_by_id(long p_userId)
    {
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

        if(l_foundUsers.size() > 0)
        {
            return l_foundUsers.get(0);
        }

        return null;
    }

    public static User findUser_by_username(String p_username)
    {
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

        if(l_foundUsers.size() > 0)
        {
            return l_foundUsers.get(0);
        }

        return null;
    }

}
