package com.ticketingsystem.repository;

import com.ticketingsystem.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketIdOrderByCreatedAtDesc(Long ticketId);
}
