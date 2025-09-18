package io.github.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.ESGReport;
import io.github.EnrichedEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class ReportController {
    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ReportController(RestClient restClient) {
        this.restClient = restClient;
    }


    @GetMapping("/api/report")
    public List<ESGReport> report(

    ) {
        Map<String, Object> request = Map.of(
                "query", Map.of("match_all", Map.of())
        );

        // Perform search
        Map<String, Object> response = restClient.post()
                .uri("/companies-esg-summary/_search")
                .body(request)
                .retrieve()
                .body(Map.class);

        // Extract hits
        List<Map<String, Object>> hits = (List<Map<String, Object>>)
                ((Map<String, Object>) response.get("hits")).get("hits");

        // Map each _source into your POJO
        return hits.stream()
                .map(hit -> (Map<String, Object>) hit.get("_source"))
                .map(src -> objectMapper.convertValue(src, ESGReport.class))
                .toList();
    }

    @GetMapping("/api/events")
    public List<EnrichedEvent> events(

    ) {
        Map<String, Object> request = Map.of(
                "query", Map.of("match_all", Map.of())
        );

        // Perform search
        Map<String, Object> response = restClient.post()
                .uri("/realtime-events-data/_search")
                .body(request)
                .retrieve()
                .body(Map.class);

        // Extract hits
        List<Map<String, Object>> hits = (List<Map<String, Object>>)
                ((Map<String, Object>) response.get("hits")).get("hits");

        // Map each _source into your POJO
        return hits.stream()
                .map(hit -> (Map<String, Object>) hit.get("_source"))
                .map(src -> objectMapper.convertValue(src, EnrichedEvent.class))
                .toList();
    }

}
