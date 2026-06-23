package br.com.autotrack.backend.controller;

import br.com.autotrack.backend.service.FipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/fipe")
@RequiredArgsConstructor
public class FipeController {

    private final FipeService fipeService;

    @GetMapping("/marcas")
    public ResponseEntity<List<Map<String, Object>>> getMarcas(
            @RequestParam(defaultValue = "1") int tipo) {
        return ResponseEntity.ok(fipeService.getMarcas(tipo));
    }

    @GetMapping("/modelos")
    public ResponseEntity<Map<String, Object>> getModelos(
            @RequestParam int tipo,
            @RequestParam int marca) {
        return ResponseEntity.ok(fipeService.getModelos(tipo, marca));
    }

    @GetMapping("/anos")
    public ResponseEntity<List<Map<String, Object>>> getAnos(
            @RequestParam int tipo,
            @RequestParam int marca,
            @RequestParam int modelo) {
        return ResponseEntity.ok(fipeService.getAnos(tipo, marca, modelo));
    }

    @GetMapping("/preco")
    public ResponseEntity<Map<String, Object>> getPreco(
            @RequestParam int tipo,
            @RequestParam int marca,
            @RequestParam int modelo,
            @RequestParam String ano) {
        return ResponseEntity.ok(fipeService.getPreco(tipo, marca, modelo, ano));
    }
}
