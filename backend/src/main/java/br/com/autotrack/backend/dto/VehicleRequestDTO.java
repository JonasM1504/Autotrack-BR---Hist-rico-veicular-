package br.com.autotrack.backend.dto;

import br.com.autotrack.backend.model.VehicleStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class VehicleRequestDTO {

    @NotBlank(message = "Placa é obrigatória")
    @Pattern(regexp = "[A-Z]{3}[0-9][A-Z0-9][0-9]{2}", message = "Placa inválida")
    private String plate;

    @Size(max = 17)
    private String vin;

    @NotBlank(message = "Marca é obrigatória")
    private String brand;

    @NotBlank(message = "Modelo é obrigatório")
    private String model;

    @NotNull(message = "Ano é obrigatório")
    @Min(value = 1900, message = "Ano inválido")
    @Max(value = 2100, message = "Ano inválido")
    private Integer year;

    private String color;
    private String fuelType;
    private Integer mileage;

    @Size(max = 2000)
    private String notes;

    private VehicleStatus status;

    @Size(max = 15)
    private String fipeCode;

    @Size(max = 25)
    private String fipePrice;

    @Size(max = 40)
    private String fipeReference;
}