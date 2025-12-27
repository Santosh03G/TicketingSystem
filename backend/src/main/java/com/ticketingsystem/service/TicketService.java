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

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(Long id, Ticket ticketDetails) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

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

        return ticketRepository.save(ticket);
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
}
