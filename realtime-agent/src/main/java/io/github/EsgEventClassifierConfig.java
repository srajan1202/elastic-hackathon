package io.github;

import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;

public class EsgEventClassifierConfig {

    public EsgEventClassifier esgEventClassifier(ChatModel model) {
        return AiServices
                .builder(EsgEventClassifier.class)
                .chatModel(model)
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(5))
                .build();
    }

    public EsgEventEnricher esgEventEnricher(ChatModel model) {
        return AiServices
                .builder(EsgEventEnricher.class)
                .chatModel(model)
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(5))
                .build();
    }

}
