package io.github;

import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class ChatBotConfig {

    @Bean
    public ChatBot chatBot(ChatModel model, StreamingChatModel streamingChatModel, EsgTools esgTools) {
        return AiServices
                .builder(ChatBot.class)
                .streamingChatModel(streamingChatModel)
                .chatModel(model)
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(20))
                .tools(esgTools)
                .build();
    }

}
