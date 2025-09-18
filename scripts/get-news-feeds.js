// tavily-to-sqs.mjs
import fetch from "node-fetch";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

/**
 * Env vars:
 * TAVILY_API_KEY   - required
 * SQS_URL          - required
 * AWS_REGION       - optional, default us-east-1
 * COMPANY_LIST     - CSV e.g. "NVIDIA,Intel"  (default: NVIDIA)
 * PAGE_MAX_RESULTS - how many results per Tavily call (max_results) (default: 20)
 * MAX_TOTAL        - overall cap across pages per company (default: 200)
 * BATCH_SIZE       - SQS SendMessageBatch size (<=10). default 10
 * DAYS             - optional integer days filter for recency (e.g. 7 for last 7 days)
 * TAVILY_MODE      - "advanced"|"basic" (default: "advanced")
 * TAVILY_BASE      - optional override (default: https://api.tavily.com)
 */

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const SQS_URL = process.env.SQS_URL;
const AWS_REGION = process.env.AWS_DEFAULT_REGION || "us-east-1";
const COMPANY_LIST = (process.env.COMPANY_LIST || "NVIDIA")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const PAGE_MAX_RESULTS = Number(process.env.PAGE_MAX_RESULTS || 20); // maps to Tavily's max_results
const MAX_TOTAL = Number(process.env.MAX_TOTAL || 200); // overall cap per company
const BATCH_SIZE = Math.min(10, Number(process.env.BATCH_SIZE || 10)); // SQS batch
const DAYS = process.env.DAYS ? Number(process.env.DAYS) : undefined;
const TAVILY_MODE = process.env.TAVILY_MODE || "advanced";
const TAVILY_BASE = process.env.TAVILY_BASE || "https://api.tavily.com";

if (!TAVILY_API_KEY || !SQS_URL) {
  console.error("Set TAVILY_API_KEY and SQS_URL in env before running.");
  process.exit(1);
}

const sqs = new SQSClient({ region: AWS_REGION });

function mkId() {
  return crypto.randomBytes(8).toString("hex");
}

async function tavilySearchPage({
  query,
  max_results = PAGE_MAX_RESULTS,
  mode = TAVILY_MODE,
  include_raw_content = true,
  cursor = undefined,
  days = undefined,
}) {
  // Tavily expects 'query' field and explicit max_results/include_raw_content. See docs. :contentReference[oaicite:4]{index=4}
  const body = {
    query,
    mode,
    max_results,
    include_raw_content,
  };
  if (typeof days === "number") body.days = days; // optional recency filter
  if (cursor) body.cursor = cursor; // if API supports cursor-based paging (common)
  const resp = await fetch(`${TAVILY_BASE}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TAVILY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    timeout: 60000,
  });

  const text = await resp.text();
  if (!resp.ok) {
    // surface response body for debugging
    throw new Error(`Tavily search failed ${resp.status}: ${text}`);
  }

  // Good responses are JSON. Parse.
  const j = JSON.parse(text);
  return j;
}

/** Publish raw messages to SQS in batches */
async function publishToSqsRawMessages(messages) {
  if (!messages || messages.length === 0) return;
  // chunk into <=10
  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const chunk = messages.slice(i, i + BATCH_SIZE);
    const entries = chunk.map((m, idx) => ({
      Id: mkId(),
      MessageBody: JSON.stringify(m),
    }));
    const cmd = new SendMessageBatchCommand({
      QueueUrl: SQS_URL,
      Entries: entries,
    });
    try {
      const resp = await sqs.send(cmd);
      if (resp.Failed && resp.Failed.length) {
        console.warn("Some SQS entries failed:", resp.Failed);
      }
      console.log(
        `Published batch: ${resp.Successful?.length || entries.length} messages`
      );
    } catch (err) {
      console.error("SQS SendMessageBatch failed:", err);
      throw err;
    }
  }
}

/** Main: per-company search, page through results if present */
export async function runOnce() {
  for (const company of COMPANY_LIST) {
    console.log("Searching Tavily for:", company);
    const query = `${company} (environment OR carbon OR trees OR emissions OR deforest OR "plant trees")`;

    let collected = 0;
    let cursor = undefined;
    const toPublish = [];

    while (collected < MAX_TOTAL) {
      let resp;
      try {
        resp = await tavilySearchPage({
          query,
          max_results: PAGE_MAX_RESULTS,
          mode: TAVILY_MODE,
          include_raw_content: true,
          cursor,
          days: DAYS,
        });
      } catch (err) {
        console.error("Tavily search error:", err.message || err);
        break; // stop paging this company on error
      }

      // Tavily response shapes vary; common field names: results / data / items / documents
      const pageResults =
        resp.results || resp.data || resp.items || resp.documents || [];
      if (!pageResults.length) {
        console.log("No results returned on this page.");
        break;
      }

      for (const r of pageResults) {
        // publish raw result (preserve full Tavily object for downstream processing)
        const msg = {
          source: "tavily",
          company_hint: company,
          collected_at: new Date().toISOString(),
          raw: r,
        };
        toPublish.push(msg);
        collected++;
        if (collected >= MAX_TOTAL) break;
      }

      // If there are messages ready to send in SQS batches, flush incrementally to avoid memory growth
      if (toPublish.length >= BATCH_SIZE) {
        const slice = toPublish.splice(0, BATCH_SIZE * 4); // send some
        await publishToSqsRawMessages(slice);
      }

      // Try to detect a pagination cursor in response
      // tavily community/docs reference 'next_cursor' or 'cursor'; try both.
      const nextCursor =
        resp.next_cursor || resp.cursor || resp.nextCursor || null;
      if (!nextCursor) {
        // no cursor → no further pages supported, break
        break;
      }
      cursor = nextCursor;
      // continue to next page unless collected >= MAX_TOTAL
    } // while paging

    // publish any remaining
    if (toPublish.length) {
      await publishToSqsRawMessages(toPublish.splice(0));
    }

    console.log(
      `Finished company ${company}. Collected ${collected} results (capped at MAX_TOTAL=${MAX_TOTAL}).`
    );
  } // companies
}

// CLI entry
if (
  process.argv[1] &&
  (process.argv[1].endsWith("tavily-to-sqs.mjs") ||
    process.argv[1].endsWith("tavily-to-sqs.js"))
) {
  runOnce()
    .then(() => console.log("All done"))
    .catch((err) => {
      console.error("Fatal run error:", err);
      process.exit(2);
    });
}
runOnce();
