package com.example.app.establishments;

import com.example.app.establishments.domain.*;
import com.example.main.ConfigurationBeans;
import com.example.utils.IntegerHeap;
import com.example.utils.Parameter;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EstablishmentQuery {

    public static EstablishmentAddress InsertEstablishmentAddress(EstablishmentAddress p_address) {
        EstablishmentAddress l_return = p_address.copy();
        KeyHolder l_addressKeyHolder = new GeneratedKeyHolder();
        ConfigurationBeans.jdbcTemplate.update(con -> {
            return EstablishmentQueryUtils.InsertEstablishmentAddress(con, p_address);
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
            return EstablishmentQueryUtils.InsertEstablishment(con, p_establishment);
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
            return EstablishmentQueryUtils.RetrieveEstablishment(rs, new IntegerHeap(1));
        });

        if(l_retrievedEstablishment.size() > 0)
        {
            return l_retrievedEstablishment.get(0);
        }

        return null;
    }

    public static void GetEstablishments_InsideBoundingSphere_with_EstablishmentAddress(double p_minlat, double p_maxlat, double p_minlng, double p_maxlng,
                                                                                        Parameter<List<Establishment>> out_establishments, Parameter<List<EstablishmentAddress>> out_establishmentAddresses)
    {
        out_establishments.Value = new ArrayList<>();
        out_establishmentAddresses.Value = new ArrayList<>();

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
                IntegerHeap l_rs_index = new IntegerHeap(1);

                Establishment l_establishment = EstablishmentQueryUtils.RetrieveEstablishment(rs, l_rs_index);
                EstablishmentAddress l_establishmentAddress = EstablishmentQueryUtils.RetrieveEstablishmentAddress(rs, l_rs_index);

                out_establishments.Value.add(l_establishment);
                out_establishmentAddresses.Value.add(l_establishmentAddress);
            });
    }

    public static void GetEstablishment_with_EstablishmentAddress(long p_establishment_id, Parameter<Establishment> out_establishment,
                                                                  Parameter<EstablishmentAddress> out_establishmentAddress)
    {
                ConfigurationBeans.jdbcTemplate.query(con -> {
                    PreparedStatement l_ps = con.prepareStatement("select * from establishments, establishment_address where establishments.id == ? and establishments.address_id == establishment_address.id limit 1;");
                    l_ps.setLong(1, p_establishment_id);
                    return l_ps;
                }, (rs) -> {
                    IntegerHeap l_rs_index = new IntegerHeap(1);

                    out_establishment.Value = EstablishmentQueryUtils.RetrieveEstablishment(rs, l_rs_index);
                    out_establishmentAddress.Value = EstablishmentQueryUtils.RetrieveEstablishmentAddress(rs, l_rs_index);

                });
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
                return EstablishmentQueryUtils.InsertEstablishment_withId(con, p_establishment);
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
                return EstablishmentQueryUtils.InsertEstablishmentAddress_withId(con, p_establishmentAddress);
            });

            ConfigurationBeans.transactionManager.commit(ts);
        }
        catch (DataAccessException ex)
        {
            ConfigurationBeans.transactionManager.rollback(ts);
            throw ex;
        }
    }

    public static void GetAllEstablishments_with_EstablishmentAddress(long p_user_id, Parameter<List<Establishment>> out_establishment,
                                                                      Parameter<List<EstablishmentAddress>> out_establishmentAddress)
    {
        out_establishment.Value = new ArrayList<>();
        out_establishmentAddress.Value = new ArrayList<>();

            ConfigurationBeans.jdbcTemplate.query(con -> {
                PreparedStatement l_ps = con.prepareStatement("select * from establishments, establishment_address where establishments.user_id == ? and establishments.address_id == establishment_address.id;");
                l_ps.setLong(1, p_user_id);
                return l_ps;
            }, (rs) -> {
                IntegerHeap l_rs_index = new IntegerHeap(1);
                Establishment l_establishment = EstablishmentQueryUtils.RetrieveEstablishment(rs, l_rs_index);
                EstablishmentAddress l_establishmentAddress = EstablishmentQueryUtils.RetrieveEstablishmentAddress(rs, l_rs_index);

                out_establishment.Value.add(l_establishment);
                out_establishmentAddress.Value.add(l_establishmentAddress);
            });
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


class EstablishmentQueryUtils
{
    public static PreparedStatement InsertEstablishment_withId(Connection con, Establishment p_establishment) throws SQLException
    {
        PreparedStatement l_ps = con.prepareStatement("insert into establishments(id, name, address_id, phone, thumb_id, user_id) values (?,?,?,?,?,?)");
        l_ps.setLong(1, p_establishment.id);
        l_ps.setString(2, p_establishment.name);
        l_ps.setLong(3, p_establishment.address_id);
        l_ps.setString(4, p_establishment.phone);
        if(p_establishment.thumb_id != null)
        {
            l_ps.setLong(5, p_establishment.thumb_id);
        }
        else
        {
            l_ps.setNull(5, Types.INTEGER);
        }

        l_ps.setLong(6, p_establishment.user_id);
        return l_ps;
    }

    public static PreparedStatement InsertEstablishment(Connection con, Establishment p_establishment) throws SQLException
    {
        PreparedStatement l_ps = con.prepareStatement("insert into establishments(name, address_id, phone, thumb_id, user_id) values (?,?,?,?,?)");
        l_ps.setString(1, p_establishment.name);
        l_ps.setLong(2, p_establishment.address_id);
        l_ps.setString(3, p_establishment.phone);
        if(p_establishment.thumb_id != null)
        {
            l_ps.setLong(4, p_establishment.thumb_id);
        }
        else
        {
            l_ps.setNull(4, Types.INTEGER);
        }

        l_ps.setLong(5, p_establishment.user_id);
        return l_ps;
    }

    public static Establishment RetrieveEstablishment(ResultSet p_rs, IntegerHeap p_startIndex) throws SQLException
    {
        Establishment l_establishment = new Establishment();

        l_establishment.id = p_rs.getLong(p_startIndex.number++);
        l_establishment.name = p_rs.getString(p_startIndex.number++);
        l_establishment.address_id = p_rs.getLong(p_startIndex.number++);
        l_establishment.phone = p_rs.getString(p_startIndex.number++);
        l_establishment.thumb_id = p_rs.getLong(p_startIndex.number++);
        l_establishment.user_id = p_rs.getLong(p_startIndex.number++);

        return l_establishment;
    }

    public static PreparedStatement InsertEstablishmentAddress_withId(Connection con, EstablishmentAddress p_establishmentAddress) throws SQLException
    {
        PreparedStatement l_ps = con.prepareStatement("insert into establishment_address(id, street_full_name, city_id, lat, lng) VALUES (?,?,?,?,?)");
        l_ps.setLong(1, p_establishmentAddress.id);
        l_ps.setString(2, p_establishmentAddress.street_full_name);
        l_ps.setLong(3, p_establishmentAddress.city_id);
        l_ps.setDouble(4, p_establishmentAddress.lat);
        l_ps.setDouble(5, p_establishmentAddress.lng);
        return l_ps;
    }

    public static PreparedStatement InsertEstablishmentAddress(Connection con, EstablishmentAddress p_establishmentAddress) throws SQLException
    {
        PreparedStatement l_ps = con.prepareStatement("insert into establishment_address(street_full_name, city_id, lat, lng) VALUES (?,?,?,?)");
        l_ps.setString(1, p_establishmentAddress.street_full_name);
        l_ps.setLong(2, p_establishmentAddress.city_id);
        l_ps.setDouble(3, p_establishmentAddress.lat);
        l_ps.setDouble(4, p_establishmentAddress.lng);
        return l_ps;
    }

    public static EstablishmentAddress RetrieveEstablishmentAddress(ResultSet p_rs, IntegerHeap p_startIndex) throws SQLException
    {
        EstablishmentAddress l_establishmentAddress = new EstablishmentAddress();
        l_establishmentAddress.id = p_rs.getLong(p_startIndex.number++);
        l_establishmentAddress.street_full_name = p_rs.getString(p_startIndex.number++);
        l_establishmentAddress.city_id = p_rs.getLong(p_startIndex.number++);
        l_establishmentAddress.lat = p_rs.getFloat(p_startIndex.number++);
        l_establishmentAddress.lng = p_rs.getFloat(p_startIndex.number++);
        return l_establishmentAddress;
    }
}
