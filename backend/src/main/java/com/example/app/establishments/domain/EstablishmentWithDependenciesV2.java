package com.example.app.establishments.domain;

import com.example.app.geo.domain.City;

import java.util.List;

public class EstablishmentWithDependenciesV2 {
    public List<Establishment> establishments;
    public List<EstablishmentAddress> establishment_addresses;

    public List<City> cities;
    public long[] establishment_address_TO_city;
}
