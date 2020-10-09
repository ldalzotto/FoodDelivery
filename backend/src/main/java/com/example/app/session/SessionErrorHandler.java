package com.example.app.session;

import com.example.main.FunctionalError;

public class SessionErrorHandler {

    static String SESSION_VALIDATION_CODE = "INVALID_SESSION";

    public static boolean HandleSessionValidationToken(boolean p_sessionValidation, FunctionalError in_out_Functional_error)
    {
        if(!p_sessionValidation)
        {
            in_out_Functional_error.code = SESSION_VALIDATION_CODE;
            return false;
        }
        return true;
    }

}
