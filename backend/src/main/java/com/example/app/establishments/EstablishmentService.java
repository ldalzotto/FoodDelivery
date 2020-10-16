package com.example.app.establishments;

import com.example.app.establishments.domain.*;
import org.springframework.dao.DataAccessException;

import java.util.List;

public class EstablishmentService {

    public static EstablishmentWithAddress InsertEstablishment(EstablishmentWithAddress p_establishment)
    {
        EstablishmentWithAddress l_return = new EstablishmentWithAddress();

        boolean l_addressInsert = false;

        try{

                //insert address
                l_return.establishment_address = EstablishmentQuery.InsertEstablishmentAddress(p_establishment.establishment_address);
                l_addressInsert = true;
                p_establishment.establishment.address_id = l_return.establishment_address.id;

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

    public static List<EstablishmentWithAddress> GetEstablishments(long p_userId)
    {
        return EstablishmentQuery.GetAllEstablishments_with_EstablishmentAddress(p_userId);
    }

    public static void DeleteEstablishment(long p_establishmentId)
    {
        EstablishmentQuery.DeleteEstablishment_with_Address(p_establishmentId);
    }
}
