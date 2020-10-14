package com.example.app.establishments.domain;

public class EstablishmentAddress {
    public long id;
    public String street_full_name;
    public long city_id;
    public float lat;
    public float lng;

    public EstablishmentAddress copy()
    {
        EstablishmentAddress l_addr = new EstablishmentAddress();
        l_addr.id = this.id;
        l_addr.street_full_name = this.street_full_name;
        l_addr.city_id = this.city_id;
        l_addr.lat = this.lat;
        l_addr.lng = this.lng;
        return l_addr;
    }
}
