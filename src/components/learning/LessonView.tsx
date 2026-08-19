"use client";

import * as React from "react";
import {
  ArrowLeft, ArrowRight, Clock, Award, CheckCircle2, Circle,
  Lightbulb, AlertTriangle, Info, CheckCircle, XCircle, Zap, BookOpen,
  ChevronRight, Terminal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { modules, type Module, type Lesson, type LessonBlock } from "@/lib/curriculum";
import { ArchitectureDiagram } from "../interactive/ArchitectureDiagram";
import { SyntaxHighlighter } from "../interactive/SyntaxHighlighter";

const levelColors: Record<string, string> = {
  beginner: "bg-level-beginner/20 text-level-beginner border-level-beginner/30",
  intermediate: "bg-level-intermediate/20 text-level-intermediate border-level-intermediate/30",
  advanced: "bg-level-advanced/20 text-level-advanced border-level-advanced/30",
  expert: "bg-level-expert/20 text-level-expert border-level-expert/30",
};

const calloutConfig = {
  info: { icon: Info, color: "aws-cyan", bg: "bg-aws-cyan/10 border-aws-cyan/30" },
  tip: { icon: Lightbulb, color: "aws-amber", bg: "bg-aws-amber/10 border-aws-amber/30" },
  warning: { icon: AlertTriangle, color: "aws-orange", bg: "bg-aws-orange/10 border-aws-orange/30" },
  danger: { icon: XCircle, color: "aws-rose", bg: "bg-aws-rose/10 border-aws-rose/30" },
  success: { icon: CheckCircle, color: "aws-emerald", bg: "bg-aws-emerald/10 border-aws-emerald/30" },
};

export function LearningPathView() {
  const navigate = useAppStore((s) => s.navigate);
  const completedLessons = useAppStore((s) => s.completedLessons);

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate({ name: "home" })} className="mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Home
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Learning Path</h1>
        <p className="text-muted-foreground mt-2">
          A structured journey from cloud computing fundamentals to expert-level architecture.
          Each module builds on the previous one — work through them in order for the best results.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-mesh">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-3xl font-bold">{modules.length}</div>
              <div className="text-xs text-muted-foreground">Total Modules</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {modules.reduce((s, m) => s + m.lessons.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {Object.keys(completedLessons).length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {modules.reduce((s, m) => s + m.estimatedHours, 0)}h
              </div>
              <div className="text-xs text-muted-foreground">Estimated Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Path */}
      <div className="space-y-4">
        {modules.map((mod, idx) => (
          <ModulePathCard key={mod.id} module={mod} index={idx} />
        ))}
      </div>
    </div>
  );
}

function ModulePathCard({ module: mod, index }: { module: Module; index: number }) {
  const navigate = useAppStore((s) => s.navigate);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const lessonsCompleted = mod.lessons.filter((l) => completedLessons[`${mod.id}:${l.id}`]).length;
  const progress = mod.lessons.length > 0 ? Math.round((lessonsCompleted / mod.lessons.length) * 100) : 0;
  const isComplete = lessonsCompleted === mod.lessons.length;
  const [expanded, setExpanded] = React.useState(index === 0); // first module expanded by default

  const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    Cloud: CloudIcon, Layers: LayersIcon, ShieldCheck: ShieldCheckIcon,
    Server: ServerIcon, Database: DatabaseIcon, Network: NetworkIcon,
    Zap: ZapIcon, Container: ContainerIcon, GitBranch: GitBranchIcon,
    BrainCircuit: BrainCircuitIcon, Terminal: TerminalIcon,
  };
  const Icon = iconMap[mod.icon] || CloudIcon;

  return (
    <Card className={cn(
      "card-premium overflow-hidden fade-in-up transition-all",
      `stagger-${Math.min(index + 1, 6)}`,
      isComplete && "border-aws-emerald/40"
    )}>
      {/* Clickable header — toggles expansion */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left focus-ring"
        aria-expanded={expanded}
      >
        <CardHeader className="hover:bg-accent/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Module</div>
              <div className="text-2xl font-bold gradient-text-orange">{String(index + 1).padStart(2, "0")}</div>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform hover:scale-110"
              style={{
                backgroundColor: `color-mix(in srgb, var(--${mod.color}) 15%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--${mod.color}) 30%, transparent)`,
              }}
            >
              <Icon className="w-6 h-6" style={{ color: `var(--${mod.color})` }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <CardTitle className="text-xl">{mod.title}</CardTitle>
                <Badge className={cn("text-xs", levelColors[mod.level])}>
                  {mod.level}
                </Badge>
                {isComplete && (
                  <Badge className="bg-aws-emerald/20 text-aws-emerald border-aws-emerald/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{mod.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="w-3 h-3" />
                  {mod.lessons.length} lessons
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {mod.estimatedHours}h
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Award className="w-3 h-3" />
                  {mod.lessons.reduce((s, l) => s + l.xp, 0)} XP
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: isComplete
                          ? "linear-gradient(90deg, var(--aws-emerald), var(--aws-teal))"
                          : `linear-gradient(90deg, var(--${mod.color}), var(--aws-amber))`,
                      }}
                    />
                  </div>
                  <span className="font-semibold text-foreground tabular-nums">{progress}%</span>
                </div>
                <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded && "rotate-90")} />
              </div>
            </div>
          </div>
        </CardHeader>
      </button>

      {/* Collapsible lessons list */}
      {expanded && (
        <CardContent className="pt-0 border-t border-border bg-muted/20">
          <div className="space-y-1 mt-2">
            {mod.lessons.map((lesson, lidx) => {
              const isDone = completedLessons[`${mod.id}:${lesson.id}`];
              return (
                <button
                  key={lesson.id}
                  onClick={() => navigate({ name: "lesson", moduleId: mod.id, lessonId: lesson.id })}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-all text-left group border border-transparent hover:border-border"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                    isDone
                      ? "bg-aws-emerald/20 text-aws-emerald"
                      : "bg-muted text-muted-foreground group-hover:bg-aws-orange/15 group-hover:text-aws-orange"
                  )}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : lidx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-sm font-medium truncate transition-colors",
                      isDone ? "text-muted-foreground line-through" : "text-foreground group-hover:text-aws-orange"
                    )}>
                      {lesson.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{lesson.summary}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] capitalize hidden md:inline-flex", levelColors[lesson.level])}
                    >
                      {lesson.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground tabular-nums">{lesson.duration}m</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-aws-orange group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => navigate({ name: "module", moduleId: mod.id })}
              className="w-full flex items-center justify-center gap-2 p-3 mt-2 rounded-lg border border-dashed border-border hover:border-aws-orange/50 hover:bg-aws-orange/5 transition-all text-sm text-muted-foreground hover:text-aws-orange"
            >
              Open module overview
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function ModuleView({ moduleId }: { moduleId: string }) {
  const navigate = useAppStore((s) => s.navigate);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const mod = modules.find((m) => m.id === moduleId);

  if (!mod) {
    return <div className="text-center py-12">Module not found.</div>;
  }

  const moduleIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    Cloud: CloudIcon, Layers: LayersIcon, ShieldCheck: ShieldCheckIcon,
    Server: ServerIcon, Database: DatabaseIcon, Network: NetworkIcon,
    Zap: ZapIcon, Container: ContainerIcon, GitBranch: GitBranchIcon,
    BrainCircuit: BrainCircuitIcon, Terminal: TerminalIcon,
  };
  const ModuleIcon = moduleIconMap[mod.icon] || CloudIcon;

  const lessonsCompleted = mod.lessons.filter((l) => completedLessons[`${mod.id}:${l.id}`]).length;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate({ name: "learning-path" })}>
        <ArrowLeft className="w-4 h-4 mr-1" />
        All Modules
      </Button>

      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `var(--${mod.color})`, opacity: 0.15 }}
        >
          <ModuleIcon className="w-7 h-7" style={{ color: `var(--${mod.color})` }} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{mod.title}</h1>
            <Badge className={cn(levelColors[mod.level])}>{mod.level}</Badge>
          </div>
          <p className="text-muted-foreground">{mod.description}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mod.lessons.length}</div>
            <div className="text-xs text-muted-foreground">Lessons</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mod.estimatedHours}h</div>
            <div className="text-xs text-muted-foreground">Estimated time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{lessonsCompleted} / {mod.lessons.length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        {mod.lessons.map((lesson, idx) => (
          <LessonRow key={lesson.id} moduleId={mod.id} lesson={lesson} index={idx} />
        ))}
      </div>
    </div>
  );
}

function LessonRow({ moduleId, lesson, index }: { moduleId: string; lesson: Lesson; index: number }) {
  const navigate = useAppStore((s) => s.navigate);
  const isDone = useAppStore((s) => s.completedLessons[`${moduleId}:${lesson.id}`]);

  return (
    <Card
      className="card-lift cursor-pointer"
      onClick={() => navigate({ name: "lesson", moduleId, lessonId: lesson.id })}
    >
      <CardContent className="flex items-center gap-4 py-4">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
          isDone ? "bg-level-beginner/20 text-level-beginner" : "bg-muted text-muted-foreground")}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium truncate">{lesson.title}</h3>
            {isDone && <CheckCircle2 className="w-4 h-4 text-level-beginner shrink-0" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{lesson.summary}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge variant="outline" className={cn("text-xs capitalize", levelColors[lesson.level])}>
            {lesson.level}
          </Badge>
          <div className="text-xs text-muted-foreground">{lesson.duration}m · {lesson.xp} XP</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LessonView({ moduleId, lessonId }: { moduleId: string; lessonId: string }) {
  const navigate = useAppStore((s) => s.navigate);
  const markComplete = useAppStore((s) => s.markLessonComplete);
  const unlockAchievement = useAppStore((s) => s.unlockAchievement);
  const mod = modules.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  const isDone = useAppStore((s) => s.completedLessons[`${moduleId}:${lessonId}`]);

  if (!mod || !lesson) {
    return <div className="text-center py-12">Lesson not found.</div>;
  }

  const lessonIdx = mod.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = lessonIdx > 0 ? mod.lessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < mod.lessons.length - 1 ? mod.lessons[lessonIdx + 1] : null;

  const onComplete = () => {
    markComplete(moduleId, lessonId, lesson.xp);
    // Unlock first achievement
    unlockAchievement("first-lesson");
    // Check for module completion
    const allDone = mod.lessons.every((l) =>
      useAppStore.getState().completedLessons[`${mod.id}:${l.id}`] || l.id === lessonId
    );
    if (allDone) {
      unlockAchievement(`module-complete-${mod.id}`);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Breadcrumb — premium with better contrast */}
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <button
          onClick={() => navigate({ name: "module", moduleId })}
          className="text-muted-foreground hover:text-aws-orange transition-colors"
        >
          {mod.short}
        </button>
        <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">{lesson.title}</span>
      </nav>

      {/* Lesson Header — premium */}
      <div className="fade-in-up">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className={cn("text-xs capitalize", levelColors[lesson.level])}>
            {lesson.level}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted">
            <Clock className="w-3 h-3" />
            {lesson.duration} min
          </span>
          <span className="text-xs text-aws-amber flex items-center gap-1.5 px-2 py-1 rounded-md bg-aws-amber/10">
            <Award className="w-3 h-3" />
            {lesson.xp} XP
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-3">
          {lesson.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{lesson.summary}</p>
      </div>

      <Separator />

      {/* Lesson Content */}
      <div className="prose-aws max-w-none space-y-4">
        {lesson.content.map((block, idx) => (
          <LessonBlockRenderer key={idx} block={block} />
        ))}
      </div>

      {/* Complete Button */}
      {/* Completion bar — premium emphasis at end of content */}
      <Card className={cn(
        "border-2 shadow-lg",
        isDone ? "border-aws-emerald/50 bg-aws-emerald/5" : "border-aws-orange/40 bg-card"
      )}>
        <CardContent className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            {isDone ? (
              <div className="w-12 h-12 rounded-full bg-aws-emerald/20 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-aws-emerald" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-aws-orange/15 flex items-center justify-center">
                <Circle className="w-7 h-7 text-aws-orange" />
              </div>
            )}
            <div>
              <div className="font-semibold text-base">
                {isDone ? "Lesson Complete!" : "Mark this lesson as complete"}
              </div>
              <div className="text-sm text-muted-foreground">
                {isDone ? `+${lesson.xp} XP earned` : `Earn ${lesson.xp} XP and track your progress`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isDone && (
              <Button onClick={onComplete} className="glow-orange">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}
            {nextLesson && (
              <Button
                variant={isDone ? "default" : "outline"}
                onClick={() => navigate({ name: "lesson", moduleId, lessonId: nextLesson.id })}
              >
                {isDone ? "Next lesson" : "Skip"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation — below sticky bar */}
      <div className="flex items-center justify-between pt-2">
        {prevLesson ? (
          <Button variant="ghost" size="sm" onClick={() => navigate({ name: "lesson", moduleId, lessonId: prevLesson.id })}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous lesson
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => navigate({ name: "module", moduleId })}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Module overview
          </Button>
        )}
        {!nextLesson && (
          <Button size="sm" onClick={() => navigate({ name: "module", moduleId })}>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Finish module
          </Button>
        )}
      </div>
    </div>
  );
}

function LessonBlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="text-2xl font-bold tracking-tight mt-8 mb-3">{block.text}</h2>;
    case "subheading":
      return <h3 className="text-xl font-semibold mt-6 mb-2">{block.text}</h3>;
    case "paragraph":
      return <p className="text-base leading-relaxed text-foreground/90">{block.text}</p>;
    case "list":
      if (block.ordered) {
        return (
          <ol className="list-decimal pl-6 space-y-1.5 my-3">
            {block.items.map((item, i) => (
              <li key={i} className="text-base leading-relaxed">{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="list-disc pl-6 space-y-1.5 my-3">
          {block.items.map((item, i) => (
            <li key={i} className="text-base leading-relaxed">{item}</li>
          ))}
        </ul>
      );
    case "callout": {
      const config = calloutConfig[block.variant];
      const Icon = config.icon;
      return (
        <div className={cn("rounded-lg border-l-4 p-4 my-4 flex gap-3", config.bg)} style={{ borderLeftColor: `var(--${config.color})` }}>
          <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: `var(--${config.color})` }} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold mb-1">{block.title}</div>
            <div className="text-sm text-foreground/90">{block.text}</div>
          </div>
        </div>
      );
    }
    case "code":
      return <SyntaxHighlighter code={block.code} language={block.language} caption={block.caption} />;
    case "architecture":
      return <ArchitectureDiagram nodes={block.nodes} edges={block.edges} caption={block.caption} />;
    case "comparison":
      return <ComparisonTable columns={block.columns} rows={block.rows} caption={block.caption} />;
    case "qa":
      return (
        <div className="my-4 rounded-lg border border-border p-4 bg-muted/30">
          <div className="font-medium mb-2 flex items-start gap-2">
            <span className="text-aws-orange">Q:</span>
            <span>{block.question}</span>
          </div>
          <div className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-level-beginner">A:</span>
            <span className="flex-1">{block.answer}</span>
          </div>
        </div>
      );
    case "keyTakeaways":
      return (
        <Card className="bg-aws-orange/5 border-aws-orange/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-aws-orange" />
              Key Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-aws-emerald mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}

function ComparisonTable({ columns, rows, caption }: {
  columns: string[];
  rows: { label: string; values: string[] }[];
  caption?: string;
}) {
  return (
    <div className="my-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {columns.map((col) => (
                <th key={col} className="text-left p-3 font-semibold border-b border-border">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-muted/50 transition-colors">
                <td className="p-3 font-medium border-b border-border">{row.label}</td>
                {row.values.map((val, j) => (
                  <td key={j} className="p-3 border-b border-border text-foreground/90">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <div className="text-xs text-muted-foreground mt-2">{caption}</div>}
    </div>
  );
}

// Re-export lucide icons for the iconMap
import {
  Cloud as CloudIcon,
  Layers as LayersIcon,
  ShieldCheck as ShieldCheckIcon,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Network as NetworkIcon,
  Zap as ZapIcon,
  Container as ContainerIcon,
  GitBranch as GitBranchIcon,
  BrainCircuit as BrainCircuitIcon,
  Terminal as TerminalIcon,
} from "lucide-react";
