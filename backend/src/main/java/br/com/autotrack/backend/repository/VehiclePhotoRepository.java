package br.com.autotrack.backend.repository;

import br.com.autotrack.backend.model.VehiclePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehiclePhotoRepository extends JpaRepository<VehiclePhoto, Long> {
    List<VehiclePhoto> findByVehicleIdOrderByCreatedAtDesc(Long vehicleId);
    Optional<VehiclePhoto> findByIdAndVehicleId(Long id, Long vehicleId);
}
