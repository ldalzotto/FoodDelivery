package com.example.app.session;

import com.example.main.ConfigurationBeans;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class SessionService {

    public static Session createSession(long p_userId) {
        Session l_session = new Session();
        l_session.token = UUID.randomUUID().toString();
        l_session.user_id = p_userId;
        l_session.emission_time = System.currentTimeMillis();
        l_session.expiration_time = System.currentTimeMillis() + 3600000;
        l_session.is_cancelled = false;
        ConfigurationBeans.jdbcTemplate.update(
                "insert into sessions(token, user_id, emission_time, expiration_time, is_cancelled) VALUES (?, ?, ?, ?, ?);", l_session.token,
                l_session.user_id,l_session.emission_time, l_session.expiration_time, l_session.is_cancelled);
        return l_session;
    }

    public static void disableSession(long p_userId)
    {
        ConfigurationBeans.jdbcTemplate.update("update sessions set is_cancelled = 1 where sessions.user_id == ?", p_userId);
    }

    public static boolean validateSessionToken(String p_sessionToken, long p_user_id)
    {
        long l_currentTime = System.currentTimeMillis();
        Session l_foundSession =
                ConfigurationBeans.jdbcTemplate.queryForObject("select * from sessions where sessions.token == ? and sessions.is_cancelled == 0 " +
                                "and sessions.user_id == ? ORDER BY sessions.emission_time ASC LIMIT 1;", new Object[]{p_sessionToken, p_user_id},
                        new RowMapper<Session>() {
                            @Override
                            public Session mapRow(ResultSet rs, int rowNum) throws SQLException {
                                Session l_session = new Session();
                                l_session.token = rs.getString(1);
                                l_session.user_id = rs.getLong(2);
                                l_session.emission_time = rs.getLong(3);
                                l_session.expiration_time = rs.getLong(4);
                                l_session.is_cancelled = rs.getBoolean(5);
                                return l_session;
                            }
                        });

        return l_foundSession != null && l_foundSession.expiration_time >= l_currentTime;
    }

}
