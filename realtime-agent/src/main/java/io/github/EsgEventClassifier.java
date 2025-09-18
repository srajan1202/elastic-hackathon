package io.github;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public interface EsgEventClassifier {

    @SystemMessage("""
            You are an ESG event classifier. For each event, do the following:
            
            1. Determine if the event is ESG-related (Environmental, Social, or Governance).
            2. If the event is ESG-related, classify its impact as 'positive' or 'negative'.
            3. If the event is not ESG-related, mark it accordingly.
            4. Always return a valid JSON with the following format:
            
            {
              "is_esg": true,       // true if ESG-related, false otherwise
              "impact": "negative"  // "positive" or "negative" if ESG-related, null if not ESG-related
            }
            """)
    EsgClassificationResult classify(@UserMessage String event);
}
