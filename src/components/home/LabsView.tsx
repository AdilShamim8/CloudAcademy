"use client";

import * as React from "react";
import {
  Terminal, ShieldCheck, Container, Wrench, ArrowRight, FlaskConical,
  Play, AlertTriangle, Lock, Zap, MonitorPlay,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface Lab {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  route: ReturnType<typeof useAppStore.getState>["route"];
  category: "simulator" | "playground" | "challenge";
  estimatedTime: string;
  features: string[];
}

const labs: Lab[] = [
  {
    id: "cli-playground",
    title: "AWS CLI Playground",
    description: "Practice AWS CLI commands in a safe, simulated terminal. Supports aws sts, s3, ec2, iam commands and more.",
    icon: Terminal,
    color: "aws-orange",
    route: { name: "cli-playground" },
    category: "simulator",
    estimatedTime: "Open-ended",
    features: [
      "Simulated AWS CLI environment — no AWS account needed",
      "Practice common commands: s3 ls, ec2 describe-instances, iam list-users",
      "Command history with arrow keys",
      "Click-to-run common commands sidebar",
    ],
  },
  {
    id: "iam-simulator",
    title: "IAM Policy Simulator",
    description: "Write and test IAM policies interactively. See how policy evaluation works, debug AccessDenied scenarios.",
    icon: ShieldCheck,
    color: "aws-rose",
    route: { name: "iam-simulator" },
    category: "simulator",
    estimatedTime: "15-30 min",
    features: [
      "JSON policy editor with live validation",
      "5 pre-built test scenarios per policy",
      "Visual pass/fail indicators",
      "Explains the evaluation logic step-by-step",
    ],
  },
  {
    id: "architecture-builder",
    title: "Architecture Builder",
    description: "Drag-and-drop AWS components onto a canvas, connect them, and get instant feedback on your architecture.",
    icon: Container,
    color: "aws-violet",
    route: { name: "architecture-builder" },
    category: "playground",
    estimatedTime: "Open-ended",
    features: [
      "24 AWS components to drag onto the canvas",
      "Connect components to build architectures",
      "Pre-built templates: 3-tier web app, serverless API, static site with CDN",
      "Architecture analysis: security, HA, cost, best practices",
    ],
  },
  {
    id: "aws-console",
    title: "AWS Console Clone",
    description: "A full simulated AWS Management Console with end-to-end wizards: launch EC2, create S3 buckets, build VPCs, deploy Lambda, and more — step by step, just like the real thing.",
    icon: MonitorPlay,
    color: "aws-cyan",
    route: { name: "aws-console" },
    category: "simulator",
    estimatedTime: "30-60 min per service",
    features: [
      "Realistic AWS Console UI — not a screenshot, a working clone",
      "End-to-end EC2 launch wizard: AMI → instance type → VPC → SG → user data → launch",
      "S3 console: create buckets, upload objects, set permissions, view lifecycle",
      "VPC visual builder: drag subnets, route tables, gateways",
      "Lambda console: create functions, set triggers, deploy code",
      "IAM console: create users, roles, policies with live validation",
      "CloudWatch dashboard: real-time metric visualization",
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting Academy",
    description: "Step through realistic AWS incidents: EC2 unreachable, AccessDenied, Lambda timeouts, ECS crashes, and more.",
    icon: Wrench,
    color: "aws-amber",
    route: { name: "troubleshooting" },
    category: "challenge",
    estimatedTime: "20-30 min per scenario",
    features: [
      "6 real-world incident scenarios",
      "Symptom → Investigation → Root Cause → Fix → Prevention",
      "Includes CLI commands and outputs",
      "Key learnings summarized at the end of each scenario",
    ],
  },
];

export function LabsView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aws-violet to-aws-rose flex items-center justify-center text-white shadow-lg">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Labs & Interactive Tools</h1>
            <p className="text-muted-foreground mt-1">
              Practice AWS concepts in safe, simulated environments. No real AWS account required.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <Card className="border-aws-emerald/30 bg-aws-emerald/5">
        <CardContent className="flex items-start gap-3 py-4">
          <Lock className="w-5 h-5 text-aws-emerald shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">Safe Simulation Environment</div>
            <div className="text-sm text-muted-foreground">
              All labs on this page run entirely in your browser. Nothing is sent to a real AWS account.
              These tools simulate AWS behavior for educational purposes only — they cannot change your real infrastructure.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Labs grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {labs.map((lab) => {
          const Icon = lab.icon;
          const categoryBadge = {
            simulator: { label: "Simulator", color: "bg-aws-cyan/20 text-aws-cyan" },
            playground: { label: "Playground", color: "bg-aws-violet/20 text-aws-violet" },
            challenge: { label: "Challenge", color: "bg-aws-amber/20 text-aws-amber" },
          }[lab.category];

          return (
            <Card
              key={lab.id}
              className="card-lift cursor-pointer group overflow-hidden"
              onClick={() => navigate(lab.route)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `var(--${lab.color})`, opacity: 0.15 }}
                  >
                    <Icon className="w-6 h-6" style={{ color: `var(--${lab.color})` }} />
                  </div>
                  <Badge className={cn("text-xs", categoryBadge.color)}>
                    {categoryBadge.label}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-3 group-hover:text-aws-orange transition-colors">
                  {lab.title}
                </CardTitle>
                <CardDescription>{lab.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 mb-4">
                  {lab.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-aws-orange mt-1.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{lab.estimatedTime}</span>
                  <Button size="sm">
                    Open
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quiz section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-aws-amber" />
                Test Your Knowledge
              </CardTitle>
              <CardDescription>Quizzes to validate your understanding</CardDescription>
            </div>
            <Button onClick={() => navigate({ name: "quizzes" })}>
              Go to Quizzes
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              "Cloud Fundamentals Quiz (6 questions)",
              "IAM Deep Dive Quiz (6 questions)",
              "Amazon EC2 Quiz (6 questions)",
              "VPC and Networking Quiz (6 questions)",
              "Lambda and API Gateway Quiz (6 questions)",
              "Architecture Decision-Making Quiz (6 questions)",
            ].map((quiz, i) => (
              <button
                key={i}
                onClick={() => navigate({ name: "quizzes" })}
                className="flex items-center gap-2 p-3 rounded-md border border-border hover:border-aws-amber/50 hover:bg-accent transition-colors text-left text-sm"
              >
                <Play className="w-3 h-3 text-aws-amber shrink-0" />
                <span className="flex-1">{quiz}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost warning for real AWS work */}
      <Card className="border-aws-orange/30 bg-aws-orange/5">
        <CardContent className="flex items-start gap-3 py-4">
          <AlertTriangle className="w-5 h-5 text-aws-orange shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">Ready for the real thing?</div>
            <div className="text-sm text-muted-foreground mb-2">
              When you start working with a real AWS account, always:
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Set up a budget alert on day one ($5/month threshold)</li>
              <li>• Use the free tier responsibly — it expires after 12 months</li>
              <li>• Always clean up resources after each lab</li>
              <li>• Never commit access keys to git</li>
              <li>• Use IAM roles for EC2/Lambda instead of access keys</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
