"use client";

import * as React from "react";
import {
  ArrowLeft,
  Server,
  Database,
  Network,
  Cloud,
  Shield,
  Container,
  Zap,
  Globe,
  Lock,
  Cpu,
  HardDrive,
  Layers,
  Box,
  Radio,
  Workflow,
  Trash2,
  Link2,
  MousePointerClick,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ComponentType =
  | "ec2"
  | "s3"
  | "rds"
  | "lambda"
  | "apigateway"
  | "vpc"
  | "subnet"
  | "alb"
  | "nat"
  | "igw"
  | "sg"
  | "iam"
  | "dynamodb"
  | "cloudfront"
  | "route53"
  | "ecs"
  | "fargate"
  | "ecr"
  | "sqs"
  | "sns"
  | "kms"
  | "secrets"
  | "cloudwatch"
  | "client";

interface PlacedComponent {
  id: string;
  type: ComponentType;
  name: string;
  x: number;
  y: number;
}

interface Edge {
  id: string;
  from: string;
  to: string;
}

interface AnalysisResult {
  components: number;
  connections: number;
  securityWarnings: string[];
  haWarnings: string[];
  costWarnings: string[];
  recommendations: string[];
}

// ---------------------------------------------------------------------------
// Component catalog
// ---------------------------------------------------------------------------

interface ComponentDef {
  type: ComponentType;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  category: "compute" | "storage" | "database" | "network" | "security" | "serverless" | "container" | "messaging" | "monitoring" | "external";
  isCompute?: boolean;
}

const CATALOG: ComponentDef[] = [
  { type: "ec2", label: "EC2", icon: Server, color: "aws-orange", category: "compute", isCompute: true },
  { type: "s3", label: "S3", icon: HardDrive, color: "aws-emerald", category: "storage" },
  { type: "rds", label: "RDS", icon: Database, color: "aws-amber", category: "database" },
  { type: "lambda", label: "Lambda", icon: Zap, color: "aws-violet", category: "serverless", isCompute: true },
  { type: "apigateway", label: "API Gateway", icon: Workflow, color: "aws-cyan", category: "network" },
  { type: "vpc", label: "VPC", icon: Cloud, color: "aws-violet", category: "network" },
  { type: "subnet", label: "Subnet", icon: Layers, color: "aws-cyan", category: "network" },
  { type: "alb", label: "ALB", icon: Network, color: "aws-cyan", category: "network" },
  { type: "nat", label: "NAT Gateway", icon: Globe, color: "aws-teal", category: "network" },
  { type: "igw", label: "Internet Gateway", icon: Globe, color: "aws-teal", category: "network" },
  { type: "sg", label: "Security Group", icon: Shield, color: "aws-rose", category: "security" },
  { type: "iam", label: "IAM Role", icon: Lock, color: "aws-rose", category: "security" },
  { type: "dynamodb", label: "DynamoDB", icon: Database, color: "aws-amber", category: "database" },
  { type: "cloudfront", label: "CloudFront", icon: Globe, color: "aws-teal", category: "network" },
  { type: "route53", label: "Route 53", icon: Globe, color: "aws-teal", category: "network" },
  { type: "ecs", label: "ECS", icon: Container, color: "aws-violet", category: "container", isCompute: true },
  { type: "fargate", label: "Fargate", icon: Container, color: "aws-violet", category: "container", isCompute: true },
  { type: "ecr", label: "ECR", icon: Box, color: "aws-violet", category: "container" },
  { type: "sqs", label: "SQS", icon: Radio, color: "aws-amber", category: "messaging" },
  { type: "sns", label: "SNS", icon: Radio, color: "aws-amber", category: "messaging" },
  { type: "kms", label: "KMS", icon: Lock, color: "aws-rose", category: "security" },
  { type: "secrets", label: "Secrets Manager", icon: Lock, color: "aws-rose", category: "security" },
  { type: "cloudwatch", label: "CloudWatch", icon: Cpu, color: "aws-violet", category: "monitoring" },
  { type: "client", label: "Internet / Client", icon: Globe, color: "aws-orange", category: "external" },
];

const CATALOG_MAP: Record<ComponentType, ComponentDef> = CATALOG.reduce(
  (acc, def) => {
    acc[def.type] = def;
    return acc;
  },
  {} as Record<ComponentType, ComponentDef>,
);

// Group catalog by category for the palette
const CATALOG_GROUPS: Record<string, ComponentDef[]> = CATALOG.reduce(
  (acc, def) => {
    (acc[def.category] = acc[def.category] || []).push(def);
    return acc;
  },
  {} as Record<string, ComponentDef[]>,
);

const CATEGORY_LABELS: Record<string, string> = {
  external: "External",
  compute: "Compute",
  storage: "Storage",
  database: "Database",
  network: "Network",
  security: "Security",
  serverless: "Serverless",
  container: "Containers",
  messaging: "Messaging",
  monitoring: "Monitoring",
};

// ---------------------------------------------------------------------------
// Pre-built templates
// ---------------------------------------------------------------------------

interface Template {
  id: string;
  name: string;
  description: string;
  components: Omit<PlacedComponent, "id">[];
  edges: { from: string; to: string }[];
}

const TEMPLATES: Template[] = [
  {
    id: "3-tier-web",
    name: "3-Tier Web App",
    description: "Classic ALB → EC2 → RDS architecture with VPC and security groups.",
    components: [
      { type: "client", name: "Internet", x: 60, y: 40 },
      { type: "route53", name: "Route 53", x: 60, y: 130 },
      { type: "alb", name: "ALB", x: 60, y: 220 },
      { type: "vpc", name: "VPC", x: 280, y: 40 },
      { type: "subnet", name: "Public Subnet", x: 280, y: 130 },
      { type: "subnet", name: "Private Subnet", x: 280, y: 220 },
      { type: "ec2", name: "EC2 Web Tier", x: 280, y: 320 },
      { type: "sg", name: "Security Group", x: 480, y: 130 },
      { type: "rds", name: "RDS Multi-AZ", x: 480, y: 320 },
    ],
    edges: [
      { from: "client", to: "route53" },
      { from: "route53", to: "alb" },
      { from: "alb", to: "ec2" },
      { from: "ec2", to: "rds" },
      { from: "sg", to: "ec2" },
    ],
  },
  {
    id: "serverless-api",
    name: "Serverless API",
    description: "API Gateway → Lambda → DynamoDB with IAM role and CloudWatch.",
    components: [
      { type: "client", name: "Client", x: 60, y: 100 },
      { type: "apigateway", name: "API Gateway", x: 240, y: 100 },
      { type: "lambda", name: "Lambda", x: 420, y: 60 },
      { type: "lambda", name: "Lambda", x: 420, y: 140 },
      { type: "dynamodb", name: "DynamoDB", x: 600, y: 100 },
      { type: "iam", name: "Execution Role", x: 420, y: 240 },
      { type: "cloudwatch", name: "CloudWatch", x: 600, y: 240 },
    ],
    edges: [
      { from: "client", to: "apigateway" },
      { from: "apigateway", to: "lambda" },
      { from: "lambda", to: "dynamodb" },
      { from: "iam", to: "lambda" },
      { from: "lambda", to: "cloudwatch" },
    ],
  },
  {
    id: "static-cdn",
    name: "Static Site with CDN",
    description: "Route 53 → CloudFront → S3 — cost-effective global static hosting.",
    components: [
      { type: "client", name: "Visitors", x: 60, y: 100 },
      { type: "route53", name: "Route 53", x: 220, y: 100 },
      { type: "cloudfront", name: "CloudFront", x: 380, y: 100 },
      { type: "s3", name: "S3 (Static Files)", x: 540, y: 100 },
      { type: "kms", name: "KMS", x: 540, y: 220 },
    ],
    edges: [
      { from: "client", to: "route53" },
      { from: "route53", to: "cloudfront" },
      { from: "cloudfront", to: "s3" },
      { from: "s3", to: "kms" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Analysis logic
// ---------------------------------------------------------------------------

function analyzeArchitecture(
  components: PlacedComponent[],
  edges: Edge[],
): AnalysisResult {
  const securityWarnings: string[] = [];
  const haWarnings: string[] = [];
  const costWarnings: string[] = [];
  const recommendations: string[] = [];

  const types = components.map((c) => c.type);
  const computeComponents = components.filter((c) =>
    CATALOG_MAP[c.type].isCompute,
  );
  const securityComponents = components.filter(
    (c) => c.type === "sg" || c.type === "iam" || c.type === "kms",
  );

  // Security: every compute resource should have a security group
  if (computeComponents.length > 0) {
    const hasSG = components.some((c) => c.type === "sg");
    if (!hasSG) {
      securityWarnings.push(
        `${computeComponents.length} compute resource(s) without a Security Group. Add an SG to control inbound/outbound traffic.`,
      );
    }
  }

  // Security: KMS for S3 encryption
  if (types.includes("s3") && !types.includes("kms")) {
    securityWarnings.push(
      "S3 bucket without KMS encryption. Consider enabling SSE-KMS for sensitive data.",
    );
  }

  // High availability: RDS Multi-AZ
  if (types.includes("rds")) {
    const rdsName = components.find((c) => c.type === "rds")?.name || "";
    if (!/multi-?az/i.test(rdsName)) {
      haWarnings.push(
        "RDS instance — consider enabling Multi-AZ for failover in production.",
      );
    }
  }

  // High availability: ALB for EC2
  if (types.includes("ec2") && !types.includes("alb")) {
    haWarnings.push(
      "EC2 instances without an Application Load Balancer. Single-instance = single point of failure.",
    );
  }

  // High availability: no multi-AZ pattern (subnets in different AZs)
  const subnetCount = types.filter((t) => t === "subnet").length;
  if (subnetCount > 0 && subnetCount < 2) {
    haWarnings.push(
      "Only one subnet detected. Multi-AZ requires at least 2 subnets in different AZs.",
    );
  }

  // Cost: multiple NAT gateways
  const natCount = types.filter((t) => t === "nat").length;
  if (natCount > 1) {
    costWarnings.push(
      `${natCount} NAT Gateways detected (~$32/month each + data processing). Consider VPC endpoints for S3/DynamoDB traffic to reduce cost.`,
    );
  }

  // Recommendations: CloudFront
  if (
    (types.includes("s3") || types.includes("ec2")) &&
    !types.includes("cloudfront")
  ) {
    recommendations.push(
      "Add CloudFront for CDN — improves latency for global users and reduces origin load.",
    );
  }

  // Recommendations: Route 53
  if (
    (types.includes("alb") || types.includes("cloudfront")) &&
    !types.includes("route53")
  ) {
    recommendations.push(
      "Add Route 53 for DNS management — enables health checks and routing policies.",
    );
  }

  // Recommendations: CloudWatch
  if (computeComponents.length > 0 && !types.includes("cloudwatch")) {
    recommendations.push(
      "Add CloudWatch for metrics, logs, and alarms — essential for production observability.",
    );
  }

  // Recommendations: Secrets Manager
  if (
    (types.includes("rds") || types.includes("dynamodb")) &&
    !types.includes("secrets")
  ) {
    recommendations.push(
      "Store database credentials in Secrets Manager — never hardcode in code or environment files.",
    );
  }

  return {
    components: components.length,
    connections: edges.length,
    securityWarnings,
    haWarnings,
    costWarnings,
    recommendations,
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

let idCounter = 0;
function newId() {
  idCounter += 1;
  return `cmp-${Date.now().toString(36)}-${idCounter}`;
}

export function ArchitectureBuilder() {
  const navigate = useAppStore((s) => s.navigate);

  const [components, setComponents] = React.useState<PlacedComponent[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);
  const [mode, setMode] = React.useState<"select" | "connect">("select");
  const [selectedForConnect, setSelectedForConnect] =
    React.useState<string | null>(null);
  const [analysis, setAnalysis] = React.useState<AnalysisResult | null>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Drag state
  const dragState = React.useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // Add component from palette (place near top-left of canvas)
  const addComponent = (type: ComponentType) => {
    const def = CATALOG_MAP[type];
    const id = newId();
    // Random offset to avoid stacking on top of each other
    const offset =
      (components.length % 6) * 30 + Math.floor(Math.random() * 20);
    const newComp: PlacedComponent = {
      id,
      type,
      name: def.label,
      x: 40 + offset,
      y: 40 + offset,
    };
    setComponents((prev) => [...prev, newComp]);
    setAnalysis(null);
  };

  // Start dragging a component
  const startDrag = (e: React.MouseEvent, comp: PlacedComponent) => {
    if (mode === "connect") {
      handleCanvasComponentClick(comp.id);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dragState.current = {
      id: comp.id,
      offsetX: e.clientX - rect.left - comp.x,
      offsetY: e.clientY - rect.top - comp.y,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(rect.width - 110, e.clientX - rect.left - dragState.current.offsetX),
    );
    const y = Math.max(
      0,
      Math.min(rect.height - 60, e.clientY - rect.top - dragState.current.offsetY),
    );
    setComponents((prev) =>
      prev.map((c) =>
        c.id === dragState.current!.id ? { ...c, x, y } : c,
      ),
    );
  };

  const endDrag = () => {
    dragState.current = null;
  };

  const handleCanvasComponentClick = (id: string) => {
    if (mode !== "connect") return;
    if (selectedForConnect === null) {
      setSelectedForConnect(id);
    } else if (selectedForConnect === id) {
      setSelectedForConnect(null);
    } else {
      // Create edge
      const exists = edges.some(
        (e) =>
          (e.from === selectedForConnect && e.to === id) ||
          (e.from === id && e.to === selectedForConnect),
      );
      if (!exists) {
        setEdges((prev) => [
          ...prev,
          { id: newId(), from: selectedForConnect, to: id },
        ]);
        setAnalysis(null);
      }
      setSelectedForConnect(null);
    }
  };

  const deleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    setEdges((prev) =>
      prev.filter((e) => e.from !== id && e.to !== id),
    );
    if (selectedForConnect === id) setSelectedForConnect(null);
    setAnalysis(null);
  };

  const deleteEdge = (id: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
    setAnalysis(null);
  };

  const renameComponent = (id: string, name: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    );
    setAnalysis(null);
  };

  const clearCanvas = () => {
    setComponents([]);
    setEdges([]);
    setSelectedForConnect(null);
    setAnalysis(null);
  };

  const runAnalysis = () => {
    setAnalysis(analyzeArchitecture(components, edges));
  };

  const loadTemplate = (templateId: string) => {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    // Assign new IDs and translate from template refs
    const newComponents = tpl.components.map((c) => ({
      ...c,
      id: newId(),
    }));
    // Template edges reference component names — map them to the new IDs.
    const nameToId: Record<string, string> = {};
    newComponents.forEach((c) => {
      nameToId[c.name] = c.id;
    });
    const mappedEdges: Edge[] = tpl.edges.map((e) => ({
      id: newId(),
      from: nameToId[e.from] || newComponents[0].id,
      to: nameToId[e.to] || newComponents[0].id,
    }));
    setComponents(newComponents);
    setEdges(mappedEdges);
    setSelectedForConnect(null);
    setAnalysis(null);
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ name: "home" })}
        className="mb-1"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Home
      </Button>

      {/* Header */}
      <Card className="bg-gradient-mesh">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--aws-violet)", opacity: 0.12 }}
            >
              <Container
                className="w-7 h-7"
                style={{ color: "var(--aws-violet)" }}
              />
            </div>
            <div>
              <Badge className="mb-2 bg-aws-violet/15 text-aws-violet border-aws-violet/30 hover:bg-aws-violet/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Visual Architect
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Architecture Playground
              </h1>
              <p className="text-muted-foreground mt-1 max-w-3xl">
                Drag AWS components onto the canvas and connect them to build
                your architecture. Use a template to start fast, then click
                &quot;Analyze&quot; for instant feedback on security, HA, and
                cost.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main 3-column grid */}
      <div className="grid gap-4 lg:grid-cols-[240px_1fr_280px]">
        {/* Palette */}
        <Card className="lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Box className="w-4 h-4 text-aws-orange" />
              Components
            </CardTitle>
            <CardDescription className="text-xs">
              Click to add to canvas
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto scroll-area-thin max-h-[60vh] lg:max-h-none">
            <div className="space-y-4">
              {Object.entries(CATALOG_GROUPS).map(([category, items]) => (
                <div key={category}>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {CATEGORY_LABELS[category] || category}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {items.map((def) => {
                      const Icon = def.icon;
                      return (
                        <button
                          key={def.type}
                          onClick={() => addComponent(def.type)}
                          className="flex flex-col items-center gap-1 p-2 rounded-md border border-border hover:border-aws-orange/50 hover:bg-accent transition-colors text-center group"
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: `var(--${def.color})` }}
                          />
                          <span className="text-[10px] font-medium leading-tight">
                            {def.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-aws-cyan" />
                  Canvas
                </CardTitle>
                <CardDescription className="text-xs">
                  Drag components to reposition · Click two components in Connect
                  mode to link them.
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  size="sm"
                  variant={mode === "select" ? "default" : "outline"}
                  onClick={() => {
                    setMode("select");
                    setSelectedForConnect(null);
                  }}
                >
                  <MousePointerClick className="w-3.5 h-3.5 mr-1" />
                  Move
                </Button>
                <Button
                  size="sm"
                  variant={mode === "connect" ? "default" : "outline"}
                  onClick={() => setMode("connect")}
                >
                  <Link2 className="w-3.5 h-3.5 mr-1" />
                  Connect
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearCanvas}
                  disabled={components.length === 0}
                >
                  <Trash2 className="w-3.5 h-3.3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
            {mode === "connect" && (
              <Alert className="mt-2 border-aws-cyan/40 bg-aws-cyan/5 py-2">
                <Info className="w-3.5 h-3.5 text-aws-cyan" />
                <AlertDescription className="text-xs">
                  {selectedForConnect
                    ? "Now click another component to create a connection."
                    : "Click a component to start a connection."}
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            <div
              ref={canvasRef}
              className="arch-canvas relative w-full h-[480px] rounded-md border border-border overflow-hidden select-none"
              onMouseMove={onMouseMove}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
            >
              {components.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <Box className="w-10 h-10 text-muted-foreground/30 mb-2" />
                  <div className="text-sm text-muted-foreground">
                    Empty canvas
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Click components on the left to add them, or load a template
                    from the right.
                  </div>
                </div>
              )}

              {/* SVG edges layer */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 1 }}
              >
                {edges.map((edge) => {
                  const from = components.find((c) => c.id === edge.from);
                  const to = components.find((c) => c.id === edge.to);
                  if (!from || !to) return null;
                  const x1 = from.x + 55;
                  const y1 = from.y + 30;
                  const x2 = to.x + 55;
                  const y2 = to.y + 30;
                  return (
                    <g key={edge.id} className="pointer-events-auto">
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="var(--aws-orange)"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        opacity={0.7}
                      />
                      {/* Invisible thick line for click target */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="transparent"
                        strokeWidth={12}
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteEdge(edge.id)}
                      >
                        <title>Click to delete edge</title>
                      </line>
                    </g>
                  );
                })}
              </svg>

              {/* Placed components */}
              {components.map((comp) => {
                const def = CATALOG_MAP[comp.type];
                const Icon = def.icon;
                const isSelected = selectedForConnect === comp.id;
                return (
                  <div
                    key={comp.id}
                    className={cn(
                      "absolute flex flex-col items-center gap-1 px-2 py-2 rounded-lg border-2 bg-card shadow-sm transition-shadow",
                      "cursor-grab active:cursor-grabbing",
                      mode === "connect" && "cursor-pointer",
                      isSelected
                        ? "border-aws-orange shadow-md ring-2 ring-aws-orange/30"
                        : "border-border hover:border-aws-orange/50 hover:shadow-md",
                    )}
                    style={{
                      left: comp.x,
                      top: comp.y,
                      width: 110,
                      zIndex: isSelected ? 10 : 2,
                    }}
                    onMouseDown={(e) => startDrag(e, comp)}
                    onClick={() => handleCanvasComponentClick(comp.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon
                        className="w-4 h-4"
                        style={{ color: `var(--${def.color})` }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteComponent(comp.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-aws-rose text-muted-foreground transition-opacity"
                        aria-label={`Delete ${comp.name}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) => renameComponent(comp.id, e.target.value)}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-medium text-center bg-transparent border-0 outline-0 w-full focus:bg-accent/50 rounded px-1"
                      aria-label="Component name"
                    />
                    <div className="text-[9px] text-muted-foreground uppercase font-mono">
                      {def.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Canvas footer stats */}
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <Badge variant="outline">
                {components.length} components
              </Badge>
              <Badge variant="outline">{edges.length} connections</Badge>
              <span className="text-muted-foreground">
                Tip: click an edge to remove it · rename components by clicking
                their label
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Analysis & Templates panel */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-aws-violet" />
                Analysis
              </CardTitle>
              <CardDescription className="text-xs">
                Run a quick architecture review.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                size="sm"
                className="w-full"
                onClick={runAnalysis}
                disabled={components.length === 0}
              >
                <Eye className="w-4 h-4 mr-1" />
                Analyze Architecture
              </Button>

              {!analysis && components.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-2">
                  Add components to begin.
                </div>
              )}

              {analysis && (
                <div className="space-y-3">
                  {/* Counts */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-border p-2 text-center">
                      <div className="text-xl font-bold">
                        {analysis.components}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Components
                      </div>
                    </div>
                    <div className="rounded-md border border-border p-2 text-center">
                      <div className="text-xl font-bold">
                        {analysis.connections}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Connections
                      </div>
                    </div>
                  </div>

                  <AnalysisSection
                    title="Security"
                    items={analysis.securityWarnings}
                    color="aws-rose"
                    emptyText="No security issues detected."
                  />
                  <AnalysisSection
                    title="High Availability"
                    items={analysis.haWarnings}
                    color="aws-amber"
                    emptyText="HA patterns look good."
                  />
                  <AnalysisSection
                    title="Cost"
                    items={analysis.costWarnings}
                    color="aws-orange"
                    emptyText="No major cost concerns."
                  />
                  <AnalysisSection
                    title="Recommendations"
                    items={analysis.recommendations}
                    color="aws-emerald"
                    emptyText="Architecture follows AWS best practices."
                    isRecommendation
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-aws-cyan" />
                Templates
              </CardTitle>
              <CardDescription className="text-xs">
                Load a starter architecture.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select onValueChange={loadTemplate}>
                <SelectTrigger className="w-full" size="sm">
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((tpl) => (
                    <SelectItem key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-1.5">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => loadTemplate(tpl.id)}
                    className="w-full text-left p-2 rounded-md border border-border hover:border-aws-cyan/50 hover:bg-accent transition-colors"
                  >
                    <div className="text-xs font-medium">{tpl.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {tpl.description}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Educational callout */}
      <Alert className="border-aws-violet/30 bg-aws-violet/5">
        <Sparkles className="w-4 h-4 text-aws-violet" />
        <AlertTitle className="text-aws-violet">Learning tip</AlertTitle>
        <AlertDescription className="text-xs">
          Real AWS architectures are typically expressed as code (CloudFormation,
          CDK, Terraform) for reproducibility. This visual builder is a learning
          tool to reason about service relationships — when you&apos;re ready to
          deploy, translate your design into infrastructure-as-code.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AnalysisSection({
  title,
  items,
  color,
  emptyText,
  isRecommendation = false,
}: {
  title: string;
  items: string[];
  color: string;
  emptyText: string;
  isRecommendation?: boolean;
}) {
  return (
    <div>
      <div
        className="text-xs font-medium mb-1.5 flex items-center gap-1.5"
        style={{ color: `var(--${color})` }}
      >
        {isRecommendation ? (
          <CheckCircle2 className="w-3 h-3" />
        ) : (
          <AlertTriangle className="w-3 h-3" />
        )}
        {title}
        <span className="text-muted-foreground font-normal">
          ({items.length})
        </span>
      </div>
      {items.length === 0 ? (
        <div className="text-[10px] text-muted-foreground pl-5">
          {emptyText}
        </div>
      ) : (
        <ul className="space-y-1 pl-5">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="text-[11px] text-muted-foreground flex items-start gap-1"
            >
              <span style={{ color: `var(--${color})` }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
