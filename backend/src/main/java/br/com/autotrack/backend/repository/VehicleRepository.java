package br.com.autotrack.backend.repository;

import br.com.autotrack.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByPlate(String plate);
    Optional<Vehicle> findByVin(String vin);
    boolean existsByPlate(String plate);
}