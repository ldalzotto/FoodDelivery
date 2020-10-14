package com.example.app.establishments.domain;

public class EstablishmentBO {
    public Establishment establishment;
    public EstablishmentAddress establishment_address;

    public EstablishmentBO copy()
    {
        EstablishmentBO l_est = new EstablishmentBO();
        l_est.establishment = this.establishment.copy();
        l_est.establishment_address = this.establishment_address.copy();
        return l_est;
    }
}
