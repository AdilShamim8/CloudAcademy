"use client";

import * as React from "react";
import { Sidebar, TopBar } from "@/components/layout/AppShell";
import { HomePage } from "@/components/home/HomePage";
import { DashboardView } from "@/components/home/DashboardView";
import { ServicesView } from "@/components/home/ServicesView";
import { LabsView } from "@/components/home/LabsView";
import { CertificationView } from "@/components/home/CertificationView";
import { LearningPathView, ModuleView, LessonView } from "@/components/learning/LessonView";
import { ProjectsView, ProjectDetail } from "@/components/projects/ProjectsView";
import { QuizzesView, QuizPlayer } from "@/components/interactive/QuizPlayer";
import { TroubleshootingView, TroubleshootingScenarioView } from "@/components/interactive/TroubleshootingAcademy";
import { CliPlayground } from "@/components/interactive/CliPlayground";
import { IamSimulator } from "@/components/interactive/IamSimulator";
import { ArchitectureBuilder } from "@/components/interactive/ArchitectureBuilder";
import { useAppStore } from "@/lib/store";
import { AwsConsoleClone } from "@/components/console/AwsConsoleClone";

function RouteRenderer() {
  const route = useAppStore((s) => s.route);
  const recordVisit = useAppStore((s) => s.recordVisit);

  React.useEffect(() => {
    recordVisit();
  }, [recordVisit]);

  switch (route.name) {
    case "home":
      return <HomePage />;
    case "dashboard":
      return <DashboardView />;
    case "services":
      return <ServicesView />;
    case "labs":
      return <LabsView />;
    case "learning-path":
      return <LearningPathView />;
    case "module":
      return <ModuleView moduleId={route.moduleId} />;
    case "lesson":
      return <LessonView moduleId={route.moduleId} lessonId={route.lessonId} />;
    case "projects":
      return <ProjectsView />;
    case "project":
      return <ProjectDetail projectId={route.projectId} />;
    case "quizzes":
      return <QuizzesView />;
    case "quiz":
      return <QuizPlayer quizId={route.quizId} />;
    case "troubleshooting":
      return <TroubleshootingView />;
    case "troubleshooting-scenario":
      return <TroubleshootingScenarioView scenarioId={route.scenarioId} />;
    case "cli-playground":
      return <CliPlayground />;
    case "iam-simulator":
      return <IamSimulator />;
    case "architecture-builder":
      return <ArchitectureBuilder />;
    case "aws-console":
      return <AwsConsoleClone />;
    case "certification":
      return <CertificationView />;
    default:
      return <HomePage />;
  }
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
            <RouteRenderer />
          </main>
        </div>
      </div>
      <footer className="border-t border-border bg-background mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">CloudAcademy</span>
            <span>·</span>
            <span>End-to-end AWS Learning Platform</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>14 modules · 60+ lessons · 10 projects · 12+ scenarios</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Safe simulated labs — no real AWS account required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
