package com.example.app.establishments;

import com.example.main.ConfigurationBeans;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class EstablishmentService {
    public static Establishment InsertEstablishment(Establishment p_establishment) {

        Establishment l_return = p_establishment.copy();
        KeyHolder keyHolder = new GeneratedKeyHolder();

        TransactionStatus l_transaction = ConfigurationBeans.transactionManager.getTransaction(new DefaultTransactionDefinition());

        try {
            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("insert into establishments(name, address, phone, user_id) VALUES (?, ?, ?, ?)");
                l_ps.setString(1, p_establishment.name);
                l_ps.setString(2, p_establishment.address);
                l_ps.setString(3, p_establishment.phone);
                l_ps.setLong(4, p_establishment.user_id);
                return l_ps;
            }, keyHolder);

            ConfigurationBeans.transactionManager.commit(l_transaction);

            l_return.id = keyHolder.getKey().longValue();

            return l_return;
        } catch (DataAccessException ex) {
            ConfigurationBeans.transactionManager.rollback(l_transaction);
            throw ex;
        }
    }

    public static List<Establishment> GetEstablishments(long p_userId)
    {
        return
        ConfigurationBeans.jdbcTemplate.query("select * from establishments where establishments.user_id == ?", new Object[]{p_userId},
                new RowMapper<Establishment>() {
                    @Override
                    public Establishment mapRow(ResultSet rs, int rowNum) throws SQLException {
                        Establishment l_establishment = new Establishment();
                        l_establishment.id = rs.getLong(1);
                        l_establishment.name = rs.getString(2);
                        l_establishment.address = rs.getString(3);
                        l_establishment.phone = rs.getString(4);
                        l_establishment.user_id = rs.getLong(5);
                        return l_establishment;
                    }
                });
    }
}
