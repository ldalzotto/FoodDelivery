package com.example.app.dish;

import com.example.app.dish.domain.Dish;
import com.example.main.ConfigurationBeans;
import com.example.utils.BooleanWrapper;
import com.example.utils.IntegerHeap;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

public class DishQuery {

    public static List<Dish> GetDishes_From_Establishment(long p_establishmentId)
    {
        return
            ConfigurationBeans.jdbcTemplate.query(con -> {
                PreparedStatement l_ps = con.prepareStatement("select * from dish, establishment_dish " +
                        "where establishment_dish.establishment_id = ? " +
                        "and establishment_dish.dish_id = dish.id");
                l_ps.setLong(1, p_establishmentId);
                return l_ps;
            }, (rs, nb) -> {
                return DishQueryUtil.RetrieveDish(rs, new IntegerHeap(1));
            });
    }

    public static List<Dish> GetDishes_From_User(long p_userId)
    {
        return
                ConfigurationBeans.jdbcTemplate.query(con -> {
                    PreparedStatement l_ps = con.prepareStatement("select * from dish " +
                            "where dish.user_id = ? ");
                    l_ps.setLong(1, p_userId);
                    return l_ps;
                }, (rs, nb) -> {
                    return DishQueryUtil.RetrieveDish(rs, new IntegerHeap(1));
                });
    }

    public static Dish GetDish(long p_dishId)
    {
        return
            ConfigurationBeans.jdbcTemplate.query(con -> {
                PreparedStatement l_ps = con.prepareStatement("select * from dish where dish.id = ?");
                l_ps.setLong(1, p_dishId);
                return l_ps;
            }, (rs) -> {
                return DishQueryUtil.RetrieveDish(rs, new IntegerHeap(1));
            });
    }

    public static void UpdateDish(Dish p_dish)
    {
        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("delete from dish where dish.id = ?");
            l_ps.setLong(1, p_dish.id);
            return l_ps;
        });

        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("insert into dish(id, name, price, thumb_id, user_id) values (?,?,?,?,?)");
            l_ps.setLong(1, p_dish.id);
            l_ps.setString(2, p_dish.name);
            l_ps.setDouble(3, p_dish.price);
            l_ps.setLong(4, p_dish.thumb_id);
            l_ps.setLong(5, p_dish.user_id);
            return l_ps;
        });
    }

    public static void InsertDish(Dish p_dish)
    {
            KeyHolder l_keyHolder = new GeneratedKeyHolder();
            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("insert into dish(name, price, thumb_id, user_id) values (?,?,?,?)");
                l_ps.setString(1, p_dish.name);
                l_ps.setDouble(2, p_dish.price);
                l_ps.setLong(3, p_dish.thumb_id);
                l_ps.setLong(4, p_dish.user_id);
                return l_ps;
            }, l_keyHolder);

            p_dish.id = l_keyHolder.getKey().longValue();
    }

    public static boolean DoesDishExists(long p_dishId)
    {
        BooleanWrapper l_return = new BooleanWrapper();
        l_return.value = false;
        ConfigurationBeans.jdbcTemplate.query(con -> {
            PreparedStatement l_ps = con.prepareStatement("select count(*) from dish where dish.id == ?");
            l_ps.setLong(1, p_dishId);
            return l_ps;
        }, (rs) -> {
            long l_count =  rs.getLong(1);
            if(l_count==0){l_return.value = true;}
        });
        return l_return.value;
    }

    public static List<Long> CheckDishesExistance(List<Long> p_dishesId)
    {
        String l_tableName = "_" + UUID.randomUUID().toString().replaceAll("-", "");

        ConfigurationBeans.jdbcTemplate.update(String.format("create table %s(id INTEGER )", l_tableName));

        ConfigurationBeans.jdbcTemplate.batchUpdate(String.format("insert into %s(id) values (?)", l_tableName),
                new BatchPreparedStatementSetter() {
                    @Override
                    public void setValues(PreparedStatement ps, int i) throws SQLException {
                        ps.setLong(1, p_dishesId.get(i));
                    }

                    @Override
                    public int getBatchSize() {
                        return p_dishesId.size();
                    }
                });

        List<Long> l_matchedId =
            ConfigurationBeans.jdbcTemplate.query(String.format("select dish.* from dish, %s where dish.id == %s.id", l_tableName, l_tableName) ,
                    (rs, rowNum) -> {
                return rs.getLong(1);
            });


        ConfigurationBeans.jdbcTemplate.update(String.format("drop table %s", l_tableName));

        return l_matchedId;
    }

    public static void DeleteDish(long p_dishId)
    {
        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("delete from dish where dish.id = ?");
            l_ps.setLong(1, p_dishId);
            return l_ps;
        });

        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("delete from establishment_dish where establishment_dish.dish_id = ?");
            l_ps.setLong(1, p_dishId);
            return l_ps;
        });
    }
}

class DishQueryUtil
{

    public static Dish RetrieveDish(ResultSet p_rs, IntegerHeap p_startIndex) throws SQLException
    {
        Dish l_dish = new Dish();
        l_dish.id = p_rs.getLong(p_startIndex.number++);
        l_dish.name = p_rs.getString(p_startIndex.number++);
        l_dish.price = p_rs.getDouble(  p_startIndex.number++);
        l_dish.thumb_id = p_rs.getLong(p_startIndex.number++);
        l_dish.user_id = p_rs.getLong(p_startIndex.number++);
        return l_dish;
    }
}