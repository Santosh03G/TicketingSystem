package com.ticketingsystem.service;

import com.ticketingsystem.model.Ticket;
import com.ticketingsystem.model.TicketStatus;
import com.ticketingsystem.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private EmailService emailService;

    // We already have UserRepository injected below as 'userRepository', so we can
    // reuse it
    // But since it is private below, it's better to move it up or ensure it's
    // accessible.
    // However, for cleaner code, I will use the one already autowired below.
    // Wait, the one below is `com.ticketingsystem.repository.UserRepository`.
    // I will rely on that field.

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public Ticket createTicket(Ticket ticket) {
        Ticket savedTicket = ticketRepository.save(ticket);

        // Send email to Creator
        if (savedTicket.getCreatedBy() != null && savedTicket.getCreatedBy().getEmail() != null) {
            String subject = "Ticket Created: #" + savedTicket.getId();
            String body = "Your ticket has been created successfully.\n\n" +
                    "Title: " + savedTicket.getTitle() + "\n" +
                    "Description: " + savedTicket.getDescription();
            emailService.sendSimpleEmail(savedTicket.getCreatedBy().getEmail(), subject, body);
        }

        // Send email to Admins
        notifyAdmins(savedTicket, "New Ticket Created: #" + savedTicket.getId());

        return savedTicket;
    }

    public Ticket updateTicket(Long id, Ticket ticketDetails) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        TicketStatus oldStatus = ticket.getStatus();

        if (ticketDetails.getTitle() != null)
            ticket.setTitle(ticketDetails.getTitle());
        if (ticketDetails.getDescription() != null)
            ticket.setDescription(ticketDetails.getDescription());
        if (ticketDetails.getStatus() != null)
            ticket.setStatus(ticketDetails.getStatus());
        if (ticketDetails.getPriority() != null)
            ticket.setPriority(ticketDetails.getPriority());
        if (ticketDetails.getAssignedTo() != null)
            ticket.setAssignedTo(ticketDetails.getAssignedTo());

        Ticket updatedTicket = ticketRepository.save(ticket);

        // Check for status change
        if (ticketDetails.getStatus() != null && oldStatus != ticketDetails.getStatus()) {
            if (ticketDetails.getStatus() == TicketStatus.RESOLVED
                    || ticketDetails.getStatus() == TicketStatus.DENIED) {
                // Notify Creator
                if (updatedTicket.getCreatedBy() != null && updatedTicket.getCreatedBy().getEmail() != null) {
                    String subject = "Ticket Updated: #" + updatedTicket.getId();
                    String body = "Your ticket status has been updated to " + ticketDetails.getStatus() + ".\n\n" +
                            "Title: " + updatedTicket.getTitle();
                    emailService.sendSimpleEmail(updatedTicket.getCreatedBy().getEmail(), subject, body);
                }

                // Notify Admins
                notifyAdmins(updatedTicket, "Ticket Status Updated: #" + updatedTicket.getId());
            }
        }

        return updatedTicket;
    }

    private void notifyAdmins(Ticket ticket, String subject) {
        List<com.ticketingsystem.model.User> admins = userRepository.findByRole(com.ticketingsystem.model.Role.ADMIN);
        List<com.ticketingsystem.model.User> staff = userRepository.findByRole(com.ticketingsystem.model.Role.STAFF); // Also
                                                                                                                      // notify
                                                                                                                      // staff?
                                                                                                                      // Usually
                                                                                                                      // yes.

        // combine list
        java.util.Set<String> adminEmails = new java.util.HashSet<>();
        admins.forEach(u -> adminEmails.add(u.getEmail()));
        staff.forEach(u -> adminEmails.add(u.getEmail()));

        String body = "Action required/Reference for ticket.\n" +
                "Title: " + ticket.getTitle() + "\n" +
                "Status: " + ticket.getStatus() + "\n" +
                "Creator: " + (ticket.getCreatedBy() != null ? ticket.getCreatedBy().getName() : "Unknown");

        for (String email : adminEmails) {
            if (email != null && !email.isEmpty()) {
                emailService.sendSimpleEmail(email, subject, body);
            }
        }
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    public long countByStatus(TicketStatus status) {
        return ticketRepository.countByStatus(status);
    }

    @Autowired
    private com.ticketingsystem.repository.CommentRepository commentRepository;

    @Autowired
    private com.ticketingsystem.repository.UserRepository userRepository;

    public com.ticketingsystem.model.Comment addComment(Long ticketId, com.ticketingsystem.dto.CommentRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        com.ticketingsystem.model.User author = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.ticketingsystem.model.Comment comment = new com.ticketingsystem.model.Comment();
        comment.setContent(request.getContent());
        comment.setTicket(ticket);
        comment.setAuthor(author);

        return commentRepository.save(comment);
    }

    public List<com.ticketingsystem.model.Comment> getCommentsByTicketId(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtDesc(ticketId);
    }

    public long countResolvedToday() {
        java.time.LocalDateTime start = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime end = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);
        return ticketRepository.countByStatusAndUpdatedAtBetween(TicketStatus.RESOLVED, start, end);
    }

    public long countResolvedThisMonth() {
        java.time.LocalDateTime start = java.time.YearMonth.now().atDay(1).atStartOfDay();
        java.time.LocalDateTime end = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);
        return ticketRepository.countByStatusAndUpdatedAtBetween(TicketStatus.RESOLVED, start, end);
    }

    public long countResolvedTotal() {
        return ticketRepository.countByStatus(TicketStatus.RESOLVED);
    }

    public List<Ticket> searchTickets(TicketStatus status, Long userId, java.time.LocalDateTime start,
            java.time.LocalDateTime end) {
        return ticketRepository.searchTickets(status, userId, start, end);
    }
}
