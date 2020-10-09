package com.example.app.session;

import com.example.main.ConfigurationBeans;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SessionService {

    public static boolean validateSessionToken(String p_sessionToken, long p_user_id)
    {
        long l_currentTime = System.currentTimeMillis();
        Session l_foundSession =
                ConfigurationBeans.jdbcTemplate.queryForObject("select * from sessions where sessions.token == ?" +
                                "and sessions.user_id == ? ORDER BY sessions.expiration_time ASC LIMIT 1;", new Object[]{p_sessionToken, p_user_id},
                        new RowMapper<Session>() {
                            @Override
                            public Session mapRow(ResultSet rs, int rowNum) throws SQLException {
                                Session l_session = new Session();
                                l_session.token = rs.getString(1);
                                l_session.user_id = rs.getLong(2);
                                l_session.expiration_time = rs.getLong(3);
                                return l_session;
                            }
                        });

        return l_foundSession != null && l_foundSession.expiration_time >= l_currentTime;
    }

}
