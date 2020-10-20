package com.example.app.establishments;

import com.example.app.establishments.domain.*;
import com.example.app.geo.GeoQuery;
import com.example.app.geo.domain.City;
import com.example.app.image.ImageQuery;
import com.example.app.image.domain.ImageCreated;
import org.springframework.dao.DataAccessException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class EstablishmentService {

    private static final double EarthRadius = 6371e3;

    public static EstablishmentWithAddress InsertEstablishment(EstablishmentWithAddress p_establishment, MultipartFile p_thumbImage)
    {
        EstablishmentWithAddress l_return = new EstablishmentWithAddress();

        boolean l_addressInsert = false;

        try{
                //insert address
                l_return.establishment_address = EstablishmentQuery.InsertEstablishmentAddress(p_establishment.establishment_address);
                l_addressInsert = true;
                p_establishment.establishment.address_id = l_return.establishment_address.id;

                if(p_thumbImage != null)
                {
                    try
                    {
                        ImageCreated l_image = ImageQuery.PostImage(p_thumbImage.getBytes(), "");
                        p_establishment.establishment.thumb_id = l_image.image_id;
                    } catch (IOException p_ex)
                    {
                        System.out.print(p_ex.toString());
                    }
                }

                //insert establishment
                l_return.establishment = EstablishmentQuery.InsertEstablishment(p_establishment.establishment);

        } catch (DataAccessException ex) {
            //ROLLBACK
            if(l_addressInsert)
            {
                EstablishmentQuery.DeleteEstablishmentAddress(l_return.establishment_address.id);
            }

            throw ex;
        }

        return l_return;
    }

    public static void UpdateEstablishment(long p_establishmentId, EstablishmentWithAddressDelta p_establishmentDelta)
    {
        EstablishmentWithAddress l_estWithAddressServer = EstablishmentQuery.GetEstablishment_with_EstablishmentAddress(p_establishmentId);

        if(l_estWithAddressServer!=null)
        {
            if(p_establishmentDelta.establishment!=null)
            {
                if(p_establishmentDelta.establishment.name != null){l_estWithAddressServer.establishment.name = p_establishmentDelta.establishment.name;}
                if(p_establishmentDelta.establishment.phone != null){l_estWithAddressServer.establishment.phone = p_establishmentDelta.establishment.phone;}
                EstablishmentQuery.UpdateEstablishment(l_estWithAddressServer.establishment);
            }

            if(p_establishmentDelta.establishment_address!=null)
            {
                if(p_establishmentDelta.establishment_address.street_full_name != null){l_estWithAddressServer.establishment_address.street_full_name = p_establishmentDelta.establishment_address.street_full_name;}
                if(p_establishmentDelta.establishment_address.city_id != null){l_estWithAddressServer.establishment_address.city_id = p_establishmentDelta.establishment_address.city_id;}
                if(p_establishmentDelta.establishment_address.lat != null){l_estWithAddressServer.establishment_address.lat = p_establishmentDelta.establishment_address.lat;}
                if(p_establishmentDelta.establishment_address.lng != null){l_estWithAddressServer.establishment_address.lng = p_establishmentDelta.establishment_address.lng;}
                EstablishmentQuery.UpdateEstablishmentAddress(l_estWithAddressServer.establishment_address);
            }
        }

    }

    public static EstablishmentWithDependenciesV2 GetEstablishments(long p_userId, List<EstablishmentCalculationType> p_caluclations)
    {
        EstablishmentWithDependenciesV2 l_establishmentWithDependencies = EstablishmentQuery.GetAllEstablishments_with_EstablishmentAddress(p_userId);

        if(p_caluclations != null) {
            for (int i = 0; i < p_caluclations.size(); i++) {
                EstablishmentCalculationType l_calculationType = p_caluclations.get(i);
                switch (l_calculationType)
                {
                    case RETRIEVE_CITIES:
                    {
                        LinkCitiesToEstablishments_Return l_citiesLinked = LinkCitiesToEstablishments(l_establishmentWithDependencies.establishments, l_establishmentWithDependencies.establishment_addresses);
                        l_establishmentWithDependencies.cities = l_citiesLinked.cities;
                        l_establishmentWithDependencies.establishment_address_TO_city = l_citiesLinked.establishment_address_TO_city;
                    }
                    break;
                }
            }
        }

        return l_establishmentWithDependencies;
    }

    public static EstablishmentWithDependenciesV2 GetEstablishmentsNear(List<EstablishmentCalculationType> p_caluclations, float p_lat, float p_lng)
    {
        float l_radius = 5000; //(meters)

        double l_minLat = p_lat - l_radius/EarthRadius*180/Math.PI;
        double l_maxLat = p_lat + l_radius/EarthRadius*180/Math.PI;
        double l_minLng = p_lng - l_radius/EarthRadius*180/Math.PI/Math.cos(p_lat*Math.PI/180);
        double l_maxLng = p_lng + l_radius/EarthRadius*180/Math.PI/Math.cos(p_lat*Math.PI/180);

        EstablishmentWithDependenciesV2 l_nearEstablishments = EstablishmentQuery.GetEstablishments_InsideBoundingSphere_with_EstablishmentAddress(l_minLat, l_maxLat, l_minLng, l_maxLng);

        if(p_caluclations != null)
        {
            for(int i=0;i<p_caluclations.size();i++)
            {
                EstablishmentCalculationType l_calculationType = p_caluclations.get(i);
                switch (l_calculationType)
                {
                    case RETRIEVE_CITIES:
                    {
                        LinkCitiesToEstablishments_Return l_citiesLinked = LinkCitiesToEstablishments(l_nearEstablishments.establishments, l_nearEstablishments.establishment_addresses);
                        l_nearEstablishments.cities = l_citiesLinked.cities;
                        l_nearEstablishments.establishment_address_TO_city = l_citiesLinked.establishment_address_TO_city;
                    }
                    break;
                    case DELIVERY_CHARGE:
                    {
                        if(l_nearEstablishments.establishment_addresses != null)
                        {
                            if(l_nearEstablishments.establishment_addresses.size() > 0)
                            {
                                l_nearEstablishments.delivery_charges = new double[l_nearEstablishments.establishment_addresses.size()];
                            }
                            for(int j=0;j<l_nearEstablishments.establishment_addresses.size();j++)
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
                                l_nearEstablishments.delivery_charges[j] = new BigDecimal(Math.random()).setScale(2, RoundingMode.HALF_UP).doubleValue();
                            }
                        }


                    }
                    break;
                }
            }
        }

        return l_nearEstablishments;
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
