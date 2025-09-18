import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import {
  Building2,
  Target,
  TrendingUp,
  Droplets,
  Zap,
  Trash2,
  Activity,
} from "lucide-react";
import { fetchCompanyESG } from "@/data/getEsgSummaryData";

// Mock ESG data for companies
const mockESGData = [
  {
    id: "tesla",
    company: "Tesla Inc",
    year: 2024,
    sector: "Automotive",
    description: "Electric vehicles and clean energy company",
    emissions: {
      scope1: 45000,
      scope2: 12000,
      scope3: 180000,
      total: 237000,
      intensity: 12.8,
    },
    energy: {
      total_mwh: 2100000,
      renewable_mwh: 1890000,
      nonrenewable_mwh: 210000,
      renewable_percent: 90.0,
    },
    water: {
      withdrawn_m3: 800000,
      consumed_m3: 640000,
      recycled_percent: 45.2,
    },
    waste: {
      total_tons: 28000,
      hazardous_tons: 2800,
      nonhazardous_tons: 25200,
      recycled_percent: 78.5,
      landfill_percent: 12.0,
    },
    targets: {
      net_zero_year: 2030,
      baseline_year: 2019,
      reduction_achieved_percent: 58.0,
    },
  },
  {
    id: "exxon",
    company: "ExxonMobil Corp",
    year: 2024,
    sector: "Energy",
    description: "Integrated oil and gas company",
    emissions: {
      scope1: 850000,
      scope2: 180000,
      scope3: 2400000,
      total: 3430000,
      intensity: 89.2,
    },
    energy: {
      total_mwh: 45000000,
      renewable_mwh: 2250000,
      nonrenewable_mwh: 42750000,
      renewable_percent: 5.0,
    },
    water: {
      withdrawn_m3: 15000000,
      consumed_m3: 12000000,
      recycled_percent: 8.5,
    },
    waste: {
      total_tons: 180000,
      hazardous_tons: 36000,
      nonhazardous_tons: 144000,
      recycled_percent: 35.2,
      landfill_percent: 45.8,
    },
    targets: {
      net_zero_year: 2050,
      baseline_year: 2016,
      reduction_achieved_percent: 12.0,
    },
  },
  {
    id: "microsoft",
    company: "Microsoft Corp",
    year: 2024,
    sector: "Technology",
    description: "Cloud computing and software services",
    emissions: {
      scope1: 8000,
      scope2: 45000,
      scope3: 780000,
      total: 833000,
      intensity: 3.8,
    },
    energy: {
      total_mwh: 8500000,
      renewable_mwh: 7650000,
      nonrenewable_mwh: 850000,
      renewable_percent: 90.0,
    },
    water: {
      withdrawn_m3: 2800000,
      consumed_m3: 2240000,
      recycled_percent: 85.6,
    },
    waste: {
      total_tons: 15000,
      hazardous_tons: 900,
      nonhazardous_tons: 14100,
      recycled_percent: 89.2,
      landfill_percent: 5.5,
    },
    targets: {
      net_zero_year: 2030,
      baseline_year: 2020,
      reduction_achieved_percent: 67.0,
    },
  },
  {
    id: "walmart",
    company: "Walmart Inc",
    year: 2024,
    sector: "Retail",
    description: "Multinational retail corporation",
    emissions: {
      scope1: 95000,
      scope2: 180000,
      scope3: 1200000,
      total: 1475000,
      intensity: 24.6,
    },
    energy: {
      total_mwh: 22000000,
      renewable_mwh: 11000000,
      nonrenewable_mwh: 11000000,
      renewable_percent: 50.0,
    },
    water: {
      withdrawn_m3: 4500000,
      consumed_m3: 3600000,
      recycled_percent: 25.8,
    },
    waste: {
      total_tons: 125000,
      hazardous_tons: 6250,
      nonhazardous_tons: 118750,
      recycled_percent: 68.4,
      landfill_percent: 25.2,
    },
    targets: {
      net_zero_year: 2040,
      baseline_year: 2015,
      reduction_achieved_percent: 28.5,
    },
  },
];

// Color schemes
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
const EMISSION_COLORS = {
  scope1: "#FF6B6B",
  scope2: "#4ECDC4",
  scope3: "#45B7D1",
};

export default function ESGDashboard() {
  const [esgData, setEsgData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(mockESGData[0]);
  const getMetrics = async () => {
    const res = await fetch("http://35.160.68.26:8081/api/report");
    const response = await res.json();
    console.log(response);
    setEsgData(response);
  };

  useEffect(() => {
    getMetrics();
  }, []);
  // Transform data for different chart types
  const getRadarData = (company) => [
    {
      subject: "Renewable Energy",
      A: company.energy.renewable_percent,
      fullMark: 100,
    },
    {
      subject: "Waste Recycling",
      A: company.waste.recycled_percent,
      fullMark: 100,
    },
    {
      subject: "Water Recycling",
      A: company.water.recycled_percent,
      fullMark: 100,
    },
    {
      subject: "Target Progress",
      A: company.targets.reduction_achieved_percent,
      fullMark: 100,
    },
    {
      subject: "Carbon Efficiency",
      A: Math.max(0, 100 - company.emissions.intensity),
      fullMark: 100,
    },
  ];

  const getEmissionsPieData = (company) => [
    {
      name: "Scope 1 (Direct)",
      value: company.emissions.scope1,
      color: EMISSION_COLORS.scope1,
    },
    {
      name: "Scope 2 (Electricity)",
      value: company.emissions.scope2,
      color: EMISSION_COLORS.scope2,
    },
    {
      name: "Scope 3 (Value Chain)",
      value: company.emissions.scope3,
      color: EMISSION_COLORS.scope3,
    },
  ];

  const getEnergyData = (company) => [
    { name: "Renewable", value: company.energy.renewable_mwh, fill: "#22C55E" },
    {
      name: "Non-Renewable",
      value: company.energy.nonrenewable_mwh,
      fill: "#EF4444",
    },
  ];

  const getComparisonData = () =>
    mockESGData.map((company) => ({
      name: company.company.split(" ")[0],
      emissions: company.emissions.intensity,
      renewable: company.energy.renewable_percent,
      recycling: company.waste.recycled_percent,
      progress: company.targets.reduction_achieved_percent,
    }));

  const getProgressToTarget = (company) => {
    const currentYear = 2024;
    const yearsToTarget = company.targets.net_zero_year - currentYear;
    const yearsFromBaseline = currentYear - company.targets.baseline_year;
    const totalYears =
      company.targets.net_zero_year - company.targets.baseline_year;

    return [
      { year: company.targets.baseline_year, progress: 0, target: 0 },
      {
        year: currentYear,
        progress: company.targets.reduction_achieved_percent,
        target: (yearsFromBaseline / totalYears) * 100,
      },
      { year: company.targets.net_zero_year, progress: 100, target: 100 },
    ];
  };

  const getESGScore = (company) => {
    const renewableScore = company.energy.renewable_percent;
    const wasteScore = company.waste.recycled_percent;
    const waterScore = company.water.recycled_percent;
    const targetScore = company.targets.reduction_achieved_percent;
    const emissionScore = Math.max(0, 100 - company.emissions.intensity);

    return Math.round(
      (renewableScore + wasteScore + waterScore + targetScore + emissionScore) /
        5
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          ESG Analytics Platform
        </h1>
        <p className="text-lg text-slate-600">
          Real-time environmental, social & governance insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Company Selector */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Companies
            </CardTitle>
            <CardDescription>Select company to analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockESGData.map((company) => {
              const esgScore = getESGScore(company);
              return (
                <Button
                  key={company.id}
                  variant={
                    selectedCompany.id === company.id ? "default" : "ghost"
                  }
                  className="w-full justify-start p-4 h-auto shadow-sm hover:shadow-md transition-all"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="text-left w-full">
                    <div className="font-medium">{company.company}</div>
                    <div className="text-xs opacity-60">{company.sector}</div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant="outline"
                        className={
                          esgScore >= 70
                            ? "border-green-500 text-green-600"
                            : esgScore >= 50
                            ? "border-yellow-500 text-yellow-600"
                            : "border-red-500 text-red-600"
                        }
                      >
                        ESG: {esgScore}
                      </Badge>
                      <div className="text-xs text-slate-500">
                        {company.emissions.intensity.toFixed(1)} tCO₂e/$M
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Main Dashboard */}
        <div className="lg:col-span-3 space-y-6">
          {/* Company Overview */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedCompany.company}
                  </h2>
                  <p className="text-blue-100 text-lg mb-4">
                    {selectedCompany.description}
                  </p>
                  <div className="flex gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      {selectedCompany.sector}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      Target: {selectedCompany.targets.net_zero_year}
                    </Badge>
                  </div>
                </div>
                <div className="text-right space-y-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="text-4xl font-bold">
                      {getESGScore(selectedCompany)}
                    </div>
                    <div className="text-blue-100">ESG Score</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold text-red-600">
                  {formatNumber(selectedCompany.emissions.total)}
                </div>
                <div className="text-sm text-slate-600">
                  Total Emissions (tCO₂e)
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold text-green-600">
                  {selectedCompany.energy.renewable_percent.toFixed(0)}%
                </div>
                <div className="text-sm text-slate-600">Renewable Energy</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-blue-600">
                  {selectedCompany.water.recycled_percent.toFixed(0)}%
                </div>
                <div className="text-sm text-slate-600">Water Recycled</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold text-purple-600">
                  {selectedCompany.targets.reduction_achieved_percent.toFixed(
                    0
                  )}
                  %
                </div>
                <div className="text-sm text-slate-600">Target Progress</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="emissions">Emissions</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ESG Radar Chart */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>ESG Performance Radar</CardTitle>
                    <CardDescription>
                      Multi-dimensional sustainability metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={getRadarData(selectedCompany)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Performance"
                          dataKey="A"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Progress to Net Zero */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Net Zero Progress</CardTitle>
                    <CardDescription>
                      Trajectory to {selectedCompany.targets.net_zero_year}{" "}
                      target
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getProgressToTarget(selectedCompany)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value.toFixed(1)}%`, ""]}
                        />
                        <Line
                          type="monotone"
                          dataKey="progress"
                          stroke="#22C55E"
                          strokeWidth={3}
                          name="Actual Progress"
                        />
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke="#EF4444"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          name="Target Path"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="emissions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Emissions Breakdown */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Emissions Breakdown</CardTitle>
                    <CardDescription>By scope (tCO₂e)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getEmissionsPieData(selectedCompany)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getEmissionsPieData(selectedCompany).map(
                            (entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            )
                          )}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [formatNumber(value), "tCO₂e"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Carbon Intensity */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-semibold">
                        Carbon Intensity
                      </h3>
                      <div className="text-5xl font-bold text-blue-600">
                        {selectedCompany.emissions.intensity.toFixed(1)}
                      </div>
                      <div className="text-lg text-slate-600">
                        tCO₂e per $M revenue
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            Scope 1:{" "}
                            {formatNumber(selectedCompany.emissions.scope1)}{" "}
                            tCO₂e
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>
                            Scope 2:{" "}
                            {formatNumber(selectedCompany.emissions.scope2)}{" "}
                            tCO₂e
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>
                            Scope 3:{" "}
                            {formatNumber(selectedCompany.emissions.scope3)}{" "}
                            tCO₂e
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Energy Mix */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Energy Mix</CardTitle>
                    <CardDescription>
                      Renewable vs Non-renewable (MWh)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={getEnergyData(selectedCompany)}
                        layout="horizontal"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip
                          formatter={(value) => [formatNumber(value), "MWh"]}
                        />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Water & Waste */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Resource Management</CardTitle>
                    <CardDescription>
                      Water and waste efficiency
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Water Recycled
                        </span>
                        <span className="text-sm">
                          {selectedCompany.water.recycled_percent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${selectedCompany.water.recycled_percent}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Waste Recycled
                        </span>
                        <span className="text-sm">
                          {selectedCompany.waste.recycled_percent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${selectedCompany.waste.recycled_percent}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(selectedCompany.water.consumed_m3)}
                        </div>
                        <div className="text-xs text-slate-600">
                          Water Consumed (m³)
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(selectedCompany.waste.total_tons)}
                        </div>
                        <div className="text-xs text-slate-600">
                          Total Waste (tons)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Industry Comparison</CardTitle>
                  <CardDescription>
                    ESG metrics across all companies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={getComparisonData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="renewable"
                        fill="#22C55E"
                        name="Renewable Energy %"
                      />
                      <Bar
                        dataKey="recycling"
                        fill="#3B82F6"
                        name="Waste Recycling %"
                      />
                      <Line
                        type="monotone"
                        dataKey="emissions"
                        stroke="#EF4444"
                        strokeWidth={3}
                        name="Carbon Intensity"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
