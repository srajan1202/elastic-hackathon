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

public class EsgMain implements RequestHandler<SQSEvent, Void> {
    private static String MODEL_NAME = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";
    private final ChatModel model;
    private final ElasticsearchClient elasticsearchClient;
    private final ESGAgent esgAgent;

    public EsgMain() {
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
        esgAgent = AiServices
                .builder(ESGAgent.class)
                .chatModel(model)
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(5))
                .build();

        elasticsearchClient = new ElasticConfig().elasticClient();
    }

    @Override
    public Void handleRequest(SQSEvent event, Context context) {
        event.getRecords().forEach(record -> {
            var eventData = record.getBody();
            var report = esgAgent.generateReport(1, "Generate esg report for company in event: \n Event: " + eventData);
            context.getLogger().log("Report: " + report);
            try {
                IndexResponse response = elasticsearchClient.index(i -> i
                        .index("companies-esg-summary")
                        .document(report)
                );
                context.getLogger().log("Index response: " + response);
            } catch (IOException e) {
                context.getLogger().log(e.getMessage());
                throw new RuntimeException(e);
            }
        });
        return null;
    }

    public static void main(String[] args) {
        new EsgMain();
    }

}

