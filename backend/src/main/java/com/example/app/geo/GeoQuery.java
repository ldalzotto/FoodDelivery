package com.example.app.geo;

import com.example.app.geo.domain.City;
import com.example.main.ConfigurationBeans;

import java.sql.PreparedStatement;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

public class GeoQuery {
    public static List<City> Get_AllCities_MatchingName(String p_name, long p_limit)
    {
        return
                ConfigurationBeans.jdbcTemplate.query(con -> {
                    PreparedStatement l_ps = con.prepareStatement("select * from city where city.name like ? limit ?");
                    l_ps.setString(1, "%" + p_name + "%");
                    l_ps.setLong(2, p_limit);
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

    public static City GetCity(long p_city_id)
    {
        List<City> l_retrievedCity =
                ConfigurationBeans.jdbcTemplate.query(con -> {
                    PreparedStatement l_ps = con.prepareStatement("select * from city where city.id = ? limit 1");
                    l_ps.setLong(1, p_city_id);
                    return l_ps;
                }, (rs, rowNum) -> {
                    City l_city = new City();

                    l_city.id = rs.getLong(1);
                    l_city.name = rs.getString(2);
                    l_city.numeric_id_0 = rs.getLong(3);
                    l_city.country_id = rs.getLong(4);

                    return l_city;
                });
        if(l_retrievedCity.size() > 0)
        {
            return l_retrievedCity.get(0);
        }
        return null;
    }


    public static List<City> GetCities_by_id(Collection<Long> p_city_ids)
    {
        return
            ConfigurationBeans.jdbcTemplate.query(con -> {


                StringBuilder l_inCondition = new StringBuilder();
                int l_index = 0;
                for (Long p_city_id : p_city_ids) {
                    l_inCondition.append(p_city_id);
                    if(l_index!=p_city_ids.size()-1)
                    {
                        l_inCondition.append(',');
                    }
                    l_index += 1;
                }
                PreparedStatement l_ps = con.prepareStatement(String.format("select * from city where city.id in (%s)", l_inCondition.toString()));
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
