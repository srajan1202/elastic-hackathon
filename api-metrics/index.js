const express = require("express");
const { Client } = require("@elastic/elasticsearch");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Elasticsearch client configuration
const client = new Client({
  node:
    process.env.ELASTIC_URL ||
    process.env.ELASTICSEARCH_URL ||
    "http://localhost:9200",
  auth:
    (process.env.ELASTIC_USERNAME || process.env.ES_USERNAME) &&
    (process.env.ELASTIC_PASSWORD || process.env.ES_PASSWORD)
      ? {
          username: process.env.ELASTIC_USERNAME || process.env.ES_USERNAME,
          password: process.env.ELASTIC_PASSWORD || process.env.ES_PASSWORD,
        }
      : undefined,
  ssl: {
    // Accept self-signed certificates for development
    rejectUnauthorized: false,
  },
  requestTimeout: 30000,
  pingTimeout: 3000,
  maxRetries: 3,
  sniffOnStart: false,
  sniffInterval: false,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await client.ping();
    res.json({ status: "healthy", elasticsearch: "connected" });
  } catch (error) {
    res
      .status(503)
      .json({
        status: "unhealthy",
        elasticsearch: "disconnected",
        error: error.message,
      });
  }
});

// Get all ESG summary data
app.get("/summary", async (req, res) => {
  try {
    const response = await client.search({
      index: "companies-esg-summary",
      body: {
        query: {
          match_all: {},
        },
        size: 1000, // Adjust based on your needs
        sort: [{ company: { order: "asc" } }, { year: { order: "desc" } }],
      },
    });

    const companies = response.body.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    res.json({
      success: true,
      total: response.body.hits.total.value || response.body.hits.total,
      data: companies,
    });
  } catch (error) {
    console.error("Error fetching ESG summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch ESG summary data",
      details: error.message,
    });
  }
});

// Get ESG data for specific company
app.get("/summary/:companyName", async (req, res) => {
  try {
    const companyName = req.params.companyName;

    const response = await client.search({
      index: "companies-esg-summary",
      body: {
        query: {
          bool: {
            should: [
              // Exact match on keyword field
              {
                term: {
                  "company.keyword": companyName,
                },
              },
              // Case-insensitive match on text field
              {
                match: {
                  company: {
                    query: companyName,
                    operator: "and",
                  },
                },
              },
              // Fuzzy match for typos
              {
                fuzzy: {
                  company: {
                    value: companyName,
                    fuzziness: "AUTO",
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
        sort: [{ year: { order: "desc" } }],
        size: 100,
      },
    });

    if (
      response.body.hits.total.value === 0 ||
      response.body.hits.total === 0
    ) {
      return res.status(404).json({
        success: false,
        error: "Company not found",
        message: `No ESG data found for company: ${companyName}`,
      });
    }

    const companyData = response.body.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    }));

    res.json({
      success: true,
      company: companyName,
      total: response.body.hits.total.value || response.body.hits.total,
      data: companyData,
    });
  } catch (error) {
    console.error(
      `Error fetching data for company ${req.params.companyName}:`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Failed to fetch company data",
      details: error.message,
    });
  }
});

// Get document count for realtime-events-data index
app.get("/realtime-events/count", async (req, res) => {
  try {
    const response = await client.count({
      index: "realtime-events-data",
    });

    res.json({
      success: true,
      index: "realtime-events-data",
      count: response.body.count,
    });
  } catch (error) {
    console.error(
      "Error getting document count for realtime-events-data:",
      error
    );

    if (error.meta?.body?.error?.type === "index_not_found_exception") {
      return res.status(404).json({
        success: false,
        error: "Index not found",
        message: "The realtime-events-data index does not exist",
        count: 0,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to get document count",
      details: error.message,
    });
  }
});

// Additional endpoint: Get available companies list
app.get("/companies", async (req, res) => {
  try {
    const response = await client.search({
      index: "companies-esg-summary",
      body: {
        size: 0,
        aggs: {
          companies: {
            terms: {
              field: "company.keyword",
              size: 1000,
              order: { _key: "asc" },
            },
            aggs: {
              years: {
                terms: {
                  field: "year",
                  size: 10,
                  order: { _key: "desc" },
                },
              },
            },
          },
        },
      },
    });

    const companies = response.body.aggregations.companies.buckets.map(
      (bucket) => ({
        name: bucket.key,
        recordCount: bucket.doc_count,
        availableYears: bucket.years.buckets
          .map((yearBucket) => yearBucket.key)
          .sort((a, b) => b - a),
      })
    );

    res.json({
      success: true,
      total: companies.length,
      companies: companies,
    });
  } catch (error) {
    console.error("Error fetching companies list:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch companies list",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: "Something went wrong!",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "The requested endpoint does not exist",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`ESG Data API server is running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET /health - Health check`);
  console.log(`  GET /summary - Get all ESG summary data`);
  console.log(
    `  GET /summary/:companyName - Get ESG data for specific company`
  );
  console.log(
    `  GET /realtime-events/count - Get document count for realtime-events-data index`
  );
  console.log(`  GET /companies - Get list of available companies`);
});

module.exports = app;
