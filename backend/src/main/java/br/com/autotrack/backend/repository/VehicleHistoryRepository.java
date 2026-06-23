package br.com.autotrack.backend.repository;

import br.com.autotrack.backend.model.VehicleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleHistoryRepository extends JpaRepository<VehicleHistory, Long> {
    List<VehicleHistory> findByVehicleIdOrderByEventDateDesc(Long vehicleId);
}