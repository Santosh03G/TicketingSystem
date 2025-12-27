package com.ticketingsystem.controller;

import com.ticketingsystem.model.TicketStatus;
import com.ticketingsystem.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private TicketService ticketService;

    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("open", ticketService.countByStatus(TicketStatus.OPEN));
        stats.put("in_progress", ticketService.countByStatus(TicketStatus.IN_PROGRESS));
        stats.put("resolved", ticketService.countByStatus(TicketStatus.RESOLVED));
        return stats;
    }
}
