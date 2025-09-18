import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Building2,
  Globe,
} from "lucide-react";
import {
  mockEvents,
  mockCompanies,
  getSeverityColor,
  getImpactScoreColor,
} from "@/data/mockData";
import { format } from "date-fns";
import { useState } from "react";

const impactTrendData = [
  { date: "2024-12-01", score: -1.2 },
  { date: "2024-12-02", score: -0.8 },
  { date: "2024-12-03", score: -1.5 },
  { date: "2024-12-04", score: -0.5 },
  { date: "2024-12-05", score: 0.2 },
  { date: "2024-12-06", score: -0.9 },
  { date: "2024-12-07", score: -1.3 },
  { date: "2024-12-08", score: 0.1 },
  { date: "2024-12-09", score: 1.2 },
  { date: "2024-12-10", score: -0.7 },
  { date: "2024-12-11", score: 2.1 },
  { date: "2024-12-12", score: -1.8 },
  { date: "2024-12-13", score: -0.3 },
  { date: "2024-12-14", score: 1.5 },
  { date: "2024-12-15", score: -2.1 },
];

const categoryData = [
  { category: "Pollution", count: 12, color: "#ef4444" },
  { category: "Carbon Emissions", count: 8, color: "#22c55e" },
  { category: "Deforestation", count: 6, color: "#f59e0b" },
  { category: "Violations", count: 4, color: "#8b5cf6" },
  { category: "Water", count: 3, color: "#3b82f6" },
  { category: "Waste", count: 2, color: "#ec4899" },
];

const severityData = [
  { severity: "Low (1-2)", count: 8, fill: "#22c55e" },
  { severity: "Medium (3)", count: 12, fill: "#f59e0b" },
  { severity: "High (4-5)", count: 15, fill: "#ef4444" },
];

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  const totalEvents = events.length;
  const criticalEvents = events.filter((e) => e.severity >= 4).length;
  const positiveEvents = events.filter((e) => e.impactScore > 0).length;
  const avgImpactScore =
    events.reduce((sum, e) => sum + e.impactScore, 0) / totalEvents;
  const avgGreenwashScore =
    mockCompanies.reduce((sum, c) => sum + c.latestGreenwashScore, 0) /
    mockCompanies.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            ESG Intelligence Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time environmental, social & governance monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <Globe className="w-4 h-4 mr-2" />
            Live Data
          </Badge>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Events
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {criticalEvents}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 inline mr-1" />
              -5% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Impact Score
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getImpactScoreColor(
                avgImpactScore
              )}`}
            >
              {avgImpactScore.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Scale: -5 (worst) to +5 (best)
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Greenwash Risk
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-foreground">
              {(avgGreenwashScore * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across companies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events and Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              Latest ESG events across monitored companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-fast"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={getSeverityColor(event.severity)}
                      >
                        Severity {event.severity}
                      </Badge>
                      <Badge variant="secondary">
                        {event.category.replace("_", " ")}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {event.body}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{event.company}</span>
                      <span>{event.location}</span>
                      <span>{format(new Date(event.timestamp), "MMM dd")}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div
                      className={`text-sm font-medium ${getImpactScoreColor(
                        event.impactScore
                      )}`}
                    >
                      {event.impactScore > 0 ? "+" : ""}
                      {event.impactScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Impact</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>Event severity levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {severityData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span>{item.severity}</span>
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
