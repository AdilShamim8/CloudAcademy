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
    <div className="space-y-10 fade-in-up">
      {/* Hero — premium with animated gradient orbs */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-mesh">
        {/* Animated gradient orbs for premium depth */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--aws-orange), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--aws-violet), transparent 70%)" }}
        />
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }} />
        <div className="relative px-6 py-12 md:px-12 md:py-20">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-aws-orange/30 bg-aws-orange/10 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-aws-orange" />
            <span className="text-xs font-medium text-aws-orange tracking-wide uppercase">
              Beginner to Expert AWS Journey
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 max-w-4xl leading-[1.1]">
            Master <span className="gradient-text-orange">AWS Cloud</span> from absolute zero to expert architect
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            A complete, interactive learning platform covering 14 AWS modules, 10 hands-on projects, real-world troubleshooting scenarios, simulators, and certification prep — designed for AI/ML developers and DevOps engineers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="glow-orange" onClick={() => navigate({ name: "learning-path" })}>
              <BookOpen className="w-4 h-4 mr-2" />
              Start Learning Path
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="backdrop-blur-sm" onClick={() => navigate({ name: "dashboard" })}>
              <Trophy className="w-4 h-4 mr-2" />
              View My Progress
            </Button>
          </div>

          {/* Premium stat bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14">
            <div className="rounded-xl bg-card/60 backdrop-blur-md p-5 border border-border hover:border-aws-orange/40 transition-colors group">
              <div className="text-4xl font-bold gradient-text-orange">{modules.length}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">In-Depth Modules</div>
            </div>
            <div className="rounded-xl bg-card/60 backdrop-blur-md p-5 border border-border hover:border-aws-orange/40 transition-colors">
              <div className="text-4xl font-bold gradient-text-orange">{totalLessons}+</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Interactive Lessons</div>
            </div>
            <div className="rounded-xl bg-card/60 backdrop-blur-md p-5 border border-border hover:border-aws-orange/40 transition-colors">
              <div className="text-4xl font-bold gradient-text-orange">10</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Hands-On Projects</div>
            </div>
            <div className="rounded-xl bg-card/60 backdrop-blur-md p-5 border border-border hover:border-aws-orange/40 transition-colors">
              <div className="text-4xl font-bold gradient-text-orange">12+</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Quizzes & Scenarios</div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Summary — premium cards with empty states */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-premium card-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Overall Progress</CardDescription>
              <Target className="w-4 h-4 text-aws-orange" />
            </div>
            <CardTitle className="text-3xl font-bold">
              {overallProgress === 0 ? (
                <span className="text-muted-foreground/60">—</span>
              ) : (
                <span>{overallProgress}%</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-1.5 mb-2" />
            <div className="text-xs text-muted-foreground">
              {completedLessons === 0 ? (
                <span className="text-aws-orange">Start your first lesson →</span>
              ) : (
                <span>{completedLessons} / {totalLessons} lessons completed</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium card-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Experience Points</CardDescription>
              <TrendingUp className="w-4 h-4 text-aws-orange" />
            </div>
            <CardTitle className="text-3xl font-bold">
              {totalXP === 0 ? (
                <span className="text-muted-foreground/60">0 XP</span>
              ) : (
                <span className="shimmer-text">{Math.round(totalXP)} XP</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={levelColors[skillLevel.toLowerCase()]}>
              {skillLevel} Level
            </Badge>
          </CardContent>
        </Card>

        <Card className="card-premium card-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Learning Streak</CardDescription>
              <Flame className={cn("w-4 h-4 transition-all", streakDays > 0 ? "text-aws-orange scale-110" : "text-muted-foreground")} />
            </div>
            <CardTitle className="text-3xl font-bold">
              {streakDays === 0 ? (
                <span className="text-muted-foreground/60">—</span>
              ) : (
                <span>{streakDays} days</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {streakDays > 0 ? "Keep it going!" : "Complete a lesson today"}
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium card-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Achievements</CardDescription>
              <Award className="w-4 h-4 text-aws-orange" />
            </div>
            <CardTitle className="text-3xl font-bold">
              {achievements.length === 0 ? (
                <span className="text-muted-foreground/60">—</span>
              ) : (
                <span>{achievements.length}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {completedProjects} projects completed
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Learning Path Quick Start — premium module cards */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight section-header">Continue Your Journey</h2>
            <p className="text-sm text-muted-foreground mt-3">Pick up where you left off or start something new</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ name: "learning-path" })}>
            View full path
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.slice(0, 6).map((mod, idx) => {
            const Icon = moduleIconMap[mod.icon] || Cloud;
            const lessonsCompleted = mod.lessons.filter((l) =>
              useAppStore.getState().completedLessons[`${mod.id}:${l.id}`]
            ).length;
            const progress = mod.lessons.length > 0 ? Math.round((lessonsCompleted / mod.lessons.length) * 100) : 0;

            return (
              <Card
                key={mod.id}
                className={cn("card-premium card-lift cursor-pointer group fade-in-up", `stagger-${idx + 1}`)}
                onClick={() => navigate({ name: "module", moduleId: mod.id })}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `color-mix(in srgb, var(--${mod.color}) 15%, transparent)`,
                        border: `1px solid color-mix(in srgb, var(--${mod.color}) 30%, transparent)`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: `var(--${mod.color})` }} />
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs capitalize", levelColors[mod.level])}
                    >
                      {mod.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-4 group-hover:text-aws-orange transition-colors">
                    {mod.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{mod.short}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">{lessonsCompleted} / {mod.lessons.length} lessons</span>
                    <span className="font-semibold text-foreground">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, var(--${mod.color}), var(--aws-amber))`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 section-header">
          Interactive Learning Tools
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <Card className="border-2 border-dashed border-border bg-card/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-aws-orange" />
              What You&apos;ll Master
            </CardTitle>
            <CardDescription>From absolute beginner to senior cloud architect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
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
              ].map((item, idx) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 p-2 rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-aws-emerald/15 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-aws-emerald" />
                  </div>
                  <span className="text-sm text-foreground/90">{item}</span>
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
    <Card
      className="card-premium card-lift cursor-pointer group h-full"
      onClick={onClick}
    >
      <CardHeader>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `color-mix(in srgb, var(--${color}) 15%, transparent)`,
            border: `1px solid color-mix(in srgb, var(--${color}) 30%, transparent)`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: `var(--${color})` }} />
        </div>
        <CardTitle className="text-base mt-4 group-hover:text-aws-orange transition-colors flex items-center justify-between">
          {title}
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
