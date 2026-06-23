package br.com.autotrack.backend.dto;

import br.com.autotrack.backend.model.EventType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class HistoryRequestDTO {

    @NotNull(message = "Tipo do evento é obrigatório")
    private EventType eventType;

    @NotNull(message = "Data do evento é obrigatória")
    private LocalDate eventDate;

    private String description;
    private String source;

    @Min(value = 0, message = "KM não pode ser negativo")
    private Integer mileage;
}