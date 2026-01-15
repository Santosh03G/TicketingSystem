package com.ticketingsystem.repository;

import com.ticketingsystem.model.Ticket;
import com.ticketingsystem.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedById(Long userId);

    List<Ticket> findByAssignedToId(Long userId);

    long countByStatus(TicketStatus status);

    long countByStatusAndUpdatedAtBetween(TicketStatus status, java.time.LocalDateTime start,
            java.time.LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT t FROM Ticket t WHERE " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:userId IS NULL OR t.createdBy.id = :userId) AND " +
            "(:start IS NULL OR t.createdAt >= :start) AND " +
            "(:end IS NULL OR t.createdAt <= :end)")
    List<Ticket> searchTickets(
            @org.springframework.data.repository.query.Param("status") TicketStatus status,
            @org.springframework.data.repository.query.Param("userId") Long userId,
            @org.springframework.data.repository.query.Param("start") java.time.LocalDateTime start,
            @org.springframework.data.repository.query.Param("end") java.time.LocalDateTime end);
}
