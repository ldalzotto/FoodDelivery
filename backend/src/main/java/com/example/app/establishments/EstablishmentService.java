package com.example.app.establishments;

import com.example.app.establishments.domain.*;
import com.example.app.geo.GeoQuery;
import com.example.app.geo.domain.City;
import com.example.app.image.ImageQuery;
import com.example.app.image.domain.ImageCreated;
import com.example.app.image.domain.ImageUrl;
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
                        ImageCreated l_image = ImageQuery.PostImage(p_thumbImage.getBytes());
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

    public static EstablishmentsGet GetEstablishment(long p_establishmentId, long p_userId, List<EstablishmentCalculationType> p_caluclations)
    {
        EstablishmentsGet l_return = new EstablishmentsGet();

        List<Establishment> l_establishments = null;
        List<EstablishmentAddress> l_establishmentAddresses = null;
        Parameter<Establishment> l_establishment_retrieved = new Parameter<>();
        Parameter<EstablishmentAddress> l_establishmentAddress_retrieved = new Parameter<>();
        EstablishmentQuery.GetEstablishment_with_EstablishmentAddress(p_userId,l_establishment_retrieved, l_establishmentAddress_retrieved);

        if(l_establishment_retrieved.Value!=null)
        {
            l_establishments = new ArrayList<>(1);
            l_establishments.add(l_establishment_retrieved.Value);
        }

        if(l_establishmentAddress_retrieved.Value!=null)
        {
            l_establishmentAddresses = new ArrayList<>(1);
            l_establishmentAddresses.add(l_establishmentAddress_retrieved.Value);
        }

        l_return.setEstablishments(l_establishments);
        l_return.setEstablishmentAddresses(l_establishmentAddresses);

        ProcessEstablishmentCalculations(p_caluclations, l_return);

        return l_return;
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

    public static EstablishmentsGet GetEstablishments(long p_userId, List<EstablishmentCalculationType> p_caluclations)
    {
        EstablishmentsGet l_return = new EstablishmentsGet();

        Parameter<List<Establishment>> l_establishments = new Parameter<>();
        Parameter<List<EstablishmentAddress>> l_establishmentAddresses = new Parameter<>();
        EstablishmentQuery.GetAllEstablishments_with_EstablishmentAddress(p_userId,l_establishments, l_establishmentAddresses);

        l_return.setEstablishments(l_establishments.Value);
        l_return.setEstablishmentAddresses(l_establishmentAddresses.Value);

        ProcessEstablishmentCalculations(p_caluclations, l_return);

        return l_return;
    }

    public static EstablishmentsGet GetEstablishmentsNear(List<EstablishmentCalculationType> p_caluclations, float p_lat, float p_lng)
    {
        float l_radius = 5000; //(meters)

        double l_minLat = p_lat - l_radius/EarthRadius*180/Math.PI;
        double l_maxLat = p_lat + l_radius/EarthRadius*180/Math.PI;
        double l_minLng = p_lng - l_radius/EarthRadius*180/Math.PI/Math.cos(p_lat*Math.PI/180);
        double l_maxLng = p_lng + l_radius/EarthRadius*180/Math.PI/Math.cos(p_lat*Math.PI/180);

        EstablishmentsGet l_return = new EstablishmentsGet();
        // l_maps.put();

        Parameter<List<Establishment>> l_establishments = new Parameter<>();
        Parameter<List<EstablishmentAddress>> l_establishmentAddresses = new Parameter<>();

        EstablishmentQuery.GetEstablishments_InsideBoundingSphere_with_EstablishmentAddress(l_minLat, l_maxLat, l_minLng, l_maxLng,
                l_establishments, l_establishmentAddresses);

        l_return.setEstablishments(l_establishments.Value);
        l_return.setEstablishmentAddresses(l_establishmentAddresses.Value);

        ProcessEstablishmentCalculations(p_caluclations, l_return);

        return l_return;
    }

    private static void ProcessEstablishmentCalculations(List<EstablishmentCalculationType> p_caluclations, EstablishmentsGet in_out_establishmentsGet)
    {
        if(p_caluclations != null)
        {
            for(int i=0;i<p_caluclations.size();i++)
            {
                EstablishmentCalculationType l_calculationType = p_caluclations.get(i);
                switch (l_calculationType)
                {
                    case RETRIEVE_CITIES:
                    {
                        LinkCitiesToEstablishments_Return l_citiesLinked = LinkCitiesToEstablishments(in_out_establishmentsGet.getEstablishments(),
                                in_out_establishmentsGet.getEstablishmentAddresses());
                        in_out_establishmentsGet.setCities(l_citiesLinked.cities);
                        in_out_establishmentsGet.setEstablishmentAddressToCity(l_citiesLinked.establishment_address_TO_city);
                    }
                    break;
                    case DELIVERY_CHARGE:
                    {
                        List<EstablishmentAddress> l_establishmentAddresses = in_out_establishmentsGet.getEstablishmentAddresses();
                        if(l_establishmentAddresses != null)
                        {
                            double[] l_deliveryCharges = null;
                            if(l_establishmentAddresses.size() > 0)
                            {
                                l_deliveryCharges = new double[l_establishmentAddresses.size()];
                            }
                            for(int j=0;j<l_establishmentAddresses.size();j++)
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

                            in_out_establishmentsGet.setDeliveryCharges(l_deliveryCharges);
                        }


                    }
                    break;
                    case RETRIEVE_THUMBNAIL:
                    {
                        LinkThumbnailToEstablishment(in_out_establishmentsGet);
                    }
                    break;
                }
            }
        }
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

    private static void LinkThumbnailToEstablishment(EstablishmentsGet p_establishmentsGet)
    {
        if(p_establishmentsGet !=null)
        {
            List<Establishment> l_establishments = p_establishmentsGet.getEstablishments();
            if(l_establishments!=null)
            {
                Set<Long> l_distinctThumbnails = new HashSet<>();
                for(int i=0;i<l_establishments.size();i++)
                {
                    if(l_establishments.get(i).thumb_id != null)
                    {
                       l_distinctThumbnails.add(l_establishments.get(i).thumb_id);
                    }
                }

                if(l_distinctThumbnails.size() > 0)
                {
                    List<ImageUrl> l_establishmentThumb = new ArrayList<>();
                    for(Long l_thumbId : l_distinctThumbnails)
                    {
                        ImageUrl l_url = new ImageUrl();
                        l_url.image_id = l_thumbId;
                        l_url.url = String.format("http://localhost:8080/image?image_id=%d", l_thumbId);
                        l_establishmentThumb.add(l_url);
                    }
                    p_establishmentsGet.setThumbnails(l_establishmentThumb);

                    long[] l_establishment_TO_thumb = new long[l_establishments.size()];

                    for(int i=0;i<l_establishments.size();i++) {
                        Establishment l_establishment = l_establishments.get(i);
                        if(l_establishment.thumb_id!=null)
                        {
                            for(int j=0;j<l_establishmentThumb.size();j++)
                            {
                                if(l_establishmentThumb.get(j).image_id == l_establishment.thumb_id)
                                {
                                    l_establishment_TO_thumb[i] = j;
                                    break;
                                }
                                l_establishment_TO_thumb[i] = -1;
                            }
                        }
                        else
                        {
                            l_establishment_TO_thumb[i] = -1;
                        }
                    }

                    p_establishmentsGet.setEstablishmentToThumbnail(l_establishment_TO_thumb);
                }

            }
        }
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
