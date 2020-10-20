package com.example.app.establishments;

import com.example.app.establishments.domain.*;
import com.example.main.ConfigurationBeans;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;

public class EstablishmentQuery {

    public static EstablishmentAddress InsertEstablishmentAddress(EstablishmentAddress p_address) {
        EstablishmentAddress l_return = p_address.copy();
        KeyHolder l_addressKeyHolder = new GeneratedKeyHolder();
        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("insert into establishment_address(street_full_name, city_id, lat, lng) VALUES (?,?,?,?)");
            l_ps.setString(1, p_address.street_full_name);
            l_ps.setLong(2, p_address.city_id);
            l_ps.setDouble(3, p_address.lat);
            l_ps.setDouble(4, p_address.lng);
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

    public static Establishment GetEstablishment(long p_establihsmentId)
    {
        List<Establishment> l_retrievedEstablishment =
        ConfigurationBeans.jdbcTemplate.query(con -> {
            PreparedStatement l_ps = con.prepareStatement("select * from establishments where establishments.id == ? limit 1");
            l_ps.setLong(1, p_establihsmentId);
            return l_ps;
        }, (rs, rowNum) -> {
            Establishment l_establishment = new Establishment();
            l_establishment.id = rs.getLong(1);
            l_establishment.name = rs.getString(2);
            l_establishment.address_id = rs.getLong(3);
            l_establishment.phone = rs.getString(4);
            l_establishment.user_id = rs.getLong(5);
            return l_establishment;
        });

        if(l_retrievedEstablishment.size() > 0)
        {
            return l_retrievedEstablishment.get(0);
        }

        return null;
    }

    public static EstablishmentWithDependenciesV2 GetEstablishments_InsideBoundingSphere_with_EstablishmentAddress(double p_minlat, double p_maxlat, double p_minlng, double p_maxlng)
    {
        EstablishmentWithDependenciesV2 l_foundEstablishments = new EstablishmentWithDependenciesV2();
        l_foundEstablishments.establishments = new ArrayList<>();
        l_foundEstablishments.establishment_addresses = new ArrayList<>();

            ConfigurationBeans.jdbcTemplate.query(con -> {
                PreparedStatement l_ps = con.prepareStatement("select * from establishments, establishment_address " +
                        "where establishment_address.lat between ? and ? " +
                        "and establishment_address.lng between ? and ? " +
                        "and establishments.address_id == establishment_address.id ");
                l_ps.setDouble(1, p_minlat);
                l_ps.setDouble(2, p_maxlat);
                l_ps.setDouble(3, p_minlng);
                l_ps.setDouble(4, p_maxlng);
                return l_ps;
            }, (rs) -> {
                EstablishmentWithDependenciesV2 l_est = new EstablishmentWithDependenciesV2();

                Establishment l_establishment = new Establishment();
                l_establishment.id = rs.getLong(1);
                l_establishment.name = rs.getString(2);
                l_establishment.address_id = rs.getLong(3);
                l_establishment.phone = rs.getString(4);
                l_establishment.user_id = rs.getLong(5);

                EstablishmentAddress l_establishmentAddress = new EstablishmentAddress();
                l_establishmentAddress.id = rs.getLong(6);
                l_establishmentAddress.street_full_name = rs.getString(7);
                l_establishmentAddress.city_id = rs.getLong(8);
                l_establishmentAddress.lat = rs.getFloat(9);
                l_establishmentAddress.lng = rs.getFloat(10);

                l_foundEstablishments.establishments.add(l_establishment);
                l_foundEstablishments.establishment_addresses.add(l_establishmentAddress);
            });
        return l_foundEstablishments;
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
                l_ps.setDouble(4, p_establishmentAddress.lat);
                l_ps.setDouble(5, p_establishmentAddress.lng);
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

    public static EstablishmentWithDependenciesV2 GetAllEstablishments_with_EstablishmentAddress(long p_user_id)
    {
        EstablishmentWithDependenciesV2 l_return = new EstablishmentWithDependenciesV2();
        l_return.establishments = new ArrayList<>();
        l_return.establishment_addresses = new ArrayList<>();

            ConfigurationBeans.jdbcTemplate.query(con -> {
                PreparedStatement l_ps = con.prepareStatement("select * from establishments, establishment_address where establishments.user_id == ? and establishments.address_id == establishment_address.id;");
                l_ps.setLong(1, p_user_id);
                return l_ps;
            }, (rs) -> {
                Establishment l_establishment = new Establishment();

                l_establishment.id = rs.getLong(1);
                l_establishment.name = rs.getString(2);
                l_establishment.address_id = rs.getLong(3);
                l_establishment.phone = rs.getString(4);
                l_establishment.user_id = rs.getLong(5);

                EstablishmentAddress l_establishmentAddress = new EstablishmentAddress();

                l_establishmentAddress.id = rs.getLong(6);
                l_establishmentAddress.street_full_name = rs.getString(7);
                l_establishmentAddress.city_id = rs.getLong(8);
                l_establishmentAddress.lat = rs.getFloat(9);
                l_establishmentAddress.lng = rs.getFloat(10);

                l_return.establishments.add(l_establishment);
                l_return.establishment_addresses.add(l_establishmentAddress);
            });

        return l_return;
    }

    public static void DeleteEstablishment_with_Address(long p_establishment)
    {
        Establishment l_establishment = GetEstablishment(p_establishment);
        if(l_establishment!=null)
        {
            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("delete from establishment_address where establishment_address.id == ?");
                l_ps.setLong(1, l_establishment.address_id);
                return l_ps;
            });
            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("delete from establishments where establishments.id == ?");
                l_ps.setLong(1, l_establishment.id);
                return l_ps;
            });
        }
    }


}
