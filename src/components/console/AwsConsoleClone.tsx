"use client";

/**
 * AwsConsoleClone — a fully simulated AWS Management Console educational playground.
 *
 * This is NOT a real AWS console. It is an original, learning-oriented clone
 * that lets learners walk through realistic AWS workflows (Launch Instance,
 * Create Bucket, Create User, Create VPC, Create Lambda function, CloudWatch)
 * end-to-end. Every action is local-only; no real AWS resources are created.
 *
 * File structure (top-to-bottom):
 *   1. Imports
 *   2. Types
 *   3. Static data (services, AMIs, instance types, etc.)
 *   4. Reusable primitives (SimBadge, ServiceHeader, WizardShell, SuccessModal, CliCommand, Tag editor)
 *   5. EC2 Console + Launch Wizard
 *   6. S3 Console + Create Bucket Wizard + Bucket Detail
 *   7. IAM Console + Create User Wizard + User Detail + Roles/Assume Role
 *   8. VPC Console + Visual Diagram + Create VPC Wizard
 *   9. Lambda Console + Create Function Wizard + Function Detail
 *  10. CloudWatch Console (Dashboards/Metrics/Alarms/Logs)
 *  11. Top-level AwsConsoleClone shell
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud, Server, HardDrive, Database as DbIcon, Network as NetIcon, Shield, Activity,
  Search, ChevronDown, Menu, X, Globe, User as UserIcon, Settings, Plus,
  ArrowLeft, ArrowRight, Check, CheckCircle2, AlertTriangle, AlertCircle,
  Info, Cpu, Lock, Key, GitBranch, Rocket, Zap,
  Folder, File, Download, Share2, RefreshCw, Filter,
  Play, Terminal, Eye, Clock, Tag, Trash2,
  ExternalLink, Layers, Route as RouteIcon, Wifi, Building2,
  BarChart3, Bell, FileText,
  ChevronRight, ChevronLeft, HelpCircle, Container,
  ShieldCheck, Users as UsersIcon, ListChecks, Gauge, Calendar,
  ArrowUpDown, Power, CircleDot, Save, Link2, Network, Boxes,
  Cpu as CpuIcon, MemoryStick, CircleCheck, CircleAlert, CircleDashed,
  Settings2, BookOpen, Cloudy, Pencil, ClipboardList, Workflow, Coins,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";

// ===========================================================================
// 1. Types
// ===========================================================================

type ServiceId = "ec2" | "s3" | "iam" | "vpc" | "lambda" | "cloudwatch";

interface ServiceDef {
  id: ServiceId;
  name: string;
  shortName: string;
  category: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  description: string;
}

interface Ec2Instance {
  id: string;
  name: string;
  state: "pending" | "running" | "stopped" | "stopping";
  type: string;
  az: string;
  publicIp: string;
  ami: string;
  statusChecks: { system: "ok" | "impaired"; instance: "ok" | "impaired" };
}

interface S3Bucket {
  name: string;
  region: string;
  access: string;
  created: string;
  versioning: boolean;
  encryption: string;
  objects: { key: string; size: string; lastModified: string; type: string }[];
}

interface IamUser {
  userName: string;
  arn: string;
  created: string;
  lastActivity: string;
  groups: string[];
  consoleAccess: boolean;
  password?: string;
  accessKey?: string;
  tags: { key: string; value: string }[];
}

interface IamRole {
  name: string;
  arn: string;
  description: string;
  trustPolicy: string;
  permissions: string[];
  created: string;
}

interface VpcResource {
  id: string;
  name: string;
  cidr: string;
  azCount: number;
  publicSubnets: { id: string; cidr: string; az: string; name: string }[];
  privateSubnets: { id: string; cidr: string; az: string; name: string }[];
  igw: { id: string };
  natGateways: { id: string; subnet: string; az: string }[];
  routeTables: { id: string; name: string; subnet: string; routes: { dest: string; target: string }[] }[];
  vpcEndpoints: string[];
  created: string;
}

interface LambdaFunction {
  name: string;
  runtime: string;
  handler: string;
  lastModified: string;
  codeSize: string;
  architecture: string;
  memory: number;
  timeout: number;
  role: string;
  envVars: { key: string; value: string }[];
  description: string;
}

interface TagPair { key: string; value: string; }

// ===========================================================================
// 2. Static data
// ===========================================================================

const SERVICE_GROUPS: { category: string; services: ServiceDef[] }[] = [
  {
    category: "Compute",
    services: [
      { id: "ec2", name: "EC2", shortName: "EC2", category: "Compute", icon: Server, color: "var(--aws-orange)", description: "Virtual servers in the cloud" },
      { id: "lambda", name: "Lambda", shortName: "Lambda", category: "Compute", icon: Zap, color: "var(--aws-rose)", description: "Run code without thinking about servers" },
    ],
  },
  {
    category: "Storage",
    services: [
      { id: "s3", name: "S3", shortName: "S3", category: "Storage", icon: HardDrive, color: "var(--aws-emerald)", description: "Scalable storage in the cloud" },
    ],
  },
  {
    category: "Database",
    services: [
      { id: "iam", name: "IAM", shortName: "IAM", category: "Security", icon: Shield, color: "var(--aws-rose)", description: "Manage access to AWS services and resources" },
    ],
  },
  {
    category: "Networking",
    services: [
      { id: "vpc", name: "VPC", shortName: "VPC", category: "Networking", icon: Network, color: "var(--aws-violet)", description: "Isolated cloud resources" },
    ],
  },
  {
    category: "Management",
    services: [
      { id: "cloudwatch", name: "CloudWatch", shortName: "CW", category: "Management", icon: Activity, color: "var(--aws-cyan)", description: "Monitor resources and applications" },
    ],
  },
];

// Extra sidebar entries (visible but not implemented as full consoles — clicking shows "coming soon")
const SIDEBAR_SERVICES = [
  { id: "ec2", name: "EC2", category: "Compute", icon: Server, color: "var(--aws-orange)" },
  { id: "lambda", name: "Lambda", category: "Compute", icon: Zap, color: "var(--aws-rose)" },
  { id: "ecs", name: "ECS", category: "Compute", icon: Container, color: "var(--aws-amber)" },
  { id: "eks", name: "EKS", category: "Compute", icon: Boxes, color: "var(--aws-teal)" },
  { id: "batch", name: "Batch", category: "Compute", icon: Layers, color: "var(--aws-cyan)" },
  { id: "s3", name: "S3", category: "Storage", icon: HardDrive, color: "var(--aws-emerald)" },
  { id: "ebs", name: "EBS", category: "Storage", icon: HardDrive, color: "var(--aws-amber)" },
  { id: "efs", name: "EFS", category: "Storage", icon: Folder, color: "var(--aws-teal)" },
  { id: "glacier", name: "S3 Glacier", category: "Storage", icon: SnowflakeIcon, color: "var(--aws-cyan)" },
  { id: "rds", name: "RDS", category: "Database", icon: DbIcon, color: "var(--aws-violet)" },
  { id: "dynamodb", name: "DynamoDB", category: "Database", icon: DbIcon, color: "var(--aws-amber)" },
  { id: "elasticache", name: "ElastiCache", category: "Database", icon: MemoryStick, color: "var(--aws-rose)" },
  { id: "redshift", name: "Redshift", category: "Database", icon: BarChart3, color: "var(--aws-teal)" },
  { id: "vpc", name: "VPC", category: "Networking", icon: Network, color: "var(--aws-violet)" },
  { id: "cloudfront", name: "CloudFront", category: "Networking", icon: Globe, color: "var(--aws-cyan)" },
  { id: "route53", name: "Route 53", category: "Networking", icon: RouteIcon, color: "var(--aws-rose)" },
  { id: "apigateway", name: "API Gateway", category: "Networking", icon: Workflow, color: "var(--aws-amber)" },
  { id: "iam", name: "IAM", category: "Security", icon: Shield, color: "var(--aws-rose)" },
  { id: "kms", name: "KMS", category: "Security", icon: Key, color: "var(--aws-violet)" },
  { id: "secretsmanager", name: "Secrets Manager", category: "Security", icon: Lock, color: "var(--aws-teal)" },
  { id: "waf", name: "WAF", category: "Security", icon: ShieldCheck, color: "var(--aws-emerald)" },
  { id: "cloudwatch", name: "CloudWatch", category: "Management", icon: Activity, color: "var(--aws-cyan)" },
  { id: "cloudtrail", name: "CloudTrail", category: "Management", icon: FileText, color: "var(--aws-amber)" },
  { id: "cloudformation", name: "CloudFormation", category: "Management", icon: Layers, color: "var(--aws-violet)" },
] as const;

const REGIONS = [
  { id: "us-east-1", name: "US East (N. Virginia)" },
  { id: "us-west-2", name: "US West (Oregon)" },
  { id: "eu-west-1", name: "Europe (Ireland)" },
  { id: "ap-south-1", name: "Asia Pacific (Mumbai)" },
  { id: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
];

const AMIS = [
  { id: "ami-0abcdef1234567890", name: "Amazon Linux 2023", os: "Linux", arch: "x86_64", desc: "Amazon Linux 2023 AMI — general purpose", color: "var(--aws-orange)" },
  { id: "ami-0fedcba9876543210", name: "Ubuntu Server 22.04 LTS", os: "Linux", arch: "x86_64", desc: "Ubuntu 22.04 LTS, Long-term support", color: "var(--aws-rose)" },
  { id: "ami-0123456789abcdef0", name: "Windows Server 2022 Base", os: "Windows", arch: "x86_64", desc: "Microsoft Windows Server 2022", color: "var(--aws-cyan)" },
  { id: "ami-0a1b2c3d4e5f60718", name: "Red Hat Enterprise Linux 8", os: "Linux", arch: "x86_64", desc: "RHEL 8 — paid AMI", color: "var(--aws-rose)" },
  { id: "ami-0f1e2d3c4b5a69788", name: "Debian 12", os: "Linux", arch: "x86_64", desc: "Debian 12 (Bookworm)", color: "var(--aws-violet)" },
];

const INSTANCE_TYPES = [
  { id: "t3.micro", vcpu: 2, ram: "1 GiB", net: "Up to 5 Gbps", free: true },
  { id: "t3.small", vcpu: 2, ram: "2 GiB", net: "Up to 5 Gbps", free: false },
  { id: "m5.large", vcpu: 2, ram: "8 GiB", net: "Up to 10 Gbps", free: false },
  { id: "c5.xlarge", vcpu: 4, ram: "8 GiB", net: "Up to 10 Gbps", free: false },
  { id: "r5.xlarge", vcpu: 4, ram: "32 GiB", net: "Up to 10 Gbps", free: false },
];

const LAMBDA_RUNTIMES = [
  "Python 3.12", "Node.js 20", "Java 21", "Go 1.x", ".NET 8", "Ruby 3.3",
];

const AWS_NAVY = "oklch(0.21 0.02 250)";
const AWS_NAVY_LIGHT = "oklch(0.27 0.02 250)";
const AWS_SIDEBAR = "oklch(0.97 0.005 250)";

// ===========================================================================
// 3. Reusable primitives
// ===========================================================================

function SnowflakeIcon(props: { className?: string }) {
  return <Cloudy {...props} />;
}

function SimBadge({ compact = false }: { compact?: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              compact ? "" : ""
            )}
            style={{
              borderColor: "color-mix(in oklch, var(--aws-amber) 40%, transparent)",
              backgroundColor: "color-mix(in oklch, var(--aws-amber) 15%, transparent)",
              color: "var(--aws-amber)",
            }}
          >
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ backgroundColor: "var(--aws-amber)", boxShadow: "0 0 6px var(--aws-amber)" }}
            />
            Simulation
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          This is a learning sandbox. No real AWS resources are created, modified, or billed.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function CliCommand({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-zinc-950 p-3 font-mono text-xs text-zinc-200">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-400">
        <Terminal className="size-3" /> AWS CLI equivalent
      </div>
      <pre className="whitespace-pre-wrap break-all leading-relaxed">{children}</pre>
    </div>
  );
}

function ServiceHeader({
  icon: Icon,
  title,
  description,
  color,
  action,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  description: string;
  color: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
      <div className="flex items-start gap-3">
        <div
          className="flex size-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklch, ${color} 18%, transparent)` }}
        >
          <Icon className="size-6" style={{ color }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{title}</h1>
            <SimBadge compact />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function WizardShell({
  steps,
  currentStep,
  title,
  description,
  onClose,
  children,
}: {
  steps: string[];
  currentStep: number;
  title: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  return (
    <DialogContent
      className="max-h-[92vh] w-[min(960px,95vw)] overflow-y-auto p-0"
      showCloseButton
    >
      <DialogHeader className="border-b px-6 pt-6 pb-4">
        <DialogTitle className="text-lg">{title}</DialogTitle>
        {description && (
          <DialogDescription className="text-xs">{description}</DialogDescription>
        )}
      </DialogHeader>
      {/* Step indicator */}
      <div className="border-b px-6 py-3">
        <div className="flex flex-wrap items-center gap-1">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-[11px] font-semibold",
                    i < currentStep && "bg-emerald-600 text-white",
                    i === currentStep && "text-white",
                    i > currentStep && "bg-muted text-muted-foreground"
                  )}
                  style={i === currentStep ? { backgroundColor: "var(--aws-orange)" } : undefined}
                >
                  {i < currentStep ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "hidden text-xs sm:inline",
                    i === currentStep ? "font-semibold" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-px w-6 sm:w-10",
                    i < currentStep ? "bg-emerald-500" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <DialogDescription className="sr-only">{steps[currentStep]}</DialogDescription>
      {children}
    </DialogContent>
  );
}

function SuccessModal({
  open,
  onClose,
  title,
  icon: Icon,
  color,
  message,
  details,
  cli,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  message: string;
  details: { label: string; value: string }[];
  cli: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[min(560px,95vw)]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex size-11 items-center justify-center rounded-full"
              style={{ backgroundColor: `color-mix(in oklch, ${color} 18%, transparent)` }}
            >
              <Icon className="size-6" style={{ color }} />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{message}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <ListChecks className="size-3.5" /> Created resource
            </div>
            <dl className="space-y-1.5">
              {details.map((d) => (
                <div key={d.label} className="flex justify-between gap-4 text-sm">
                  <dt className="text-muted-foreground">{d.label}</dt>
                  <dd className="font-mono text-right text-foreground">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <CliCommand>{cli}</CliCommand>
          <Alert>
            <Info className="size-4" />
            <AlertTitle>Simulation only</AlertTitle>
            <AlertDescription>
              Nothing was actually created in AWS. Use the equivalent CLI command above with your real AWS credentials to perform this action in a real account.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TagEditor({
  tags,
  onChange,
}: {
  tags: TagPair[];
  onChange: (t: TagPair[]) => void;
}) {
  return (
    <div className="space-y-2">
      {tags.map((t, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            placeholder="Key"
            value={t.key}
            onChange={(e) => {
              const next = [...tags];
              next[i] = { ...next[i], key: e.target.value };
              onChange(next);
            }}
            className="h-8 flex-1"
          />
          <Input
            placeholder="Value"
            value={t.value}
            onChange={(e) => {
              const next = [...tags];
              next[i] = { ...next[i], value: e.target.value };
              onChange(next);
            }}
            className="h-8 flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={() => onChange(tags.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="text-xs"
        onClick={() => onChange([...tags, { key: "", value: "" }])}
      >
        <Plus className="size-3.5" /> Add new tag
      </Button>
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  const map: Record<string, { bg: string; fg: string; icon: React.ComponentType<{ className?: string }> }> = {
    running: { bg: "var(--aws-emerald)", fg: "white", icon: CircleCheck },
    pending: { bg: "var(--aws-amber)", fg: "white", icon: Clock },
    stopped: { bg: "var(--muted-foreground)", fg: "white", icon: CircleDashed },
    stopping: { bg: "var(--aws-amber)", fg: "white", icon: Clock },
    OK: { bg: "var(--aws-emerald)", fg: "white", icon: CheckCircle2 },
    ALARM: { bg: "var(--aws-rose)", fg: "white", icon: AlertTriangle },
    INSUFFICIENT_DATA: { bg: "var(--muted-foreground)", fg: "white", icon: CircleAlert },
  };
  const cfg = map[state] ?? map.running;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.fg }}
    >
      <Icon className="size-3" /> {state}
    </span>
  );
}

// ===========================================================================
// 4. EC2 Console + Launch Instance Wizard (7 steps)
// ===========================================================================

const INITIAL_EC2: Ec2Instance[] = [
  {
    id: "i-0abc123def4567890",
    name: "web-server-prod",
    state: "running",
    type: "t3.small",
    az: "us-east-1a",
    publicIp: "54.210.18.92",
    ami: "Amazon Linux 2023",
    statusChecks: { system: "ok", instance: "ok" },
  },
  {
    id: "i-0def456abc7890123",
    name: "app-server-staging",
    state: "running",
    type: "m5.large",
    az: "us-east-1b",
    publicIp: "3.219.66.140",
    ami: "Ubuntu Server 22.04 LTS",
    statusChecks: { system: "ok", instance: "ok" },
  },
  {
    id: "i-0ghi789jkl0123456",
    name: "db-worker-dev",
    state: "stopped",
    type: "r5.xlarge",
    az: "us-east-1c",
    publicIp: "-",
    ami: "Red Hat Enterprise Linux 8",
    statusChecks: { system: "ok", instance: "ok" },
  },
];

function Ec2Console({
  instances,
  setInstances,
}: {
  instances: Ec2Instance[];
  setInstances: React.Dispatch<React.SetStateAction<Ec2Instance[]>>;
}) {
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggleSelect = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return (
    <div className="space-y-4">
      <ServiceHeader
        icon={Server}
        title="EC2"
        description="Virtual servers in the cloud"
        color="var(--aws-orange)"
        action={
          <Button
            className="text-white"
            style={{ backgroundColor: "var(--aws-orange)" }}
            onClick={() => setWizardOpen(true)}
          >
            <Rocket className="size-4" /> Launch instance
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">Instances ({instances.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="size-3.5" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <RefreshCw className="size-3.5" /> Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox
                    checked={selected.length === instances.length && instances.length > 0}
                    onCheckedChange={(v) => setSelected(v ? instances.map((i) => i.id) : [])}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Instance ID</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Instance type</TableHead>
                <TableHead>AZ</TableHead>
                <TableHead>Public IPv4</TableHead>
                <TableHead>Status check</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instances.map((inst) => (
                <TableRow key={inst.id} data-state={selected.includes(inst.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(inst.id)}
                      onCheckedChange={() => toggleSelect(inst.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{inst.name}</TableCell>
                  <TableCell className="font-mono text-xs text-[color:var(--aws-orange)]">{inst.id}</TableCell>
                  <TableCell><StateBadge state={inst.state} /></TableCell>
                  <TableCell>{inst.type}</TableCell>
                  <TableCell>{inst.az}</TableCell>
                  <TableCell className="font-mono text-xs">{inst.publicIp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <CircleCheck className="size-3.5" style={{ color: "var(--aws-emerald)" }} />
                        2/2 checks
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Ec2LaunchWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onLaunch={(newInstance) => {
          setInstances((prev) => [newInstance, ...prev]);
          // Simulate pending → running after 3 seconds
          setTimeout(() => {
            setInstances((prev) =>
              prev.map((i) =>
                i.id === newInstance.id
                  ? { ...i, state: "running", publicIp: `54.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` }
                  : i
              )
            );
          }, 3000);
        }}
      />
    </div>
  );
}

function Ec2LaunchWizard({
  open,
  onClose,
  onLaunch,
}: {
  open: boolean;
  onClose: () => void;
  onLaunch: (inst: Ec2Instance) => void;
}) {
  const STEPS = [
    "Name and tags",
    "AMI",
    "Instance type",
    "Key pair",
    "Network",
    "Storage",
    "Review",
  ];
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [tags, setTags] = React.useState<TagPair[]>([]);
  const [ami, setAmi] = React.useState<string>("ami-0abcdef1234567890");
  const [amiName, setAmiName] = React.useState("Amazon Linux 2023");
  const [instanceType, setInstanceType] = React.useState("t3.micro");
  const [keyPairMode, setKeyPairMode] = React.useState<"existing" | "new">("existing");
  const [existingKey, setExistingKey] = React.useState("lab-keypair-us-east-1");
  const [newKeyName, setNewKeyName] = React.useState("");
  const [vpc, setVpc] = React.useState("vpc-abc123 (default)");
  const [subnet, setSubnet] = React.useState("subnet-1a2b3c4d | us-east-1a");
  const [autoPublicIp, setAutoPublicIp] = React.useState(true);
  const [sgCreateNew, setSgCreateNew] = React.useState(true);
  const [sgName, setSgName] = React.useState("launch-wizard-1-sg");
  const [sshFromMyIp, setSshFromMyIp] = React.useState(true);
  const [httpFromAnywhere, setHttpFromAnywhere] = React.useState(true);
  const [volumeSize, setVolumeSize] = React.useState(8);
  const [volumeType, setVolumeType] = React.useState("gp3");
  const [extraVolumes, setExtraVolumes] = React.useState<{ size: number; type: string }[]>([]);
  const [success, setSuccess] = React.useState<Ec2Instance | null>(null);

  const reset = () => {
    setStep(0); setName(""); setTags([]); setAmi("ami-0abcdef1234567890");
    setAmiName("Amazon Linux 2023"); setInstanceType("t3.micro");
    setKeyPairMode("existing"); setExistingKey("lab-keypair-us-east-1");
    setNewKeyName(""); setVpc("vpc-abc123 (default)");
    setSubnet("subnet-1a2b3c4d | us-east-1a"); setAutoPublicIp(true);
    setSgCreateNew(true); setSgName("launch-wizard-1-sg");
    setSshFromMyIp(true); setHttpFromAnywhere(true);
    setVolumeSize(8); setVolumeType("gp3"); setExtraVolumes([]);
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return !!ami;
    if (step === 2) return !!instanceType;
    if (step === 3) return keyPairMode === "existing" ? !!existingKey : newKeyName.trim().length > 0;
    if (step === 4) return !!vpc && !!subnet;
    return true;
  };

  const handleLaunch = () => {
    const newInstance: Ec2Instance = {
      id: "i-" + Math.random().toString(16).slice(2, 18).padEnd(17, "0").slice(0, 17),
      name: name.trim(),
      state: "pending",
      type: instanceType,
      az: subnet.split("|")[1]?.trim().split(" ")[0] ?? "us-east-1a",
      publicIp: "-",
      ami: amiName,
      statusChecks: { system: "ok", instance: "ok" },
    };
    onLaunch(newInstance);
    setSuccess(newInstance);
  };

  const close = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && close()}>
        <WizardShell
          steps={STEPS}
          currentStep={step}
          title="Launch an instance"
          description="Configure and launch a virtual server"
          onClose={close}
        >
          <div className="px-6 py-4 min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ec2-name">Name</Label>
                      <Input
                        id="ec2-name"
                        placeholder="web-server-prod"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        This name will be added as a tag with key &quot;Name&quot;.
                      </p>
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Optional. Add additional tags as key-value pairs.
                      </p>
                      <TagEditor tags={tags} onChange={setTags} />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3">
                    <Label>Application and OS Images (Amazon Machine Image)</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {AMIS.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => { setAmi(a.id); setAmiName(a.name); }}
                          className={cn(
                            "flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:bg-accent/50",
                            ami === a.id && "ring-2"
                          )}
                          style={ami === a.id ? { borderColor: "var(--aws-orange)", boxShadow: "0 0 0 1px var(--aws-orange)" } : undefined}
                        >
                          <div
                            className="flex size-9 shrink-0 items-center justify-center rounded"
                            style={{ backgroundColor: `color-mix(in oklch, ${a.color} 18%, transparent)` }}
                          >
                            <Server className="size-5" style={{ color: a.color }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{a.name}</span>
                              {ami === a.id && <Check className="size-4" style={{ color: "var(--aws-orange)" }} />}
                            </div>
                            <div className="mt-0.5 truncate text-xs text-muted-foreground">{a.desc}</div>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                              <Badge variant="outline" className="text-[10px]">{a.os}</Badge>
                              <span className="font-mono">{a.id}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <Label>Instance type</Label>
                    <p className="text-xs text-muted-foreground">
                      The instance type determines the hardware of the host computer used for your instance.
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-8"></TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>vCPUs</TableHead>
                          <TableHead>Memory</TableHead>
                          <TableHead>Network performance</TableHead>
                          <TableHead>Free tier</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {INSTANCE_TYPES.map((t) => (
                          <TableRow
                            key={t.id}
                            className={cn("cursor-pointer", instanceType === t.id && "bg-accent")}
                            onClick={() => setInstanceType(t.id)}
                          >
                            <TableCell>
                              <RadioGroup
                                value={instanceType}
                                onValueChange={setInstanceType}
                              >
                                <RadioGroupItem value={t.id} id={`it-${t.id}`} />
                              </RadioGroup>
                            </TableCell>
                            <TableCell className="font-mono text-sm font-medium">{t.id}</TableCell>
                            <TableCell>{t.vcpu}</TableCell>
                            <TableCell>{t.ram}</TableCell>
                            <TableCell className="text-xs">{t.net}</TableCell>
                            <TableCell>
                              {t.free && (
                                <Badge
                                  className="text-[10px]"
                                  style={{ backgroundColor: "var(--aws-emerald)", color: "white" }}
                                >
                                  Free tier
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <Label>Key pair (login)</Label>
                    <p className="text-xs text-muted-foreground">
                      A key pair is used to securely connect to your instance.
                    </p>
                    <RadioGroup
                      value={keyPairMode}
                      onValueChange={(v) => setKeyPairMode(v as "existing" | "new")}
                    >
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="existing" id="kp-existing" className="mt-0.5" />
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="kp-existing" className="cursor-pointer font-normal">
                            Select an existing key pair
                          </Label>
                          {keyPairMode === "existing" && (
                            <Select value={existingKey} onValueChange={setExistingKey}>
                              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lab-keypair-us-east-1">lab-keypair-us-east-1</SelectItem>
                                <SelectItem value="prod-ssh-key">prod-ssh-key</SelectItem>
                                <SelectItem value="admin-keypair">admin-keypair</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="new" id="kp-new" className="mt-0.5" />
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="kp-new" className="cursor-pointer font-normal">
                            Create new key pair
                          </Label>
                          {keyPairMode === "new" && (
                            <>
                              <Input
                                placeholder="my-new-keypair"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                              />
                              <Select defaultValue="rsa">
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="rsa">RSA</SelectItem>
                                  <SelectItem value="ed25519">ED25519</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground">
                                The private key file (.pem) will download automatically.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label>VPC</Label>
                        <Select value={vpc} onValueChange={setVpc}>
                          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vpc-abc123 (default)">vpc-abc123 (10.0.0.0/16)</SelectItem>
                            <SelectItem value="vpc-prod-9988">vpc-prod-9988 (172.16.0.0/16)</SelectItem>
                            <SelectItem value="vpc-mgmt-4455">vpc-mgmt-4455 (10.50.0.0/16)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Subnet</Label>
                        <Select value={subnet} onValueChange={setSubnet}>
                          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="subnet-1a2b3c4d | us-east-1a">subnet-1a2b3c4d | us-east-1a</SelectItem>
                            <SelectItem value="subnet-5e6f7g8h | us-east-1b">subnet-5e6f7g8h | us-east-1b</SelectItem>
                            <SelectItem value="subnet-9i0j1k2l | us-east-1c">subnet-9i0j1k2l | us-east-1c</SelectItem>
                            <SelectItem value="no-preference">No preference</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <Label className="cursor-pointer">Auto-assign public IP</Label>
                        <p className="text-xs text-muted-foreground">Use a public IP address for instances launched in the default subnet.</p>
                      </div>
                      <Checkbox checked={autoPublicIp} onCheckedChange={(v) => setAutoPublicIp(!!v)} />
                    </div>
                    <div className="rounded-md border p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="cursor-pointer">Security group</Label>
                        <RadioGroup
                          value={sgCreateNew ? "new" : "existing"}
                          onValueChange={(v) => setSgCreateNew(v === "new")}
                          className="flex gap-4"
                        >
                          <div className="flex items-center gap-1.5">
                            <RadioGroupItem value="new" id="sg-new" />
                            <Label htmlFor="sg-new" className="text-xs cursor-pointer">Create new</Label>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <RadioGroupItem value="existing" id="sg-existing" />
                            <Label htmlFor="sg-existing" className="text-xs cursor-pointer">Select existing</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {sgCreateNew && (
                        <Input
                          placeholder="Security group name"
                          value={sgName}
                          onChange={(e) => setSgName(e.target.value)}
                        />
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Allow SSH traffic from your IP (port 22)</Label>
                          <Checkbox checked={sshFromMyIp} onCheckedChange={(v) => setSshFromMyIp(!!v)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Allow HTTP traffic from the internet (port 80)</Label>
                          <Checkbox checked={httpFromAnywhere} onCheckedChange={(v) => setHttpFromAnywhere(!!v)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <Label>Configure storage</Label>
                    <div className="rounded-md border p-4 space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <Label className="text-xs">Size (GiB)</Label>
                          <Input
                            type="number"
                            min={1}
                            max={16384}
                            value={volumeSize}
                            onChange={(e) => setVolumeSize(Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Volume type</Label>
                          <Select value={volumeType} onValueChange={setVolumeType}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gp3">gp3 (General Purpose SSD)</SelectItem>
                              <SelectItem value="gp2">gp2 (General Purpose SSD)</SelectItem>
                              <SelectItem value="io2">io2 (Provisioned IOPS SSD)</SelectItem>
                              <SelectItem value="st1">st1 (Throughput Optimized HDD)</SelectItem>
                              <SelectItem value="sc1">sc1 (Cold HDD)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Badge variant="outline" className="text-[10px]">{volumeType}</Badge>
                        </div>
                      </div>
                    </div>
                    {extraVolumes.length > 0 && (
                      <div className="space-y-2">
                        {extraVolumes.map((v, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-md border p-2 text-xs">
                            <HardDrive className="size-4 text-muted-foreground" />
                            <span>{v.size} GiB</span>
                            <Badge variant="outline" className="text-[10px]">{v.type}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto size-6"
                              onClick={() => setExtraVolumes(extraVolumes.filter((_, idx) => idx !== i))}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExtraVolumes([...extraVolumes, { size: 20, type: "gp3" }])}
                    >
                      <Plus className="size-3.5" /> Add new volume
                    </Button>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle2 className="size-4" style={{ color: "var(--aws-emerald)" }} />
                      <AlertTitle>Review your configuration</AlertTitle>
                      <AlertDescription>
                        Verify the details below, then click Launch to create your EC2 instance.
                      </AlertDescription>
                    </Alert>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-md border p-4 text-sm sm:grid-cols-2">
                      <ReviewRow label="Name" value={name} />
                      <ReviewRow label="AMI" value={amiName} />
                      <ReviewRow label="Instance type" value={instanceType} />
                      <ReviewRow label="Key pair" value={keyPairMode === "existing" ? existingKey : `${newKeyName} (new)`} />
                      <ReviewRow label="VPC" value={vpc.split(" ")[0]} />
                      <ReviewRow label="Subnet" value={subnet.split("|")[0].trim()} />
                      <ReviewRow label="Auto-assign public IP" value={autoPublicIp ? "Yes" : "No"} />
                      <ReviewRow label="Security group" value={sgCreateNew ? `${sgName} (new)` : "existing"} />
                      <ReviewRow label="Root volume" value={`${volumeSize} GiB ${volumeType}`} />
                      <ReviewRow label="Extra volumes" value={`${extraVolumes.length}`} />
                    </dl>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-3">
            <Button variant="link" size="sm" className="text-xs text-muted-foreground" onClick={close}>
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={handleLaunch}
                >
                  <Rocket className="size-4" /> Launch instance
                </Button>
              )}
            </div>
          </div>
        </WizardShell>
      </Dialog>

      {success && (
        <SuccessModal
          open={!!success}
          onClose={() => { setSuccess(null); close(); }}
          title="Instance launched successfully"
          icon={CircleCheck}
          color="var(--aws-emerald)"
          message={`Your EC2 instance "${success.name}" has been created and is currently in the "pending" state.`}
          details={[
            { label: "Instance ID", value: success.id },
            { label: "Type", value: success.type },
            { label: "AMI", value: success.ami },
            { label: "AZ", value: success.az },
          ]}
          cli={`aws ec2 run-instances \\\n  --image-id ${ami} \\\n  --instance-type ${instanceType} \\\n  --key-name ${keyPairMode === "existing" ? existingKey : newKeyName} \\\n  --subnet-id ${subnet.split("|")[0].trim()} \\\n  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${name}}]"`}
        />
      )}
    </>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm">{value || "—"}</dd>
    </div>
  );
}

// ===========================================================================
// 5. S3 Console + Create Bucket Wizard + Bucket Detail
// ===========================================================================

const INITIAL_S3: S3Bucket[] = [
  {
    name: "my-website-assets-prod",
    region: "us-east-1",
    access: "Bucket and objects not public",
    created: "Jan 8, 2025",
    versioning: true,
    encryption: "SSE-S3",
    objects: [
      { key: "index.html", size: "4.2 KiB", lastModified: "2025-01-15 14:32:08", type: "text/html" },
      { key: "assets/app.js", size: "128 KiB", lastModified: "2025-01-15 14:32:11", type: "application/javascript" },
      { key: "assets/style.css", size: "24 KiB", lastModified: "2025-01-15 14:32:09", type: "text/css" },
      { key: "images/logo.png", size: "8.6 KiB", lastModified: "2025-01-12 09:11:45", type: "image/png" },
    ],
  },
  {
    name: "cloud-academy-logs",
    region: "us-west-2",
    access: "Bucket and objects not public",
    created: "Dec 22, 2024",
    versioning: false,
    encryption: "SSE-KMS",
    objects: [
      { key: "2025/01/15/app.log", size: "2.1 MiB", lastModified: "2025-01-15 23:59:58", type: "text/plain" },
      { key: "2025/01/14/app.log", size: "1.8 MiB", lastModified: "2025-01-14 23:59:51", type: "text/plain" },
    ],
  },
  {
    name: "ml-training-data",
    region: "eu-west-1",
    access: "Bucket and objects not public",
    created: "Nov 3, 2024",
    versioning: true,
    encryption: "SSE-S3",
    objects: [
      { key: "dataset/train-001.csv", size: "128 MiB", lastModified: "2024-11-03 12:00:00", type: "text/csv" },
      { key: "dataset/validate.csv", size: "32 MiB", lastModified: "2024-11-03 12:01:10", type: "text/csv" },
    ],
  },
];

function S3Console({
  buckets,
  setBuckets,
}: {
  buckets: S3Bucket[];
  setBuckets: React.Dispatch<React.SetStateAction<S3Bucket[]>>;
}) {
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [selectedBucket, setSelectedBucket] = React.useState<S3Bucket | null>(null);

  return (
    <div className="space-y-4">
      <ServiceHeader
        icon={HardDrive}
        title="S3"
        description="Scalable storage in the cloud"
        color="var(--aws-emerald)"
        action={
          <Button
            className="text-white"
            style={{ backgroundColor: "var(--aws-orange)" }}
            onClick={() => setWizardOpen(true)}
          >
            <Plus className="size-4" /> Create bucket
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">General purpose buckets ({buckets.length})</CardTitle>
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="size-3.5" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>AWS Region</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Creation date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buckets.map((b) => (
                <TableRow
                  key={b.name}
                  className="cursor-pointer"
                  onClick={() => setSelectedBucket(b)}
                >
                  <TableCell className="font-mono text-[color:var(--aws-orange)]">{b.name}</TableCell>
                  <TableCell className="text-xs">{b.region}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{b.access}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{b.created}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <S3CreateBucketWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onCreate={(b) => {
          setBuckets((prev) => [b, ...prev]);
        }}
      />

      {selectedBucket && (
        <S3BucketDetail
          bucket={buckets.find((b) => b.name === selectedBucket.name) ?? selectedBucket}
          onClose={() => setSelectedBucket(null)}
        />
      )}
    </div>
  );
}

function S3CreateBucketWizard({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (b: S3Bucket) => void;
}) {
  const STEPS = [
    "General configuration",
    "Object ownership",
    "Block Public Access",
    "Bucket versioning",
    "Tags",
    "Default encryption",
  ];
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [region, setRegion] = React.useState("us-east-1");
  const [ownership, setOwnership] = React.useState<"disabled" | "enabled">("disabled");
  const [blockAcls, setBlockAcls] = React.useState(true);
  const [blockPolicies, setBlockPolicies] = React.useState(true);
  const [ignoreAcls, setIgnoreAcls] = React.useState(true);
  const [restrictBuckets, setRestrictBuckets] = React.useState(true);
  const [versioning, setVersioning] = React.useState<"enabled" | "disabled" | "suspended">("enabled");
  const [tags, setTags] = React.useState<TagPair[]>([]);
  const [encryption, setEncryption] = React.useState<"sse-s3" | "sse-kms">("sse-s3");
  const [success, setSuccess] = React.useState<S3Bucket | null>(null);

  const reset = () => {
    setStep(0); setName(""); setRegion("us-east-1"); setOwnership("disabled");
    setBlockAcls(true); setBlockPolicies(true); setIgnoreAcls(true); setRestrictBuckets(true);
    setVersioning("enabled"); setTags([]); setEncryption("sse-s3");
  };

  const nameError = React.useMemo(() => {
    if (!name) return "";
    if (name.length < 3) return "Bucket name must be at least 3 characters.";
    if (name.length > 63) return "Bucket name must be at most 63 characters.";
    if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(name)) return "Must use only lowercase letters, numbers, hyphens, and dots.";
    if (/\.\./.test(name)) return "Cannot contain consecutive dots.";
    if (/^\d+\.\d+\.\d+\.\d+$/.test(name)) return "Cannot be formatted as an IP address.";
    return "";
  }, [name]);

  const canProceed = () => {
    if (step === 0) return name.length >= 3 && !nameError;
    return true;
  };

  const handleCreate = () => {
    const bucket: S3Bucket = {
      name,
      region,
      access: "Bucket and objects not public",
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      versioning: versioning === "enabled",
      encryption: encryption === "sse-s3" ? "SSE-S3" : "SSE-KMS",
      objects: [],
    };
    onCreate(bucket);
    setSuccess(bucket);
  };

  const close = () => { reset(); onClose(); };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && close()}>
        <WizardShell
          steps={STEPS}
          currentStep={step}
          title="Create bucket"
          description="Buckets are containers for data stored in S3"
          onClose={close}
        >
          <div className="px-6 py-4 min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bucket-name">Bucket name</Label>
                      <Input
                        id="bucket-name"
                        placeholder="my-unique-bucket-name"
                        value={name}
                        onChange={(e) => setName(e.target.value.toLowerCase())}
                        autoFocus
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Bucket names must be globally unique across all of AWS.
                      </p>
                      {nameError && (
                        <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="size-3" /> {nameError}
                        </p>
                      )}
                      {!nameError && name && (
                        <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "var(--aws-emerald)" }}>
                          <Check className="size-3" /> Name format looks valid.
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>AWS Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {REGIONS.map((r) => (
                            <SelectItem key={r.id} value={r.id}>{r.name} ({r.id})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Choose the region closest to your users to minimize latency.
                      </p>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3">
                    <Label>Object ownership</Label>
                    <RadioGroup value={ownership} onValueChange={(v) => setOwnership(v as "disabled" | "enabled")}>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="disabled" id="own-disabled" className="mt-0.5" />
                        <div>
                          <Label htmlFor="own-disabled" className="cursor-pointer font-normal">ACLs disabled (recommended)</Label>
                          <p className="text-xs text-muted-foreground">The bucket owner has full control of all objects in the bucket. ACLs are no longer used to manage access.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="enabled" id="own-enabled" className="mt-0.5" />
                        <div>
                          <Label htmlFor="own-enabled" className="cursor-pointer font-normal">ACLs enabled</Label>
                          <p className="text-xs text-muted-foreground">Objects are owned by the AWS account that uploads them. Bucket owner permissions must be configured via ACLs.</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <Label>Block Public Access settings for this bucket</Label>
                    <Alert>
                      <AlertTriangle className="size-4" style={{ color: "var(--aws-amber)" }} />
                      <AlertTitle>Block all public access</AlertTitle>
                      <AlertDescription>
                        Recommended. Causes Amazon S3 to ignore public ACLs and bucket policies on this bucket and its objects.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2 rounded-md border p-3">
                      {[
                        { v: blockAcls, set: setBlockAcls, label: "Block public ACLs" },
                        { v: blockPolicies, set: setBlockPolicies, label: "Block public bucket policies" },
                        { v: ignoreAcls, set: setIgnoreAcls, label: "Ignore public ACLs" },
                        { v: restrictBuckets, set: setRestrictBuckets, label: "Restrict public buckets" },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Label className="cursor-pointer text-sm">{c.label}</Label>
                          <Checkbox
                            checked={c.v}
                            onCheckedChange={(v) => c.set(!!v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <Label>Bucket versioning</Label>
                    <RadioGroup value={versioning} onValueChange={(v) => setVersioning(v as typeof versioning)}>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="enabled" id="ver-enable" className="mt-0.5" />
                        <div>
                          <Label htmlFor="ver-enable" className="cursor-pointer font-normal">Enable</Label>
                          <p className="text-xs text-muted-foreground">Keep multiple versions of an object in the same bucket.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="disabled" id="ver-disable" className="mt-0.5" />
                        <div>
                          <Label htmlFor="ver-disable" className="cursor-pointer font-normal">Disable</Label>
                          <p className="text-xs text-muted-foreground">Versioning is off. Existing object versions are not preserved.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="suspended" id="ver-suspend" className="mt-0.5" />
                        <div>
                          <Label htmlFor="ver-suspend" className="cursor-pointer font-normal">Suspend</Label>
                          <p className="text-xs text-muted-foreground">Suspend versioning on a previously-enabled bucket.</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    <Label>Tags</Label>
                    <p className="text-xs text-muted-foreground">
                      Optional. Add tags to help track costs and organize resources.
                    </p>
                    <TagEditor tags={tags} onChange={setTags} />
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-3">
                    <Label>Default encryption</Label>
                    <RadioGroup value={encryption} onValueChange={(v) => setEncryption(v as typeof encryption)}>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="sse-s3" id="enc-s3" className="mt-0.5" />
                        <div>
                          <Label htmlFor="enc-s3" className="cursor-pointer font-normal">SSE-S3 (recommended)</Label>
                          <p className="text-xs text-muted-foreground">Uses Amazon S3-managed encryption keys (AES-256). No additional cost.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="sse-kms" id="enc-kms" className="mt-0.5" />
                        <div>
                          <Label htmlFor="enc-kms" className="cursor-pointer font-normal">SSE-KMS</Label>
                          <p className="text-xs text-muted-foreground">Uses AWS Key Management Service (KMS) customer-managed keys. Subject to KMS request charges.</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-3">
            <Button variant="link" size="sm" className="text-xs text-muted-foreground" onClick={close}>Cancel</Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
              <Button variant="outline" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ChevronLeft className="size-4" /> Previous
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={handleCreate}
                >
                  <Plus className="size-4" /> Create bucket
                </Button>
              )}
            </div>
          </div>
        </WizardShell>
      </Dialog>

      {success && (
        <SuccessModal
          open={!!success}
          onClose={() => { setSuccess(null); close(); }}
          title="Bucket created successfully"
          icon={CircleCheck}
          color="var(--aws-emerald)"
          message={`Bucket "${success.name}" is ready to receive objects.`}
          details={[
            { label: "Bucket name", value: success.name },
            { label: "Region", value: success.region },
            { label: "Versioning", value: success.versioning ? "Enabled" : "Disabled" },
            { label: "Encryption", value: success.encryption },
          ]}
          cli={`aws s3api create-bucket \\\n  --bucket ${success.name} \\\n  --region ${success.region} \\\n  --create-bucket-configuration LocationConstraint=${success.region}`}
        />
      )}
    </>
  );
}

function S3BucketDetail({ bucket, onClose }: { bucket: S3Bucket; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[min(900px,95vw)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "color-mix(in oklch, var(--aws-emerald) 18%, transparent)" }}
            >
              <HardDrive className="size-5" style={{ color: "var(--aws-emerald)" }} />
            </div>
            <div>
              <DialogTitle className="font-mono text-base">{bucket.name}</DialogTitle>
              <DialogDescription>{bucket.region} · {bucket.access}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Tabs defaultValue="objects">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="objects">Objects</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>
          <TabsContent value="objects" className="mt-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm text-muted-foreground">{bucket.objects.length} object(s)</span>
              <Button variant="outline" size="sm" className="text-xs">
                <Plus className="size-3.5" /> Upload
              </Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last modified</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bucket.objects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        This bucket is empty. Click Upload to add objects.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bucket.objects.map((o) => (
                      <TableRow key={o.key}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <File className="size-4 text-muted-foreground" />
                            <span className="font-mono text-xs">{o.key}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{o.type}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{o.lastModified}</TableCell>
                        <TableCell className="text-xs">{o.size}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="size-7" title="Download">
                              <Download className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-7" title="Share">
                              <Share2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="properties" className="mt-3">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PropRow label="Region" value={bucket.region} />
              <PropRow label="Created" value={bucket.created} />
              <PropRow label="Versioning" value={bucket.versioning ? "Enabled" : "Disabled"} />
              <PropRow label="Default encryption" value={bucket.encryption} />
              <PropRow label="Object ownership" value="Bucket owner enforced" />
              <PropRow label="Public access block" value="All enabled" />
            </dl>
          </TabsContent>
          <TabsContent value="permissions" className="mt-3 space-y-3">
            <div className="rounded-md border p-3">
              <h4 className="mb-2 text-sm font-medium">Block public access (bucket settings)</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="size-3.5" style={{ color: "var(--aws-emerald)" }} /> Block public ACLs</li>
                <li className="flex items-center gap-2"><Check className="size-3.5" style={{ color: "var(--aws-emerald)" }} /> Block public bucket policies</li>
                <li className="flex items-center gap-2"><Check className="size-3.5" style={{ color: "var(--aws-emerald)" }} /> Ignore public ACLs</li>
                <li className="flex items-center gap-2"><Check className="size-3.5" style={{ color: "var(--aws-emerald)" }} /> Restrict public buckets</li>
              </ul>
            </div>
            <Alert>
              <Shield className="size-4" style={{ color: "var(--aws-rose)" }} />
              <AlertTitle>Bucket policy</AlertTitle>
              <AlertDescription>
                No bucket policy is configured. Access is controlled via IAM.
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="management" className="mt-3">
            <div className="rounded-md border p-3 text-xs text-muted-foreground">
              Lifecycle rules, replication rules, and event notifications are not configured.
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-sm">{value}</dd>
    </div>
  );
}

// ===========================================================================
// 6. IAM Console + Create User Wizard + User Detail + Roles
// ===========================================================================

const INITIAL_IAM_USERS: IamUser[] = [
  {
    userName: "alice", arn: "arn:aws:iam::123456789012:user/alice",
    created: "Sep 12, 2024", lastActivity: "2 days ago",
    groups: ["developers", "billing-read-only"], consoleAccess: true,
    tags: [{ key: "team", value: "platform" }, { key: "env", value: "prod" }],
  },
  {
    userName: "bob", arn: "arn:aws:iam::123456789012:user/bob",
    created: "Oct 4, 2024", lastActivity: "5 hours ago",
    groups: ["developers"], consoleAccess: true,
    tags: [{ key: "team", value: "frontend" }],
  },
  {
    userName: "charlie", arn: "arn:aws:iam::123456789012:user/charlie",
    created: "Oct 28, 2024", lastActivity: "1 day ago",
    groups: ["ops"], consoleAccess: true,
    tags: [],
  },
  {
    userName: "dave", arn: "arn:aws:iam::123456789012:user/dave",
    created: "Nov 15, 2024", lastActivity: "3 weeks ago",
    groups: [], consoleAccess: false,
    tags: [{ key: "team", value: "data" }],
  },
  {
    userName: "eve", arn: "arn:aws:iam::123456789012:user/eve",
    created: "Dec 1, 2024", lastActivity: "never",
    groups: ["security-audit"], consoleAccess: false,
    tags: [],
  },
];

const IAM_ROLES: IamRole[] = [
  {
    name: "EC2InstanceRole",
    arn: "arn:aws:iam::123456789012:role/EC2InstanceRole",
    description: "Allows EC2 instances to call AWS services on your behalf.",
    trustPolicy: "ec2.amazonaws.com",
    permissions: ["AmazonS3ReadOnlyAccess", "CloudWatchAgentServerPolicy", "AmazonSSMManagedInstanceCore"],
    created: "Aug 22, 2024",
  },
  {
    name: "LambdaExecutionRole",
    arn: "arn:aws:iam::123456789012:role/LambdaExecutionRole",
    description: "Lambda basic execution role with permission to write logs.",
    trustPolicy: "lambda.amazonaws.com",
    permissions: ["AWSLambdaBasicExecutionRole", "AmazonDynamoDBReadOnlyAccess"],
    created: "Sep 30, 2024",
  },
  {
    name: "CrossAccountAuditRole",
    arn: "arn:aws:iam::123456789012:role/CrossAccountAuditRole",
    description: "Allows an external auditing account to assume read-only access.",
    trustPolicy: "arn:aws:iam::987654321098:root",
    permissions: ["SecurityAudit", "AWSCloudTrailReadOnlyAccess"],
    created: "Oct 11, 2024",
  },
  {
    name: "CodeBuildServiceRole",
    arn: "arn:aws:iam::123456789012:role/CodeBuildServiceRole",
    description: "Allows CodeBuild to call AWS services during builds.",
    trustPolicy: "codebuild.amazonaws.com",
    permissions: ["AmazonS3FullAccess (scoped)", "CloudWatchLogsFullAccess"],
    created: "Nov 7, 2024",
  },
];

function IamConsole({
  users,
  setUsers,
}: {
  users: IamUser[];
  setUsers: React.Dispatch<React.SetStateAction<IamUser[]>>;
}) {
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<IamUser | null>(null);
  const [assumeRole, setAssumeRole] = React.useState<IamRole | null>(null);

  const stats = [
    { label: "Users", value: users.length, icon: UsersIcon, color: "var(--aws-cyan)" },
    { label: "Roles", value: IAM_ROLES.length, icon: ShieldCheck, color: "var(--aws-violet)" },
    { label: "Policies", value: 8, icon: FileText, color: "var(--aws-amber)" },
    { label: "Groups", value: 3, icon: UsersIcon, color: "var(--aws-emerald)" },
  ];

  return (
    <div className="space-y-4">
      <ServiceHeader
        icon={Shield}
        title="IAM"
        description="Securely manage identities, access, and permissions"
        color="var(--aws-rose)"
        action={
          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label} className="card-lift">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <s.icon className="size-5" style={{ color: s.color }} />
                    <span className="text-2xl font-semibold">{s.value}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="size-4" style={{ color: "var(--aws-violet)" }} /> IAM Access Analyzer
              </CardTitle>
              <CardDescription>Find resources that are shared with external entities</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <CheckCircle2 className="size-4" style={{ color: "var(--aws-emerald)" }} />
                <AlertTitle>No findings</AlertTitle>
                <AlertDescription>
                  No resources in this account or organization are shared with external entities.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">A list of IAM users in your account.</p>
            <Button
              className="text-white"
              style={{ backgroundColor: "var(--aws-orange)" }}
              onClick={() => setWizardOpen(true)}
            >
              <Plus className="size-4" /> Create user
            </Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User name</TableHead>
                  <TableHead>ARN</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last activity</TableHead>
                  <TableHead>Groups</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow
                    key={u.userName}
                    className="cursor-pointer"
                    onClick={() => setSelectedUser(u)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex size-7 items-center justify-center rounded-full text-[10px] font-semibold uppercase text-white"
                          style={{ backgroundColor: "var(--aws-cyan)" }}
                        >
                          {u.userName.slice(0, 2)}
                        </div>
                        {u.userName}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{u.arn}</TableCell>
                    <TableCell className="text-xs">{u.created}</TableCell>
                    <TableCell className="text-xs">{u.lastActivity}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.groups.length === 0 ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          u.groups.map((g) => (
                            <Badge key={g} variant="outline" className="text-[10px]">{g}</Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Roles can be assumed by trusted principals.</p>
            <Button variant="outline">
              <Plus className="size-4" /> Create role
            </Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role name</TableHead>
                  <TableHead>Trusted entity</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {IAM_ROLES.map((r) => (
                  <TableRow key={r.arn}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="font-mono text-xs">{r.trustPolicy}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {r.permissions.map((p) => (
                          <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{r.created}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setAssumeRole(r)}
                      >
                        <Shield className="size-3.5" /> Assume
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <IamCreateUserWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onCreate={(u) => setUsers((prev) => [u, ...prev])}
      />

      {selectedUser && (
        <IamUserDetail
          user={users.find((u) => u.userName === selectedUser.userName) ?? selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {assumeRole && (
        <AssumeRoleDialog role={assumeRole} onClose={() => setAssumeRole(null)} />
      )}
    </div>
  );
}

function IamCreateUserWizard({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (u: IamUser) => void;
}) {
  const STEPS = ["User details", "Permissions", "Tags", "Review"];
  const [step, setStep] = React.useState(0);
  const [userName, setUserName] = React.useState("");
  const [consoleAccess, setConsoleAccess] = React.useState(false);
  const [autogenPassword, setAutogenPassword] = React.useState(true);
  const [customPassword, setCustomPassword] = React.useState("");
  const [requireReset, setRequireReset] = React.useState(true);
  const [permMode, setPermMode] = React.useState<"policy" | "group" | "copy">("policy");
  const [selectedPolicies, setSelectedPolicies] = React.useState<string[]>(["AmazonS3ReadOnlyAccess"]);
  const [selectedGroup, setSelectedGroup] = React.useState("developers");
  const [copyFrom, setCopyFrom] = React.useState("alice");
  const [tags, setTags] = React.useState<TagPair[]>([]);
  const [success, setSuccess] = React.useState<{ user: IamUser; password: string; accessKey: string } | null>(null);

  const reset = () => {
    setStep(0); setUserName(""); setConsoleAccess(false); setAutogenPassword(true);
    setCustomPassword(""); setRequireReset(true); setPermMode("policy");
    setSelectedPolicies(["AmazonS3ReadOnlyAccess"]); setSelectedGroup("developers");
    setCopyFrom("alice"); setTags([]);
  };

  const canProceed = () => {
    if (step === 0) return userName.trim().length >= 1;
    return true;
  };

  const genPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    return Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const genAccessKey = () => "AKIA" + Array.from({ length: 16 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"[Math.floor(Math.random() * 32)]).join("");

  const handleCreate = () => {
    const password = consoleAccess && autogenPassword ? genPassword() : consoleAccess ? customPassword : undefined;
    const accessKey = genAccessKey();
    const user: IamUser = {
      userName,
      arn: `arn:aws:iam::123456789012:user/${userName}`,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastActivity: "never",
      groups: permMode === "group" ? [selectedGroup] : [],
      consoleAccess,
      password,
      accessKey,
      tags,
    };
    onCreate(user);
    setSuccess({ user, password: password ?? "(none — programmatic only)", accessKey });
  };

  const close = () => { reset(); onClose(); };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && close()}>
        <WizardShell
          steps={STEPS}
          currentStep={step}
          title="Create user"
          description="Add a new IAM user to your AWS account"
          onClose={close}
        >
          <div className="px-6 py-4 min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="iam-username">User name</Label>
                      <Input
                        id="iam-username"
                        placeholder="jdoe"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="flex items-start gap-3 rounded-md border p-3">
                      <Checkbox
                        id="iam-console-access"
                        checked={consoleAccess}
                        onCheckedChange={(v) => setConsoleAccess(!!v)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label htmlFor="iam-console-access" className="cursor-pointer font-normal">
                            Provide user access to the AWS Management Console
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Optional. Required if the user needs to sign in to the console.
                          </p>
                        </div>
                        {consoleAccess && (
                          <div className="space-y-3 rounded-md bg-muted/40 p-3">
                            <RadioGroup value={autogenPassword ? "auto" : "custom"} onValueChange={(v) => setAutogenPassword(v === "auto")}>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="auto" id="pw-auto" />
                                <Label htmlFor="pw-auto" className="cursor-pointer text-sm font-normal">Autogenerated password</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="custom" id="pw-custom" />
                                <Label htmlFor="pw-custom" className="cursor-pointer text-sm font-normal">Custom password</Label>
                              </div>
                            </RadioGroup>
                            {!autogenPassword && (
                              <Input
                                placeholder="Enter custom password"
                                type="password"
                                value={customPassword}
                                onChange={(e) => setCustomPassword(e.target.value)}
                              />
                            )}
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">Users must create a new password at next sign-in</Label>
                              <Checkbox checked={requireReset} onCheckedChange={(v) => setRequireReset(!!v)} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3">
                    <Label>Permissions options</Label>
                    <RadioGroup value={permMode} onValueChange={(v) => setPermMode(v as typeof permMode)}>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="policy" id="perm-policy" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="perm-policy" className="cursor-pointer font-normal">Attach policies directly</Label>
                          <p className="mb-2 text-xs text-muted-foreground">Select managed policies to attach to this user.</p>
                          {permMode === "policy" && (
                            <div className="space-y-1">
                              {["AmazonS3ReadOnlyAccess", "AmazonEC2FullAccess", "CloudWatchReadOnlyAccess", "IAMReadOnlyAccess"].map((p) => (
                                <div key={p} className="flex items-center justify-between rounded border bg-background px-2 py-1">
                                  <Label className="cursor-pointer text-xs font-mono">{p}</Label>
                                  <Checkbox
                                    checked={selectedPolicies.includes(p)}
                                    onCheckedChange={(v) =>
                                      setSelectedPolicies(v ? [...selectedPolicies, p] : selectedPolicies.filter((x) => x !== p))
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="group" id="perm-group" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="perm-group" className="cursor-pointer font-normal">Add user to group</Label>
                          <p className="mb-2 text-xs text-muted-foreground">Inherit permissions from an existing group.</p>
                          {permMode === "group" && (
                            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="developers">developers (8 policies)</SelectItem>
                                <SelectItem value="ops">ops (12 policies)</SelectItem>
                                <SelectItem value="billing-read-only">billing-read-only (3 policies)</SelectItem>
                                <SelectItem value="security-audit">security-audit (5 policies)</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="copy" id="perm-copy" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="perm-copy" className="cursor-pointer font-normal">Copy permissions from another user</Label>
                          {permMode === "copy" && (
                            <Select value={copyFrom} onValueChange={setCopyFrom}>
                              <SelectTrigger className="w-full mt-2"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="alice">alice</SelectItem>
                                <SelectItem value="bob">bob</SelectItem>
                                <SelectItem value="charlie">charlie</SelectItem>
                                <SelectItem value="dave">dave</SelectItem>
                                <SelectItem value="eve">eve</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <Label>Add tags (optional)</Label>
                    <p className="text-xs text-muted-foreground">Tags help you identify and organize your IAM users.</p>
                    <TagEditor tags={tags} onChange={setTags} />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle2 className="size-4" style={{ color: "var(--aws-emerald)" }} />
                      <AlertTitle>Review and create</AlertTitle>
                      <AlertDescription>Verify these settings, then click Create user.</AlertDescription>
                    </Alert>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-md border p-4 text-sm sm:grid-cols-2">
                      <ReviewRow label="User name" value={userName} />
                      <ReviewRow label="Console access" value={consoleAccess ? "Yes" : "No"} />
                      {consoleAccess && (
                        <ReviewRow label="Password" value={autogenPassword ? "Autogenerated" : "Custom"} />
                      )}
                      <ReviewRow
                        label="Permissions"
                        value={
                          permMode === "policy" ? `${selectedPolicies.length} policy/policies` :
                          permMode === "group" ? `Group: ${selectedGroup}` :
                          `Copied from ${copyFrom}`
                        }
                      />
                      <ReviewRow label="Tags" value={`${tags.filter((t) => t.key).length} tag(s)`} />
                    </dl>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-3">
            <Button variant="link" size="sm" className="text-xs text-muted-foreground" onClick={close}>Cancel</Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
              <Button variant="outline" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ChevronLeft className="size-4" /> Previous
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={handleCreate}
                >
                  <Plus className="size-4" /> Create user
                </Button>
              )}
            </div>
          </div>
        </WizardShell>
      </Dialog>

      {success && (
        <Dialog open onOpenChange={() => { setSuccess(null); close(); }}>
          <DialogContent className="w-[min(560px,95vw)]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className="flex size-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: "color-mix(in oklch, var(--aws-emerald) 18%, transparent)" }}
                >
                  <CircleCheck className="size-6" style={{ color: "var(--aws-emerald)" }} />
                </div>
                <div>
                  <DialogTitle>User created successfully</DialogTitle>
                  <DialogDescription>Save these credentials — they will not be shown again.</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-md border bg-muted/40 p-3 space-y-2">
                <div>
                  <Label className="text-xs">User name</Label>
                  <p className="font-mono text-sm">{success.user.userName}</p>
                </div>
                <div>
                  <Label className="text-xs">Console sign-in URL</Label>
                  <p className="font-mono text-xs break-all">https://123456789012.signin.aws.amazon.com/console</p>
                </div>
                {success.user.consoleAccess && (
                  <div>
                    <Label className="text-xs">Password</Label>
                    <p className="font-mono text-xs">{success.password}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs">Access key ID</Label>
                  <p className="font-mono text-xs">{success.accessKey}</p>
                </div>
                <div>
                  <Label className="text-xs">Secret access key</Label>
                  <p className="font-mono text-xs">************************************</p>
                </div>
              </div>
              <CliCommand>
                {`aws iam create-user --user-name ${success.user.userName}\naws iam create-access-key --user-name ${success.user.userName}`}
              </CliCommand>
              <Alert>
                <Info className="size-4" />
                <AlertTitle>Simulation only</AlertTitle>
                <AlertDescription>
                  No real AWS IAM user was created. The credentials above are fake — never use them outside this sandbox.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button onClick={() => { setSuccess(null); close(); }}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function IamUserDetail({ user, onClose }: { user: IamUser; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[min(720px,95vw)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex size-11 items-center justify-center rounded-full text-sm font-semibold uppercase text-white"
              style={{ backgroundColor: "var(--aws-cyan)" }}
            >
              {user.userName.slice(0, 2)}
            </div>
            <div>
              <DialogTitle>{user.userName}</DialogTitle>
              <DialogDescription className="font-mono">{user.arn}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Tabs defaultValue="permissions">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="credentials">Security credentials</TabsTrigger>
          </TabsList>
          <TabsContent value="permissions" className="mt-3">
            {user.groups.length === 0 && !user.consoleAccess ? (
              <p className="text-sm text-muted-foreground">This user has no attached policies.</p>
            ) : (
              <ul className="space-y-2">
                {user.groups.length > 0 && (
                  <li className="rounded-md border p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium">Inherited from group</span>
                      <Badge variant="outline" className="text-[10px]">{user.groups.join(", ")}</Badge>
                    </div>
                  </li>
                )}
                <li className="rounded-md border p-3 text-sm">
                  <span className="font-mono">AmazonS3ReadOnlyAccess</span>
                  <span className="ml-2 text-xs text-muted-foreground">— AWS managed policy</span>
                </li>
              </ul>
            )}
          </TabsContent>
          <TabsContent value="groups" className="mt-3">
            {user.groups.length === 0 ? (
              <p className="text-sm text-muted-foreground">Not a member of any groups.</p>
            ) : (
              <ul className="space-y-1">
                {user.groups.map((g) => (
                  <li key={g} className="flex items-center gap-2 text-sm">
                    <UsersIcon className="size-4 text-muted-foreground" /> {g}
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent value="tags" className="mt-3">
            {user.tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags applied.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.tags.map((t) => (
                    <TableRow key={t.key}>
                      <TableCell className="font-mono text-xs">{t.key}</TableCell>
                      <TableCell className="font-mono text-xs">{t.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          <TabsContent value="credentials" className="mt-3 space-y-3">
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Console password</span>
                <Badge variant="outline" className="text-[10px]">
                  {user.consoleAccess ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              {user.consoleAccess && (
                <p className="font-mono text-xs text-muted-foreground">{user.password}</p>
              )}
            </div>
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Access keys</span>
                <Badge variant="outline" className="text-[10px]">Active</Badge>
              </div>
              <p className="font-mono text-xs text-muted-foreground">{user.accessKey}</p>
            </div>
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Multi-factor authentication (MFA)</span>
                <Badge variant="outline" className="text-[10px]" style={{ color: "var(--aws-rose)" }}>Not assigned</Badge>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                <Lock className="size-3.5" /> Assign MFA device
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssumeRoleDialog({ role, onClose }: { role: IamRole; onClose: () => void }) {
  const [assumed, setAssumed] = React.useState(false);
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[min(640px,95vw)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5" style={{ color: "var(--aws-violet)" }} />
            Assume role — {role.name}
          </DialogTitle>
          <DialogDescription>{role.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded-md border bg-muted/40 p-3">
            <Label className="text-xs">Role ARN</Label>
            <p className="font-mono text-xs">{role.arn}</p>
          </div>
          <div className="rounded-md border bg-muted/40 p-3">
            <Label className="text-xs">Trust policy (who can assume this role)</Label>
            <pre className="mt-1 overflow-x-auto rounded bg-zinc-950 p-2 font-mono text-[11px] text-zinc-200">
{`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "${role.trustPolicy}" },
    "Action": "sts:AssumeRole"
  }]
}`}
            </pre>
          </div>
          <div className="rounded-md border bg-muted/40 p-3">
            <Label className="text-xs">Permissions granted</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {role.permissions.map((p) => (
                <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
              ))}
            </div>
          </div>
          {assumed ? (
            <Alert>
              <CheckCircle2 className="size-4" style={{ color: "var(--aws-emerald)" }} />
              <AlertTitle>Role assumed (simulated)</AlertTitle>
              <AlertDescription>
                You would now operate with the permissions of <strong>{role.name}</strong> for the next hour. Temporary credentials would be returned by STS.
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              className="w-full text-white"
              style={{ backgroundColor: "var(--aws-violet)" }}
              onClick={() => setAssumed(true)}
            >
              <Shield className="size-4" /> Assume role
            </Button>
          )}
          {assumed && (
            <CliCommand>
              {`aws sts assume-role \\\n  --role-arn "${role.arn}" \\\n  --role-session-name "lab-session"`}
            </CliCommand>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===========================================================================
// 7. VPC Console + Visual Diagram + Create VPC Wizard
// ===========================================================================

const INITIAL_VPCS: VpcResource[] = [
  {
    id: "vpc-0abc123def456789",
    name: "vpc-abc123 (default)",
    cidr: "10.0.0.0/16",
    azCount: 3,
    publicSubnets: [
      { id: "subnet-0a1", cidr: "10.0.1.0/24", az: "us-east-1a", name: "public-1a" },
      { id: "subnet-0a2", cidr: "10.0.2.0/24", az: "us-east-1b", name: "public-1b" },
      { id: "subnet-0a3", cidr: "10.0.3.0/24", az: "us-east-1c", name: "public-1c" },
    ],
    privateSubnets: [
      { id: "subnet-0p1", cidr: "10.0.11.0/24", az: "us-east-1a", name: "private-1a" },
      { id: "subnet-0p2", cidr: "10.0.12.0/24", az: "us-east-1b", name: "private-1b" },
      { id: "subnet-0p3", cidr: "10.0.13.0/24", az: "us-east-1c", name: "private-1c" },
    ],
    igw: { id: "igw-0abc1234" },
    natGateways: [
      { id: "nat-0abc1", subnet: "public-1a", az: "us-east-1a" },
    ],
    routeTables: [
      {
        id: "rtb-public", name: "public-rt", subnet: "public-1a,public-1b,public-1c",
        routes: [
          { dest: "10.0.0.0/16", target: "local" },
          { dest: "0.0.0.0/0", target: "igw-0abc1234" },
        ],
      },
      {
        id: "rtb-private", name: "private-rt", subnet: "private-1a,private-1b,private-1c",
        routes: [
          { dest: "10.0.0.0/16", target: "local" },
          { dest: "0.0.0.0/0", target: "nat-0abc1" },
        ],
      },
    ],
    vpcEndpoints: ["s3", "dynamodb"],
    created: "Aug 12, 2024",
  },
];

function VpcConsole({
  vpcs,
  setVpcs,
}: {
  vpcs: VpcResource[];
  setVpcs: React.Dispatch<React.SetStateAction<VpcResource[]>>;
}) {
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [selectedVpc, setSelectedVpc] = React.useState<VpcResource | null>(vpcs[0] ?? null);

  return (
    <div className="space-y-4">
      <ServiceHeader
        icon={Network}
        title="VPC"
        description="Isolated cloud resources and networking"
        color="var(--aws-violet)"
        action={
          <Button
            className="text-white"
            style={{ backgroundColor: "var(--aws-orange)" }}
            onClick={() => setWizardOpen(true)}
          >
            <Plus className="size-4" /> Create VPC
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your VPCs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>VPC ID</TableHead>
                <TableHead>IPv4 CIDR</TableHead>
                <TableHead>Availability Zones</TableHead>
                <TableHead>Subnets</TableHead>
                <TableHead>NAT gateways</TableHead>
                <TableHead>VPC endpoints</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vpcs.map((v) => (
                <TableRow
                  key={v.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedVpc(v)}
                  data-state={selectedVpc?.id === v.id ? "selected" : undefined}
                >
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="font-mono text-xs text-[color:var(--aws-orange)]">{v.id}</TableCell>
                  <TableCell className="font-mono text-xs">{v.cidr}</TableCell>
                  <TableCell className="text-xs">{v.azCount}</TableCell>
                  <TableCell className="text-xs">{v.publicSubnets.length + v.privateSubnets.length} ({v.publicSubnets.length} public, {v.privateSubnets.length} private)</TableCell>
                  <TableCell className="text-xs">{v.natGateways.length}</TableCell>
                  <TableCell className="text-xs">{v.vpcEndpoints.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedVpc && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Network className="size-4" style={{ color: "var(--aws-violet)" }} />
              VPC visual map — <span className="font-mono text-sm">{selectedVpc.id}</span>
            </CardTitle>
            <CardDescription>
              Click a subnet to highlight its associated route table.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VpcDiagram vpc={selectedVpc} />
          </CardContent>
        </Card>
      )}

      <VpcCreateWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onCreate={(v) => {
          setVpcs((prev) => [...prev, v]);
          setSelectedVpc(v);
        }}
      />
    </div>
  );
}

function VpcDiagram({ vpc }: { vpc: VpcResource }) {
  const [highlighted, setHighlighted] = React.useState<string | null>(null);

  const rtForSubnet = (subnetName: string) => {
    // each subnet's route table — find one that mentions it
    return vpc.routeTables.find((rt) => rt.subnet.includes(subnetName)) ?? vpc.routeTables[0];
  };

  const isHighlighted = (subnetName: string) => {
    if (!highlighted) return false;
    return rtForSubnet(subnetName).id === highlighted;
  };

  return (
    <div className="space-y-4">
      {/* Diagram */}
      <div className="relative rounded-lg border bg-gradient-to-b from-slate-50 to-slate-100 p-4 dark:from-slate-900/50 dark:to-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Network topology
          </span>
          <Badge variant="outline" className="text-[10px]">{vpc.cidr}</Badge>
        </div>

        {/* Internet Gateway */}
        <div className="flex justify-center">
          <div
            className="flex flex-col items-center gap-1 rounded-lg border-2 border-slate-300 bg-white px-4 py-2 shadow-sm dark:bg-slate-800"
          >
            <Globe className="size-6" style={{ color: "var(--aws-cyan)" }} />
            <span className="text-xs font-medium">Internet Gateway</span>
            <span className="font-mono text-[10px] text-muted-foreground">{vpc.igw.id}</span>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center py-1">
          <div className="h-6 w-px bg-slate-400" />
        </div>

        {/* Public subnets row */}
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Public subnets
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {vpc.publicSubnets.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setHighlighted(rtForSubnet(s.name).id === highlighted ? null : rtForSubnet(s.name).id)}
              className={cn(
                "rounded-md border-2 bg-white p-2 text-left transition-all dark:bg-slate-800",
                isHighlighted(s.name) ? "border-orange-500 ring-2 ring-orange-300" : "border-emerald-300 hover:border-emerald-500"
              )}
              style={isHighlighted(s.name) ? { borderColor: "var(--aws-orange)", boxShadow: "0 0 0 2px color-mix(in oklch, var(--aws-orange) 30%, transparent)" } : undefined}
            >
              <div className="flex items-center gap-1">
                <Wifi className="size-3.5" style={{ color: "var(--aws-emerald)" }} />
                <span className="text-xs font-medium">{s.name}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{s.cidr}</span>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{s.az}</div>
            </button>
          ))}
        </div>

        {/* NAT gateway (in first public subnet) */}
        {vpc.natGateways.length > 0 && (
          <div className="mt-2 flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 p-2 dark:bg-amber-900/20">
            <Building2 className="size-4" style={{ color: "var(--aws-amber)" }} />
            <div>
              <span className="text-xs font-medium">NAT Gateway</span>
              <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                {vpc.natGateways[0].id} · {vpc.natGateways[0].az}
              </span>
            </div>
          </div>
        )}

        {/* Arrow down */}
        <div className="flex justify-center py-1">
          <div className="h-6 w-px bg-slate-400" />
        </div>

        {/* Private subnets row */}
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Private subnets
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {vpc.privateSubnets.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setHighlighted(rtForSubnet(s.name).id === highlighted ? null : rtForSubnet(s.name).id)}
              className={cn(
                "rounded-md border-2 bg-white p-2 text-left transition-all dark:bg-slate-800",
                isHighlighted(s.name) ? "ring-2" : "border-violet-300 hover:border-violet-500"
              )}
              style={isHighlighted(s.name) ? { borderColor: "var(--aws-orange)", boxShadow: "0 0 0 2px color-mix(in oklch, var(--aws-orange) 30%, transparent)" } : undefined}
            >
              <div className="flex items-center gap-1">
                <Lock className="size-3.5" style={{ color: "var(--aws-violet)" }} />
                <span className="text-xs font-medium">{s.name}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{s.cidr}</span>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{s.az}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Route tables */}
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
          <RouteIcon className="size-4" style={{ color: "var(--aws-violet)" }} /> Route tables
        </h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {vpc.routeTables.map((rt) => (
            <div
              key={rt.id}
              className={cn(
                "rounded-md border p-3 transition-all",
                highlighted === rt.id ? "ring-2" : ""
              )}
              style={highlighted === rt.id ? { borderColor: "var(--aws-orange)", boxShadow: "0 0 0 2px color-mix(in oklch, var(--aws-orange) 30%, transparent)" } : undefined}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">{rt.name}</span>
                <Badge variant="outline" className="text-[10px] font-mono">{rt.id}</Badge>
              </div>
              <div className="text-[11px] text-muted-foreground">Subnets: <span className="font-mono">{rt.subnet}</span></div>
              <div className="mt-2 space-y-1">
                {rt.routes.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 font-mono text-[11px]">
                    <ArrowUpDown className="size-3 text-muted-foreground" />
                    <span className="text-cyan-700 dark:text-cyan-400">{r.dest}</span>
                    <ArrowRight className="size-3 text-muted-foreground" />
                    <span className="text-orange-600 dark:text-orange-400">{r.target}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VPC endpoints */}
      {vpc.vpcEndpoints.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Link2 className="size-4" style={{ color: "var(--aws-violet)" }} /> VPC endpoints
          </h4>
          <div className="flex flex-wrap gap-2">
            {vpc.vpcEndpoints.map((ep) => (
              <Badge key={ep} variant="outline" className="text-xs">com.amazonaws.{ep}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VpcCreateWizard({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (v: VpcResource) => void;
}) {
  const STEPS = ["Resources to create", "VPC settings", "NAT gateway", "VPC endpoints"];
  const [step, setStep] = React.useState(0);
  const [resources, setResources] = React.useState<"vpc-only" | "vpc-and-more">("vpc-and-more");
  const [name, setName] = React.useState("vpc-lab");
  const [cidr, setCidr] = React.useState("10.0.0.0/16");
  const [azCount, setAzCount] = React.useState(3);
  const [publicSubnetCount, setPublicSubnetCount] = React.useState(3);
  const [privateSubnetCount, setPrivateSubnetCount] = React.useState(3);
  const [natMode, setNatMode] = React.useState<"none" | "one-az" | "one-per-az">("one-az");
  const [endpoints, setEndpoints] = React.useState<"none" | "s3" | "s3-dynamodb">("s3");
  const [progress, setProgress] = React.useState<{ step: string; done: boolean }[] | null>(null);
  const [success, setSuccess] = React.useState<VpcResource | null>(null);

  const reset = () => {
    setStep(0); setResources("vpc-and-more"); setName("vpc-lab"); setCidr("10.0.0.0/16");
    setAzCount(3); setPublicSubnetCount(3); setPrivateSubnetCount(3);
    setNatMode("one-az"); setEndpoints("s3"); setProgress(null);
  };

  const handleCreate = () => {
    const steps = [
      "VPC", "Subnets", "Route tables", "Internet Gateway", "NAT Gateway", "VPC endpoints",
    ].filter((s) => {
      if (s === "NAT Gateway" && natMode === "none") return false;
      if (s === "VPC endpoints" && endpoints === "none") return false;
      return true;
    });
    setProgress(steps.map((s) => ({ step: s, done: false })));
    // Animate progress
    steps.forEach((_, i) => {
      setTimeout(() => {
        setProgress((prev) => (prev ?? []).map((p, idx) => idx <= i ? { ...p, done: true } : p));
      }, 600 * (i + 1));
    });
    const finishDelay = 600 * (steps.length + 1);
    setTimeout(() => {
      const azs = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d"].slice(0, azCount);
      const publicSubs = Array.from({ length: publicSubnetCount }, (_, i) => ({
        id: `subnet-pub${i}`,
        cidr: `10.0.${i + 1}.0/24`,
        az: azs[i % azs.length],
        name: `public-${azs[i % azs.length].slice(-2)}`,
      }));
      const privateSubs = Array.from({ length: privateSubnetCount }, (_, i) => ({
        id: `subnet-priv${i}`,
        cidr: `10.0.${i + 11}.0/24`,
        az: azs[i % azs.length],
        name: `private-${azs[i % azs.length].slice(-2)}`,
      }));
      const natGws = natMode === "none" ? [] : natMode === "one-az"
        ? [{ id: "nat-0abc1", subnet: publicSubs[0].name, az: publicSubs[0].az }]
        : publicSubs.map((s) => ({ id: `nat-${s.id}`, subnet: s.name, az: s.az }));
      const vpc: VpcResource = {
        id: "vpc-" + Math.random().toString(16).slice(2, 17),
        name: name + " (lab)",
        cidr,
        azCount,
        publicSubnets: publicSubs,
        privateSubnets: privateSubs,
        igw: { id: "igw-" + Math.random().toString(16).slice(2, 10) },
        natGateways: natGws,
        routeTables: [
          {
            id: "rtb-pub", name: "public-rt",
            subnet: publicSubs.map((s) => s.name).join(","),
            routes: [
              { dest: cidr, target: "local" },
              { dest: "0.0.0.0/0", target: "igw" },
            ],
          },
          ...(privateSubs.length > 0 ? [{
            id: "rtb-priv", name: "private-rt",
            subnet: privateSubs.map((s) => s.name).join(","),
            routes: [
              { dest: cidr, target: "local" },
              ...(natGws.length > 0 ? [{ dest: "0.0.0.0/0", target: natGws[0].id }] : []),
            ],
          }] : []),
        ],
        vpcEndpoints: endpoints === "none" ? [] : endpoints === "s3" ? ["s3"] : ["s3", "dynamodb"],
        created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      onCreate(vpc);
      setSuccess(vpc);
      setProgress(null);
    }, finishDelay);
  };

  const close = () => { reset(); onClose(); };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && close()}>
        <WizardShell
          steps={STEPS}
          currentStep={step}
          title="Create VPC"
          description="Provision an isolated virtual network in the AWS cloud"
          onClose={close}
        >
          <div className="px-6 py-4 min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="space-y-3">
                    <Label>Resources to create</Label>
                    <RadioGroup value={resources} onValueChange={(v) => setResources(v as typeof resources)}>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="vpc-only" id="res-vpc" className="mt-0.5" />
                        <div>
                          <Label htmlFor="res-vpc" className="cursor-pointer font-normal">VPC only</Label>
                          <p className="text-xs text-muted-foreground">Creates only a VPC with a single IPv4 CIDR block. No subnets, gateways, or route tables will be created.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="vpc-and-more" id="res-more" className="mt-0.5" />
                        <div>
                          <Label htmlFor="res-more" className="cursor-pointer font-normal">VPC and more</Label>
                          <p className="text-xs text-muted-foreground">Creates a VPC plus subnets, route tables, an internet gateway, NAT gateways, and VPC endpoints.</p>
                        </div>
                      </div>
                    </RadioGroup>
                    {resources === "vpc-only" && (
                      <Alert>
                        <Info className="size-4" />
                        <AlertTitle>Simplified option</AlertTitle>
                        <AlertDescription>
                          If you choose VPC only, the next steps for subnets, NAT gateways, and endpoints will be skipped.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Name tag auto-generation</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div>
                        <Label>IPv4 CIDR</Label>
                        <Input value={cidr} onChange={(e) => setCidr(e.target.value)} placeholder="10.0.0.0/16" />
                      </div>
                    </div>
                    {resources === "vpc-and-more" && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <Label>Number of Availability Zones</Label>
                          <Select value={String(azCount)} onValueChange={(v) => setAzCount(Number(v))}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Public subnets</Label>
                          <Select value={String(publicSubnetCount)} onValueChange={(v) => setPublicSubnetCount(Number(v))}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Private subnets</Label>
                          <Select value={String(privateSubnetCount)} onValueChange={(v) => setPrivateSubnetCount(Number(v))}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <Label>NAT gateways ($)</Label>
                    <RadioGroup value={natMode} onValueChange={(v) => setNatMode(v as typeof natMode)}>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="none" id="nat-none" className="mt-0.5" />
                        <div>
                          <Label htmlFor="nat-none" className="cursor-pointer font-normal">None</Label>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="one-az" id="nat-one" className="mt-0.5" />
                        <div>
                          <Label htmlFor="nat-one" className="cursor-pointer font-normal">In 1 AZ</Label>
                          <p className="text-xs text-muted-foreground">Creates a single NAT gateway in the first public subnet.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="one-per-az" id="nat-per" className="mt-0.5" />
                        <div>
                          <Label htmlFor="nat-per" className="cursor-pointer font-normal">In 1 AZ per public subnet</Label>
                          <p className="text-xs text-muted-foreground">Creates a NAT gateway in each AZ with a public subnet — maximizes availability.</p>
                        </div>
                      </div>
                    </RadioGroup>
                    {natMode !== "none" && (
                      <Alert>
                        <AlertTriangle className="size-4" style={{ color: "var(--aws-amber)" }} />
                        <AlertTitle>Cost warning</AlertTitle>
                        <AlertDescription>
                          Each NAT gateway costs ~$0.045/hour plus data processing fees. A NAT gateway in each AZ maximizes availability but multiplies cost.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <Label>VPC endpoints</Label>
                    <RadioGroup value={endpoints} onValueChange={(v) => setEndpoints(v as typeof endpoints)}>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="none" id="ep-none" className="mt-0.5" />
                        <Label htmlFor="ep-none" className="cursor-pointer font-normal">None</Label>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="s3" id="ep-s3" className="mt-0.5" />
                        <div>
                          <Label htmlFor="ep-s3" className="cursor-pointer font-normal">Gateway S3</Label>
                          <p className="text-xs text-muted-foreground">Privately connect to S3 from this VPC without traversing the public internet.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="s3-dynamodb" id="ep-ddb" className="mt-0.5" />
                        <div>
                          <Label htmlFor="ep-ddb" className="cursor-pointer font-normal">Gateway S3 + DynamoDB</Label>
                          <p className="text-xs text-muted-foreground">Privately connect to both S3 and DynamoDB.</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress animation */}
            {progress && (
              <div className="mt-4 space-y-2 rounded-md border bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <RefreshCw className="size-4 animate-spin" style={{ color: "var(--aws-orange)" }} />
                  Creating VPC resources…
                </div>
                {progress.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {p.done ? (
                      <CheckCircle2 className="size-4" style={{ color: "var(--aws-emerald)" }} />
                    ) : (
                      <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
                    )}
                    <span className={p.done ? "text-foreground" : "text-muted-foreground"}>{p.step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-3">
            <Button variant="link" size="sm" className="text-xs text-muted-foreground" onClick={close} disabled={!!progress}>Cancel</Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
              <Button variant="outline" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || !!progress}>
                <ChevronLeft className="size-4" /> Previous
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={() => setStep((s) => s + 1)}
                  disabled={resources === "vpc-only" && step === 0 && false}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={handleCreate}
                  disabled={!!progress}
                >
                  <Plus className="size-4" /> Create VPC
                </Button>
              )}
            </div>
          </div>
        </WizardShell>
      </Dialog>

      {success && (
        <SuccessModal
          open={!!success}
          onClose={() => { setSuccess(null); close(); }}
          title="VPC created successfully"
          icon={CircleCheck}
          color="var(--aws-violet)"
          message={`VPC "${success.name}" with ${success.publicSubnets.length + success.privateSubnets.length} subnets is ready.`}
          details={[
            { label: "VPC ID", value: success.id },
            { label: "CIDR", value: success.cidr },
            { label: "AZs", value: String(success.azCount) },
            { label: "NAT gateways", value: String(success.natGateways.length) },
          ]}
          cli={`aws ec2 create-vpc --cidr-block ${cidr} --region us-east-1\n# Then create subnets, route tables, IGW, and NAT gateways`}
        />
      )}
    </>
  );
}

// ===========================================================================
// 8. Lambda Console + Create Function Wizard + Function Detail
// ===========================================================================

const INITIAL_LAMBDA: LambdaFunction[] = [
  {
    name: "orders-api-handler",
    runtime: "Python 3.12",
    handler: "lambda_function.lambda_handler",
    lastModified: "Jan 14, 2025 09:23 UTC",
    codeSize: "1.2 MB",
    architecture: "x86_64",
    memory: 256,
    timeout: 30,
    role: "LambdaExecutionRole",
    envVars: [{ key: "LOG_LEVEL", value: "INFO" }, { key: "TABLE_NAME", value: "orders-prod" }],
    description: "Handles HTTP requests for the orders API.",
  },
  {
    name: "user-auth-handler",
    runtime: "Node.js 20",
    handler: "index.handler",
    lastModified: "Jan 10, 2025 18:11 UTC",
    codeSize: "845 KB",
    architecture: "arm64",
    memory: 512,
    timeout: 10,
    role: "LambdaExecutionRole",
    envVars: [{ key: "JWT_SECRET", value: "********" }],
    description: "Validates JWT tokens and authorizes API Gateway requests.",
  },
  {
    name: "image-resizer",
    runtime: "Python 3.12",
    handler: "resize.handler",
    lastModified: "Dec 28, 2024 14:02 UTC",
    codeSize: "3.7 MB",
    architecture: "x86_64",
    memory: 2048,
    timeout: 60,
    role: "LambdaExecutionRole",
    envVars: [{ key: "BUCKET", value: "my-website-assets-prod" }, { key: "MAX_WIDTH", value: "1200" }],
    description: "Triggered by S3 to resize uploaded images on the fly.",
  },
];

function LambdaConsole({
  functions,
  setFunctions,
}: {
  functions: LambdaFunction[];
  setFunctions: React.Dispatch<React.SetStateAction<LambdaFunction[]>>;
}) {
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<LambdaFunction | null>(null);

  return (
    <div className="space-y-4">
      <ServiceHeader
        icon={Zap}
        title="Lambda"
        description="Run code without thinking about servers"
        color="var(--aws-rose)"
        action={
          <Button
            className="text-white"
            style={{ backgroundColor: "var(--aws-orange)" }}
            onClick={() => setWizardOpen(true)}
          >
            <Plus className="size-4" /> Create function
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Functions ({functions.length})</CardTitle>
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="size-3.5" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Function name</TableHead>
                <TableHead>Runtime</TableHead>
                <TableHead>Handler</TableHead>
                <TableHead>Last modified</TableHead>
                <TableHead>Code size</TableHead>
                <TableHead>Architecture</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {functions.map((f) => (
                <TableRow
                  key={f.name}
                  className="cursor-pointer"
                  onClick={() => setSelected(f)}
                >
                  <TableCell className="font-medium text-[color:var(--aws-orange)]">{f.name}</TableCell>
                  <TableCell className="text-xs">{f.runtime}</TableCell>
                  <TableCell className="font-mono text-xs">{f.handler}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{f.lastModified}</TableCell>
                  <TableCell className="text-xs">{f.codeSize}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{f.architecture}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <LambdaCreateWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onCreate={(f) => setFunctions((prev) => [f, ...prev])}
      />

      {selected && (
        <LambdaFunctionDetail
          fn={functions.find((f) => f.name === selected.name) ?? selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function LambdaCreateWizard({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (f: LambdaFunction) => void;
}) {
  const STEPS = ["Basic information", "Permissions", "Advanced settings", "Review"];
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [runtime, setRuntime] = React.useState("Python 3.12");
  const [arch, setArch] = React.useState<"x86_64" | "arm64">("x86_64");
  const [roleMode, setRoleMode] = React.useState<"new" | "existing">("new");
  const [existingRole, setExistingRole] = React.useState("LambdaExecutionRole");
  const [enableVpc, setEnableVpc] = React.useState(false);
  const [envVars, setEnvVars] = React.useState<TagPair[]>([]);
  const [memory, setMemory] = React.useState(256);
  const [timeout, setTimeout_] = React.useState(30);
  const [success, setSuccess] = React.useState<LambdaFunction | null>(null);

  const reset = () => {
    setStep(0); setName(""); setRuntime("Python 3.12"); setArch("x86_64");
    setRoleMode("new"); setExistingRole("LambdaExecutionRole");
    setEnableVpc(false); setEnvVars([]); setMemory(256); setTimeout_(30);
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0;
    return true;
  };

  const handleCreate = () => {
    const handler = runtime.startsWith("Python") ? "lambda_function.lambda_handler"
      : runtime.startsWith("Node") ? "index.handler"
      : runtime.startsWith("Java") ? "com.example.Handler::handleRequest"
      : runtime.startsWith("Go") ? "bootstrap"
      : runtime.startsWith(".NET") ? "Assembly::Handler::Handle"
      : "handler";
    const fn: LambdaFunction = {
      name,
      runtime,
      handler,
      lastModified: new Date().toUTCString().slice(0, 22) + " UTC",
      codeSize: "1.0 KB",
      architecture: arch,
      memory,
      timeout,
      role: roleMode === "new" ? `${name}-role` : existingRole,
      envVars: envVars.filter((v) => v.key),
      description: "Function created via the console clone.",
    };
    onCreate(fn);
    setSuccess(fn);
  };

  const close = () => { reset(); onClose(); };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && close()}>
        <WizardShell
          steps={STEPS}
          currentStep={step}
          title="Create function"
          description="Run code on-demand without thinking about servers"
          onClose={close}
        >
          <div className="px-6 py-4 min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="lambda-name">Function name</Label>
                      <Input
                        id="lambda-name"
                        placeholder="my-function"
                        value={name}
                        onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                        autoFocus
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Only letters, numbers, hyphens, and underscores are allowed.
                      </p>
                    </div>
                    <div>
                      <Label>Runtime</Label>
                      <Select value={runtime} onValueChange={setRuntime}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {LAMBDA_RUNTIMES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Architecture</Label>
                      <RadioGroup value={arch} onValueChange={(v) => setArch(v as typeof arch)} className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="x86_64" id="arch-x86" />
                          <Label htmlFor="arch-x86" className="cursor-pointer font-normal">x86_64</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="arm64" id="arch-arm" />
                          <Label htmlFor="arch-arm" className="cursor-pointer font-normal">arm64 (Graviton)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3">
                    <Label>Execution role</Label>
                    <RadioGroup value={roleMode} onValueChange={(v) => setRoleMode(v as typeof roleMode)}>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="new" id="role-new" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="role-new" className="cursor-pointer font-normal">
                            Create a new role with basic Lambda permissions
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Creates a role with the <span className="font-mono">AWSLambdaBasicExecutionRole</span> policy attached, allowing your function to write logs to CloudWatch.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-md border p-3">
                        <RadioGroupItem value="existing" id="role-existing" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="role-existing" className="cursor-pointer font-normal">Use an existing role</Label>
                          {roleMode === "existing" && (
                            <Select value={existingRole} onValueChange={setExistingRole}>
                              <SelectTrigger className="w-full mt-2"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LambdaExecutionRole">LambdaExecutionRole</SelectItem>
                                <SelectItem value="EC2InstanceRole">EC2InstanceRole</SelectItem>
                                <SelectItem value="CrossAccountAuditRole">CrossAccountAuditRole</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <Label className="cursor-pointer">Enable VPC</Label>
                        <p className="text-xs text-muted-foreground">Connect your function to resources in a VPC.</p>
                      </div>
                      <Checkbox checked={enableVpc} onCheckedChange={(v) => setEnableVpc(!!v)} />
                    </div>
                    <div>
                      <Label>Environment variables</Label>
                      <p className="mb-2 text-xs text-muted-foreground">Optional key-value pairs accessible from your function code.</p>
                      <TagEditor tags={envVars} onChange={setEnvVars} />
                    </div>
                    <div>
                      <Label>Memory size — <span className="font-mono text-xs">{memory} MB</span></Label>
                      <input
                        type="range"
                        min={128}
                        max={10240}
                        step={64}
                        value={memory}
                        onChange={(e) => setMemory(Number(e.target.value))}
                        className="w-full accent-orange-500"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>128 MB</span>
                        <span>10240 MB</span>
                      </div>
                    </div>
                    <div>
                      <Label>Timeout — <span className="font-mono text-xs">{Math.floor(timeout / 60)}m {timeout % 60}s</span></Label>
                      <input
                        type="range"
                        min={1}
                        max={900}
                        step={1}
                        value={timeout}
                        onChange={(e) => setTimeout_(Number(e.target.value))}
                        className="w-full accent-orange-500"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>1s</span>
                        <span>15m</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle2 className="size-4" style={{ color: "var(--aws-emerald)" }} />
                      <AlertTitle>Review</AlertTitle>
                      <AlertDescription>Verify these settings, then click Create function.</AlertDescription>
                    </Alert>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-md border p-4 text-sm sm:grid-cols-2">
                      <ReviewRow label="Function name" value={name} />
                      <ReviewRow label="Runtime" value={runtime} />
                      <ReviewRow label="Architecture" value={arch} />
                      <ReviewRow label="Role" value={roleMode === "new" ? `${name}-role (new)` : existingRole} />
                      <ReviewRow label="Memory" value={`${memory} MB`} />
                      <ReviewRow label="Timeout" value={`${timeout}s`} />
                      <ReviewRow label="VPC enabled" value={enableVpc ? "Yes" : "No"} />
                      <ReviewRow label="Env variables" value={`${envVars.filter((v) => v.key).length}`} />
                    </dl>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-3">
            <Button variant="link" size="sm" className="text-xs text-muted-foreground" onClick={close}>Cancel</Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
              <Button variant="outline" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ChevronLeft className="size-4" /> Previous
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: "var(--aws-orange)" }}
                  onClick={handleCreate}
                >
                  <Plus className="size-4" /> Create function
                </Button>
              )}
            </div>
          </div>
        </WizardShell>
      </Dialog>

      {success && (
        <SuccessModal
          open={!!success}
          onClose={() => { setSuccess(null); close(); }}
          title="Function created successfully"
          icon={CircleCheck}
          color="var(--aws-rose)"
          message={`Lambda function "${success.name}" is ready to receive invocations.`}
          details={[
            { label: "Function name", value: success.name },
            { label: "Runtime", value: success.runtime },
            { label: "Handler", value: success.handler },
            { label: "Memory / Timeout", value: `${success.memory} MB / ${success.timeout}s` },
          ]}
          cli={`aws lambda create-function \\\n  --function-name ${success.name} \\\n  --runtime ${success.runtime.toLowerCase().replace(/[^a-z0-9.]/g, "")} \\\n  --handler ${success.handler} \\\n  --zip-file fileb://function.zip \\\n  --role arn:aws:iam::123456789012:role/${success.role}`}
        />
      )}
    </>
  );
}

function LambdaFunctionDetail({ fn, onClose }: { fn: LambdaFunction; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[min(900px,95vw)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex size-11 items-center justify-center rounded-lg"
              style={{ backgroundColor: "color-mix(in oklch, var(--aws-rose) 18%, transparent)" }}
            >
              <Zap className="size-6" style={{ color: "var(--aws-rose)" }} />
            </div>
            <div>
              <DialogTitle className="font-mono text-base">{fn.name}</DialogTitle>
              <DialogDescription>
                {fn.runtime} · {fn.architecture} · {fn.memory} MB · {fn.timeout}s
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Tabs defaultValue="code">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="mt-3">
            <div className="rounded-md bg-zinc-950 p-4 font-mono text-xs text-zinc-200">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-400">
                <FileText className="size-3" /> {fn.handler.split(".")[0]}.py
              </div>
              <pre className="overflow-x-auto leading-relaxed">{`import json
import logging
import os

logger = logging.getLogger()
logger.setLevel(os.environ.get("LOG_LEVEL", "INFO"))

def ${fn.handler.split(".").pop()}(event, context):
    """Entry point for ${fn.name}."""
    logger.info("Received event: %s", json.dumps(event))
    ${fn.name.replace(/-/g, "_")}_result = process_event(event)
    return {
        "statusCode": 200,
        "body": json.dumps(${fn.name.replace(/-/g, "_")}_result),
    }

def process_event(event):
    return {"message": "Hello from AWS Lambda!", "input": event}`}
              </pre>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Play className="size-3.5" /> Test
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Save className="size-3.5" /> Deploy
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="config" className="mt-3">
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="triggers">Triggers</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-3">
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <PropRow label="Function name" value={fn.name} />
                  <PropRow label="Runtime" value={fn.runtime} />
                  <PropRow label="Handler" value={fn.handler} />
                  <PropRow label="Architecture" value={fn.architecture} />
                  <PropRow label="Memory" value={`${fn.memory} MB`} />
                  <PropRow label="Timeout" value={`${fn.timeout}s`} />
                  <PropRow label="Last modified" value={fn.lastModified} />
                  <PropRow label="Code size" value={fn.codeSize} />
                </dl>
                {fn.envVars.length > 0 && (
                  <div className="mt-3">
                    <Label className="text-xs">Environment variables</Label>
                    <div className="mt-1 space-y-1 rounded-md border bg-muted/40 p-3">
                      {fn.envVars.map((v) => (
                        <div key={v.key} className="flex justify-between font-mono text-xs">
                          <span className="text-cyan-700 dark:text-cyan-400">{v.key}</span>
                          <span className="text-foreground">{v.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="triggers" className="mt-3">
                {fn.name === "image-resizer" ? (
                  <Alert>
                    <GitBranch className="size-4" style={{ color: "var(--aws-cyan)" }} />
                    <AlertTitle>S3 trigger configured</AlertTitle>
                    <AlertDescription>
                      Triggered when objects are created in <span className="font-mono">s3://my-website-assets-prod/uploads/</span>
                    </AlertDescription>
                  </Alert>
                ) : fn.name === "orders-api-handler" ? (
                  <Alert>
                    <GitBranch className="size-4" style={{ color: "var(--aws-amber)" }} />
                    <AlertTitle>API Gateway trigger configured</AlertTitle>
                    <AlertDescription>
                      Mapped to <span className="font-mono">ANY /orders/{`{proxy+}`}</span> on <span className="font-mono">orders-prod API</span>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-sm text-muted-foreground">No triggers configured.</p>
                )}
              </TabsContent>
              <TabsContent value="permissions" className="mt-3">
                <PropRow label="Execution role" value={fn.role} />
                <div className="mt-2">
                  <Label className="text-xs">Permissions granted to this function</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-[10px]">AWSLambdaBasicExecutionRole</Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="monitoring" className="mt-3">
                <MiniMetric label="Invocations (last 24h)" value="1,284" />
                <MiniMetric label="Errors" value="3" />
                <MiniMetric label="Throttles" value="0" />
                <MiniMetric label="Duration (avg)" value="142 ms" />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="monitor" className="mt-3">
            <MetricChart metric="invocations" fnName={fn.name} />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2 flex items-center justify-between rounded-md border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-semibold">{value}</span>
    </div>
  );
}

// ===========================================================================
// 9. CloudWatch Console
// ===========================================================================

const CW_DASHBOARDS = [
  { name: "EC2 Production", widgets: 6, lastViewed: "Jan 15, 2025" },
  { name: "Lambda Functions", widgets: 8, lastViewed: "Jan 14, 2025" },
  { name: "RDS", widgets: 5, lastViewed: "Jan 12, 2025" },
];

const CW_ALARMS = [
  { name: "High CPU > 80%", state: "OK", metric: "CPUUtilization", threshold: "> 80% for 5 min", updated: "Jan 15 14:00" },
  { name: "Lambda Errors > 5", state: "ALARM", metric: "Errors", threshold: "> 5 errors for 1 min", updated: "Jan 15 13:42" },
  { name: "RDS Connections > 100", state: "INSUFFICIENT_DATA", metric: "DatabaseConnections", threshold: "> 100 for 5 min", updated: "Jan 14 22:18" },
  { name: "S3 4xx Errors > 10", state: "OK", metric: "4xxErrors", threshold: "> 10 for 5 min", updated: "Jan 15 12:00" },
];

const CW_LOG_GROUPS = [
  {
    name: "/aws/lambda/orders-api-handler",
    streams: [
      { name: "2025/01/15/[$LATEST]abc123", events: [
        { ts: "2025-01-15 14:32:08.912", msg: '{"level":"INFO","msg":"Received event","requestId":"req-001","httpMethod":"POST","path":"/orders"}' },
        { ts: "2025-01-15 14:32:08.945", msg: '{"level":"INFO","msg":"Processed order","orderId":"ord-99881","amount":49.99}' },
        { ts: "2025-01-15 14:32:08.947", msg: '{"level":"INFO","msg":"Wrote to DynamoDB","table":"orders-prod","consumedCapacity":1}' },
      ] },
      { name: "2025/01/14/[$LATEST]def456", events: [
        { ts: "2025-01-14 23:59:58.001", msg: '{"level":"INFO","msg":"Received event","requestId":"req-992","httpMethod":"GET","path":"/orders/123"}' },
        { ts: "2025-01-14 23:59:58.012", msg: '{"level":"WARN","msg":"Slow query","durationMs":1450,"table":"orders-prod"}' },
      ] },
    ],
  },
  {
    name: "/aws/lambda/user-auth-handler",
    streams: [
      { name: "2025/01/15/[$LATEST]xyz789", events: [
        { ts: "2025-01-15 09:11:22.001", msg: '{"level":"INFO","msg":"Token validated","sub":"user-9981","exp":1736958682}' },
        { ts: "2025-01-15 09:11:22.022", msg: '{"level":"ERROR","msg":"Invalid signature","reason":"token-expired"}' },
      ] },
    ],
  },
  {
    name: "/aws/lambda/image-resizer",
    streams: [
      { name: "2025/01/12/[$LATEST]img001", events: [
        { ts: "2025-01-12 09:11:45.110", msg: '{"level":"INFO","msg":"S3 trigger received","bucket":"my-website-assets-prod","key":"uploads/cat.jpg"}' },
        { ts: "2025-01-12 09:11:46.002", msg: '{"level":"INFO","msg":"Resized image","width":1200,"height":800,"durationMs":890}' },
      ] },
    ],
  },
];

function CloudWatchConsole() {
  return (
    <div className="space-y-4">
      <ServiceHeader
        icon={Activity}
        title="CloudWatch"
        description="Monitor resources and applications"
        color="var(--aws-cyan)"
      />
      <Tabs defaultValue="dashboards">
        <TabsList>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="alarms">Alarms</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CW_DASHBOARDS.map((d) => (
              <Card key={d.name} className="card-lift cursor-pointer">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="flex size-9 items-center justify-center rounded"
                      style={{ backgroundColor: "color-mix(in oklch, var(--aws-cyan) 18%, transparent)" }}
                    >
                      <Gauge className="size-5" style={{ color: "var(--aws-cyan)" }} />
                    </div>
                    <span className="text-sm font-medium">{d.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{d.widgets} widgets</span>
                    <span>Viewed {d.lastViewed}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="size-4" style={{ color: "var(--aws-cyan)" }} /> Metrics explorer
              </CardTitle>
              <CardDescription>Pre-populated with sample metrics from your simulated resources.</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricChart metric="cpu" fnName="EC2 web-server-prod" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alarms" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="size-4" style={{ color: "var(--aws-amber)" }} /> Alarms ({CW_ALARMS.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Last updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CW_ALARMS.map((a) => (
                    <TableRow key={a.name}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell><StateBadge state={a.state} /></TableCell>
                      <TableCell className="font-mono text-xs">{a.metric}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.threshold}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <LogsExplorer />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricChart({ metric, fnName }: { metric: string; fnName: string }) {
  const [sel, setSel] = React.useState(metric);
  const data = React.useMemo(() => {
    const points: { time: string; value: number }[] = [];
    let base = sel === "cpu" ? 35 : sel === "invocations" ? 50 : sel === "errors" ? 1.5 : 30;
    for (let i = 23; i >= 0; i--) {
      const wave = Math.sin(i / 3) * (base * 0.25) + Math.cos(i / 7) * (base * 0.15);
      const noise = (Math.random() - 0.5) * (base * 0.2);
      let val = Math.max(0, base + wave + noise);
      if (sel === "errors" && i === 4) val = 7; // spike
      if (sel === "cpu" && i === 8) val = 88; // spike
      points.push({ time: `${String(23 - i).padStart(2, "0")}:00`, value: Math.round(val * 10) / 10 });
    }
    return points;
  }, [sel]);

  const labels: Record<string, { title: string; unit: string; color: string }> = {
    cpu: { title: `CPUUtilization — ${fnName}`, unit: "%", color: "var(--aws-orange)" },
    invocations: { title: `Invocations — ${fnName}`, unit: "count", color: "var(--aws-cyan)" },
    errors: { title: `Errors — ${fnName}`, unit: "count", color: "var(--aws-rose)" },
    duration: { title: `Duration — ${fnName}`, unit: "ms", color: "var(--aws-violet)" },
  };
  const cfg = labels[sel] ?? labels.cpu;
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium">{cfg.title}</h3>
          <p className="text-xs text-muted-foreground">Last 24 hours · 1-hour resolution</p>
        </div>
        <Select value={sel} onValueChange={setSel}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cpu">CPUUtilization (%)</SelectItem>
            <SelectItem value="invocations">Invocations (count)</SelectItem>
            <SelectItem value="errors">Errors (count)</SelectItem>
            <SelectItem value="duration">Duration (ms)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-64 w-full rounded-md border bg-gradient-to-b from-slate-50 to-white p-4 dark:from-slate-900/30 dark:to-slate-900/10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cfg.color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={cfg.color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} interval={3} />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} domain={[0, Math.ceil(maxVal * 1.2)]} />
            <RTooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #cbd5e1" }}
              formatter={(v: number) => [`${v} ${cfg.unit}`, cfg.title.split("—")[0].trim()]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={cfg.color}
              strokeWidth={2}
              fill="url(#metricFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LogsExplorer() {
  const [group, setGroup] = React.useState<string | null>(null);
  const [stream, setStream] = React.useState<string | null>(null);

  if (!group) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="size-4" style={{ color: "var(--aws-cyan)" }} /> Log groups ({CW_LOG_GROUPS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log group</TableHead>
                <TableHead>Streams</TableHead>
                <TableHead className="w-24">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CW_LOG_GROUPS.map((g) => (
                <TableRow key={g.name}>
                  <TableCell className="font-mono text-xs text-[color:var(--aws-orange)]">{g.name}</TableCell>
                  <TableCell className="text-xs">{g.streams.length}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setGroup(g.name)}
                    >
                      View streams <ChevronRight className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  const g = CW_LOG_GROUPS.find((x) => x.name === group)!;
  if (!stream) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            <Button variant="link" className="px-0 text-base" onClick={() => setGroup(null)}>
              <ChevronLeft className="size-4" /> Log groups
            </Button>
            <span className="mx-2">/</span>
            <span className="font-mono text-sm">{group}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log stream</TableHead>
                <TableHead className="w-24">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {g.streams.map((s) => (
                <TableRow key={s.name}>
                  <TableCell className="font-mono text-xs">{s.name}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setStream(s.name)}>
                      View events <ChevronRight className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  const s = g.streams.find((x) => x.name === stream)!;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex flex-wrap items-center gap-1">
          <Button variant="link" className="px-0 text-base" onClick={() => setStream(null)}>
            <ChevronLeft className="size-4" /> {group}
          </Button>
          <span className="mx-2">/</span>
          <span className="font-mono text-xs">{stream}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 rounded-md border bg-zinc-950 p-3 font-mono text-xs text-zinc-200">
          <div className="space-y-1">
            {s.events.map((e, i) => (
              <div key={i} className="flex gap-2">
                <span className="shrink-0 text-emerald-400">{e.ts}</span>
                <span className="break-all">{e.msg}</span>
              </div>
            ))}
            <div className="flex gap-2 text-cyan-400">
              <span className="shrink-0">──────────</span>
              <span className="italic">End of log stream</span>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// ===========================================================================
// 10. Top-level AwsConsoleClone shell
// ===========================================================================

export function AwsConsoleClone() {
  const [selectedService, setSelectedService] = React.useState<ServiceId>("ec2");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [region, setRegion] = React.useState("US East (N. Virginia)");
  const [search, setSearch] = React.useState("");

  const [ec2Instances, setEc2Instances] = React.useState<Ec2Instance[]>(INITIAL_EC2);
  const [s3Buckets, setS3Buckets] = React.useState<S3Bucket[]>(INITIAL_S3);
  const [iamUsers, setIamUsers] = React.useState<IamUser[]>(INITIAL_IAM_USERS);
  const [vpcs, setVpcs] = React.useState<VpcResource[]>(INITIAL_VPCS);
  const [lambdaFunctions, setLambdaFunctions] = React.useState<LambdaFunction[]>(INITIAL_LAMBDA);

  const selectService = (id: string) => {
    const isImplemented = ["ec2", "s3", "iam", "vpc", "lambda", "cloudwatch"].includes(id);
    if (!isImplemented) return; // other services shown in sidebar but not implemented
    setSelectedService(id as ServiceId);
    setSidebarOpen(false);
    setSearch("");
  };

  const filteredServices = React.useMemo(() => {
    if (!search.trim()) return SIDEBAR_SERVICES;
    const q = search.toLowerCase();
    return SIDEBAR_SERVICES.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }, [search]);

  const grouped = React.useMemo(() => {
    const map: Record<string, Array<{ readonly id: string; readonly name: string; readonly category: string; readonly icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; readonly color: string }>> = {};
    filteredServices.forEach((s) => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [filteredServices]);

  return (
    <div className="flex min-h-screen flex-col bg-background" style={{ backgroundColor: "var(--background)" }}>
      {/* Top header bar */}
      <header
        className="sticky top-0 z-40 flex h-[50px] items-center justify-between px-3 text-white shadow-md sm:px-4"
        style={{ backgroundColor: AWS_NAVY }}
      >
        <div className="flex items-center gap-2">
          <button
            className="rounded p-1 hover:bg-white/10 md:hidden"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle services"
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex items-center gap-1.5">
            <Cloud className="size-5" style={{ color: "var(--aws-orange)" }} />
            <span className="text-sm font-semibold tracking-tight">AWS Console Clone</span>
          </div>
          <SimBadge compact />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Region selector */}
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger
              className="h-8 w-fit border-white/20 bg-white/10 text-xs text-white hover:bg-white/20"
              size="sm"
            >
              <Globe className="size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" className="size-8 text-white hover:bg-white/10">
            <HelpCircle className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-white hover:bg-white/10">
            <Bell className="size-4" />
          </Button>

          {/* Account menu */}
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1">
            <div className="flex size-6 items-center justify-center rounded-full text-[10px] font-semibold" style={{ backgroundColor: "var(--aws-orange)" }}>
              LA
            </div>
            <span className="hidden text-xs font-medium sm:inline">lab-account</span>
            <ChevronDown className="size-3" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <aside
          className="hidden w-60 shrink-0 border-r lg:block"
          style={{ backgroundColor: AWS_SIDEBAR }}
        >
          <SidebarContent
            search={search}
            setSearch={setSearch}
            grouped={grouped}
            selectedService={selectedService}
            selectService={selectService}
          />
        </aside>

        {/* Sidebar — mobile (slide-over) */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="fixed left-0 top-[50px] z-50 h-[calc(100vh-50px)] w-72 border-r shadow-xl md:hidden"
                style={{ backgroundColor: AWS_SIDEBAR }}
              >
                <SidebarContent
                  search={search}
                  setSearch={setSearch}
                  grouped={grouped}
                  selectedService={selectedService}
                  selectService={selectService}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedService}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {selectedService === "ec2" && (
                  <Ec2Console instances={ec2Instances} setInstances={setEc2Instances} />
                )}
                {selectedService === "s3" && (
                  <S3Console buckets={s3Buckets} setBuckets={setS3Buckets} />
                )}
                {selectedService === "iam" && (
                  <IamConsole users={iamUsers} setUsers={setIamUsers} />
                )}
                {selectedService === "vpc" && (
                  <VpcConsole vpcs={vpcs} setVpcs={setVpcs} />
                )}
                {selectedService === "lambda" && (
                  <LambdaConsole functions={lambdaFunctions} setFunctions={setLambdaFunctions} />
                )}
                {selectedService === "cloudwatch" && <CloudWatchConsole />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer with simulation reminder */}
          <footer
            className="mt-auto border-t px-4 py-4 text-xs"
            style={{ backgroundColor: AWS_NAVY_LIGHT, color: "rgba(255,255,255,0.85)" }}
          >
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SimBadge />
                <span>
                  This is a learning sandbox. No real AWS resources are created or modified.
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] opacity-80">
                <span className="flex items-center gap-1"><Cloud className="size-3" /> AWS Console Clone</span>
                <span className="flex items-center gap-1"><BookOpen className="size-3" /> Educational use only</span>
                <span className="flex items-center gap-1"><Coins className="size-3" /> $0.00 spent</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  search,
  setSearch,
  grouped,
  selectedService,
  selectService,
}: {
  search: string;
  setSearch: (v: string) => void;
  grouped: Record<string, Array<{ readonly id: string; readonly name: string; readonly category: string; readonly icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; readonly color: string }>>;
  selectedService: ServiceId;
  selectService: (id: string) => void;
}) {
  const categories = Object.keys(grouped);

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b p-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>
      {/* Services list */}
      <ScrollArea className="scroll-area-thin flex-1">
        <div className="p-2">
          {categories.length === 0 ? (
            <p className="px-2 py-4 text-xs text-muted-foreground">No services match your search.</p>
          ) : (
            <Accordion type="multiple" defaultValue={categories} className="w-full">
              {categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat] ?? Cloud;
                const services = grouped[cat] ?? [];
                return (
                  <AccordionItem key={cat} value={cat} className="border-b border-border/60">
                    <AccordionTrigger className="px-2 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:no-underline">
                      <span className="flex items-center gap-1.5">
                        <Icon className="size-3.5" />
                        {cat}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <ul className="space-y-0.5">
                        {services.map((s) => {
                          const isImplemented = ["ec2", "s3", "iam", "vpc", "lambda", "cloudwatch"].includes(s.id);
                          const isSelected = selectedService === s.id;
                          return (
                            <li key={s.id}>
                              <button
                                type="button"
                                disabled={!isImplemented}
                                onClick={() => selectService(s.id)}
                                className={cn(
                                  "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors",
                                  isSelected ? "text-white" : "hover:bg-accent",
                                  !isImplemented && "cursor-not-allowed opacity-40"
                                )}
                                style={isSelected ? { backgroundColor: "var(--aws-orange)" } : undefined}
                                title={isImplemented ? s.name : `${s.name} — not implemented in this sandbox`}
                              >
                                <s.icon className="size-3.5" style={{ color: isSelected ? "white" : s.color }} />
                                <span className="flex-1">{s.name}</span>
                                {!isImplemented && <Lock className="size-3 opacity-50" />}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </ScrollArea>
      {/* Footer mini-info */}
      <div className="border-t p-3 text-[10px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Account: 123456789012</span>
          <SimBadge compact />
        </div>
      </div>
    </div>
  );
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Compute: CpuIcon,
  Storage: HardDrive,
  Database: DbIcon,
  Networking: NetIcon,
  Security: Shield,
  Management: Activity,
};
