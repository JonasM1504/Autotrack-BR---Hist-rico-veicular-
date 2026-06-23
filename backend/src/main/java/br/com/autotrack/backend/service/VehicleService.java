package br.com.autotrack.backend.service;

import br.com.autotrack.backend.dto.VehicleRequestDTO;
import br.com.autotrack.backend.dto.VehicleResponseDTO;
import br.com.autotrack.backend.exception.BusinessException;
import br.com.autotrack.backend.exception.ResourceNotFoundException;
import br.com.autotrack.backend.model.Vehicle;
import br.com.autotrack.backend.model.VehicleStatus;
import br.com.autotrack.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<VehicleResponseDTO> findAll() {
        return vehicleRepository.findAll()
            .stream().map(this::toDTO).toList();
    }

    public VehicleResponseDTO findById(Long id) {
        return toDTO(vehicleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado: " + id)));
    }

    public VehicleResponseDTO findByPlate(String plate) {
        return toDTO(vehicleRepository.findByPlate(plate.toUpperCase())
            .orElseThrow(() -> new ResourceNotFoundException("Placa não encontrada: " + plate)));
    }

    public VehicleResponseDTO findByVin(String vin) {
        return toDTO(vehicleRepository.findByVin(vin.toUpperCase())
            .orElseThrow(() -> new ResourceNotFoundException("Chassi não encontrado: " + vin)));
    }

    public VehicleResponseDTO create(VehicleRequestDTO dto) {
        if (vehicleRepository.existsByPlate(dto.getPlate().toUpperCase())) {
            throw new BusinessException("Placa já cadastrada: " + dto.getPlate());
        }
        Vehicle vehicle = Vehicle.builder()
            .plate(dto.getPlate().toUpperCase())
            .vin(dto.getVin() != null ? dto.getVin().toUpperCase() : null)
            .brand(dto.getBrand())
            .model(dto.getModel())
            .year(dto.getYear())
            .color(dto.getColor())
            .fuelType(dto.getFuelType())
            .mileage(dto.getMileage())
            .notes(dto.getNotes())
            .status(dto.getStatus() != null ? dto.getStatus() : VehicleStatus.REGULAR)
            .fipeCode(dto.getFipeCode())
            .fipePrice(dto.getFipePrice())
            .fipeReference(dto.getFipeReference())
            .build();
        return toDTO(vehicleRepository.save(vehicle));
    }

    public VehicleResponseDTO update(Long id, VehicleRequestDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado: " + id));
        vehicle.setPlate(dto.getPlate().toUpperCase());
        vehicle.setVin(dto.getVin() != null ? dto.getVin().toUpperCase() : null);
        vehicle.setBrand(dto.getBrand());
        vehicle.setModel(dto.getModel());
        vehicle.setYear(dto.getYear());
        vehicle.setColor(dto.getColor());
        vehicle.setFuelType(dto.getFuelType());
        vehicle.setMileage(dto.getMileage());
        vehicle.setNotes(dto.getNotes());
        vehicle.setStatus(dto.getStatus());
        vehicle.setFipeCode(dto.getFipeCode());
        vehicle.setFipePrice(dto.getFipePrice());
        vehicle.setFipeReference(dto.getFipeReference());
        return toDTO(vehicleRepository.save(vehicle));
    }

    public void delete(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Veículo não encontrado: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    private VehicleResponseDTO toDTO(Vehicle v) {
        VehicleResponseDTO dto = new VehicleResponseDTO();
        dto.setId(v.getId());
        dto.setPlate(v.getPlate());
        dto.setVin(v.getVin());
        dto.setBrand(v.getBrand());
        dto.setModel(v.getModel());
        dto.setYear(v.getYear());
        dto.setColor(v.getColor());
        dto.setFuelType(v.getFuelType());
        dto.setMileage(v.getMileage());
        dto.setNotes(v.getNotes());
        dto.setStatus(v.getStatus());
        dto.setFipeCode(v.getFipeCode());
        dto.setFipePrice(v.getFipePrice());
        dto.setFipeReference(v.getFipeReference());
        dto.setCreatedAt(v.getCreatedAt());
        dto.setUpdatedAt(v.getUpdatedAt());
        return dto;
    }
}