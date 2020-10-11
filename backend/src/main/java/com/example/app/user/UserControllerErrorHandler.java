package com.example.app.user;

import com.example.app.user.inter.InsertUserReturn;
import com.example.app.user.inter.ValidateUserReturn;
import com.example.database.DatabaseConstants;
import com.example.database.DatabaseError;
import com.example.database.DatabaseUniqueConstraintError;
import com.example.main.FunctionalError;

public class UserControllerErrorHandler {

    public static final String USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS";
    public static final String EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public static final String MAIl_SEND_ERROR = "MAIl_SEND_ERROR";

    public static final String USER_NOT_FOUND = "MAIl_SEND_ERROR";
    public static final String CANT_VALIDATE_MAILTOKEN = "VALIDATE_CANNOT_VALIDATE_MAIL_TOKEN";

    public static boolean HandleInsertUserReturn(InsertUserReturn p_insertUserReturn, FunctionalError p_error)
    {
        if(p_insertUserReturn.Error!=null)
        {
            if(p_insertUserReturn.Error instanceof DatabaseError)
            {
                DatabaseError l_databaseError = (DatabaseError) p_insertUserReturn.Error;
                if(l_databaseError.Code == DatabaseConstants.ErrorCode.UNIQUE_CONSTRAINT_VIOLATION)
                {
                    DatabaseUniqueConstraintError l_uniqueConstraintError = (DatabaseUniqueConstraintError) l_databaseError.Error;
                    if(l_uniqueConstraintError.Table.equals("users"))
                    {
                        if(l_uniqueConstraintError.Column.equals("username"))
                        {
                            p_error.code = UserControllerErrorHandler.USERNAME_ALREADY_EXISTS;
                        }
                        else if(l_uniqueConstraintError.Column.equals("email"))
                        {
                            p_error.code = UserControllerErrorHandler.EMAIL_ALREADY_EXISTS;
                        }

                        p_error.message = l_databaseError.Message;

                        return false;
                    }
                }
            }
        }
        return true;
    }

    public static boolean HandleValidateUserReturn(ValidateUserReturn p_validateUserReturn, FunctionalError p_error)
    {
        switch (p_validateUserReturn)
        {
            case USER_NOT_FOUND: {
                p_error.code = UserControllerErrorHandler.USER_NOT_FOUND;
                return false;
            }
            case MAIL_TOKEN_VALIDATION: {
                p_error.code = UserControllerErrorHandler.CANT_VALIDATE_MAILTOKEN;
                return false;
            }
        }
        return true;
    }
}
