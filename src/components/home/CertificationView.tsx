"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  ChevronDown,
  Clock,
  Target,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Trophy,
  GraduationCap,
  Brain,
  ExternalLink,
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  certificationTracks,
  type CertificationTrack,
} from "@/lib/learning-content";
import { modules } from "@/lib/curriculum";

const levelColors: Record<string, string> = {
  beginner:
    "bg-level-beginner/20 text-level-beginner border-level-beginner/30",
  intermediate:
    "bg-level-intermediate/20 text-level-intermediate border-level-intermediate/30",
  advanced: "bg-level-advanced/20 text-level-advanced border-level-advanced/30",
  expert: "bg-level-expert/20 text-level-expert border-level-expert/30",
};

const certAccent: Record<string, string> = {
  beginner: "aws-emerald",
  intermediate: "aws-cyan",
  advanced: "aws-violet",
  expert: "aws-rose",
};

const certPrereq: Record<string, string> = {
  "cloud-practitioner": "None — open to all",
  "solutions-architect-associate": "Recommended: Cloud Practitioner",
  "solutions-architect-professional": "Required: SAA-C03 (Associate)",
  "devops-engineer-professional":
    "Recommended: SAA-C03 or Developer Associate",
};

const certBestFor: Record<string, string> = {
  "cloud-practitioner":
    "Non-technical roles, executives, and anyone new to cloud",
  "solutions-architect-associate":
    "Engineers, architects, and DevOps who design AWS solutions",
  "solutions-architect-professional":
    "Senior architects handling multi-account, multi-region, hybrid",
  "devops-engineer-professional":
    "DevOps engineers owning CI/CD, IaC, and observability",
};

export function CertificationView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="space-y-8">
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
              style={{ backgroundColor: "var(--aws-amber)", opacity: 0.12 }}
            >
              <Award
                className="w-7 h-7"
                style={{ color: "var(--aws-amber)" }}
              />
            </div>
            <div>
              <Badge className="mb-2 bg-aws-amber/15 text-aws-amber border-aws-amber/30 hover:bg-aws-amber/20">
                <Trophy className="w-3 h-3 mr-1" />
                Industry-Recognized Credentials
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Certification Preparation
              </h1>
              <p className="text-muted-foreground mt-1 max-w-3xl">
                AWS certifications validate your cloud expertise and unlock
                career opportunities. Our curriculum is structured around these
                tracks — when you complete the recommended modules, you&apos;ll
                be ready to take the real exam.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important disclaimer */}
      <Alert className="border-aws-violet/40 bg-aws-violet/5">
        <Brain className="w-4 h-4 text-aws-violet" />
        <AlertTitle className="text-aws-violet">
          We teach understanding, not memorization
        </AlertTitle>
        <AlertDescription className="text-sm">
          Certification is a <strong>byproduct</strong> of true knowledge — not
          the goal. This platform teaches you to{" "}
          <em>think like a cloud architect</em>, reason about trade-offs, and
          build real systems. When you deeply understand the material, the exam
          becomes a formality. Don&apos;t optimize for the test; optimize for
          mastery and the cert will follow.
        </AlertDescription>
      </Alert>

      {/* Certification tracks */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Certification Tracks
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {certificationTracks.map((track) => (
            <AccordionItem
              key={track.id}
              value={track.id}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              <CertTrackHeader track={track} />
              <AccordionContent>
                <CertTrackDetail track={track} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Comparison table */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-aws-cyan" />
              Side-by-Side Comparison
            </CardTitle>
            <CardDescription>
              Quick reference for picking the right certification for your goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certification</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Prerequisites</TableHead>
                  <TableHead>Best for</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificationTracks.map((track) => (
                  <TableRow key={track.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{track.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {track.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "capitalize",
                          levelColors[track.level],
                        )}
                      >
                        {track.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {track.duration}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {certPrereq[track.id] || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {certBestFor[track.id] || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Study tips callout */}
      <Alert className="border-aws-amber/40 bg-aws-amber/5">
        <Lightbulb className="w-4 h-4 text-aws-amber" />
        <AlertTitle className="text-aws-amber">How to use this section</AlertTitle>
        <AlertDescription className="text-sm">
          Pick the certification that matches your career stage. Click each
          track above to see its topic breakdown, recommended modules, and study
          tips. Then work through the recommended modules in order — when you
          can pass our quizzes comfortably, you&apos;re ready for the real exam.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CertTrackHeader({ track }: { track: CertificationTrack }) {
  const accent = certAccent[track.level] || "aws-orange";
  return (
    <AccordionTrigger className="hover:no-underline px-4 py-4">
      <div className="flex items-center gap-4 w-full text-left">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `var(--${accent})`, opacity: 0.15 }}
        >
          <Award
            className="w-6 h-6"
            style={{ color: `var(--${accent})` }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-base">{track.name}</span>
            <Badge
              variant="outline"
              className="text-xs font-mono"
            >
              {track.code}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {track.description}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
          <Badge className={cn("capitalize", levelColors[track.level])}>
            {track.level}
          </Badge>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {track.duration}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform [[data-state=open]>&]:rotate-180" />
      </div>
    </AccordionTrigger>
  );
}

function CertTrackDetail({ track }: { track: CertificationTrack }) {
  const navigate = useAppStore((s) => s.navigate);
  const firstModule = track.recommendedModules[0];
  const totalWeight = track.topics.reduce((s, t) => s + t.weight, 0);
  const isAllModules = track.recommendedModules.includes("all");

  return (
    <div className="px-4 pb-4 pt-2 space-y-5">
      {/* Topic breakdown */}
      <div>
        <div className="text-sm font-medium mb-3 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-aws-orange" />
          Topic Breakdown (by exam weight)
        </div>
        <div className="space-y-3">
          {track.topics.map((topic, idx) => {
            const pct = Math.round((topic.weight / totalWeight) * 100);
            const topicModule = modules.find((m) => m.id === topic.moduleId);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      topicModule &&
                      navigate({ name: "module", moduleId: topicModule.id })
                    }
                    className="text-sm hover:text-aws-orange hover:underline text-left flex items-center gap-1.5"
                    disabled={!topicModule}
                  >
                    {topic.name}
                    {topicModule && (
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    )}
                  </button>
                  <Badge variant="outline" className="text-xs">
                    {topic.weight}%
                  </Badge>
                </div>
                <Progress value={pct} className="h-2" />
                {topicModule && (
                  <div className="text-xs text-muted-foreground pl-1">
                    Covered in: {topicModule.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended modules */}
      <div>
        <div className="text-sm font-medium mb-3 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-aws-cyan" />
          Recommended Modules
        </div>
        {isAllModules ? (
          <Alert className="border-aws-violet/30 bg-aws-violet/5 py-2">
            <Sparkles className="w-3.5 h-3.5 text-aws-violet" />
            <AlertDescription className="text-xs">
              This is a senior-level certification — complete{" "}
              <strong>all modules</strong> in the curriculum, in order.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-wrap gap-2">
            {track.recommendedModules.map((moduleId) => {
              const recModule = modules.find((m) => m.id === moduleId);
              if (!recModule) return null;
              return (
                <button
                  key={moduleId}
                  onClick={() => navigate({ name: "module", moduleId })}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:border-aws-cyan/50 hover:bg-accent transition-colors text-xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-aws-emerald" />
                  <span>{recModule.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Study tips */}
      <div>
        <div className="text-sm font-medium mb-3 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-aws-amber" />
          Study Tips
        </div>
        <ul className="space-y-2">
          {track.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="w-5 h-5 rounded-full bg-aws-amber/20 text-aws-amber text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* CTA */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-muted-foreground">
          Ready to start preparing?
        </div>
        <Button
          size="sm"
          onClick={() => {
            if (firstModule && firstModule !== "all") {
              navigate({ name: "module", moduleId: firstModule });
            } else {
              navigate({ name: "learning-path" });
            }
          }}
        >
          <BookOpen className="w-4 h-4 mr-1" />
          Start preparing
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
