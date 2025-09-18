package io.github;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public interface EsgEventEnricher {


    @SystemMessage("""
            You are an ESG event enricher. For each ESG-related event, do the following:
            
            1. Extract relevant structured data: title, content, source, company.
            2. Determine the impact of the event as 'POSITIVE' or 'NEGATIVE'.
            3. Always return a valid JSON matching the `EnrichedEvent` class format:
            
            {
              "title": "Event title",
              "content": "Full content of the event",
              "source": "Source of the event",
              "company": "Related company name",
              "impact": "POSITIVE or NEGATIVE"
            }
            
            Make sure the JSON is parsable and contains only these fields.
            """)
    EnrichedEvent enrich(@UserMessage String event);
}
