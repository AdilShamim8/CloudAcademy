"use client";

import * as React from "react";
import {
  Cloud, ShieldCheck, Server, Database, Network, Zap, Container,
  GitBranch, BrainCircuit, Terminal, Layers, ArrowRight, BookOpen,
  Trophy, Wrench, Award, Sparkles, TrendingUp, Flame, Target,
  CheckCircle2, Circle, Clock, ChevronRight, MonitorPlay,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { modules } from "@/lib/curriculum";
import { quizzes } from "@/lib/learning-content";

const moduleIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Cloud, Layers, ShieldCheck, Server, Database, Network, Zap, Container,
  GitBranch, BrainCircuit, Terminal,
};

const levelColors: Record<string, string> = {
  beginner: "bg-level-beginner/20 text-level-beginner",
  intermediate: "bg-level-intermediate/20 text-level-intermediate",
  advanced: "bg-level-advanced/20 text-level-advanced",
  expert: "bg-level-expert/20 text-level-expert",
};

export function HomePage() {
  const navigate = useAppStore((s) => s.navigate);
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = useAppStore((s) => Object.keys(s.completedLessons).length);
  const totalXP = useAppStore((s) => s.totalXP);
  const streakDays = useAppStore((s) => s.streakDays);
  const achievements = useAppStore((s) => s.achievements);
  const completedProjects = useAppStore((s) => Object.keys(s.completedProjects).length);

  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const skillLevel =
    totalXP < 50 ? "Beginner" :
    totalXP < 200 ? "Intermediate" :
    totalXP < 500 ? "Advanced" :
    "Expert";

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-mesh border border-border">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" style={{
          backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <Badge className="mb-4 bg-aws-orange/15 text-aws-orange border-aws-orange/30 hover:bg-aws-orange/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Beginner to Expert AWS Journey
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 max-w-3xl">
            Master <span className="bg-gradient-to-r from-aws-orange via-aws-amber to-aws-rose bg-clip-text text-transparent">AWS Cloud</span> from absolute zero to expert architect
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            A complete, interactive learning platform covering 14 AWS modules, hands-on projects, real-world troubleshooting scenarios, simulators, and certification prep — designed for AI/ML developers and DevOps engineers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate({ name: "learning-path" })}>
              <BookOpen className="w-4 h-4 mr-2" />
              Start Learning Path
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ name: "dashboard" })}>
              <Trophy className="w-4 h-4 mr-2" />
              View My Progress
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="rounded-xl bg-card/50 backdrop-blur p-4 border border-border">
              <div className="text-3xl font-bold">{modules.length}</div>
              <div className="text-xs text-muted-foreground mt-1">In-Depth Modules</div>
            </div>
            <div className="rounded-xl bg-card/50 backdrop-blur p-4 border border-border">
              <div className="text-3xl font-bold">{totalLessons}+</div>
              <div className="text-xs text-muted-foreground mt-1">Interactive Lessons</div>
            </div>
            <div className="rounded-xl bg-card/50 backdrop-blur p-4 border border-border">
              <div className="text-3xl font-bold">10</div>
              <div className="text-xs text-muted-foreground mt-1">Hands-On Projects</div>
            </div>
            <div className="rounded-xl bg-card/50 backdrop-blur p-4 border border-border">
              <div className="text-3xl font-bold">12+</div>
              <div className="text-xs text-muted-foreground mt-1">Quizzes & Scenarios</div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Summary */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Overall Progress</CardDescription>
              <Target className="w-4 h-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">{overallProgress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-2 mb-2" />
            <div className="text-xs text-muted-foreground">
              {completedLessons} / {totalLessons} lessons completed
            </div>
          </CardContent>
        </Card>

        <Card className="card-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Experience Points</CardDescription>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">{Math.round(totalXP)} XP</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={levelColors[skillLevel.toLowerCase()]}>
              {skillLevel} Level
            </Badge>
          </CardContent>
        </Card>

        <Card className="card-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Learning Streak</CardDescription>
              <Flame className={cn("w-4 h-4", streakDays > 0 ? "text-aws-orange" : "text-muted-foreground")} />
            </div>
            <CardTitle className="text-2xl">{streakDays} days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {streakDays > 0 ? "Keep it going!" : "Complete a lesson today"}
            </div>
          </CardContent>
        </Card>

        <Card className="card-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Achievements</CardDescription>
              <Award className="w-4 h-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">{achievements.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {completedProjects} projects completed
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Learning Path Quick Start */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Continue Your Journey</h2>
            <p className="text-sm text-muted-foreground">Pick up where you left off or start something new</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ name: "learning-path" })}>
            View full path
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.slice(0, 6).map((mod) => {
            const Icon = moduleIconMap[mod.icon] || Cloud;
            const lessonsCompleted = mod.lessons.filter((l) =>
              useAppStore.getState().completedLessons[`${mod.id}:${l.id}`]
            ).length;
            const progress = mod.lessons.length > 0 ? Math.round((lessonsCompleted / mod.lessons.length) * 100) : 0;

            return (
              <Card
                key={mod.id}
                className="card-lift cursor-pointer group"
                onClick={() => navigate({ name: "module", moduleId: mod.id })}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className={cn("w-10 h-10 rounded-lg flex items-center justify-center")}
                      style={{ backgroundColor: `var(--${mod.color})`, opacity: 0.15 }}
                    >
                      <Icon className="w-5 h-5" style={{ color: `var(--${mod.color})` }} />
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {mod.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3 group-hover:text-aws-orange transition-colors">
                    {mod.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{mod.short}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{lessonsCompleted} / {mod.lessons.length} lessons</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Interactive Learning Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={Terminal}
            color="aws-orange"
            title="CLI Playground"
            description="Practice AWS CLI commands in a safe, simulated terminal environment."
            onClick={() => navigate({ name: "cli-playground" })}
          />
          <FeatureCard
            icon={ShieldCheck}
            color="aws-rose"
            title="IAM Simulator"
            description="Build and test IAM policies interactively. Diagnose AccessDenied scenarios."
            onClick={() => navigate({ name: "iam-simulator" })}
          />
          <FeatureCard
            icon={Container}
            color="aws-violet"
            title="Architecture Builder"
            description="Drag-and-drop AWS components to build architectures and get instant feedback."
            onClick={() => navigate({ name: "architecture-builder" })}
          />
          <FeatureCard
            icon={MonitorPlay}
            color="aws-cyan"
            title="AWS Console Clone"
            description="A full simulated AWS Management Console with end-to-end launch wizards for EC2, S3, IAM, VPC, Lambda, and CloudWatch."
            onClick={() => navigate({ name: "aws-console" })}
          />
          <FeatureCard
            icon={Wrench}
            color="aws-emerald"
            title="Troubleshooting"
            description="Step through real AWS incidents: EC2 unreachable, AccessDenied, Lambda timeouts, and more."
            onClick={() => navigate({ name: "troubleshooting" })}
          />
        </div>
      </section>

      {/* Certification Tracks */}
      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-aws-amber" />
                  Certification Tracks
                </CardTitle>
                <CardDescription>Structured preparation for AWS certification exams</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate({ name: "certification" })}>
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {[
              { name: "Cloud Practitioner", code: "CLF-C02", level: "beginner" },
              { name: "Solutions Architect", code: "SAA-C03", level: "intermediate" },
              { name: "Solutions Architect Pro", code: "SAP-C02", level: "expert" },
              { name: "DevOps Engineer Pro", code: "DOP-C02", level: "expert" },
            ].map((cert) => (
              <button
                key={cert.code}
                onClick={() => navigate({ name: "certification" })}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-aws-orange/50 hover:bg-accent transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-sm">{cert.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{cert.code}</div>
                </div>
                <Badge className={cn("text-xs capitalize", levelColors[cert.level])}>
                  {cert.level}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* What you'll learn */}
      <section>
        <Card className="border-2 border-dashed border-border">
          <CardHeader>
            <CardTitle className="text-xl">What You'll Master</CardTitle>
            <CardDescription>From absolute beginner to senior cloud architect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[
                "Cloud computing fundamentals & shared responsibility model",
                "IAM deep dive: users, roles, policies, cross-account access",
                "EC2, Auto Scaling, and multi-AZ high availability",
                "S3 storage classes, lifecycle policies, encryption",
                "RDS managed databases, Multi-AZ, read replicas",
                "AWS CLI mastery for scripting and automation",
                "Lambda & API Gateway serverless architectures",
                "VPC networking: subnets, routing, NAT, peering",
                "Security: least privilege, encryption, monitoring",
                "Containers: Docker, ECS, Fargate, ECR",
                "DevOps: CI/CD, IaC, deployment strategies",
                "AI/ML infrastructure: data lakes, model serving",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-level-beginner mt-0.5 shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  color,
  title,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Card className="card-lift cursor-pointer group" onClick={onClick}>
      <CardHeader>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `var(--${color})`, opacity: 0.15 }}
        >
          <Icon className="w-5 h-5" style={{ color: `var(--${color})` }} />
        </div>
        <CardTitle className="text-base mt-3 group-hover:text-aws-orange transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
