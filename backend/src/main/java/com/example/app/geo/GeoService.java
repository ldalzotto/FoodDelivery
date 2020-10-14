package com.example.app.geo;

import com.example.app.geo.domain.City;

import java.util.List;

public class GeoService {
public static List<City> GetAllCitiesMatching(String p_name)
{
    return GeoQuery.Get_AllCities_MatchingName(p_name);
}
}
