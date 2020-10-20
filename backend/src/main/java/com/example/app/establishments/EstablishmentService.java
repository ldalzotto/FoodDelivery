package com.example.app.establishments;

import com.example.app.establishments.domain.*;
import com.example.app.geo.GeoQuery;
import com.example.app.geo.domain.City;
import com.example.app.image.ImageQuery;
import com.example.app.image.domain.ImageCreated;
import com.example.utils.Parameter;
import org.springframework.dao.DataAccessException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

public class EstablishmentService {

    private static final double EarthRadius = 6371e3;

    public static void InsertEstablishment(Establishment p_establishment,
                                                               EstablishmentAddress p_establishmentAddress, MultipartFile p_thumbImage)
    {
        boolean l_addressInsert = false;

        try{
                //insert address
                EstablishmentAddress l_insertedEstablishmentAddress = EstablishmentQuery.InsertEstablishmentAddress(p_establishmentAddress);
                l_addressInsert = true;
                p_establishment.address_id = l_insertedEstablishmentAddress.id;

                if(p_thumbImage != null)
                {
                    try
                    {
                        ImageCreated l_image = ImageQuery.PostImage(p_thumbImage.getBytes(), "");
                        p_establishment.thumb_id = l_image.image_id;
                    } catch (IOException p_ex)
                    {
                        System.out.print(p_ex.toString());
                    }
                }

                //insert establishment
                EstablishmentQuery.InsertEstablishment(p_establishment);

        } catch (DataAccessException ex) {
            //ROLLBACK
            if(l_addressInsert)
            {
                EstablishmentQuery.DeleteEstablishmentAddress(p_establishment.address_id);
            }

            throw ex;
        }
    }

    public static void UpdateEstablishment(long p_establishmentId, EstablishmentDelta p_establishmentDelta,
                                           EstablishmentAddressDelta p_establishmentAddressDelta)
    {
        Parameter<Establishment> l_establishmentServer = new Parameter<>();
        Parameter<EstablishmentAddress> l_establishmentAddressServer = new Parameter<>();
        EstablishmentQuery.GetEstablishment_with_EstablishmentAddress(p_establishmentId, l_establishmentServer, l_establishmentAddressServer);

            if(p_establishmentDelta !=null)
            {
                if(p_establishmentDelta.name != null){l_establishmentServer.Value.name = p_establishmentDelta.name;}
                if(p_establishmentDelta.phone != null){l_establishmentServer.Value.phone = p_establishmentDelta.phone;}
                EstablishmentQuery.UpdateEstablishment(l_establishmentServer.Value);
            }

            if(p_establishmentAddressDelta!=null)
            {
                if(p_establishmentAddressDelta.street_full_name != null){l_establishmentAddressServer.Value.street_full_name = p_establishmentAddressDelta.street_full_name;}
                if(p_establishmentAddressDelta.city_id != null){l_establishmentAddressServer.Value.city_id = p_establishmentAddressDelta.city_id;}
                if(p_establishmentAddressDelta.lat != null){l_establishmentAddressServer.Value.lat = p_establishmentAddressDelta.lat;}
                if(p_establishmentAddressDelta.lng != null){l_establishmentAddressServer.Value.lng = p_establishmentAddressDelta.lng;}
                EstablishmentQuery.UpdateEstablishmentAddress(l_establishmentAddressServer.Value);
            }
    }

    public static EstablishmentGet GetEstablishments(long p_userId, List<EstablishmentCalculationType> p_caluclations)
    {
        EstablishmentGet l_return = new EstablishmentGet();

        Parameter<List<Establishment>> l_establishments = new Parameter<>();
        Parameter<List<EstablishmentAddress>> l_establishmentAddresses = new Parameter<>();
        EstablishmentQuery.GetAllEstablishments_with_EstablishmentAddress(p_userId,l_establishments, l_establishmentAddresses);

        l_return.setEstablishments(l_establishments.Value);
        l_return.setEstablishmentAddresses(l_establishmentAddresses.Value);

        if(p_caluclations != null) {
            for (int i = 0; i < p_caluclations.size(); i++) {
                EstablishmentCalculationType l_calculationType = p_caluclations.get(i);
                switch (l_calculationType)
                {
                    case RETRIEVE_CITIES:
                    {
                        LinkCitiesToEstablishments_Return l_citiesLinked = LinkCitiesToEstablishments(l_establishments.Value, l_establishmentAddresses.Value);
                        l_return.setCities(l_citiesLinked.cities);
                        l_return.setEstablishmentAddressToCity(l_citiesLinked.establishment_address_TO_city);
                    }
                    break;
                }
            }
        }

        return l_return;
    }

    public static EstablishmentGet GetEstablishmentsNear(List<EstablishmentCalculationType> p_caluclations, float p_lat, float p_lng)
    {
        float l_radius = 5000; //(meters)

        double l_minLat = p_lat - l_radius/EarthRadius*180/Math.PI;
        double l_maxLat = p_lat + l_radius/EarthRadius*180/Math.PI;
        double l_minLng = p_lng - l_radius/EarthRadius*180/Math.PI/Math.cos(p_lat*Math.PI/180);
        double l_maxLng = p_lng + l_radius/EarthRadius*180/Math.PI/Math.cos(p_lat*Math.PI/180);

        EstablishmentGet l_return = new EstablishmentGet();
        // l_maps.put();

        Parameter<List<Establishment>> l_establishments = new Parameter<>();
        Parameter<List<EstablishmentAddress>> l_establishmentAddresses = new Parameter<>();

        EstablishmentQuery.GetEstablishments_InsideBoundingSphere_with_EstablishmentAddress(l_minLat, l_maxLat, l_minLng, l_maxLng,
                l_establishments, l_establishmentAddresses);

        l_return.setEstablishments(l_establishments.Value);
        l_return.setEstablishmentAddresses(l_establishmentAddresses.Value);

        if(p_caluclations != null)
        {
            for(int i=0;i<p_caluclations.size();i++)
            {
                EstablishmentCalculationType l_calculationType = p_caluclations.get(i);
                switch (l_calculationType)
                {
                    case RETRIEVE_CITIES:
                    {
                        LinkCitiesToEstablishments_Return l_citiesLinked = LinkCitiesToEstablishments(l_establishments.Value, l_establishmentAddresses.Value);
                        l_return.setCities(l_citiesLinked.cities);
                        l_return.setEstablishmentAddressToCity(l_citiesLinked.establishment_address_TO_city);
                    }
                    break;
                    case DELIVERY_CHARGE:
                    {
                        if(l_establishmentAddresses.Value != null)
                        {
                            double[] l_deliveryCharges = null;
                            if(l_establishmentAddresses.Value.size() > 0)
                            {
                                l_deliveryCharges = new double[l_establishmentAddresses.Value.size()];
                            }
                            for(int j=0;j<l_establishmentAddresses.Value.size();j++)
                            {
                                /*
                                EstablishmentAddress l_address = l_nearEstablishments.establishment_addresses.get(j);
                                double l_phi1 = p_lat * EarthRadius;
                                double l_phi2 = l_address.lat * EarthRadius;
                                double l_deltaPhi = Math.abs(l_address.lat - p_lat) * Math.PI /180;
                                double l_deltaLanbda = Math.abs(l_address.lng - p_lng) * Math.PI /180;

                                double l_sindphi = Math.sin(l_deltaPhi/2);
                                double l_sindlamba = Math.sin(l_deltaLanbda/2);
                                double a = l_sindphi * l_sindphi * Math.cos(l_phi1) * Math.cos(l_phi2) * l_sindlamba * l_sindlamba;
                                double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                double d = EarthRadius * c;
                                 */
                                l_deliveryCharges[j] = new BigDecimal(Math.random()).setScale(2, RoundingMode.HALF_UP).doubleValue();
                            }

                            l_return.setDeliveryCharges(l_deliveryCharges);
                        }


                    }
                    break;
                }
            }
        }

        return l_return;
    }

    private static LinkCitiesToEstablishments_Return LinkCitiesToEstablishments(List<Establishment> p_establishments, List<EstablishmentAddress> p_establishmentAddress)
    {
        LinkCitiesToEstablishments_Return l_return = new LinkCitiesToEstablishments_Return();
        Set<Long> l_distinct_citites = new HashSet<Long>();
        for(int i=0;i<p_establishmentAddress.size();i++)
        {
            l_distinct_citites.add(p_establishmentAddress.get(i).city_id);
        }

        if(l_distinct_citites.size() > 0) {
            l_return.cities = GeoQuery.GetCities_by_id(l_distinct_citites);
            if(l_return.cities.size() > 0)
            {
                l_return.establishment_address_TO_city = new long[p_establishmentAddress.size()];
                for(int i=0;i<p_establishmentAddress.size();i++)
                {
                    for(int j=0;j<l_return.cities.size();j++)
                    {
                        if(p_establishmentAddress.get(i).city_id == l_return.cities.get(j).id)
                        {
                            l_return.establishment_address_TO_city[i] = j;
                            break;
                        }
                        l_return.establishment_address_TO_city[i] = -1;
                    }
                }
            }
        }

        return l_return;
    }

    public static void DeleteEstablishment(long p_establishmentId)
    {
        EstablishmentQuery.DeleteEstablishment_with_Address(p_establishmentId);
    }
}

class LinkCitiesToEstablishments_Return
{
    public List<City> cities;
    public long[] establishment_address_TO_city;
}
