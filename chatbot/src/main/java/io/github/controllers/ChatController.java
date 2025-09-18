package io.github.controllers;

import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.model.chat.response.PartialThinking;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.service.tool.BeforeToolExecution;
import dev.langchain4j.service.tool.ToolExecution;
import io.github.ChatBot;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatBot chatBot;

    public ChatController(ChatBot chatBot) {
        this.chatBot = chatBot;
    }

    @PostMapping
    public Map<String, Object> sendMessage(@RequestBody Map<String, Object> body) throws ExecutionException, InterruptedException {
        var message = body.get("message").toString();
        var chatStream = chatBot.chat(message, 1);
        CompletableFuture<ChatResponse> futureResponse = new CompletableFuture<>();
        chatStream
                .onPartialResponse((String partialResponse) -> System.out.println(partialResponse))
                .onPartialThinking((PartialThinking partialThinking) -> System.out.println(partialThinking))
                .onRetrieved((List<Content> contents) -> System.out.println(contents))
                .onIntermediateResponse((ChatResponse intermediateResponse) -> System.out.println(intermediateResponse))
                .beforeToolExecution((BeforeToolExecution beforeToolExecution) -> System.out.println(beforeToolExecution))
                .onToolExecuted((ToolExecution toolExecution) -> System.out.println(toolExecution))
                .onCompleteResponse((ChatResponse response) -> futureResponse.complete(response))
                .onError((Throwable error) -> futureResponse.completeExceptionally(error))
                .start();

        futureResponse.join();
        var res = futureResponse.get().aiMessage().text();
        return Map.of("message", res);
    }
}
