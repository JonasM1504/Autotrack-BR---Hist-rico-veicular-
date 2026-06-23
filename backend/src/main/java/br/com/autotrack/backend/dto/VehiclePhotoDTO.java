package br.com.autotrack.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiclePhotoDTO {
    private Long id;
    private String originalName;
    private String url;
    private LocalDateTime createdAt;
}
