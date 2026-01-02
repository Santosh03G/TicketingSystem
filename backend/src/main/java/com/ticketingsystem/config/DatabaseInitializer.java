package com.ticketingsystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running Database Initializer...");
        try {
            String sql = "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE NOT NULL";
            jdbcTemplate.execute(sql);
            String sql2 = "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE NOT NULL";
            jdbcTemplate.execute(sql2);
            System.out.println("Successfully ensured 'is_deleted' and 'is_new' columns exist in 'users' table.");
        } catch (Exception e) {
            System.err.println("Error initializing database schema: " + e.getMessage());
        }
    }
}
