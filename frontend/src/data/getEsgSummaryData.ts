import { Client } from "@elastic/elasticsearch";

// Define the TypeScript types for your ESG data
interface Emissions {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  intensity: number;
}

interface Energy {
  total_mwh: number;
  renewable_mwh: number;
  nonrenewable_mwh: number;
  renewable_percent: number;
}

interface Water {
  withdrawn_m3: number;
  consumed_m3: number;
  recycled_percent: number;
}

interface Waste {
  total_tons: number;
  hazardous_tons: number;
  nonhazardous_tons: number;
  recycled_percent: number;
  landfill_percent: number;
}

interface Targets {
  net_zero_year: number;
  baseline_year: number;
  reduction_achieved_percent: number;
}

interface CompanyESG {
  id: string;
  company: string;
  year: number;
  sector: string;
  description: string;
  emissions: Emissions;
  energy: Energy;
  water: Water;
  waste: Waste;
  targets: Targets;
}

// Elasticsearch client setup
const esClient = new Client({
  node: process.env.ELASTIC_URL || "",
  auth: {
    username: process.env.ELASTIC_USERNAME || "elastic",
    password: process.env.ELASTIC_PASSWORD || "changeme",
  },
});

// Function to fetch ESG data by company ID
export const fetchCompanyESG = async (
  index: string,
  companyId: string
): Promise<CompanyESG | null> => {
  try {
    const response = await esClient.get({
      index,
      id: companyId,
    });

    if (!response || !response._source) {
      return null;
    }

    return response._source as CompanyESG;
  } catch (error: any) {
    if (error.meta?.statusCode === 404) {
      console.warn(`Document with ID ${companyId} not found`);
      return null;
    }
    console.error("Error fetching ESG data:", error);
    throw error;
  }
};
