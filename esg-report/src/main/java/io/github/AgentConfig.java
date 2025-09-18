package io.github;

import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.bedrock.BedrockChatModel;
import dev.langchain4j.model.bedrock.BedrockStreamingChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeAsyncClient;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

public class AgentConfig {
    private static String MODEL_NAME = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";

    public ESGAgent esgAgent() {
        return AiServices
                .builder(ESGAgent.class)
                .streamingChatModel(streamingChatModel())
                .chatModel(chatModel())
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(20))
                .tools(new EsgTools())
                .build();
    }

    public ChatModel chatModel() {

        return BedrockChatModel.builder()
                .client(bedrockRuntimeClient())
                .modelId(MODEL_NAME)
                .maxRetries(3)
                .logRequests(true)
                .logResponses(true)
                .build();
    }

    public StreamingChatModel streamingChatModel() {
        return BedrockStreamingChatModel.builder()
                .client(bedrockRuntimeAsyncClient())
                .modelId(MODEL_NAME)
                .logRequests(true)
                .logResponses(true)
                .build();
    }

    public BedrockRuntimeClient bedrockRuntimeClient() {
        return BedrockRuntimeClient.builder()
                .region(Region.US_WEST_2) // pick the correct Bedrock region
                .build();
    }

    public BedrockRuntimeAsyncClient bedrockRuntimeAsyncClient() {
        return BedrockRuntimeAsyncClient.builder()
                .region(Region.US_WEST_2) // pick the correct Bedrock region
                .build();
    }
}
