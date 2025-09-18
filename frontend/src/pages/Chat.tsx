import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  MessageCircle,
  ExternalLink,
  Bot,
  User,
  Sparkles,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  citations?: { title: string; url?: string; snippet: string }[]; //thought about citing sources but lack on time
  timestamp: Date;
}

interface Citation {
  title: string;
  url?: string;
  snippet: string;
}

const mockCitations: Citation[] = [
  {
    title: "ABC Corp Wastewater Incident Report",
    snippet:
      "Local authorities found elevated dye levels in river water downstream from ABC Corp textile facility...",
  },
  {
    title: "Bangladesh Environmental Compliance Report 2024",
    snippet:
      "Multiple textile manufacturers cited for water pollution violations in Q4 2024...",
  },
  {
    title: "ABC Corp Sustainability Statement 2024",
    snippet:
      "We commit to achieving net-zero emissions by 2050 through renewable energy adoption...",
  },
];

const mockResponses = {
  "abc corp pollution": {
    answer: `Based on our analysis of recent ESG events, ABC Corp has been involved in several environmental incidents that raise significant concerns:

**Recent Pollution Events:**
• **Wastewater contamination** (Dec 15, 2024): Environmental authorities reported elevated dye levels in river water downstream from ABC Corp's Dhaka facility, resulting in fish kills and community health concerns.
• **Worker safety violations** (Dec 10, 2024): Bangladesh Labor Ministry cited safety violations at Chittagong facility including inadequate ventilation.

**Impact Assessment:**
• Current environmental impact score: **-3.4** (significantly negative)
• Greenwashing risk score: **70%** (high risk)
• Primary concerns: Water pollution, worker safety, compliance failures

**Contradictions with ESG Claims:**
The company's public commitment to "net-zero emissions by 2050" appears inconsistent with recent pollution incidents and regulatory violations.`,
    citations: mockCitations,
    reasoning_outline: [
      "Retrieved recent pollution events for ABC Corp from our database",
      "Analyzed regulatory filings and NGO reports",
      "Compared claims vs. evidence to identify contradictions",
      "Calculated impact and greenwashing risk scores",
    ],
  },
  greenwashing: {
    answer: `Our analysis identifies several patterns of potential greenwashing across monitored companies:

**High-Risk Companies:**
• **ABC Corp**: Claims net-zero commitment while facing multiple pollution incidents (70% risk score)
• **Forest Products Inc**: Promotes "sustainable forestry" amid illegal logging allegations (80% risk score)

**Common Greenwashing Indicators:**
• Vague sustainability commitments without measurable targets
• ESG claims contradicted by recent environmental incidents
• Lack of third-party verification for reported achievements
• Focus on future goals while current practices remain problematic

**Detection Methods:**
Our AI system compares corporate ESG claims against real-time environmental event data to identify inconsistencies and calculate risk scores.`,
    citations: [
      {
        title: "Greenwashing Detection Analysis Report",
        snippet:
          "Systematic comparison of corporate sustainability claims vs. documented environmental incidents...",
      },
      ...mockCitations.slice(0, 2),
    ],
    reasoning_outline: [
      "Analyzed ESG claims from corporate reports and filings",
      "Cross-referenced with environmental incident database",
      "Applied ML models to detect claim-evidence inconsistencies",
      "Generated risk scores based on contradiction severity",
    ],
  },
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your ESG Intelligence Assistant. I can help you analyze environmental, social, and governance data for companies in our database. You can ask me about:\n\n• Specific company ESG performance\n• Environmental incident analysis\n• Greenwashing detection\n• Impact score explanations\n• Regulatory compliance issues\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isStrictRAG, setIsStrictRAG] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI processing delay
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 3000000);
    try {
      const res = await fetch("http://35.160.68.26:8081/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
        }),
        signal: controller.signal,
      });
      const response = await res.json();
      // Here you would handle the real response from your backend
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "ERROR IN CONTACTING MODEL",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      clearTimeout(timeout);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Tell me about Apple's recent pollution incidents",
    "Which companies show signs of greenwashing?",
    "What are the highest risk ESG events this month?",
    "Compare Apple vs Tesla impact scores",
  ];

  return (
    <div className="p-6 h-[calc(100vh-2rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Chat Interface */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="shadow-card flex-1 flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    ESG Intelligence Chat
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis of environmental and governance data
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="strict-rag"
                      checked={isStrictRAG}
                      onCheckedChange={setIsStrictRAG}
                    />
                    <label htmlFor="strict-rag" className="text-sm">
                      Strict RAG Mode
                    </label>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Powered
                  </Badge>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.type === "user" ? "justify-end" : ""
                      }`}
                    >
                      {message.type === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] ${
                          message.type === "user" ? "order-first" : ""
                        }`}
                      >
                        <div
                          className={`rounded-lg p-4 ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                        </div>

                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">
                              Sources:
                            </div>
                            {message.citations.map((citation, index) => (
                              <div
                                key={index}
                                className="p-3 bg-card border border-border rounded-lg"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">
                                      {citation.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {citation.snippet}
                                    </div>
                                  </div>
                                  {citation.url && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="ml-2 flex-shrink-0"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>

                      {message.type === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <span className="text-sm text-muted-foreground ml-2">
                            Analyzing ESG data...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Ask about ESG performance, greenwashing, environmental incidents..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Questions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Suggested Questions</CardTitle>
              <CardDescription>Try these example queries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full text-left justify-start h-auto p-3 text-sm"
                  onClick={() => setInputValue(question)}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Chat Features */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">AI Features</CardTitle>
              <CardDescription>
                Powered by advanced ESG intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm">Real-time data analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm">Greenwashing detection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm">Source citations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm">Impact score analysis</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  {isStrictRAG
                    ? "Strict RAG: Answers based only on indexed documents"
                    : "Enhanced mode: Broader knowledge with source verification"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
