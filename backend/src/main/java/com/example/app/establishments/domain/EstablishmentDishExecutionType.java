package com.example.app.establishments.domain;


public enum EstablishmentDishExecutionType
{
    DEFAULT, ADD, REMOVE;

    public static EstablishmentDishExecutionType fromInt(int p_value)
    {
        switch (p_value)
        {
            case 0:
                return EstablishmentDishExecutionType.ADD;
            case 1:
                return EstablishmentDishExecutionType.REMOVE;
            default:
                return EstablishmentDishExecutionType.DEFAULT;
        }
    }
}
