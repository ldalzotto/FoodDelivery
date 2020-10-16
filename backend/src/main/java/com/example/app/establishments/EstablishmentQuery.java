package com.example.app.establishments;

import com.example.app.establishments.domain.*;
import com.example.main.ConfigurationBeans;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.sql.PreparedStatement;
import java.util.List;

public class EstablishmentQuery {

    public static EstablishmentAddress InsertEstablishmentAddress(EstablishmentAddress p_address) {
        EstablishmentAddress l_return = p_address.copy();
        KeyHolder l_addressKeyHolder = new GeneratedKeyHolder();
        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("insert into establishment_address(street_full_name, city_id, lat, lng) VALUES (?,?,?,?)");
            l_ps.setString(1, p_address.street_full_name);
            l_ps.setLong(2, p_address.city_id);
            l_ps.setFloat(3, p_address.lat);
            l_ps.setFloat(4, p_address.lng);
            return l_ps;
        }, l_addressKeyHolder);
        l_return.id = l_addressKeyHolder.getKey().longValue();
        return l_return;
    }

    public static void DeleteEstablishmentAddress(long p_id)
    {
        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("delete from establishment_address where id == ?");
            l_ps.setLong(1, p_id);
            return l_ps;
        });
    }

    public static Establishment InsertEstablishment(Establishment p_establishment)
    {
        Establishment l_return = p_establishment.copy();
        KeyHolder l_keyHolder = new GeneratedKeyHolder();
        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("insert into establishments(name, address_id, phone, user_id) VALUES (?, ?, ?, ?)");
            l_ps.setString(1, p_establishment.name);
            l_ps.setLong(2, p_establishment.address_id);
            l_ps.setString(3, p_establishment.phone);
            l_ps.setLong(4, p_establishment.user_id);
            return l_ps;
        }, l_keyHolder);
        l_return.id = l_keyHolder.getKey().longValue();
        return l_return;
    }

    public static EstablishmentWithAddress GetEstablishment_with_EstablishmentAddress(long p_establishment_id)
    {
        List<EstablishmentWithAddress> l_foundEstablishments =
                ConfigurationBeans.jdbcTemplate.query(con -> {
                    PreparedStatement l_ps = con.prepareStatement("select * from establishments, establishment_address where establishments.id == ? and establishments.address_id == establishment_address.id limit 1;");
                    l_ps.setLong(1, p_establishment_id);
                    return l_ps;
                }, (rs, rowNum) -> {
                    EstablishmentWithAddress l_establishmentWithAddress = new EstablishmentWithAddress();

                    l_establishmentWithAddress.establishment = new Establishment();
                    l_establishmentWithAddress.establishment.id = rs.getLong(1);
                    l_establishmentWithAddress.establishment.name = rs.getString(2);
                    l_establishmentWithAddress.establishment.address_id = rs.getLong(3);
                    l_establishmentWithAddress.establishment.phone = rs.getString(4);
                    l_establishmentWithAddress.establishment.user_id = rs.getLong(5);

                    l_establishmentWithAddress.establishment_address = new EstablishmentAddress();
                    l_establishmentWithAddress.establishment_address.id = rs.getLong(6);
                    l_establishmentWithAddress.establishment_address.street_full_name = rs.getString(7);
                    l_establishmentWithAddress.establishment_address.city_id = rs.getLong(8);
                    l_establishmentWithAddress.establishment_address.lat = rs.getFloat(9);
                    l_establishmentWithAddress.establishment_address.lng = rs.getFloat(10);

                    return l_establishmentWithAddress;
                });
        if(l_foundEstablishments.size() > 0)
        {
           return l_foundEstablishments.get(0);
        }
        return null;
    }

    public static void UpdateEstablishment(Establishment p_establishment)
    {
        TransactionStatus ts = ConfigurationBeans.transactionManager.getTransaction(new DefaultTransactionDefinition());

        try
        {
            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("delete from establishments where establishments.id == ?");
                l_ps.setLong(1, p_establishment.id);
                return l_ps;
            });
            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("insert into establishments(id, name, address_id, phone, user_id) values (?,?,?,?,?)");
                l_ps.setLong(1, p_establishment.id);
                l_ps.setString(2, p_establishment.name);
                l_ps.setLong(3, p_establishment.address_id);
                l_ps.setString(4, p_establishment.phone);
                l_ps.setLong(5, p_establishment.user_id);
                return l_ps;
            });

            ConfigurationBeans.transactionManager.commit(ts);
        }
        catch (DataAccessException ex)
        {
            ConfigurationBeans.transactionManager.rollback(ts);
            throw ex;
        }
    }

    public static void UpdateEstablishmentAddress(EstablishmentAddress p_establishmentAddress)
    {
        TransactionStatus ts = ConfigurationBeans.transactionManager.getTransaction(new DefaultTransactionDefinition());

        try
        {
            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("delete from establishment_address where establishment_address.id == ?");
                l_ps.setLong(1, p_establishmentAddress.id);
                return l_ps;
            });

            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("insert into establishment_address(id, street_full_name, city_id, lat, lng) VALUES (?,?,?,?,?)");
                l_ps.setLong(1, p_establishmentAddress.id);
                l_ps.setString(2, p_establishmentAddress.street_full_name);
                l_ps.setLong(3, p_establishmentAddress.city_id);
                l_ps.setFloat(4, p_establishmentAddress.lat);
                l_ps.setFloat(5, p_establishmentAddress.lng);
                return l_ps;
            });

            ConfigurationBeans.transactionManager.commit(ts);
        }
        catch (DataAccessException ex)
        {
            ConfigurationBeans.transactionManager.rollback(ts);
            throw ex;
        }
    }

    public static List<EstablishmentWithAddress> GetAllEstablishments_with_EstablishmentAddress(long p_user_id)
    {
        return
            ConfigurationBeans.jdbcTemplate.query(con -> {
                PreparedStatement l_ps = con.prepareStatement("select * from establishments, establishment_address where establishments.user_id == ? and establishments.address_id == establishment_address.id;");
                l_ps.setLong(1, p_user_id);
                return l_ps;
            }, (rs, rowNum) -> {
                EstablishmentWithAddress l_establishmentWithAddress = new EstablishmentWithAddress();

                l_establishmentWithAddress.establishment = new Establishment();
                l_establishmentWithAddress.establishment.id = rs.getLong(1);
                l_establishmentWithAddress.establishment.name = rs.getString(2);
                l_establishmentWithAddress.establishment.address_id = rs.getLong(3);
                l_establishmentWithAddress.establishment.phone = rs.getString(4);
                l_establishmentWithAddress.establishment.user_id = rs.getLong(5);

                l_establishmentWithAddress.establishment_address = new EstablishmentAddress();
                l_establishmentWithAddress.establishment_address.id = rs.getLong(6);
                l_establishmentWithAddress.establishment_address.street_full_name = rs.getString(7);
                l_establishmentWithAddress.establishment_address.city_id = rs.getLong(8);
                l_establishmentWithAddress.establishment_address.lat = rs.getFloat(9);
                l_establishmentWithAddress.establishment_address.lng = rs.getFloat(10);

                return l_establishmentWithAddress;
            });
    }
}
