// Mock data for CarbonScope ESG Intelligence Platform

export interface ESGEvent {
  id: string;
  timestamp: string;
  company: string;
  title: string;
  body: string;
  category: 'carbon_emissions' | 'water' | 'pollution' | 'waste' | 'deforestation' | 'violations';
  severity: 1 | 2 | 3 | 4 | 5;
  sentiment: number; // -1 to 1
  impactScore: number;
  greenwashScore: number;
  location: string;
  sourceType: 'news' | 'ngo' | 'regulator' | 'filing';
  scope: 'Scope1' | 'Scope2' | 'Scope3' | 'unknown';
  linkedCompanyId: string;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  hqCountry: string;
  latestImpactScore: number;
  latestGreenwashScore: number;
  description: string;
  website?: string;
}

export interface ESGClaim {
  id: string;
  companyId: string;
  claimText: string;
  claimDate: string;
  claimType: 'net_zero' | 'emissions_reduction' | 'renewable_energy' | 'sustainability' | 'carbon_neutral';
  sources: string[];
  verificationScore: number; // 0-1
}

export interface GraphNode {
  id: string;
  type: 'company' | 'event' | 'category' | 'regulator' | 'claim';
  label: string;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  strength?: number;
}

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: 'abc-corp',
    name: 'ABC Corp',
    sector: 'Manufacturing',
    hqCountry: 'Bangladesh',
    latestImpactScore: -3.4,
    latestGreenwashScore: 0.7,
    description: 'Large textile manufacturer with multiple factories across Asia.',
    website: 'https://abc-corp.example.com'
  },
  {
    id: 'green-energy-co',
    name: 'GreenEnergy Co',
    sector: 'Energy',
    hqCountry: 'Germany',
    latestImpactScore: 2.1,
    latestGreenwashScore: 0.3,
    description: 'Renewable energy company focusing on wind and solar power.',
    website: 'https://greenenergy.example.com'
  },
  {
    id: 'ocean-shipping',
    name: 'Ocean Shipping Ltd',
    sector: 'Transportation',
    hqCountry: 'Norway',
    latestImpactScore: -1.8,
    latestGreenwashScore: 0.5,
    description: 'International shipping company with focus on cargo transport.',
    website: 'https://oceanshipping.example.com'
  },
  {
    id: 'forest-products',
    name: 'Forest Products Inc',
    sector: 'Forestry',
    hqCountry: 'Canada',
    latestImpactScore: -2.7,
    latestGreenwashScore: 0.8,
    description: 'Paper and lumber production company with operations in North America.',
    website: 'https://forestproducts.example.com'
  },
  {
    id: 'solar-tech',
    name: 'SolarTech Solutions',
    sector: 'Technology',
    hqCountry: 'USA',
    latestImpactScore: 3.2,
    latestGreenwashScore: 0.1,
    description: 'Solar panel manufacturer and clean technology innovator.',
    website: 'https://solartech.example.com'
  }
];

// Mock ESG Events
export const mockEvents: ESGEvent[] = [
  {
    id: 'evt-001',
    timestamp: '2024-12-15T10:30:00Z',
    company: 'ABC Corp',
    title: 'Wastewater contamination reported near ABC facility',
    body: 'Local authorities found elevated dye levels in river water downstream from ABC Corp textile facility in Dhaka. Environmental groups report fish kills and community health concerns.',
    category: 'pollution',
    severity: 4,
    sentiment: -0.7,
    impactScore: -3.4,
    greenwashScore: 0.0,
    location: 'Dhaka, Bangladesh',
    sourceType: 'ngo',
    scope: 'Scope1',
    linkedCompanyId: 'abc-corp'
  },
  {
    id: 'evt-002',
    timestamp: '2024-12-14T15:45:00Z',
    company: 'GreenEnergy Co',
    title: 'New offshore wind farm completes construction',
    body: 'GreenEnergy Co announces completion of 500MW offshore wind farm, expected to power 400,000 homes with clean energy and reduce CO2 emissions by 1.2M tons annually.',
    category: 'carbon_emissions',
    severity: 1,
    sentiment: 0.8,
    impactScore: 2.1,
    greenwashScore: 0.0,
    location: 'North Sea, Germany',
    sourceType: 'filing',
    scope: 'Scope2',
    linkedCompanyId: 'green-energy-co'
  },
  {
    id: 'evt-003',
    timestamp: '2024-12-13T09:20:00Z',
    company: 'Ocean Shipping Ltd',
    title: 'Fuel oil spill during port operations',
    body: 'Ocean Shipping vessel experienced fuel leak during docking operations at Bergen port. Approximately 200 liters of heavy fuel oil entered harbor waters before containment.',
    category: 'pollution',
    severity: 3,
    sentiment: -0.5,
    impactScore: -1.8,
    greenwashScore: 0.0,
    location: 'Bergen, Norway',
    sourceType: 'regulator',
    scope: 'Scope1',
    linkedCompanyId: 'ocean-shipping'
  },
  {
    id: 'evt-004',
    timestamp: '2024-12-12T14:30:00Z',
    company: 'Forest Products Inc',
    title: 'Illegal logging allegations in protected area',
    body: 'Environmental watchdog reports Forest Products Inc contractors allegedly harvesting trees in protected watershed area without proper permits. Company denies involvement.',
    category: 'deforestation',
    severity: 4,
    sentiment: -0.8,
    impactScore: -2.7,
    greenwashScore: 0.0,
    location: 'British Columbia, Canada',
    sourceType: 'ngo',
    scope: 'Scope1',
    linkedCompanyId: 'forest-products'
  },
  {
    id: 'evt-005',
    timestamp: '2024-12-11T11:15:00Z',
    company: 'SolarTech Solutions',
    title: 'Carbon-negative manufacturing process announced',
    body: 'SolarTech unveils new manufacturing process that captures more CO2 than it produces, achieved through renewable energy and carbon capture technology integration.',
    category: 'carbon_emissions',
    severity: 1,
    sentiment: 0.9,
    impactScore: 3.2,
    greenwashScore: 0.0,
    location: 'San Francisco, USA',
    sourceType: 'filing',
    scope: 'Scope1',
    linkedCompanyId: 'solar-tech'
  },
  {
    id: 'evt-006',
    timestamp: '2024-12-10T16:45:00Z',
    company: 'ABC Corp',
    title: 'Worker safety violations cited by labor ministry',
    body: 'Bangladesh Labor Ministry cites ABC Corp for safety violations at Chittagong facility including inadequate ventilation and missing safety equipment. Fines imposed.',
    category: 'violations',
    severity: 3,
    sentiment: -0.6,
    impactScore: -2.1,
    greenwashScore: 0.0,
    location: 'Chittagong, Bangladesh',
    sourceType: 'regulator',
    scope: 'unknown',
    linkedCompanyId: 'abc-corp'
  }
];

// Mock ESG Claims
export const mockClaims: ESGClaim[] = [
  {
    id: 'claim-001',
    companyId: 'abc-corp',
    claimText: 'ABC Corp commits to achieving net-zero emissions by 2050 through renewable energy adoption and supply chain optimization.',
    claimDate: '2024-01-15T00:00:00Z',
    claimType: 'net_zero',
    sources: ['2024 Sustainability Report', 'CEO Statement'],
    verificationScore: 0.3
  },
  {
    id: 'claim-002',
    companyId: 'forest-products',
    claimText: 'We practice sustainable forestry with 100% of our operations certified by FSC standards and plant 3 trees for every 1 harvested.',
    claimDate: '2024-03-10T00:00:00Z',
    claimType: 'sustainability',
    sources: ['Environmental Policy Document', 'Annual Report'],
    verificationScore: 0.2
  },
  {
    id: 'claim-003',
    companyId: 'ocean-shipping',
    claimText: 'Ocean Shipping Ltd has reduced emissions by 40% since 2020 through fleet modernization and green fuel adoption.',
    claimDate: '2024-06-20T00:00:00Z',
    claimType: 'emissions_reduction',
    sources: ['Quarterly Sustainability Update'],
    verificationScore: 0.6
  }
];

// Mock Graph Data
export const mockGraphData = {
  nodes: [
    { id: 'abc-corp', type: 'company', label: 'ABC Corp', size: 20, color: '#ef4444' },
    { id: 'green-energy-co', type: 'company', label: 'GreenEnergy Co', size: 18, color: '#22c55e' },
    { id: 'pollution', type: 'category', label: 'Pollution', size: 15, color: '#f59e0b' },
    { id: 'carbon_emissions', type: 'category', label: 'Carbon Emissions', size: 16, color: '#3b82f6' },
    { id: 'dhaka', type: 'regulator', label: 'Dhaka Environmental Authority', size: 12, color: '#8b5cf6' },
    { id: 'evt-001', type: 'event', label: 'Wastewater contamination', size: 14, color: '#ef4444' },
    { id: 'evt-002', type: 'event', label: 'Wind farm completion', size: 14, color: '#22c55e' },
  ],
  links: [
    { source: 'abc-corp', target: 'evt-001', type: 'involved_in' },
    { source: 'evt-001', target: 'pollution', type: 'categorized_as' },
    { source: 'evt-001', target: 'dhaka', type: 'reported_by' },
    { source: 'green-energy-co', target: 'evt-002', type: 'involved_in' },
    { source: 'evt-002', target: 'carbon_emissions', type: 'categorized_as' },
  ]
};

// Utility functions
export const getSeverityColor = (severity: number): string => {
  if (severity <= 2) return 'text-success border-success/30 bg-success/10';
  if (severity === 3) return 'text-warning-foreground border-warning/30 bg-warning/10';
  return 'text-destructive border-destructive/30 bg-destructive/10';
};

export const getImpactScoreColor = (score: number): string => {
  if (score > 0) return 'text-success';
  if (score > -2) return 'text-warning-foreground';
  return 'text-destructive';
};

export const getGreenwashStatus = (score: number): { label: string; className: string } => {
  if (score < 0.3) return { label: 'Clean', className: 'greenwash-clean' };
  if (score < 0.6) return { label: 'Moderate Risk', className: 'text-warning-foreground border-warning/30 bg-warning/10' };
  return { label: 'High Risk', className: 'greenwash-detected' };
};

export const getCategoryIcon = (category: string): string => {
  const icons = {
    carbon_emissions: '🌡️',
    water: '💧',
    pollution: '☠️',
    waste: '🗑️',
    deforestation: '🌳',
    violations: '⚠️'
  };
  return icons[category as keyof typeof icons] || '📊';
};