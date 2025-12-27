package com.ticketingsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Setting {

    @Id
    @Column(unique = true, nullable = false)
    private String key;

    @Column(nullable = false)
    private String value;
}
