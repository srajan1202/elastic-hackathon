
# CarbonScope: ESG Intelligence Platform


#### Hackathon Project ####
This project was developed for the "Forge the Future" Elasticsearch Hackathon, powered by Elastic and AWS. It showcases how AI and data can be combined to create intelligent search solutions that improve lives and businesses.

#### Project Overview ####
An intelligent real-time search and analytics system that combines Elasticsearch's powerful search capabilities with AI-driven data processing. The system ingests data in real-time, processes it through specialized AI agents, and provides semantic search with intelligent summarization.


#### System Architecture ####


##### Core Components:

1. Real-Time Ingestor: Streams data from various sources via   Amazon SQS
2. Classification Agent: Automatically categorizes incoming data
3. Enrichment Agent: Enhances data with additional context and metadata
4. Vector Search Engine: Performs semantic similarity searches using embeddings
5. Search Agent: Handles intelligent query processing and ranking
6. Summary Agent: Generates concise summaries of search results
7. Chat Interface: Interactive AI-powered search experience

##### Key Features:

1. Semantic Vector Search: Find relevant content based on meaning, not just keywords
2. Real-Time Data Processing: Continuous ingestion and processing of streaming data
3. Multi-Agent AI System: Specialized agents for different data processing tasks
4. Intelligent Summarization: Automatic generation of concise result summaries

---
# Elasticsearch Setup

This document describes the steps to setup ingest pipeline and embedding model on Elasticsearch.

#### 1. Upload Sentence transformers embedding model

```bash
docker run -it --rm --network host \
    docker.elastic.co/eland/eland eland_import_hub_model \
      --url https://4e98f18d23f84d59ad7be6e0fd810d38.us-west-2.aws.found.io:443 --es-api-key=$API_KEY \
      --hub-model-id sentence-transformers/all-MiniLM-L12-v2 \
      --task-type text_embedding --insecure

```

#### 2. Create Ingest pipeline

```bash
PUT _ingest/pipeline/text-embedding-pipeline
{
  "description": "Text embedding pipeline",
  "processors": [
    {
      "inference": {
        "model_id": "sentence-transformers__all-minilm-l12-v2",
        "input_output": [
            {
                "input_field": "text",
                "output_field": "vector"
            }
        ]
      }
    }
  ],
  "on_failure": [
    {
      "set": {
        "description": "Index document to 'failed-<index>'",
        "field": "_index",
        "value": "failed-{{{_index}}}"
      }
    },
    {
      "set": {
        "description": "Set error message",
        "field": "ingest.failure",
        "value": "{{_ingest.on_failure_message}}"
      }
    }
  ]
}
```

#### 3. Put Index template

```bash
PUT _index_template/esg_template
{
  "index_patterns": ["*esg*"],
  "priority": 501,
  "template": {
    "settings": {
      "default_pipeline": "text-embedding-pipeline"
    },
    "mappings": {
      "properties": {
        "metadata": {
          "type": "flattened"
        },
        "text": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "vector": {
          "type": "dense_vector",
          "dims": 384,
          "index": true,
          "similarity": "cosine"
        }
      }
    }
  }
}
```





---

# Build and Deploy Project on AWS

This document describes the steps to build and deploy the **chatbot**, **esg-report**, and **realtime-agent** modules of the project on AWS.

---

## 1. Clone Repository

```bash
git clone https://github.com/srajan1202/elastic-hackathon
cd elastic-hackathon
```

---

## 2. Setup Prerequisites

* **Java 21** (make sure it is set as default)
* **Node.js** (latest LTS recommended)
* **Gradle** (if not already included via wrapper)

---

## 3. Build Project

Run the following command from the project root:

```bash
./gradlew clean build
```

This will build all three modules:

* **chatbot** → `chatbot/build/libs/chatbot-<version>.jar`
* **esg-report** → `esg-report/build/libs/esg-report-<version>.jar`
* **realtime-agent** → `realtime-agent/build/libs/realtime-agent-<version>.jar`

---

## 4. Deploy Chatbot (EC2)

1. Create an **EC2 instance** (Amazon Linux 2023 or Ubuntu 22.04 recommended).
2. Install Java 21 on EC2:

   ```bash
   sudo amazon-linux-extras enable java-openjdk21
   sudo yum install java-21-amazon-corretto -y
   ```
3. Copy the chatbot JAR to EC2:

   ```bash
   scp chatbot/build/libs/chatbot-<version>.jar ec2-user@<ec2-ip>:/home/ec2-user/chatbot.jar
   ```
4. Start chatbot service:

   ```bash
   java -Xmx4g -jar chatbot.jar
   ```

> (Optional: Configure **Systemd service** for chatbot to auto-restart)

---

## 5. Deploy ESG Report and Realtime Agent (Lambda)

1. Navigate to the built JARs:

    * `esg-report/build/libs/esg-report-<version>.jar`
    * `realtime-agent/build/libs/realtime-agent-<version>.jar`
2. Create two AWS Lambda functions (Runtime: **Java 21**):

    * **esg-report**

        * Handler: `io.github.EsgMain::handleRequest`
    * **realtime-agent**

        * Handler: `io.github.AgentMain::handleRequest`
3. Upload the respective JARs to each Lambda.

---

## 6. IAM Role Setup

Create a single **IAM Role** (e.g., `project-execution-role`) and attach it to:

* **Chatbot EC2 instance**
* **esg-report Lambda**
* **realtime-agent Lambda**

The role should have the following permissions:

* **Amazon Bedrock** (invoke models)
* **Amazon SQS** (read messages)
* (Optional) **CloudWatch Logs** (for monitoring)

---

## 7. Environment Configuration

Set environment variables for **esg-report** and **realtime-agent** Lambdas:

* `ELASTIC_URL` → Elasticsearch cluster endpoint
* `ELASTIC_API_KEY` → API key for Elasticsearch

For EC2 (chatbot), configure these as system environment variables or in a `.env` file.

---

✅ At this point:

* **Chatbot** runs on EC2
* **esg-report** runs as Lambda (Java 21)
* **realtime-agent** runs as Lambda (Java 21)
* All three share the same IAM role with required permissions
* Lambdas have environment variables configured




