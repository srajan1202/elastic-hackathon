package io.github;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;


public interface ESGAgent {

    @SystemMessage("""
                 You are an ESG data extraction assistant.
                 Your task is to build an ESGReport JSON object.
                 - Index names follow the pattern: esg-{company}-{year}.
                 - If you need information, call tools available to you. May call multiple time if don't get enough data.
                 - Use as many tool calls as necessary to retrieve emissions, energy, water, waste, and targets data.
                 - If some data is missing, set the field to null.
                 Return ONLY a valid JSON matching the ESGReport schema.
                 \s
                 ====================ESG Json Schema Start=================
                 ```json
                 {
                    "company": "Example Corp",              // Name of the reporting company
                    "year": 2024,                           // Reporting year for the ESG data
                    "emissions": {                          // Greenhouse Gas (GHG) emissions (tons CO₂e)
                      "scope1": 120000,                     // Direct emissions (Scope 1)
                      "scope2": 80000,                      // Indirect emissions from purchased electricity/heat (Scope 2)
                      "scope3": 300000,                     // Other indirect emissions (Scope 3: supply chain, logistics, etc.)
                      "total": 500000,                      // Total GHG emissions (Scope 1 + 2 + 3)
                      "intensity": 25.4                     // Carbon intensity (tons CO₂e per $M revenue / per employee / per product unit)
                    },
                    "energy": {                             // Energy consumption
                      "total_mwh": 1500000,                 // Total energy consumption (MWh / GJ)
                      "renewable_mwh": 600000,              // Renewable energy consumption (MWh)
                      "nonrenewable_mwh": 900000,           // Non-renewable energy consumption (MWh)
                      "renewable_percent": 40.0             // % of renewable energy in operations
                    },
                    "water": {                              // Water usage
                      "withdrawn_m3": 1200000,              // Total water withdrawn (m³)
                      "consumed_m3": 950000,                // Total water consumed (m³)
                      "recycled_percent": 15.2              // % of recycled water from total
                    },
                    "waste": {                              // Waste management
                      "total_tons": 45000,                  // Total waste generated (tons)
                      "hazardous_tons": 5000,               // Hazardous waste generated (tons)
                      "nonhazardous_tons": 40000,           // Non-hazardous waste generated (tons)
                      "recycled_percent": 62.5,             // % of waste recycled, reused, or composted
                      "landfill_percent": 25.0              // % of waste sent to landfill/incineration
                    },
                    "targets": {                            // Climate targets and progress
                      "net_zero_year": 2040,                // Target year to reach Net Zero emissions
                      "baseline_year": 2020,                // Baseline year for measuring reductions
                      "reduction_achieved_percent": 35.0    // % reduction achieved vs. baseline
                    }
                  }
                 ```
                 ====================ESG Json Schema End=================
            \s""")
    ESGReport generateReport(@MemoryId int memoryId, @UserMessage String task);
}
