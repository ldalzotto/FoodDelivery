package com.example.app.establishments;

import com.example.app.establishments.domain.Establishment;
import com.example.app.establishments.domain.EstablishmentAddress;
import com.example.app.establishments.domain.EstablishmentBO;
import com.example.main.ConfigurationBeans;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class EstablishmentService {

    public static EstablishmentBO InsertEstablishment(EstablishmentBO p_establishment)
    {
        EstablishmentBO l_return = p_establishment.copy();

        KeyHolder l_addressKeyHolder = new GeneratedKeyHolder();
        KeyHolder l_establishmentKeyHolder = new GeneratedKeyHolder();

        boolean l_addressInsert = false;

        try{

            //insert address
            {
                ConfigurationBeans.jdbcTemplate.update(con -> {
                   PreparedStatement l_ps = con.prepareStatement("insert into establishment_address(street_full_name, city_id, lat, lng) VALUES (?,?,?,?)");
                    l_ps.setString(1, l_return.establishment_address.street_full_name);
                    l_ps.setLong(2, l_return.establishment_address.city_id);
                    l_ps.setFloat(3, l_return.establishment_address.lat);
                    l_ps.setFloat(4, l_return.establishment_address.lng);
                    return l_ps;
                }, l_addressKeyHolder);
                l_return.establishment_address.id = l_addressKeyHolder.getKey().longValue();
                l_addressInsert = true;
            }

            //insert establishment
            {
                ConfigurationBeans.jdbcTemplate.update(con -> {
                    PreparedStatement l_ps = con.prepareStatement("insert into establishments(name, address_id, phone, user_id) VALUES (?, ?, ?, ?)");
                    l_ps.setString(1, l_return.establishment.name);
                    l_ps.setLong(2, l_return.establishment.address_id);
                    l_ps.setString(3, l_return.establishment.phone);
                    l_ps.setLong(4, l_return.establishment.user_id);
                    return l_ps;
                }, l_establishmentKeyHolder);
                l_return.establishment.id = l_establishmentKeyHolder.getKey().longValue();
                l_return.establishment.address_id = l_return.establishment_address.id;
            }

        } catch (DataAccessException ex) {
            //ROLLBACK
            if(l_addressInsert)
            {
                ConfigurationBeans.jdbcTemplate.update(con -> {
                    PreparedStatement l_ps = con.prepareStatement("delete * from establishment_address where id == ?");
                    l_ps.setLong(1, l_return.establishment_address.id);
                    return l_ps;
                });
            }

            throw ex;
        }

        return l_return;
    }

    public static List<EstablishmentBO> GetEstablishments(long p_userId)
    {
        return
        ConfigurationBeans.jdbcTemplate.query("" +
                        "select * " +
                        "from establishments, establishment_address " +
                        "where establishments.user_id == ? " +
                        "and establishments.address_id == establishment_address.id;", new Object[]{p_userId},
                new RowMapper<EstablishmentBO>() {
                    @Override
                    public EstablishmentBO mapRow(ResultSet rs, int rowNum) throws SQLException {
                        EstablishmentBO l_establishmentBO = new EstablishmentBO();
                        int l_columnCounter = 1;
                        l_establishmentBO.establishment = new Establishment();
                        l_establishmentBO.establishment.id = rs.getLong(l_columnCounter++);
                        l_establishmentBO.establishment.name = rs.getString(l_columnCounter++);
                        l_establishmentBO.establishment.address_id = rs.getLong(l_columnCounter++);
                        l_establishmentBO.establishment.phone = rs.getString(l_columnCounter++);
                        l_establishmentBO.establishment.user_id = rs.getLong(l_columnCounter++);

                        l_establishmentBO.establishment_address = new EstablishmentAddress();
                        l_establishmentBO.establishment_address.id = rs.getLong(l_columnCounter++);
                        l_establishmentBO.establishment_address.street_full_name = rs.getString(l_columnCounter++);
                        l_establishmentBO.establishment_address.city_id = rs.getLong(l_columnCounter++);
                        l_establishmentBO.establishment_address.lat = rs.getFloat(l_columnCounter++);
                        l_establishmentBO.establishment_address.lng = rs.getFloat(l_columnCounter++);

                        return l_establishmentBO;
                    }
                });
    }
}
