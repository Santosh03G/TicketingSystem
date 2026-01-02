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
            // Create Admin
            if (!userRepository.existsByEmail("santosh.g@saazvat.com")) {
                User admin = new User();
                admin.setName("Santosh Admin");
                admin.setEmail("santosh.g@saazvat.com");
                admin.setPassword("Saazvat@120");
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Admin created: santosh.g@saazvat.com");
            }

            // Create User
            if (!userRepository.existsByEmail("reachoutsantosh.g@gmail.com")) {
                User user = new User();
                user.setName("Santosh User");
                user.setEmail("reachoutsantosh.g@gmail.com");
                user.setPassword("Anadearms@1011");
                user.setRole(Role.USER);
                userRepository.save(user);
                System.out.println("User created: reachoutsantosh.g@gmail.com");
            }
        };
    }
}
