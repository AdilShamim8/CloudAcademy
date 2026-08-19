"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  TrendingUp,
  Flame,
  CheckCircle2,
  Circle,
  Trophy,
  Zap,
  Sparkles,
  BookOpen,
  Lock,
  RotateCcw,
  Rocket,
  ListChecks,
  BarChart3,
  Footprints,
  Cloud,
  Layers,
  ShieldCheck,
  Server,
  Database,
  Network,
  Container,
  GitBranch,
  BrainCircuit,
  Terminal,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { modules, type Module } from "@/lib/curriculum";
import { quizzes, projects } from "@/lib/learning-content";

// ---------------------------------------------------------------------------
// Icon maps (mirror HomePage / LessonView maps)
// ---------------------------------------------------------------------------

const moduleIconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  Cloud,
  Layers,
  ShieldCheck,
  Server,
  Database,
  Network,
  Zap,
  Container,
  GitBranch,
  BrainCircuit,
  Terminal,
};

const levelColors: Record<string, string> = {
  beginner: "bg-level-beginner/20 text-level-beginner",
  intermediate: "bg-level-intermediate/20 text-level-intermediate",
  advanced: "bg-level-advanced/20 text-level-advanced",
  expert: "bg-level-expert/20 text-level-expert",
};

const categoryColors: Record<string, string> = {
  fundamentals: "var(--aws-orange)",
  compute: "var(--aws-amber)",
  storage: "var(--aws-emerald)",
  database: "var(--aws-amber)",
  networking: "var(--aws-cyan)",
  security: "var(--aws-rose)",
  serverless: "var(--aws-violet)",
  containers: "var(--aws-violet)",
  devops: "var(--aws-teal)",
  aiml: "var(--aws-violet)",
  core: "var(--aws-cyan)",
};

// Pre-defined achievements list
const allAchievements: {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: Footprints,
    color: "aws-emerald",
  },
  {
    id: "quiz-complete-quiz-fundamentals",
    title: "Foundation Builder",
    description: "Pass the Fundamentals quiz",
    icon: BookOpen,
    color: "aws-cyan",
  },
  {
    id: "quiz-complete-quiz-iam",
    title: "Identity Master",
    description: "Pass the IAM quiz",
    icon: ShieldCheck,
    color: "aws-rose",
  },
  {
    id: "module-complete-iam",
    title: "Security First",
    description: "Complete the IAM module",
    icon: Lock,
    color: "aws-rose",
  },
  {
    id: "module-complete-networking",
    title: "Network Architect",
    description: "Complete the Networking module",
    icon: Network,
    color: "aws-cyan",
  },
  {
    id: "module-complete-lambda",
    title: "Going Serverless",
    description: "Complete the Lambda module",
    icon: Zap,
    color: "aws-violet",
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "7-day learning streak",
    icon: Flame,
    color: "aws-orange",
  },
  {
    id: "project-complete",
    title: "Builder",
    description: "Complete your first project",
    icon: Rocket,
    color: "aws-orange",
  },
];

// ---------------------------------------------------------------------------
// Skill level helpers
// ---------------------------------------------------------------------------

const skillLevels = [
  { name: "Beginner", min: 0, max: 50 },
  { name: "Intermediate", min: 50, max: 200 },
  { name: "Advanced", min: 200, max: 500 },
  { name: "Expert", min: 500, max: Infinity },
];

function getSkillLevel(xp: number) {
  return skillLevels.find((l) => xp >= l.min && xp < l.max) || skillLevels[0];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DashboardView() {
  const navigate = useAppStore((s) => s.navigate);
  const resetProgress = useAppStore((s) => s.resetProgress);

  const totalXP = useAppStore((s) => s.totalXP);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const completedProjects = useAppStore((s) => s.completedProjects);
  const quizScores = useAppStore((s) => s.quizScores);
  const achievements = useAppStore((s) => s.achievements);
  const streakDays = useAppStore((s) => s.streakDays);

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessonsCount = Object.keys(completedLessons).filter(
    (k) => completedLessons[k],
  ).length;
  const completedProjectsCount = Object.keys(completedProjects).filter(
    (k) => completedProjects[k],
  ).length;

  const skill = getSkillLevel(totalXP);
  const nextLevel = skillLevels.find((l) => l.min > totalXP);
  const xpIntoLevel = totalXP - skill.min;
  const xpSpan = skill.max === Infinity ? 1 : skill.max - skill.min;
  const xpToNext = nextLevel ? nextLevel.min - totalXP : 0;
  const levelProgressPct =
    skill.max === Infinity
      ? 100
      : Math.min(100, Math.round((xpIntoLevel / xpSpan) * 100));

  // Find recommended next lesson (first incomplete lesson across all modules).
  // Written as a single expression so the React Compiler can preserve memoization.
  const recommendedNext = React.useMemo<
    { module: (typeof modules)[number]; lesson: (typeof modules)[number]["lessons"][number] } | null
  >(() => {
    return modules
      .flatMap((mod) => mod.lessons.map((lesson) => ({ module: mod, lesson })))
      .find(({ module: mod, lesson }) => !completedLessons[`${mod.id}:${lesson.id}`]) ?? null;
  }, [completedLessons]);

  // Build XP per category data for bar chart
  const xpPerCategory = React.useMemo(() => {
    const buckets: Record<string, number> = {};
    modules.forEach((m) => {
      buckets[m.category] = buckets[m.category] || 0;
    });
    Object.entries(completedLessons).forEach(([key, done]) => {
      if (!done) return;
      const [moduleId, lessonId] = key.split(":");
      const mod = modules.find((m) => m.id === moduleId);
      if (!mod) return;
      const lesson = mod.lessons.find((l) => l.id === lessonId);
      if (!lesson) return;
      buckets[mod.category] = (buckets[mod.category] || 0) + lesson.xp;
    });
    return Object.entries(buckets).map(([category, xp]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      xp,
      color: categoryColors[category] || "var(--aws-orange)",
    }));
  }, [completedLessons]);

  // Recent activity — completed lesson keys (in order they were added)
  const recentLessons = React.useMemo(() => {
    return Object.keys(completedLessons)
      .filter((k) => completedLessons[k])
      .slice(-5)
      .reverse()
      .map((key) => {
        const [moduleId, lessonId] = key.split(":");
        const mod = modules.find((m) => m.id === moduleId);
        const lesson = mod?.lessons.find((l) => l.id === lessonId);
        return mod && lesson
          ? {
              moduleId,
              lessonId,
              moduleTitle: mod.title,
              lessonTitle: lesson.title,
            }
          : null;
      })
      .filter(Boolean) as {
      moduleId: string;
      lessonId: string;
      moduleTitle: string;
      lessonTitle: string;
    }[];
  }, [completedLessons]);

  const recentProjects = React.useMemo(() => {
    return Object.keys(completedProjects)
      .filter((k) => completedProjects[k])
      .map((projectId) => projects.find((p) => p.id === projectId))
      .filter(Boolean)
      .slice(-5) as typeof projects;
  }, [completedProjects]);

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
      <Card className="bg-gradient-mesh border border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Badge className="mb-3 bg-aws-orange/15 text-aws-orange border-aws-orange/30 hover:bg-aws-orange/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Your Learning Dashboard
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, cloud learner
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Track your progress through the AWS cloud curriculum. Every
                lesson, quiz, and project earns XP — keep your streak going and
                unlock achievements along the way.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2">
                <Trophy
                  className="w-5 h-5"
                  style={{ color: "var(--aws-amber)" }}
                />
                <div className="text-3xl font-bold">
                  {Math.round(totalXP)} XP
                </div>
              </div>
              <Badge
                className={cn(
                  "capitalize",
                  levelColors[skill.name.toLowerCase()],
                )}
              >
                {skill.name} Level
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stat cards row */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total XP"
          value={`${Math.round(totalXP)}`}
          sublabel={
            xpToNext > 0
              ? `${Math.round(xpToNext)} XP to ${nextLevel?.name}`
              : "Max level reached"
          }
          icon={TrendingUp}
          color="aws-violet"
        />
        <StatCard
          label="Lessons Completed"
          value={`${completedLessonsCount} / ${totalLessons}`}
          sublabel={`${totalLessons - completedLessonsCount} to go`}
          icon={BookOpen}
          color="aws-cyan"
        />
        <StatCard
          label="Projects Completed"
          value={`${completedProjectsCount} / ${projects.length}`}
          sublabel={`${projects.length - completedProjectsCount} to go`}
          icon={Rocket}
          color="aws-orange"
        />
        <StatCard
          label="Day Streak"
          value={`${streakDays} ${streakDays === 1 ? "day" : "days"}`}
          sublabel={
            streakDays > 0 ? "Keep it going!" : "Complete a lesson today"
          }
          icon={Flame}
          color={streakDays > 0 ? "aws-orange" : "muted"}
          iconActive={streakDays > 0}
        />
      </section>

      {/* Skill level progress */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-aws-violet" />
              Skill Level Progress
            </CardTitle>
            <CardDescription>
              You&apos;re currently at{" "}
              <span className="font-medium text-foreground">
                {skill.name}
              </span>{" "}
              level.
              {nextLevel &&
                ` ${Math.round(xpToNext)} XP until you reach ${nextLevel.name}.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">{skill.name}</span>
                <span className="text-muted-foreground">
                  {nextLevel ? nextLevel.name : "Max"}
                </span>
              </div>
              <Progress value={levelProgressPct} className="h-3" />
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-muted-foreground">
                  {Math.round(totalXP)} XP
                </span>
                <span className="text-muted-foreground">
                  {nextLevel ? `${nextLevel.min} XP` : "∞"}
                </span>
              </div>
            </div>

            {/* Recommended next lesson */}
            {recommendedNext ? (
              <Card
                className="card-lift cursor-pointer border-aws-orange/30 bg-aws-orange/5"
                onClick={() =>
                  navigate({
                    name: "lesson",
                    moduleId: recommendedNext.module.id,
                    lessonId: recommendedNext.lesson.id,
                  })
                }
              >
                <CardContent className="py-4 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `var(--${recommendedNext.module.color})`,
                      opacity: 0.15,
                    }}
                  >
                    <Zap
                      className="w-5 h-5"
                      style={{ color: "var(--aws-orange)" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-0.5">
                      Recommended next lesson
                    </div>
                    <div className="font-medium truncate">
                      {recommendedNext.lesson.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {recommendedNext.module.title} ·{" "}
                      {recommendedNext.lesson.duration}m · +
                      {recommendedNext.lesson.xp} XP
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-aws-emerald/30 bg-aws-emerald/5">
                <CardContent className="py-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-aws-emerald shrink-0" />
                  <div>
                    <div className="font-medium">All lessons complete!</div>
                    <div className="text-xs text-muted-foreground">
                      You&apos;ve completed every lesson in the curriculum.
                      Incredible work.
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </section>

      {/* XP per category chart */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-aws-cyan" />
              XP by Category
            </CardTitle>
            <CardDescription>
              How your experience is distributed across AWS service categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={xpPerCategory}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    allowDecimals={false}
                  />
                  <RTooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [`${value} XP`, "Earned"]}
                  />
                  <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                    {xpPerCategory.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Module progress */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Module Progress</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ name: "learning-path" })}
          >
            View full path
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <ModuleProgressCard key={mod.id} module={mod} />
          ))}
        </div>
      </section>

      {/* Tabs: Quiz scores / Achievements / Recent activity */}
      <section>
        <Tabs defaultValue="quizzes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quizzes">
              <ListChecks className="w-4 h-4 mr-1.5" />
              Quiz Scores
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Award className="w-4 h-4 mr-1.5" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity">
              <TrendingUp className="w-4 h-4 mr-1.5" />
              Recent Activity
            </TabsTrigger>
          </TabsList>

          {/* Quiz scores */}
          <TabsContent value="quizzes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quiz Scores</CardTitle>
                <CardDescription>
                  Your performance across the platform&apos;s quizzes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(quizScores).length === 0 ? (
                  <div className="text-center py-8">
                    <Circle className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                    <div className="text-sm text-muted-foreground">
                      No quizzes attempted yet.
                    </div>
                    <Button
                      size="sm"
                      className="mt-4"
                      onClick={() => navigate({ name: "quizzes" })}
                    >
                      Take a quiz
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto scroll-area-thin">
                    {Object.entries(quizScores).map(([quizId, score]) => {
                      const quiz = quizzes.find((q) => q.id === quizId);
                      const pct = Math.round(
                        (score.score / score.total) * 100,
                      );
                      return (
                        <div
                          key={quizId}
                          className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {quiz?.title || quizId}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {score.score} / {score.total} ·{" "}
                              {new Date(score.takenAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              pct >= 80
                                ? "bg-aws-emerald/20 text-aws-emerald"
                                : pct >= 50
                                  ? "bg-aws-amber/20 text-aws-amber"
                                  : "bg-aws-rose/20 text-aws-rose",
                            )}
                          >
                            {pct}%
                          </Badge>
                        </div>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => navigate({ name: "quizzes" })}
                    >
                      Take more quizzes
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-aws-amber" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  {achievements.length} of {allAchievements.length} unlocked.
                  Keep learning to collect them all.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {allAchievements.map((ach) => {
                    const unlocked = achievements.includes(ach.id);
                    const Icon = ach.icon;
                    return (
                      <div
                        key={ach.id}
                        className={cn(
                          "rounded-lg border p-4 flex items-start gap-3 transition-all",
                          unlocked
                            ? "border-border bg-card card-lift"
                            : "border-dashed border-border bg-muted/30 opacity-70",
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `var(--${ach.color})`,
                            opacity: unlocked ? 0.15 : 0.08,
                          }}
                        >
                          {unlocked ? (
                            <Icon
                              className="w-5 h-5"
                              style={{ color: `var(--${ach.color})` }}
                            />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm flex items-center gap-1.5">
                            {ach.title}
                            {unlocked && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-aws-emerald" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {ach.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent activity */}
          <TabsContent value="activity" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-aws-cyan" />
                  Recently Completed Lessons
                </CardTitle>
                <CardDescription>
                  Your last {Math.min(5, recentLessons.length)} completed
                  lessons.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentLessons.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No lessons completed yet. Start with the fundamentals!
                  </div>
                ) : (
                  <ul className="space-y-2 max-h-72 overflow-y-auto scroll-area-thin">
                    {recentLessons.map((item, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() =>
                            navigate({
                              name: "lesson",
                              moduleId: item.moduleId,
                              lessonId: item.lessonId,
                            })
                          }
                          className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
                        >
                          <CheckCircle2 className="w-4 h-4 text-aws-emerald shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {item.lessonTitle}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.moduleTitle}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-aws-orange" />
                  Recently Completed Projects
                </CardTitle>
                <CardDescription>
                  Hands-on projects you&apos;ve marked complete.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentProjects.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No projects completed yet.
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2"
                      onClick={() => navigate({ name: "projects" })}
                    >
                      Browse projects
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2 max-h-72 overflow-y-auto scroll-area-thin">
                    {recentProjects.map((proj) => (
                      <li key={proj.id}>
                        <button
                          onClick={() =>
                            navigate({ name: "project", projectId: proj.id })
                          }
                          className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
                        >
                          <CheckCircle2 className="w-4 h-4 text-aws-emerald shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {proj.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              +50 XP earned
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Reset progress */}
      <section className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-aws-rose/40 p-4 bg-aws-rose/5">
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-aws-rose mt-0.5 shrink-0" />
          <div>
            <div className="font-medium text-sm">Reset all progress</div>
            <div className="text-xs text-muted-foreground">
              Permanently erase your XP, achievements, and completion history.
              This cannot be undone.
            </div>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-aws-rose/40 text-aws-rose hover:bg-aws-rose/10"
            >
              Reset progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently erase your XP, completed lessons,
                projects, quiz scores, achievements, and streak. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => resetProgress()}
                className="bg-aws-rose text-white hover:bg-aws-rose/90"
              >
                Yes, reset everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  color,
  iconActive = true,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
  iconActive?: boolean;
}) {
  return (
    <Card className="card-lift">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{label}</CardDescription>
          <Icon
            className="w-4 h-4"
            style={iconActive ? { color: `var(--${color})` } : undefined}
          />
        </div>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{sublabel}</div>
      </CardContent>
    </Card>
  );
}

function ModuleProgressCard({ module: mod }: { module: Module }) {
  const navigate = useAppStore((s) => s.navigate);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const lessonsCompleted = mod.lessons.filter(
    (l) => completedLessons[`${mod.id}:${l.id}`],
  ).length;
  const progress =
    mod.lessons.length > 0
      ? Math.round((lessonsCompleted / mod.lessons.length) * 100)
      : 0;
  const Icon = moduleIconMap[mod.icon] || Cloud;

  return (
    <Card
      className="card-lift cursor-pointer group"
      onClick={() => navigate({ name: "module", moduleId: mod.id })}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `var(--${mod.color})`,
              opacity: 0.15,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: `var(--${mod.color})` }} />
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            {mod.level}
          </Badge>
        </div>
        <CardTitle className="text-base mt-3 group-hover:text-aws-orange transition-colors line-clamp-1">
          {mod.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">
            {lessonsCompleted} / {mod.lessons.length} lessons
          </span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </CardContent>
    </Card>
  );
}
