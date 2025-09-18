package io.github;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.service.V;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EsgTools {
    private static final Logger log = LoggerFactory.getLogger(EsgTools.class);
    private final EmbeddingStoreProvider embeddingStoreProvider;
    private final EmbeddingModel embeddingModel;
    private final ElasticsearchClient elasticsearchClient;

    public EsgTools(EmbeddingStoreProvider embeddingStoreProvider, EmbeddingModel embeddingModel, ElasticsearchClient elasticsearchClient) {
        this.embeddingStoreProvider = embeddingStoreProvider;
        this.embeddingModel = embeddingModel;
        this.elasticsearchClient = elasticsearchClient;
    }

    @Tool("Search ESG report text using semantic vector search")
    public String search(
            @V("semantic query text") String query,
            @V("Elasticsearch index name for the company's ESG report in a given year") String indexName
    ) {
        try {
            log.info("Search ESG report text using semantic vector search");
            var store = embeddingStoreProvider.getEmbeddingStore(indexName);
            var textSegment = TextSegment.textSegment(query);
            var embedding = embeddingModel.embed(textSegment).content();

            var request = EmbeddingSearchRequest.builder()
                    .queryEmbedding(embedding)
                    .maxResults(20)
                    .build();

            var result = store.search(request);

            var sb = new StringBuilder();
            result.matches().forEach(match -> {
                sb.append(match.embedded().text()).append("\n\n");
            });
            return sb.toString();
        } catch (Exception e) {
            return "No such index";
        }
    }


}
