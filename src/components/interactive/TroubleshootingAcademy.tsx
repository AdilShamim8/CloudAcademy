"use client";

import * as React from "react";
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  Lightbulb,
  Wrench,
  Search,
  Bug,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Target,
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
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  troubleshootingScenarios,
  type TroubleshootingScenario,
  type TroubleshootingStep,
} from "@/lib/learning-content";
import { SyntaxHighlighter } from "@/components/interactive/SyntaxHighlighter";

const levelColors: Record<string, string> = {
  beginner:
    "bg-level-beginner/20 text-level-beginner border-level-beginner/30",
  intermediate:
    "bg-level-intermediate/20 text-level-intermediate border-level-intermediate/30",
  advanced: "bg-level-advanced/20 text-level-advanced border-level-advanced/30",
  expert: "bg-level-expert/20 text-level-expert border-level-expert/30",
};

// Step type → color + icon + label
const stepTypeConfig: Record<
  TroubleshootingStep["type"],
  {
    color: string;
    bg: string;
    border: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  symptom: {
    color: "text-aws-amber",
    bg: "bg-aws-amber/15",
    border: "border-aws-amber",
    label: "Symptom",
    icon: AlertTriangle,
  },
  investigation: {
    color: "text-aws-cyan",
    bg: "bg-aws-cyan/15",
    border: "border-aws-cyan",
    label: "Investigation",
    icon: Search,
  },
  "root-cause": {
    color: "text-aws-rose",
    bg: "bg-aws-rose/15",
    border: "border-aws-rose",
    label: "Root Cause",
    icon: Bug,
  },
  fix: {
    color: "text-aws-emerald",
    bg: "bg-aws-emerald/15",
    border: "border-aws-emerald",
    label: "Fix",
    icon: Wrench,
  },
  prevention: {
    color: "text-aws-violet",
    bg: "bg-aws-violet/15",
    border: "border-aws-violet",
    label: "Prevention",
    icon: ShieldCheck,
  },
};

// ---------------------------------------------------------------------------
// TroubleshootingView — list of all scenarios
// ---------------------------------------------------------------------------

export function TroubleshootingView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ name: "home" })}
          className="mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Home
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Troubleshooting Academy
        </h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Step through real-world AWS incidents as a senior engineer would —
          symptom, investigation, root cause, fix, and prevention. Each scenario
          teaches you not just the answer, but the diagnostic methodology behind it.
        </p>
      </div>

      {/* Stats */}
      <Card className="bg-gradient-mesh">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat
              icon={Bug}
              color="aws-rose"
              value={String(troubleshootingScenarios.length)}
              label="Scenarios"
            />
            <Stat
              icon={Activity}
              color="aws-cyan"
              value={String(
                troubleshootingScenarios.reduce(
                  (s, sc) => s + sc.steps.length,
                  0,
                ),
              )}
              label="Diagnostic Steps"
            />
            <Stat
              icon={Clock}
              color="aws-amber"
              value={`${troubleshootingScenarios.reduce(
                (s, sc) => s + sc.estimatedTime,
                0,
              )} min`}
              label="Total Practice Time"
            />
            <Stat
              icon={Lightbulb}
              color="aws-emerald"
              value={String(
                troubleshootingScenarios.reduce(
                  (s, sc) => s + sc.keyLearnings.length,
                  0,
                ),
              )}
              label="Key Learnings"
            />
          </div>
        </CardContent>
      </Card>

      {/* Scenario cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {troubleshootingScenarios.map((sc) => {
          const stepTypes = Array.from(new Set(sc.steps.map((s) => s.type)));
          return (
            <Card
              key={sc.id}
              className="card-lift cursor-pointer group flex flex-col"
              onClick={() =>
                navigate({ name: "troubleshooting-scenario", scenarioId: sc.id })
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "var(--aws-rose)",
                      opacity: 0.12,
                    }}
                  >
                    <Stethoscope
                      className="w-6 h-6"
                      style={{ color: "var(--aws-rose)" }}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={cn("capitalize", levelColors[sc.level])}
                    >
                      {sc.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {sc.estimatedTime} min
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-aws-orange transition-colors">
                  {sc.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {sc.scenario}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {sc.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {sc.steps.length} steps
                  </span>
                </div>
                {/* Step type legend */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {stepTypes.map((t) => {
                    const cfg = stepTypeConfig[t];
                    return (
                      <span
                        key={t}
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
                          cfg.bg,
                          cfg.color,
                        )}
                      >
                        <cfg.icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-auto flex items-center justify-end">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({
                        name: "troubleshooting-scenario",
                        scenarioId: sc.id,
                      });
                    }}
                  >
                    Open Scenario
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: `var(--${color})` }} />
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TroubleshootingScenarioView — single scenario walkthrough
// ---------------------------------------------------------------------------

export function TroubleshootingScenarioView({
  scenarioId,
}: {
  scenarioId: string;
}) {
  const navigate = useAppStore((s) => s.navigate);

  const scenario: TroubleshootingScenario | undefined =
    troubleshootingScenarios.find((s) => s.id === scenarioId);

  if (!scenario) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ name: "troubleshooting" })}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          All Scenarios
        </Button>
        <div className="text-center py-12 text-muted-foreground">
          Scenario not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ name: "troubleshooting" })}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        All Scenarios
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--aws-rose)", opacity: 0.12 }}
        >
          <Stethoscope
            className="w-7 h-7"
            style={{ color: "var(--aws-rose)" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {scenario.category}
            </Badge>
            <Badge className={cn("capitalize", levelColors[scenario.level])}>
              {scenario.level}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {scenario.estimatedTime} min
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              {scenario.steps.length} steps
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {scenario.title}
          </h1>
        </div>
      </div>

      {/* Scenario description — highlighted */}
      <Card className="border-aws-amber/40 bg-aws-amber/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-aws-amber" />
            The Situation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{scenario.scenario}</p>
        </CardContent>
      </Card>

      {/* Steps timeline */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-aws-orange" />
          <h2 className="text-xl font-bold tracking-tight">
            Diagnostic Walkthrough
          </h2>
        </div>

        <div className="space-y-4">
          {scenario.steps.map((step, idx) => {
            const cfg = stepTypeConfig[step.type];
            const StepIcon = cfg.icon;
            return (
              <div
                key={idx}
                className="relative pl-12 border-l-2 last:border-l-transparent"
                style={{ borderColor: `var(--${cssColorFor(cfg.color)})` }}
              >
                {/* Step icon bubble */}
                <div
                  className={cn(
                    "absolute -left-[18px] top-0 w-9 h-9 rounded-full flex items-center justify-center border-2 bg-card",
                    cfg.color,
                  )}
                  style={{ borderColor: `var(--${cssColorFor(cfg.color)})` }}
                >
                  <StepIcon className="w-4 h-4" />
                </div>

                <Card className={cn("border-l-4", cfg.border)} style={{ borderLeftColor: `var(--${cssColorFor(cfg.color)})` }}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={cn(
                          "text-[10px] uppercase tracking-wide",
                          cfg.bg,
                          cfg.color,
                        )}
                      >
                        <StepIcon className="w-3 h-3 mr-1" />
                        {cfg.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        Step {idx + 1}
                      </span>
                    </div>
                    <CardTitle className="text-base mt-1">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {step.description}
                    </p>

                    {step.command && (
                      <SyntaxHighlighter
                        code={step.command}
                        language="bash"
                        caption="CLI command"
                      />
                    )}

                    {step.output && (
                      <div className="my-4">
                        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-50">
                          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-aws-cyan" />
                              <span className="text-xs font-mono text-muted-foreground uppercase">
                                Output
                              </span>
                            </div>
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-aws-rose/70" />
                              <div className="w-2.5 h-2.5 rounded-full bg-aws-amber/70" />
                              <div className="w-2.5 h-2.5 rounded-full bg-aws-emerald/70" />
                            </div>
                          </div>
                          <pre className="code-block p-4 overflow-x-auto">
                            <code className="text-sm text-aws-emerald">
                              {step.output}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Learnings */}
      <Card className="border-aws-emerald/40 bg-aws-emerald/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-aws-emerald" />
            Key Learnings
          </CardTitle>
          <CardDescription>
            Take these principles with you to the next incident.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {scenario.keyLearnings.map((k, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-aws-emerald mt-0.5 shrink-0" />
                <span className="text-sm">{k}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// Map a tailwind text color class like "text-aws-amber" → css var name "aws-amber"
function cssColorFor(tailwindColorClass: string): string {
  const m = tailwindColorClass.match(/text-([a-z-]+)/);
  return m ? m[1] : "aws-orange";
}
