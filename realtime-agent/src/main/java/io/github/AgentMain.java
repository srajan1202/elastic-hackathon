package io.github;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.bedrock.BedrockChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

import java.io.IOException;

public class AgentMain implements RequestHandler<SQSEvent, Void> {
    private static String MODEL_NAME = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";
    private final EsgEventClassifier esgEventClassifier;
    private final EsgEventEnricher esgEventEnricher;
    private final ChatModel model;
    private final ElasticsearchClient elasticsearchClient;

    public AgentMain() {
        var client = BedrockRuntimeClient.builder()
                .region(Region.US_WEST_2)
                .build();
        model = BedrockChatModel.builder()
                .client(client)
                .modelId(MODEL_NAME)
                .maxRetries(3)
                .logRequests(true)
                .logResponses(true)
                .build();
        esgEventClassifier = AiServices
                .builder(EsgEventClassifier.class)
                .chatModel(model)
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(5))
                .build();
        esgEventEnricher = AiServices
                .builder(EsgEventEnricher.class)
                .chatModel(model)
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(5))
                .build();

        elasticsearchClient = new ElasticConfig().restClient();

    }

    @Override
    public Void handleRequest(SQSEvent event, Context context) {
        event.getRecords().forEach(record -> {
            var eventData = record.getBody();
            EsgClassificationResult classify = esgEventClassifier.classify(eventData);
            context.getLogger().log("Classify: " + classify);
            if (classify.isEsg()) {
                EnrichedEvent enrich = esgEventEnricher.enrich(eventData);
                context.getLogger().log("Enriched event: " + enrich);

                try {
                    IndexResponse response = elasticsearchClient.index(i -> i
                            .index("realtime-events-data")
                            .document(enrich)
                    );
                    context.getLogger().log("Index response: " + response);
                } catch (IOException e) {
                    context.getLogger().log(e.getMessage());
                    throw new RuntimeException(e);
                }
            }
        });
        return null;
    }
}

