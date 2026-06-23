package br.com.autotrack.backend.controller;

import br.com.autotrack.backend.dto.VehiclePhotoDTO;
import br.com.autotrack.backend.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping("/vehicles/{id}/photos")
    public ResponseEntity<VehiclePhotoDTO> upload(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(photoService.upload(id, file));
    }

    @GetMapping("/vehicles/{id}/photos")
    public ResponseEntity<List<VehiclePhotoDTO>> list(@PathVariable Long id) {
        return ResponseEntity.ok(photoService.findByVehicle(id));
    }

    @DeleteMapping("/vehicles/{id}/photos/{photoId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @PathVariable Long photoId) throws IOException {
        photoService.delete(id, photoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/photos/{filename}")
    public ResponseEntity<Resource> getPhoto(@PathVariable String filename) throws IOException {
        Resource resource = photoService.loadAsResource(filename);
        String contentType = filename.toLowerCase().endsWith(".png") ? "image/png"
            : filename.toLowerCase().endsWith(".webp") ? "image/webp"
            : "image/jpeg";
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .body(resource);
    }
}
