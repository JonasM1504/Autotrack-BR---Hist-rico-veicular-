package br.com.autotrack.backend.service;

import br.com.autotrack.backend.dto.HistoryRequestDTO;
import br.com.autotrack.backend.dto.HistoryResponseDTO;
import br.com.autotrack.backend.exception.ResourceNotFoundException;
import br.com.autotrack.backend.model.Vehicle;
import br.com.autotrack.backend.model.VehicleHistory;
import br.com.autotrack.backend.repository.VehicleHistoryRepository;
import br.com.autotrack.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleHistoryService {

    private final VehicleHistoryRepository historyRepository;
    private final VehicleRepository vehicleRepository;

    public List<HistoryResponseDTO> findByVehicleId(Long vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException("Veículo não encontrado: " + vehicleId);
        }
        return historyRepository.findByVehicleIdOrderByEventDateDesc(vehicleId)
            .stream().map(this::toDTO).toList();
    }

    public HistoryResponseDTO create(Long vehicleId, HistoryRequestDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado: " + vehicleId));

        VehicleHistory history = VehicleHistory.builder()
            .vehicle(vehicle)
            .eventType(dto.getEventType())
            .eventDate(dto.getEventDate())
            .description(dto.getDescription())
            .source(dto.getSource())
            .mileage(dto.getMileage())
            .build();

        return toDTO(historyRepository.save(history));
    }

    public void delete(Long id) {
        if (!historyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento não encontrado: " + id);
        }
        historyRepository.deleteById(id);
    }

    private HistoryResponseDTO toDTO(VehicleHistory h) {
        HistoryResponseDTO dto = new HistoryResponseDTO();
        dto.setId(h.getId());
        dto.setVehicleId(h.getVehicle().getId());
        dto.setVehiclePlate(h.getVehicle().getPlate());
        dto.setEventType(h.getEventType());
        dto.setEventDate(h.getEventDate());
        dto.setDescription(h.getDescription());
        dto.setSource(h.getSource());
        dto.setMileage(h.getMileage());
        dto.setCreatedAt(h.getCreatedAt());
        return dto;
    }
}