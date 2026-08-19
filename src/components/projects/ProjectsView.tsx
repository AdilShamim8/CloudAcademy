"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Target,
  Layers,
  ShieldAlert,
  Trash2,
  Rocket,
  AlertTriangle,
  Wrench,
  Lightbulb,
  BookOpen,
  Cloud,
  Network,
  Container,
  Server,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { projects, type Project } from "@/lib/learning-content";
import { ArchitectureDiagram } from "@/components/interactive/ArchitectureDiagram";
import { SyntaxHighlighter } from "@/components/interactive/SyntaxHighlighter";

const levelColors: Record<string, string> = {
  beginner:
    "bg-level-beginner/20 text-level-beginner border-level-beginner/30",
  intermediate:
    "bg-level-intermediate/20 text-level-intermediate border-level-intermediate/30",
  advanced: "bg-level-advanced/20 text-level-advanced border-level-advanced/30",
  expert: "bg-level-expert/20 text-level-expert border-level-expert/30",
};

const projectIconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  "project-1-static-website": Cloud,
  "project-2-ec2-webserver": Server,
  "project-3-serverless-api": Rocket,
  "project-4-ec2-autoscaling-rds": Layers,
  "project-5-containerized": Container,
};

// ---------------------------------------------------------------------------
// ProjectsView — list of all projects
// ---------------------------------------------------------------------------

export function ProjectsView() {
  const navigate = useAppStore((s) => s.navigate);
  const completedProjects = useAppStore((s) => s.completedProjects);

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
        <h1 className="text-3xl font-bold tracking-tight">Hands-On Projects</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Apply what you&apos;ve learned to real AWS architectures. Each project
          includes step-by-step CLI commands, an architecture diagram,
          troubleshooting tips, security considerations, and cleanup instructions
          so you never leave resources running.
        </p>
      </div>

      {/* Stats overview */}
      <Card className="bg-gradient-mesh">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBlock
              value={String(projects.length)}
              label="Total Projects"
              icon={Rocket}
              color="aws-orange"
            />
            <StatBlock
              value={`${projects.reduce(
                (s, p) => s + p.estimatedHours,
                0,
              )}h`}
              label="Total Build Time"
              icon={Clock}
              color="aws-cyan"
            />
            <StatBlock
              value={String(
                Object.keys(completedProjects).filter(
                  (k) => completedProjects[k],
                ).length,
              )}
              label="Completed"
              icon={CheckCircle2}
              color="aws-emerald"
            />
            <StatBlock
              value={`${projects.reduce(
                (s, p) => s + p.steps.length,
                0,
              )}`}
              label="Guided Steps"
              icon={Target}
              color="aws-violet"
            />
          </div>
        </CardContent>
      </Card>

      {/* Project cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project, idx) => {
          const Icon = projectIconMap[project.id] || Cloud;
          const isComplete = !!completedProjects[project.id];
          return (
            <Card
              key={project.id}
              className="card-lift cursor-pointer group flex flex-col"
              onClick={() =>
                navigate({ name: "project", projectId: project.id })
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--aws-orange)", opacity: 0.12 }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: "var(--aws-orange)" }}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      Project {String(idx + 1).padStart(2, "0")}
                    </Badge>
                    {isComplete && (
                      <Badge className="bg-aws-emerald/20 text-aws-emerald">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-aws-orange transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={cn("capitalize", levelColors[project.level])}>
                    {project.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {project.estimatedHours}h
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {project.cost}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Layers className="w-3 h-3 mr-1" />
                    {project.steps.length} steps
                  </Badge>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {project.objectives.length} objectives ·{" "}
                    {project.troubleshooting.length} troubleshooting tips
                  </span>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ name: "project", projectId: project.id });
                    }}
                  >
                    Start Project
                    <ArrowRight className="w-4 h-4 ml-1" />
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

function StatBlock({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon
          className="w-4 h-4"
          style={{ color: `var(--${color})` }}
        />
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProjectDetail — full project walkthrough
// ---------------------------------------------------------------------------

export function ProjectDetail({ projectId }: { projectId: string }) {
  const navigate = useAppStore((s) => s.navigate);
  const markProjectComplete = useAppStore((s) => s.markProjectComplete);
  const unlockAchievement = useAppStore((s) => s.unlockAchievement);
  const completedProjects = useAppStore((s) => s.completedProjects);

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ name: "projects" })}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          All Projects
        </Button>
        <div className="text-center py-12 text-muted-foreground">
          Project not found.
        </div>
      </div>
    );
  }

  const isComplete = !!completedProjects[projectId];
  const Icon = projectIconMap[project.id] || Cloud;

  const onComplete = () => {
    markProjectComplete(projectId, 50);
    unlockAchievement(`project-complete-${projectId}`);
    // First project achievement
    if (Object.keys(completedProjects).length === 0) {
      unlockAchievement("first-project");
    }
  };

  return (
    <div className="space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ name: "projects" })}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        All Projects
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--aws-orange)", opacity: 0.12 }}
        >
          <Icon
            className="w-7 h-7"
            style={{ color: "var(--aws-orange)" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className={cn("capitalize", levelColors[project.level])}>
              {project.level}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {project.estimatedHours} hours
            </Badge>
            <Badge variant="outline" className="text-xs">
              <DollarSign className="w-3 h-3 mr-1" />
              {project.cost}
            </Badge>
            {isComplete && (
              <Badge className="bg-aws-emerald/20 text-aws-emerald">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {project.title}
          </h1>
          <p className="text-muted-foreground mt-2">{project.description}</p>
        </div>
      </div>

      {/* Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-4 h-4 text-aws-orange" />
            Learning Objectives
          </CardTitle>
          <CardDescription>
            By the end of this project, you will be able to:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {project.objectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-aws-emerald mt-0.5 shrink-0" />
                <span className="text-sm">{obj}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="w-4 h-4 text-aws-cyan" />
            Architecture Diagram
          </CardTitle>
          <CardDescription>
            The AWS services and their relationships for this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArchitectureDiagram
            nodes={project.architecture.nodes}
            edges={project.architecture.edges}
          />
        </CardContent>
      </Card>

      {/* Step-by-step guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-aws-violet" />
            Step-by-Step Guide
          </CardTitle>
          <CardDescription>
            Follow these steps in order. Commands are ready to copy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {project.steps.map((step, idx) => (
            <div
              key={idx}
              className="relative pl-10 border-l-2 border-border last:border-l-transparent"
            >
              <div className="absolute -left-[15px] top-0 w-7 h-7 rounded-full bg-aws-orange/20 border-2 border-aws-orange/40 flex items-center justify-center text-xs font-bold text-aws-orange">
                {idx + 1}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-base">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {step.command && (
                  <SyntaxHighlighter
                    code={step.command}
                    language="bash"
                    caption="Run this in your AWS CLI"
                  />
                )}
                {step.cliEquivalent && (
                  <div className="rounded-md border border-dashed border-border bg-muted/30 p-3 text-xs">
                    <div className="text-muted-foreground mb-1 font-medium">
                      Console equivalent:
                    </div>
                    <div className="font-mono">{step.cliEquivalent}</div>
                  </div>
                )}
                {step.warning && (
                  <Alert className="border-aws-amber/40 bg-aws-amber/10">
                    <AlertTriangle className="w-4 h-4 text-aws-amber" />
                    <AlertTitle className="text-aws-amber">Warning</AlertTitle>
                    <AlertDescription>{step.warning}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="w-4 h-4 text-aws-rose" />
            Troubleshooting
          </CardTitle>
          <CardDescription>
            Common issues you may hit and how to fix them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {project.troubleshooting.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-aws-amber shrink-0" />
                    <span className="text-sm">{item.problem}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-muted-foreground pl-6">
                    {item.solution}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-aws-rose" />
            Security Considerations
          </CardTitle>
          <CardDescription>
            Apply least privilege and defense-in-depth principles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {project.security.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-aws-rose mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Cleanup */}
      <Card className="border-aws-rose/30 bg-aws-rose/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-aws-rose">
            <Trash2 className="w-4 h-4" />
            Cleanup Instructions
          </CardTitle>
          <CardDescription className="text-aws-rose/80">
            Always clean up resources to avoid ongoing AWS charges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="w-4 h-4" />
            <AlertTitle>Cost Warning</AlertTitle>
            <AlertDescription>
              Resources left running will continue to bill your account until
              deleted. Run cleanup immediately after finishing the project.
            </AlertDescription>
          </Alert>
          <ul className="space-y-2">
            {project.cleanup.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Trash2 className="w-4 h-4 text-aws-rose mt-0.5 shrink-0" />
                <span className="text-sm font-mono">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Extensions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-aws-amber" />
            Extension Challenges
          </CardTitle>
          <CardDescription>
            Level up this project with these advanced challenges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {project.extensions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Circle className="w-4 h-4 text-aws-amber mt-0.5 shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Complete button */}
      <Card
        className={cn(
          "border-2",
          isComplete
            ? "border-aws-emerald bg-aws-emerald/5"
            : "border-dashed",
        )}
      >
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {isComplete ? (
              <CheckCircle2 className="w-6 h-6 text-aws-emerald" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
            )}
            <div>
              <div className="font-medium">
                {isComplete ? "Project Complete!" : "Mark project as complete"}
              </div>
              <div className="text-xs text-muted-foreground">
                {isComplete
                  ? "+50 XP earned"
                  : "Earn 50 XP and unlock the project achievement"}
              </div>
            </div>
          </div>
          {!isComplete && (
            <Button onClick={onComplete}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Mark Complete
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
