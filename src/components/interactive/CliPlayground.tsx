"use client";

import * as React from "react";
import {
  Terminal,
  Trash2,
  Play,
  ChevronRight,
  Info,
  Cloud,
  User,
  Server,
  HardDrive,
  Shield,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TerminalLine {
  id: number;
  type: "input" | "output" | "error" | "system" | "success";
  prompt?: string;
  text: string;
}

interface CommonCommand {
  label: string;
  command: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PROMPT = "aws-student@cloud-lab:~$";

const COMMON_COMMANDS: CommonCommand[] = [
  {
    label: "Get Caller Identity",
    command: "aws sts get-caller-identity",
    description: "Who am I authenticated as?",
    icon: User,
    color: "aws-cyan",
  },
  {
    label: "List S3 Buckets",
    command: "aws s3 ls",
    description: "All buckets in this account",
    icon: HardDrive,
    color: "aws-emerald",
  },
  {
    label: "Describe EC2 Instances",
    command: "aws ec2 describe-instances",
    description: "Running EC2 instances",
    icon: Server,
    color: "aws-orange",
  },
  {
    label: "List IAM Users",
    command: "aws iam list-users",
    description: "Users in the account",
    icon: Shield,
    color: "aws-rose",
  },
  {
    label: "CLI Version",
    command: "aws --version",
    description: "Show CLI version info",
    icon: Info,
    color: "aws-violet",
  },
  {
    label: "Help",
    command: "aws help",
    description: "Available service commands",
    icon: HelpCircle,
    color: "aws-amber",
  },
];

// ---------------------------------------------------------------------------
// Command simulation
// ---------------------------------------------------------------------------

function simulateCommand(raw: string): TerminalLine[] {
  const cmd = raw.trim();
  const lower = cmd.toLowerCase();

  if (lower === "clear") {
    // Special signal handled by caller
    return [
      {
        id: 0,
        type: "system",
        text: "__CLEAR__",
      },
    ];
  }

  // Non-aws commands → command not found
  if (!lower.startsWith("aws")) {
    return [
      {
        id: 0,
        type: "error",
        text: `command not found: ${cmd.split(/\s+/)[0]}\nType "aws help" to see available commands. This simulator only responds to AWS CLI commands.`,
      },
    ];
  }

  // aws --version
  if (lower === "aws --version" || lower === "aws version") {
    return [
      {
        id: 0,
        type: "output",
        text: "aws-cli/2.15.0 Python/3.11.5 Linux/6.5.0 botocore/2.4.0",
      },
    ];
  }

  // aws help
  if (lower === "aws help") {
    return [
      {
        id: 0,
        type: "output",
        text: [
          "aws <command> <subcommand> [options]",
          "",
          "Available service commands (simulated):",
          "  sts           AWS Security Token Service (get-caller-identity)",
          "  s3            Simple Storage Service (ls, cp, sync, mb, rb)",
          "  ec2           Elastic Compute Cloud (describe-instances, ...)",
          "  iam           Identity & Access Management (list-users, list-roles)",
          "",
          "Global options:",
          "  --version             Show AWS CLI version",
          "  --help                Show this help",
          "  --region <region>     Override default region",
          "  --profile <name>      Use a named profile",
          "",
          'Try: aws sts get-caller-identity',
        ].join("\n"),
      },
    ];
  }

  // aws sts get-caller-identity
  if (lower === "aws sts get-caller-identity") {
    return [
      {
        id: 0,
        type: "output",
        text: [
          "{",
          '    "UserId": "AIDA123456789EXAMPLE",',
          '    "Account": "123456789012",',
          '    "Arn": "arn:aws:iam::123456789012:user/student"',
          "}",
        ].join("\n"),
      },
    ];
  }

  // aws s3 ls
  if (lower === "aws s3 ls") {
    return [
      {
        id: 0,
        type: "output",
        text: [
          "2023-08-15 10:30:00 my-example-bucket",
          "2024-01-20 14:22:00 cloud-academy-data",
          "2024-03-05 09:15:30 website-static-assets",
          "2024-06-12 16:48:12 lambda-deployments-archive",
        ].join("\n"),
      },
    ];
  }

  // aws ec2 describe-instances
  if (lower === "aws ec2 describe-instances") {
    return [
      {
        id: 0,
        type: "output",
        text: [
          "RESERVATIONS\tOwner\t123456789012\tReservationId\tr-0abc123def456",
          "INSTANCES\tAmiLaunchIndex\t0\tImageId\tami-0abcdef123456789",
          "\tInstanceType\tt3.micro\tInstanceId\ti-0abc123def456789",
          "\tState\tName\trunning\tSubnetId\tsubnet-0abc123",
          "\tPublicIpAddress\t54.210.23.45\tPrivateIpAddress\t10.0.1.42",
          "\tLaunchTime\t2024-06-10T08:30:00.000Z\tAvailabilityZone\tus-east-1a",
          "TAGS\tKey\tName\tValue\tweb-server-prod",
          "",
          "INSTANCES\tInstanceType\tt3.small\tInstanceId\ti-0def456ghi789012",
          "\tState\tName\tstopped\tSubnetId\tsubnet-0abc456",
          "\tLaunchTime\t2024-05-22T14:15:00.000Z\tAvailabilityZone\tus-east-1b",
          "TAGS\tKey\tName\tValue\tworker-node-dev",
        ].join("\n"),
      },
    ];
  }

  // aws iam list-users
  if (lower === "aws iam list-users") {
    return [
      {
        id: 0,
        type: "output",
        text: [
          "USERS\tUserName\tUserId\tArn\tCreateDate",
          "\tadmin\tAIDAI2345678901ABCD\tarn:aws:iam::123456789012:user/admin\t2023-01-15T10:00:00Z",
          "\tstudent\tAIDA1234567890EXAMPLE\tarn:aws:iam::123456789012:user/student\t2023-08-01T08:30:00Z",
          "\tdeploy-bot\tAIDAI3456789012EFGH\tarn:aws:iam::123456789012:user/deploy-bot\t2024-02-10T12:00:00Z",
        ].join("\n"),
      },
    ];
  }

  // Unknown aws commands — realistic error
  return [
    {
      id: 0,
      type: "error",
      text: [
        `usage: aws [options] <command> <subcommand> [<subcommand> ...]`,
        "",
        `Unknown output format: ${cmd.split(/\s+/).slice(2).join(" ") || "(none)"}`,
        "Valid commands in this simulator: sts, s3, ec2, iam.",
        'Type "aws help" for the full list.',
      ].join("\n"),
    },
  ];
}

// ---------------------------------------------------------------------------
// CliPlayground component
// ---------------------------------------------------------------------------

let lineCounter = 0;
const nextId = () => ++lineCounter;

export function CliPlayground() {
  const navigate = useAppStore((s) => s.navigate);
  const [lines, setLines] = React.useState<TerminalLine[]>([
    {
      id: nextId(),
      type: "system",
      text: "AWS CLI Simulator v2.15.0 — type 'aws help' to see supported commands. Type 'clear' to reset the screen.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new lines
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const pushLines = (newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines.map((l) => ({ ...l, id: nextId() }))]);
  };

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) {
      // Just show empty prompt line
      pushLines([
        { id: nextId(), type: "input", prompt: PROMPT, text: "" },
      ]);
      return;
    }
    // Push input line
    pushLines([
      { id: nextId(), type: "input", prompt: PROMPT, text: cmd },
    ]);
    // Add to history (dedupe consecutive duplicates)
    setHistory((prev) =>
      prev.length > 0 && prev[prev.length - 1] === cmd
        ? prev
        : [...prev, cmd],
    );
    setHistoryIndex(null);

    const result = simulateCommand(cmd);
    if (result.length === 1 && result[0].text === "__CLEAR__") {
      setLines([]);
      return;
    }
    pushLines(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIdx =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIdx);
      setInput(history[newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0 || historyIndex === null) return;
      const newIdx = historyIndex + 1;
      if (newIdx >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  };

  const clearTerminal = () => {
    setLines([]);
    inputRef.current?.focus();
  };

  const runCommon = (cmd: string) => {
    runCommand(cmd);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ name: "home" })}
          className="mb-3"
        >
          <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
          Home
        </Button>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--aws-orange)", opacity: 0.12 }}
          >
            <Terminal
              className="w-6 h-6"
              style={{ color: "var(--aws-orange)" }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AWS CLI Playground</h1>
            <p className="text-muted-foreground">
              Practice AWS CLI commands in a safe, simulated terminal.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start banner */}
      <Card className="border-aws-cyan/30 bg-aws-cyan/5">
        <CardContent className="flex items-start gap-3 py-4">
          <Info className="w-5 h-5 text-aws-cyan shrink-0 mt-0.5" />
          <div className="text-sm space-y-1.5">
            <div className="font-semibold flex items-center gap-2 flex-wrap">
              Quick Start
              <Badge className="bg-aws-amber/20 text-aws-amber text-[10px]">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Simulation
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              This is a fully simulated AWS CLI — no real AWS account is
              connected, no resources will be created, and no charges will occur.
              Try <code className="px-1 py-0.5 rounded bg-muted font-mono text-xs">aws sts get-caller-identity</code>{" "}
              to start, or click a command on the right. Use{" "}
              <kbd className="px-1.5 py-0.5 rounded border bg-muted text-xs font-mono">↑</kbd>{" "}
              <kbd className="px-1.5 py-0.5 rounded border bg-muted text-xs font-mono">↓</kbd>{" "}
              to navigate command history.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Terminal */}
        <Card className="overflow-hidden p-0">
          <CardHeader className="bg-zinc-900 border-b border-zinc-800 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-aws-rose/70" />
                  <div className="w-3 h-3 rounded-full bg-aws-amber/70" />
                  <div className="w-3 h-3 rounded-full bg-aws-emerald/70" />
                </div>
                <span className="text-xs font-mono text-zinc-400 ml-2">
                  aws-cli-simulator — bash
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-aws-amber/20 text-aws-amber text-[10px]">
                  <Cloud className="w-3 h-3 mr-1" />
                  Simulation
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearTerminal}
                  className="h-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Terminal body */}
            <div
              ref={scrollRef}
              onClick={() => inputRef.current?.focus()}
              className="bg-black text-zinc-100 font-mono text-sm leading-relaxed p-4 h-[480px] overflow-y-auto scroll-area-thin cursor-text"
            >
              {lines.map((line) => (
                <TerminalLineView key={line.id} line={line} />
              ))}
              {/* Active prompt */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-aws-emerald shrink-0 select-none">
                  {PROMPT}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-sm caret-aws-orange"
                  aria-label="AWS CLI command input"
                />
                <span className="terminal-cursor inline-block w-2 h-4 bg-aws-orange shrink-0" />
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: Common commands */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Play className="w-4 h-4 text-aws-orange" />
              Common Commands
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {COMMON_COMMANDS.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.command}
                  onClick={() => runCommon(c.command)}
                  className="w-full text-left p-2.5 rounded-lg border border-border hover:border-aws-orange/40 hover:bg-accent transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <Icon
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: `var(--${c.color})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium leading-tight">
                        {c.label}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate group-hover:text-aws-orange">
                        {c.command}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {c.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-border">
              <div className="text-xs text-muted-foreground mb-2 font-medium">
                Keyboard Shortcuts
              </div>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li className="flex justify-between">
                  <span>Previous command</span>
                  <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">↑</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Next command</span>
                  <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">↓</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Clear screen</span>
                  <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">Ctrl+L</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Submit command</span>
                  <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">Enter</kbd>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Terminal line renderer
// ---------------------------------------------------------------------------

function TerminalLineView({ line }: { line: TerminalLine }) {
  if (line.type === "input") {
    return (
      <div className="whitespace-pre-wrap break-words">
        <span className="text-aws-emerald select-none">{line.prompt}</span>{" "}
        <span className="text-zinc-100">{line.text}</span>
      </div>
    );
  }
  if (line.type === "system") {
    return (
      <div className="text-aws-cyan whitespace-pre-wrap break-words">
        {line.text}
      </div>
    );
  }
  if (line.type === "error") {
    return (
      <div className="text-aws-rose whitespace-pre-wrap break-words">
        {line.text}
      </div>
    );
  }
  if (line.type === "success") {
    return (
      <div className="text-aws-emerald whitespace-pre-wrap break-words">
        {line.text}
      </div>
    );
  }
  // output (default)
  return (
    <div className="text-zinc-300 whitespace-pre-wrap break-words">
      {line.text}
    </div>
  );
}
