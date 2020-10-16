package com.example.app.geo;

import com.example.app.geo.domain.City;
import java.util.List;

public class GeoService {
    public static List<City> GetAllCitiesMatching(String p_name, long p_limit)
    {
        return GeoQuery.Get_AllCities_MatchingName(p_name, p_limit);
    }
    public static City GetCity(long p_city_id)
    {
        return GeoQuery.GetCity(p_city_id);
    }
}
