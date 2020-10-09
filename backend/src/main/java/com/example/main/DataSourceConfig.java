package com.example.main;

import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
public class DataSourceConfig {


    @Bean("DatabaseBean")
    public DataSource getDataSource()
    {
        DriverManagerDataSource l_dDataSource = new DriverManagerDataSource();
        l_dDataSource.setDriverClassName("org.sqlite.JDBC");
        l_dDataSource.setUrl("jdbc:sqlite:database/database.db");
        return l_dDataSource;
    }
}

