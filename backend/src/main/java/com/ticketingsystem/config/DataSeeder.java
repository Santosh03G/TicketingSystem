package com.ticketingsystem.config;

import com.ticketingsystem.model.Role;
import com.ticketingsystem.model.User;
import com.ticketingsystem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setName("Santosh Admin");
                admin.setEmail("santosh.g@saazvat.com");
                admin.setPassword("password"); // In real app, hash this!
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Default admin user created: santosh.g@saazvat.com / password");
            }
        };
    }
}
