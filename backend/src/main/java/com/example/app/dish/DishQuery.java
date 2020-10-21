package com.example.app.dish;

import com.example.app.dish.domain.Dish;
import com.example.main.ConfigurationBeans;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;
import java.util.List;

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
                Dish l_dish = new Dish();
                l_dish.id = rs.getLong(1);
                l_dish.name = rs.getString(2);
                l_dish.price = rs.getFloat(3);
                l_dish.thumb_id = rs.getLong(4);
                l_dish.user_id = rs.getLong(5);
                return l_dish;
            });
    }

    public static void InsertDish(Dish p_dish, long p_establishmentId)
    {
        boolean l_dishInserted = false;
        try
        {
            KeyHolder l_keyHolder = new GeneratedKeyHolder();
            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("insert into dish(name, price, thumb_id, user_id) values (?,?,?,?)");
                l_ps.setString(1, p_dish.name);
                l_ps.setFloat(2, p_dish.price);
                l_ps.setLong(3, p_dish.thumb_id);
                l_ps.setLong(4, p_dish.user_id);
                return l_ps;
            }, l_keyHolder);

            p_dish.id = l_keyHolder.getKey().longValue();
            l_dishInserted = true;

            ConfigurationBeans.jdbcTemplate.update(con -> {
                PreparedStatement l_ps = con.prepareStatement("insert into establishment_dish(establishment_id, dish_id) values (?,?)");
                l_ps.setLong(1, p_establishmentId);
                l_ps.setLong(2, p_dish.id);
                return l_ps;
            });
        }
        catch (DataAccessException ex)
        {
            if(l_dishInserted)
            {
                ConfigurationBeans.jdbcTemplate.update(con -> {
                    PreparedStatement l_ps = con.prepareStatement("delete from dish where dish.id = ?");
                    l_ps.setLong(1, p_dish.id);
                    return l_ps;
                });
            }
            throw ex;
        }

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
