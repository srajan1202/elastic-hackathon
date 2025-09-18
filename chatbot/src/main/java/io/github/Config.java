package io.github;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class Config {

    @Bean
    RestClient restClient(
            @Value("${elastic.url}") String elasticUrl,
            @Value("${elastic.apiKey}") String apiKey) {
        return RestClient.builder()
                .baseUrl(elasticUrl)
                .defaultHeader("Authorization", "ApiKey "+apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    ;
}
