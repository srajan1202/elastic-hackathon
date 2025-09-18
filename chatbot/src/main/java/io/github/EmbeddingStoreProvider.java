package io.github;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.elasticsearch.ElasticsearchEmbeddingStore;
import org.elasticsearch.client.RestClient;
import org.springframework.stereotype.Component;

@Component
public class EmbeddingStoreProvider {
    private final RestClient restClient;

    public EmbeddingStoreProvider(RestClient restClient) {
        this.restClient = restClient;
    }

    public EmbeddingStore<TextSegment> getEmbeddingStore(String index) {
        return ElasticsearchEmbeddingStore
                .builder()
                .restClient(restClient)
                .indexName(index)
                .build();
    }
}
