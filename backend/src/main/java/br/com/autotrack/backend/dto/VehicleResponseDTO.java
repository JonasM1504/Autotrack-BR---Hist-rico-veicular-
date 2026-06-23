package br.com.autotrack.backend.dto;

import br.com.autotrack.backend.model.VehicleStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VehicleResponseDTO {

    private Long id;
    private String plate;
    private String vin;
    private String brand;
    private String model;
    private Integer year;
    private String color;
    private String fuelType;
    private Integer mileage;
    private String notes;
    private VehicleStatus status;
    private String fipeCode;
    private String fipePrice;
    private String fipeReference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}