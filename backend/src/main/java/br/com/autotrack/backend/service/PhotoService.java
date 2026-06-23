package br.com.autotrack.backend.service;

import br.com.autotrack.backend.dto.VehiclePhotoDTO;
import br.com.autotrack.backend.exception.BusinessException;
import br.com.autotrack.backend.exception.ResourceNotFoundException;
import br.com.autotrack.backend.model.Vehicle;
import br.com.autotrack.backend.model.VehiclePhoto;
import br.com.autotrack.backend.repository.VehiclePhotoRepository;
import br.com.autotrack.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhotoService {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    private final VehiclePhotoRepository photoRepository;
    private final VehicleRepository vehicleRepository;

    public VehiclePhotoDTO upload(Long vehicleId, MultipartFile file) throws IOException {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado: " + vehicleId));

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("Apenas imagens são permitidas (JPEG, PNG, WebP)");
        }

        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
            ? originalName.substring(originalName.lastIndexOf('.'))
            : ".jpg";
        String filename = UUID.randomUUID() + ext;

        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);
        Files.copy(file.getInputStream(), uploadPath.resolve(filename));

        VehiclePhoto photo = VehiclePhoto.builder()
            .vehicle(vehicle)
            .filename(filename)
            .originalName(originalName != null ? originalName : filename)
            .build();

        return toDTO(photoRepository.save(photo));
    }

    public List<VehiclePhotoDTO> findByVehicle(Long vehicleId) {
        return photoRepository.findByVehicleIdOrderByCreatedAtDesc(vehicleId)
            .stream().map(this::toDTO).toList();
    }

    public void delete(Long vehicleId, Long photoId) throws IOException {
        VehiclePhoto photo = photoRepository.findByIdAndVehicleId(photoId, vehicleId)
            .orElseThrow(() -> new ResourceNotFoundException("Foto não encontrada"));

        Files.deleteIfExists(Paths.get(uploadDir).resolve(photo.getFilename()));
        photoRepository.delete(photo);
    }

    public Resource loadAsResource(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) {
            throw new ResourceNotFoundException("Foto não encontrada: " + filename);
        }
        return resource;
    }

    private VehiclePhotoDTO toDTO(VehiclePhoto p) {
        return new VehiclePhotoDTO(
            p.getId(),
            p.getOriginalName(),
            "/api/v1/photos/" + p.getFilename(),
            p.getCreatedAt()
        );
    }
}
