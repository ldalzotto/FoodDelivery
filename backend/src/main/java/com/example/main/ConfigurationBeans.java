package com.example.main;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
@DependsOn("DatabaseBean")
public class ConfigurationBeans
{
    public static JdbcTemplate jdbcTemplate;

    @Autowired
    JdbcTemplate _jdbcTemplate;

    @PostConstruct
    public void init()
    {
        ConfigurationBeans.jdbcTemplate = _jdbcTemplate;
    }
}
