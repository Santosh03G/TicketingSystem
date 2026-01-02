package com.ticketingsystem.controller;

import com.ticketingsystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/email")
    public String testEmail() {
        try {
            // Send to self to test
            emailService.sendSimpleEmail("santoshraina11999@gmail.com", "Test Email",
                    "This is a test email from the backend.");
            return "Email Sent Successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Email Sending Failed: " + e.getMessage();
        }
    }
}
