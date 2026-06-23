package br.com.autotrack.backend.controller;

import br.com.autotrack.backend.dto.HistoryRequestDTO;
import br.com.autotrack.backend.dto.HistoryResponseDTO;
import br.com.autotrack.backend.service.VehicleHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles/{vehicleId}/history")
@RequiredArgsConstructor
public class VehicleHistoryController {

    private final VehicleHistoryService historyService;

    @GetMapping
    public ResponseEntity<List<HistoryResponseDTO>> findAll(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(historyService.findByVehicleId(vehicleId));
    }

    @PostMapping
    public ResponseEntity<HistoryResponseDTO> create(
            @PathVariable Long vehicleId,
            @RequestBody @Valid HistoryRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(historyService.create(vehicleId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long vehicleId, @PathVariable Long id) {
        historyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}