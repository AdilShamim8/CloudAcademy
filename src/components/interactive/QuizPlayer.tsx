"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  HelpCircle,
  Brain,
  Award,
  Clock,
  ChevronRight,
  Sparkles,
  PartyPopper,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { quizzes, type Quiz } from "@/lib/learning-content";

const levelColors: Record<string, string> = {
  beginner:
    "bg-level-beginner/20 text-level-beginner border-level-beginner/30",
  intermediate:
    "bg-level-intermediate/20 text-level-intermediate border-level-intermediate/30",
  advanced: "bg-level-advanced/20 text-level-advanced border-level-advanced/30",
  expert: "bg-level-expert/20 text-level-expert border-level-expert/30",
};

// ---------------------------------------------------------------------------
// QuizzesView — list of all quizzes
// ---------------------------------------------------------------------------

export function QuizzesView() {
  const navigate = useAppStore((s) => s.navigate);
  const quizScores = useAppStore((s) => s.quizScores);

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
        <h1 className="text-3xl font-bold tracking-tight">Quizzes & Knowledge Checks</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Test your understanding of each AWS topic. Each quiz gives you
          instant feedback, explanations for every question, and XP for completing it.
        </p>
      </div>

      <Card className="bg-gradient-mesh">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat
              icon={HelpCircle}
              color="aws-orange"
              value={String(quizzes.length)}
              label="Quizzes Available"
            />
            <Stat
              icon={Brain}
              color="aws-cyan"
              value={String(quizzes.reduce((s, q) => s + q.questions.length, 0))}
              label="Total Questions"
            />
            <Stat
              icon={Trophy}
              color="aws-amber"
              value={String(Object.keys(quizScores).length)}
              label="Quizzes Attempted"
            />
            <Stat
              icon={Award}
              color="aws-emerald"
              value={`${quizAveragePercent(quizScores)}%`}
              label="Average Score"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        {quizzes.map((quiz) => {
          const score = quizScores[quiz.id];
          const pct =
            score && score.total > 0
              ? Math.round((score.score / score.total) * 100)
              : null;
          return (
            <Card
              key={quiz.id}
              className="card-lift cursor-pointer group flex flex-col"
              onClick={() => navigate({ name: "quiz", quizId: quiz.id })}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--aws-violet)", opacity: 0.12 }}
                  >
                    <HelpCircle
                      className="w-6 h-6"
                      style={{ color: "var(--aws-violet)" }}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={cn("capitalize", levelColors[quiz.level])}
                    >
                      {quiz.level}
                    </Badge>
                    {score ? (
                      <Badge
                        className={cn(
                          "text-xs",
                          pct !== null && pct >= 70
                            ? "bg-aws-emerald/20 text-aws-emerald"
                            : "bg-aws-rose/20 text-aws-rose",
                        )}
                      >
                        <Trophy className="w-3 h-3 mr-1" />
                        Best: {score.score}/{score.total}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Not attempted
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-aws-orange transition-colors">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {quiz.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    {quiz.questions.length} questions
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    ~{quiz.questions.length * 2} min
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    +20 XP
                  </Badge>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {score
                      ? `Last taken ${new Date(score.takenAt).toLocaleDateString()}`
                      : "Test your knowledge"}
                  </span>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ name: "quiz", quizId: quiz.id });
                    }}
                  >
                    {score ? "Retake Quiz" : "Start Quiz"}
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

function quizAveragePercent(
  scores: Record<string, { score: number; total: number; takenAt: string }>,
): number {
  const entries = Object.values(scores);
  if (entries.length === 0) return 0;
  const totalPct = entries.reduce(
    (sum, e) => (e.total > 0 ? sum + (e.score / e.total) * 100 : sum),
    0,
  );
  return Math.round(totalPct / entries.length);
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
// QuizPlayer — interactive quiz
// ---------------------------------------------------------------------------

interface QuizState {
  phase: "question" | "feedback" | "complete";
  currentIndex: number;
  selectedOption: number | null;
  correctCount: number;
  answers: { questionId: string; selected: number; correct: boolean }[];
}

const initialState: QuizState = {
  phase: "question",
  currentIndex: 0,
  selectedOption: null,
  correctCount: 0,
  answers: [],
};

export function QuizPlayer({ quizId }: { quizId: string }) {
  const navigate = useAppStore((s) => s.navigate);
  const recordQuizScore = useAppStore((s) => s.recordQuizScore);
  const unlockAchievement = useAppStore((s) => s.unlockAchievement);

  const quiz = quizzes.find((q) => q.id === quizId);
  const [state, setState] = React.useState<QuizState>(initialState);

  // Reset state if quiz changes
  React.useEffect(() => {
    setState(initialState);
  }, [quizId]);

  if (!quiz) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ name: "quizzes" })}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          All Quizzes
        </Button>
        <div className="text-center py-12 text-muted-foreground">
          Quiz not found.
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[state.currentIndex];
  const totalQuestions = quiz.questions.length;
  const progressPct =
    totalQuestions > 0
      ? Math.round(
          ((state.phase === "complete"
            ? totalQuestions
            : state.currentIndex) /
            totalQuestions) *
            100,
        )
      : 0;

  const handleSelect = (idx: number) => {
    if (state.phase !== "question") return;
    setState((s) => ({ ...s, selectedOption: idx }));
  };

  const handleCheck = () => {
    if (state.selectedOption === null) return;
    const isCorrect =
      state.selectedOption === currentQuestion.correctIndex;
    const newCount = state.correctCount + (isCorrect ? 1 : 0);
    const newAnswers = [
      ...state.answers,
      {
        questionId: currentQuestion.id,
        selected: state.selectedOption,
        correct: isCorrect,
      },
    ];
    setState((s) => ({
      ...s,
      correctCount: newCount,
      answers: newAnswers,
      phase: "feedback",
    }));
  };

  const handleNext = () => {
    if (state.currentIndex + 1 >= totalQuestions) {
      // Final — record score and unlock achievement
      const finalScore = state.correctCount;
      recordQuizScore(quizId, finalScore, totalQuestions, 20);
      unlockAchievement(`quiz-complete-${quizId}`);
      if (finalScore / totalQuestions >= 0.9) {
        unlockAchievement(`quiz-perfect-${quizId}`);
      }
      setState((s) => ({ ...s, phase: "complete" }));
    } else {
      setState((s) => ({
        ...s,
        currentIndex: s.currentIndex + 1,
        selectedOption: null,
        phase: "question",
      }));
    }
  };

  const handleRetry = () => {
    setState(initialState);
  };

  // ---- Render: Complete screen ----
  if (state.phase === "complete") {
    const finalScore = state.correctCount;
    const pct =
      totalQuestions > 0
        ? Math.round((finalScore / totalQuestions) * 100)
        : 0;
    const passed = pct >= 70;
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ name: "quizzes" })}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          All Quizzes
        </Button>

        <Card
          className={cn(
            "border-2 text-center",
            passed
              ? "border-aws-emerald/40 bg-aws-emerald/5"
              : "border-aws-amber/40 bg-aws-amber/5",
          )}
        >
          <CardHeader>
            <div className="flex justify-center mb-2">
              {passed ? (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--aws-emerald)",
                    opacity: 0.15,
                  }}
                >
                  <PartyPopper
                    className="w-10 h-10"
                    style={{ color: "var(--aws-emerald)" }}
                  />
                </div>
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--aws-amber)",
                    opacity: 0.15,
                  }}
                >
                  <Trophy
                    className="w-10 h-10"
                    style={{ color: "var(--aws-amber)" }}
                  />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl">
              {passed ? "Great job!" : "Keep practicing!"}
            </CardTitle>
            <CardDescription>
              {passed
                ? "You passed this quiz. Try to keep your streak going!"
                : "You need 70% to pass. Review the explanations and try again."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-3xl font-bold text-aws-orange">
                  {finalScore}/{totalQuestions}
                </div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-aws-emerald">{pct}%</div>
                <div className="text-xs text-muted-foreground">Percentage</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-aws-violet">+{passed ? "20" : "10"} XP</div>
                <div className="text-xs text-muted-foreground">Earned</div>
              </div>
            </div>

            <Progress value={pct} className="h-3 mb-6" />

            {/* Answer review */}
            <div className="text-left space-y-2 mt-6">
              <div className="font-medium text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-aws-amber" />
                Your Answers
              </div>
              {state.answers.map((a, idx) => {
                const q = quiz.questions.find(
                  (qq) => qq.id === a.questionId,
                );
                if (!q) return null;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-md border p-3 text-sm flex items-start gap-2",
                      a.correct
                        ? "border-aws-emerald/30 bg-aws-emerald/5"
                        : "border-aws-rose/30 bg-aws-rose/5",
                    )}
                  >
                    {a.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-aws-emerald mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-aws-rose mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium mb-1">{q.question}</div>
                      <div className="text-xs text-muted-foreground">
                        Your answer: {q.options[a.selected]}
                      </div>
                      {!a.correct && (
                        <div className="text-xs text-aws-emerald">
                          Correct: {q.options[q.correctIndex]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Button onClick={handleRetry}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Retry Quiz
              </Button>
              <Button variant="outline" onClick={() => navigate({ name: "quizzes" })}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- Render: Question / Feedback ----
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ name: "quizzes" })}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        All Quizzes
      </Button>

      {/* Quiz Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className={cn("capitalize", levelColors[quiz.level])}>
            {quiz.level}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            {quiz.questions.length} questions
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {quiz.title}
        </h1>
        <p className="text-muted-foreground mt-2">{quiz.description}</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {state.currentIndex + 1} of {totalQuestions}
          </span>
          <span className="font-medium">
            Score: {state.correctCount}/{state.currentIndex + (state.phase === "feedback" ? 1 : 0)}
          </span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">
              {currentQuestion.level}
            </Badge>
            <span>Pick the best answer.</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={
              state.selectedOption !== null
                ? String(state.selectedOption)
                : ""
            }
            onValueChange={(v) => handleSelect(Number(v))}
            className="space-y-2"
          >
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = state.selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;
              const showResult = state.phase === "feedback";

              return (
                <label
                  key={idx}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    !showResult && "hover:bg-accent hover:border-aws-orange/40",
                    showResult && isCorrect &&
                      "border-aws-emerald/50 bg-aws-emerald/10",
                    showResult && isSelected && !isCorrect &&
                      "border-aws-rose/50 bg-aws-rose/10",
                    showResult && !isSelected && !isCorrect &&
                      "opacity-60",
                    !showResult && isSelected &&
                      "border-aws-orange/50 bg-aws-orange/5",
                    !showResult && !isSelected && "border-border",
                  )}
                >
                  <RadioGroupItem
                    value={String(idx)}
                    id={`opt-${idx}`}
                    disabled={showResult}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{opt}</div>
                  </div>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-aws-emerald shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-aws-rose shrink-0" />
                  )}
                </label>
              );
            })}
          </RadioGroup>

          {/* Feedback */}
          {state.phase === "feedback" && (
            <div
              className={cn(
                "mt-4 rounded-lg border-l-4 p-4",
                state.selectedOption === currentQuestion.correctIndex
                  ? "bg-aws-emerald/10 border-aws-emerald"
                  : "bg-aws-rose/10 border-aws-rose",
              )}
            >
              <div className="flex items-start gap-3">
                {state.selectedOption === currentQuestion.correctIndex ? (
                  <CheckCircle2 className="w-5 h-5 text-aws-emerald shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-aws-rose shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">
                    {state.selectedOption === currentQuestion.correctIndex
                      ? "Correct!"
                      : "Not quite."}
                  </div>
                  <div className="text-sm text-foreground/90 mt-1">
                    {currentQuestion.explanation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ name: "quizzes" })}
            >
              Exit quiz
            </Button>
            {state.phase === "question" ? (
              <Button
                onClick={handleCheck}
                disabled={state.selectedOption === null}
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {state.currentIndex + 1 >= totalQuestions
                  ? "See Results"
                  : "Next Question"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
