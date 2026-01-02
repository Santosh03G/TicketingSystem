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
            System.out.println("Successfully ensured 'is_deleted' column exists in 'users' table.");
        } catch (Exception e) {
            System.err.println("Error initializing database schema: " + e.getMessage());
        }
    }
}
