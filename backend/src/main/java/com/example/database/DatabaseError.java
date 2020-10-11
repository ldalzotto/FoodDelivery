package com.example.database;

import com.example.error.IHandledError;
import org.springframework.dao.DataAccessException;
import org.sqlite.SQLiteException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DatabaseError implements IHandledError
{
    public DatabaseConstants.ErrorCode Code = DatabaseConstants.ErrorCode.UNDEFINED;
    public String Message;
    public Object Error;

    private static final Pattern UniqueConstraintPattern = Pattern.compile("(?<=\\:\\s).+?(?=\\))"); // extract "users.email" from (UNIQUE constraint failed: users.email)

    public void populateFromException(DataAccessException p_exception)
    {
        SQLiteException l_sqlException = (SQLiteException)p_exception.getRootCause();
        this.Message = l_sqlException.getMessage();
        switch (l_sqlException.getResultCode().code)
        {
            case 19: //constraint
            {
                this.Code = DatabaseConstants.ErrorCode.UNIQUE_CONSTRAINT_VIOLATION;
                String l_errorMessage = l_sqlException.getMessage();

                Matcher l_matcher = UniqueConstraintPattern.matcher(l_errorMessage);
                if(l_matcher.find())
                {
                    String[] l_tableAndColumn = l_matcher.group(0).split("\\.");
                    if(l_tableAndColumn.length == 2)
                    {
                        DatabaseUniqueConstraintError l_constraintError = new DatabaseUniqueConstraintError();
                        l_constraintError.Table = l_tableAndColumn[0];
                        l_constraintError.Column = l_tableAndColumn[1];
                        this.Error = l_constraintError;
                    }
                }
            }
            break;
        }
    }
}
