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

    public static List<EstablishmentWithAddress> GetEstablishments(long p_userId)
    {
        return EstablishmentQuery.GetAllEstablishments_with_EstablishmentAddress(p_userId);
    }
}
