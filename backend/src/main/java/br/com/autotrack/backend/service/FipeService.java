package br.com.autotrack.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class FipeService {

    private static final String FIPE_BASE = "https://veiculos.fipe.org.br/api/veiculos";

    private final RestTemplate restTemplate = new RestTemplate();

    private Integer cachedRefCode;
    private LocalDateTime cacheTime;

    private Integer getRefCode() {
        if (cachedRefCode == null || cacheTime == null ||
                cacheTime.plusHours(12).isBefore(LocalDateTime.now())) {
            HttpHeaders headers = buildHeaders();
            var response = restTemplate.exchange(
                    FIPE_BASE + "/ConsultarTabelaDeReferencia",
                    HttpMethod.POST,
                    new HttpEntity<>(headers),
                    List.class);
            @SuppressWarnings("unchecked")
            var list = (List<Map<String, Object>>) response.getBody();
            cachedRefCode = (Integer) list.get(0).get("Codigo");
            cacheTime = LocalDateTime.now();
            log.info("FIPE reference code updated: {}", cachedRefCode);
        }
        return cachedRefCode;
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        h.set("Referer", "https://veiculos.fipe.org.br/");
        return h;
    }

    private <T> T post(String path, MultiValueMap<String, String> body, Class<T> type) {
        var entity = new HttpEntity<>(body, buildHeaders());
        return restTemplate.postForObject(FIPE_BASE + path, entity, type);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getMarcas(int tipo) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("codigoTabelaReferencia", getRefCode().toString());
        body.add("codigoTipoVeiculo", String.valueOf(tipo));
        return post("/ConsultarMarcas", body, List.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getModelos(int tipo, int marca) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("codigoTabelaReferencia", getRefCode().toString());
        body.add("codigoTipoVeiculo", String.valueOf(tipo));
        body.add("codigoMarca", String.valueOf(marca));
        return post("/ConsultarModelos", body, Map.class);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAnos(int tipo, int marca, int modelo) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("codigoTabelaReferencia", getRefCode().toString());
        body.add("codigoTipoVeiculo", String.valueOf(tipo));
        body.add("codigoMarca", String.valueOf(marca));
        body.add("codigoModelo", String.valueOf(modelo));
        return post("/ConsultarAnoModelo", body, List.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getPreco(int tipo, int marca, int modelo, String ano) {
        String anoModelo = ano.split("-")[0];
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("codigoTabelaReferencia", getRefCode().toString());
        body.add("codigoTipoVeiculo", String.valueOf(tipo));
        body.add("codigoMarca", String.valueOf(marca));
        body.add("codigoModelo", String.valueOf(modelo));
        body.add("ano", ano);
        body.add("codigoAnoModelo", anoModelo);
        body.add("tipoPesquisa", "2");
        return post("/ConsultarValorComTodosParametros", body, Map.class);
    }
}
