package com.example.app.geo;

import com.example.app.geo.domain.City;
import com.example.main.ConfigurationBeans;

import java.sql.PreparedStatement;
import java.util.List;

public class GeoQuery {
    public static List<City> Get_AllCities_MatchingName(String p_name)
    {
        return
                ConfigurationBeans.jdbcTemplate.query(con -> {
                    PreparedStatement l_ps = con.prepareStatement("select * from city where city.name like ?");
                    l_ps.setString(1, "%" + p_name + "%");
                    return l_ps;
                }, (rs, rowNum) -> {
                    City l_city = new City();

                    l_city.id = rs.getLong(1);
                    l_city.name = rs.getString(2);
                    l_city.numeric_id_0 = rs.getLong(3);
                    l_city.country_id = rs.getLong(4);

                    return l_city;
                });
    }
}
