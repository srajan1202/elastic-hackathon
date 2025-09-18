import { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { mockGraphData, mockCompanies } from "@/data/mockData";
import { ZoomIn, ZoomOut, RotateCcw, Settings } from "lucide-react";

// Mock force graph component since react-force-graph-2d might not be available
function ForceGraphMock({
  graphData,
  selectedCompany,
}: {
  graphData: any;
  selectedCompany: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw nodes
    graphData.nodes.forEach((node: any, index: number) => {
      const angle = (index / graphData.nodes.length) * 2 * Math.PI;
      const radius = 150 + (node.type === "company" ? 50 : 0);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, node.size || 10, 0, 2 * Math.PI);
      ctx.fillStyle = node.color || "#22c55e";
      ctx.fill();

      // Draw label
      ctx.fillStyle = "#333";
      ctx.font = "12px Inter";
      ctx.textAlign = "center";
      ctx.fillText(node.label, x, y + 25);

      // Store position for links
      node.x = x;
      node.y = y;
    });

    // Draw links
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    graphData.links.forEach((link: any) => {
      const source = graphData.nodes.find((n: any) => n.id === link.source);
      const target = graphData.nodes.find((n: any) => n.id === link.target);

      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });
  }, [graphData]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full border border-border rounded-lg bg-card"
      style={{ minHeight: "500px" }}
    />
  );
}

export default function GraphView() {
  const [selectedCompany, setSelectedCompany] = useState("abc-corp");
  const [linkDistance, setLinkDistance] = useState([100]);
  const [nodeSize, setNodeSize] = useState([1]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Filter graph data based on selected company
  const filteredGraphData = {
    nodes: mockGraphData.nodes.filter(
      (node) =>
        (node.type === "company" && node.id === selectedCompany) ||
        node.type !== "company"
    ),
    links: mockGraphData.links.filter(
      (link) =>
        link.source === selectedCompany ||
        link.target === selectedCompany ||
        (mockGraphData.nodes.find((n) => n.id === link.source)?.type !==
          "company" &&
          mockGraphData.nodes.find((n) => n.id === link.target)?.type !==
            "company")
    ),
  };

  const nodeTypes = [
    {
      type: "company",
      label: "Companies",
      color: "#22c55e",
      count: filteredGraphData.nodes.filter((n) => n.type === "company").length,
    },
    {
      type: "event",
      label: "Events",
      color: "#ef4444",
      count: filteredGraphData.nodes.filter((n) => n.type === "event").length,
    },
    {
      type: "category",
      label: "Categories",
      color: "#f59e0b",
      count: filteredGraphData.nodes.filter((n) => n.type === "category")
        .length,
    },
    {
      type: "regulator",
      label: "Regulators",
      color: "#8b5cf6",
      count: filteredGraphData.nodes.filter((n) => n.type === "regulator")
        .length,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            ESG Network Graph
          </h1>
          <p className="text-muted-foreground">
            Interactive visualization of ESG relationships and connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ZoomIn className="w-4 h-4 mr-1" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="w-4 h-4 mr-1" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Graph Controls
            </CardTitle>
            <CardDescription>
              Customize the network visualization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Focus Company
              </label>
              <Select
                value={selectedCompany}
                onValueChange={setSelectedCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Link Distance */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Link Distance: {linkDistance[0]}px
              </label>
              <Slider
                value={linkDistance}
                onValueChange={setLinkDistance}
                min={50}
                max={200}
                step={10}
                className="w-full"
              />
            </div>

            {/* Node Size */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Node Size: {nodeSize[0]}x
              </label>
              <Slider
                value={nodeSize}
                onValueChange={setNodeSize}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Legend */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Node Types
              </label>
              <div className="space-y-2">
                {nodeTypes.map((type) => (
                  <div
                    key={type.type}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-sm">{type.label}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {type.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Node Info */}
            {selectedNode && (
              <div className="border-t border-border pt-4">
                <label className="text-sm font-medium mb-2 block">
                  Selected Node
                </label>
                <div className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">
                      {selectedNode.label}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {selectedNode.type}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Graph Visualization */}
        <div className="lg:col-span-3">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Network Visualization</CardTitle>
              <CardDescription>
                Showing connections for{" "}
                {mockCompanies.find((c) => c.id === selectedCompany)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full" style={{ height: "600px" }}>
                <ForceGraphMock
                  graphData={filteredGraphData}
                  selectedCompany={selectedCompany}
                />

                {/* Graph Statistics */}
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 space-y-2">
                  <div className="text-sm font-medium">Graph Statistics</div>
                  <div className="text-xs space-y-1">
                    <div>Nodes: {filteredGraphData.nodes.length}</div>
                    <div>Connections: {filteredGraphData.links.length}</div>
                    <div>
                      Companies:{" "}
                      {
                        filteredGraphData.nodes.filter(
                          (n) => n.type === "company"
                        ).length
                      }
                    </div>
                    <div>
                      Events:{" "}
                      {
                        filteredGraphData.nodes.filter(
                          (n) => n.type === "event"
                        ).length
                      }
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Click and drag to move nodes</div>
                    <div>• Scroll to zoom in/out</div>
                    <div>• Click nodes to view details</div>
                    <div>• Use controls to filter connections</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Details */}
          <Card className="shadow-card mt-6">
            <CardHeader>
              <CardTitle>Connection Types</CardTitle>
              <CardDescription>
                Types of relationships in the ESG network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="font-medium text-sm mb-2">
                    Company → Event
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Direct involvement in environmental incidents
                  </div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="font-medium text-sm mb-2">
                    Event → Category
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Classification of environmental impacts
                  </div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="font-medium text-sm mb-2">
                    Event → Regulator
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Regulatory oversight and reporting
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
