package br.com.autotrack.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehiclePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String originalName;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
