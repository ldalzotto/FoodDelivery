package com.example.main;

public class ValidationMessage
{
    public String field;
    public String message;

    public boolean isNull(){
        return this.field == null || this.field.isEmpty() || this.message == null || this.message.isEmpty();
    }

    public static boolean string_nullOrEmpty(String p_string)
    {
        return p_string==null || p_string.isEmpty();
    }

}