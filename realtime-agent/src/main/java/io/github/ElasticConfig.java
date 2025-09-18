package io.github;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.client.RestClient;

public class ElasticConfig {

    private final String elasticUrl;
    private final String apiKey;

    public ElasticConfig() {
        this.elasticUrl = System.getenv("ELASTIC_URL");
        this.apiKey = System.getenv("ELASTIC_API_KEY");
    }


    public ElasticsearchClient restClient() {
        var restClient = RestClient
                .builder(HttpHost.create(elasticUrl))
                .setDefaultHeaders(new Header[]{
                        new BasicHeader("Authorization", "ApiKey " + apiKey)
                })
                .build();
        ElasticsearchTransport transport = new RestClientTransport(
                restClient, new JacksonJsonpMapper());
        return new ElasticsearchClient(transport);
    }
}
