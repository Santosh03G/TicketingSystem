package com.ticketingsystem.controller;

import com.ticketingsystem.model.Ticket;
import com.ticketingsystem.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticketDetails) {
        try {
            return ResponseEntity.ok(ticketService.updateTicket(id, ticketDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/comments")
    public List<com.ticketingsystem.model.Comment> getComments(@PathVariable Long id) {
        return ticketService.getCommentsByTicketId(id);
    }

    @PostMapping("/{id}/comments")
    public com.ticketingsystem.model.Comment addComment(@PathVariable Long id,
            @RequestBody com.ticketingsystem.dto.CommentRequest request) {
        return ticketService.addComment(id, request);
    }

    @GetMapping("/search")
    public List<Ticket> searchTickets(
            @RequestParam(required = false) com.ticketingsystem.model.TicketStatus status,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime start,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime end) {
        System.out.println("Search Req: status=" + status + ", userId=" + userId + ", start=" + start + ", end=" + end);
        return ticketService.searchTickets(status, userId, start, end);
    }
}
