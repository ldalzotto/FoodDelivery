package com.example.app.establishments.domain;

import com.example.app.geo.domain.City;
import com.example.app.image.domain.ImageUrl;

import java.util.HashMap;
import java.util.List;

public class EstablishmentGet extends HashMap<String, Object> {
    public void setEstablishments(List<Establishment> p_establishments)
    {
        this.put("establishments", p_establishments);
    }
    public List<Establishment> getEstablishments()
    {
        return (List<Establishment>) this.getOrDefault("establishments", null);
    }
    public void setEstablishmentAddresses(List<EstablishmentAddress> p_establishmentAddresses)
    {
        this.put("establishment_addresses", p_establishmentAddresses);
    }
    public List<EstablishmentAddress> getEstablishmentAddresses()
    {
        return (List<EstablishmentAddress>) this.getOrDefault("establishment_addresses", null);
    }
    public void setCities(List<City> p_cities)
    {
        this.put("cities", p_cities);
    }
    public List<City> getCities()
    {
        return (List<City>)this.getOrDefault("cities", null);
    }
    public void setEstablishmentAddressToCity(long[] p_establishmentAddressToCity)
    {
        this.put("establishment_address_TO_city", p_establishmentAddressToCity);
    }
    public long[] getEstablishmentAddressToCity()
    {
        return (long[])this.getOrDefault("establishment_address_TO_city", null);
    }
    public void setDeliveryCharges(double[] p_deliveryCharges)
    {
        this.put("delivery_charges", p_deliveryCharges);
    }
    public double[] getDeliveryCharges()
    {
        return (double[])this.getOrDefault("delivery_charges", null);
    }
    public void setThumbnails(List<ImageUrl> p_thumbnails)
    {
        this.put("thumbnails", p_thumbnails);
    }
    public List<String> getThumbnails()
    {
        return (List<String>)this.getOrDefault("thumbnails", null);
    }
    public void setEstablishmentToThumbnail(long[] p_establishmentToThumbnail)
    {
        this.put("establishment_TO_thumbnail", p_establishmentToThumbnail);
    }
    public long[] getEstablishmentToThumbnail()
    {
        return (long[])this.getOrDefault("establishment_TO_thumbnail", null);
    }
}
