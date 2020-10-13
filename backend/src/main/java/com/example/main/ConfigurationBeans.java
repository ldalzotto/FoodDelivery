package com.example.main;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.DependsOn;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import javax.annotation.PostConstruct;

@Component
@DependsOn("DatabaseBean")
public class ConfigurationBeans
{
    public static JdbcTemplate jdbcTemplate;
    public static PlatformTransactionManager transactionManager;
    public static RestTemplateBuilder restTemplateBuilder;

    @Autowired
    JdbcTemplate _jdbcTemplate;

    @Autowired
    DataSourceTransactionManager _dataSourceTransactionManager;

    @Autowired
    RestTemplateBuilder _restTenmplateBuilder;

    @PostConstruct
    public void init()
    {
        ConfigurationBeans.jdbcTemplate = _jdbcTemplate;
        ConfigurationBeans.transactionManager = _dataSourceTransactionManager;
        ConfigurationBeans.restTemplateBuilder = _restTenmplateBuilder;
    }
}
