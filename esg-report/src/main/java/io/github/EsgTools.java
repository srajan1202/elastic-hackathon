package io.github;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.service.V;

import java.io.IOException;
import java.util.Map;

public class EsgTools {
    private final ElasticsearchClient client;

    public EsgTools() {
        this.client = new ElasticConfig().elasticClient();
    }

    record Response(String text, Map<String, String> metadata) {
    }

    @Tool("Search ESG report text using semantic vector search")
    public String search(
            @V("semantic query text") String query,
            @V("Elasticsearch index name for the company's ESG report in a given year") String indexName
    ) {
        try {
            SearchResponse<Object> response = client.search(s -> s
                            .index(indexName) // change to your index
                            .knn(k -> k
                                    .field("vector")
                                    .numCandidates(100)
                                    .queryVectorBuilder(qvb -> qvb
                                            .textEmbedding(te -> te
                                                    .modelId("sentence-transformers__all-minilm-l12-v2")
                                                    .modelText(query)
                                            )
                                    )
                            ),
                    Object.class
            );
            StringBuilder builder = new StringBuilder();
            for (Hit<Object> hit : response.hits().hits()) {
                System.out.println(hit.source());
                builder.append(((Map) hit.source()).get("text")).append("\n\n");
            }
            return builder.toString();
        } catch (IOException e) {
            return "Failed to search ESG report.";
        }
    }

}
