import "dotenv/config";
import { Client } from "@elastic/elasticsearch";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/core/text_splitter";

import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const apiKey = process.env.API_KEY;

const esClient = new Client({
  node: "https://4e98f18d23f84d59ad7be6e0fd810d38.us-west-2.aws.found.io:443",
  auth: {
    username: "admin",
    password: "password",
  },
});

async function downloadPdf(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  return outputPath;
}

async function processReport(company, year, pdfUrl) {
  try {
    console.log(`\n📄 Processing ${company} (${year}) report...`);
    const localPdfPath = path.resolve(
      `./${company.replace(/\s+/g, "_")}_${year}.pdf`
    );
    await downloadPdf(pdfUrl, localPdfPath);

    const loader = new PDFLoader(localPdfPath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512,
      chunkOverlap: 256,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    const indexName = `${company
      .toLowerCase()
      .replace(/\s+/g, "-")}-${year}-esg-report`;

    const operations = splitDocs.flatMap((doc, i) => [
      { index: { _index: indexName, pipeline: "text-embeddings" } },
      { text: doc.pageContent, page_number: i },
    ]);

    await esClient.bulk({
      refresh: true,
      body: operations,
    });

    console.log(`✅ Indexed ${company} (${year}) into ${indexName}`);
  } catch (err) {
    console.error(`❌ Error processing ${company} (${year}):`, err);
  }
}

async function run() {
  const reports = JSON.parse(
    fs.readFileSync("sustainability_reports.json", "utf-8")
  );

  for (const report of reports) {
    const { company, year, url } = report;
    if (!url) {
      console.warn(`⚠️ No URL found for ${company} (${year}), skipping...`);
      continue;
    }
    await processReport(company, year, url);
  }

  console.log("\n🎉 All reports processed!");
}

run();
