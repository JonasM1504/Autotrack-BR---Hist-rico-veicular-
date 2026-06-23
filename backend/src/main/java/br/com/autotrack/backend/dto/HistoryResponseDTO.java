package br.com.autotrack.backend.dto;

import br.com.autotrack.backend.model.EventType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class HistoryResponseDTO {
    private Long id;
    private Long vehicleId;
    private String vehiclePlate;
    private EventType eventType;
    private LocalDate eventDate;
    private String description;
    private String source;
    private Integer mileage;
    private LocalDateTime createdAt;
}