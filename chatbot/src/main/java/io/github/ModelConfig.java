package io.github;

import dev.langchain4j.model.bedrock.BedrockChatModel;
import dev.langchain4j.model.bedrock.BedrockStreamingChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeAsyncClient;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

@Component
public class ModelConfig {
    private static String MODEL_NAME = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";
    private static String LLAMA_3_1_70B = "us.meta.llama3-1-70b-instruct-v1:0";

    @Bean
    public ChatModel chatModel(BedrockRuntimeClient client) {
        return BedrockChatModel.builder()
                .client(client)
                .modelId(MODEL_NAME)
                .maxRetries(3)
                .logRequests(true)
                .logResponses(true)
                .build();
    }

    @Bean
    public StreamingChatModel streamingChatModel(BedrockRuntimeAsyncClient client) {
        return BedrockStreamingChatModel.builder()
                .client(client)
                .modelId(MODEL_NAME)
                .logRequests(true)
                .logResponses(true)
                .build();
    }

    @Bean
    public BedrockRuntimeClient bedrockRuntimeClient() {
        return BedrockRuntimeClient.builder()
                .region(Region.US_WEST_2) // pick the correct Bedrock region
                .build();
    }

    @Bean
    public BedrockRuntimeAsyncClient bedrockRuntimeAsyncClient() {
        return BedrockRuntimeAsyncClient.builder()
                .region(Region.US_WEST_2) // pick the correct Bedrock region
                .build();
    }

}
