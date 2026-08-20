"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Route =
  | { name: "home" }
  | { name: "dashboard" }
  | { name: "learning-path"; pathId?: string }
  | { name: "module"; moduleId: string }
  | { name: "lesson"; moduleId: string; lessonId: string }
  | { name: "projects" }
  | { name: "project"; projectId: string }
  | { name: "labs" }
  | { name: "cli-playground" }
  | { name: "iam-simulator" }
  | { name: "architecture-builder" }
  | { name: "troubleshooting" }
  | { name: "troubleshooting-scenario"; scenarioId: string }
  | { name: "quizzes" }
  | { name: "quiz"; quizId: string }
  | { name: "certification" }
  | { name: "aws-console" }
  | { name: "services" };

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

interface ProgressState {
  // Navigation
  route: Route;
  sidebarOpen: boolean;
  navigate: (route: Route) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Progress tracking
  completedLessons: Record<string, boolean>; // key: `${moduleId}:${lessonId}`
  completedModules: Record<string, boolean>;
  completedProjects: Record<string, boolean>;
  quizScores: Record<string, { score: number; total: number; takenAt: string }>;
  achievements: string[];
  streakDays: number;
  lastVisit: string | null;
  totalXP: number;

  // Actions
  markLessonComplete: (moduleId: string, lessonId: string, xp?: number) => void;
  markProjectComplete: (projectId: string, xp?: number) => void;
  recordQuizScore: (quizId: string, score: number, total: number, xp?: number) => void;
  unlockAchievement: (id: string) => void;
  recordVisit: () => void;

  // Reset
  resetProgress: () => void;
}

const today = () => new Date().toISOString().split("T")[0];

export const useAppStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      route: { name: "home" },
      // Default closed on mobile, open on desktop. The Sidebar component
      // handles this via CSS (lg:translate-x-0), so this only affects
      // mobile initial state. Use a function to detect viewport on first render.
      sidebarOpen: typeof window !== "undefined" && window.innerWidth >= 1024,
      navigate: (route) => {
        set({ route });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      completedLessons: {},
      completedModules: {},
      completedProjects: {},
      quizScores: {},
      achievements: [],
      streakDays: 0,
      lastVisit: null,
      totalXP: 0,

      markLessonComplete: (moduleId, lessonId, xp = 10) =>
        set((s) => {
          const key = `${moduleId}:${lessonId}`;
          if (s.completedLessons[key]) return s; // already completed
          return {
            completedLessons: { ...s.completedLessons, [key]: true },
            totalXP: s.totalXP + xp,
          };
        }),

      markProjectComplete: (projectId, xp = 50) =>
        set((s) => {
          if (s.completedProjects[projectId]) return s;
          return {
            completedProjects: { ...s.completedProjects, [projectId]: true },
            totalXP: s.totalXP + xp,
          };
        }),

      recordQuizScore: (quizId, score, total, xp = 20) =>
        set((s) => {
          const prev = s.quizScores[quizId];
          const improvement = prev ? Math.max(0, score - prev.score) : score;
          return {
            quizScores: {
              ...s.quizScores,
              [quizId]: { score, total, takenAt: new Date().toISOString() },
            },
            totalXP: s.totalXP + improvement * (xp / total),
          };
        }),

      unlockAchievement: (id) =>
        set((s) => {
          if (s.achievements.includes(id)) return s;
          return { achievements: [...s.achievements, id] };
        }),

      recordVisit: () => {
        const state = get();
        const todayStr = today();
        if (state.lastVisit === todayStr) return; // already counted today
        let newStreak = 1;
        if (state.lastVisit) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];
          if (state.lastVisit === yesterdayStr) {
            newStreak = state.streakDays + 1;
          }
        }
        set({ lastVisit: todayStr, streakDays: newStreak });
      },

      resetProgress: () =>
        set({
          completedLessons: {},
          completedModules: {},
          completedProjects: {},
          quizScores: {},
          achievements: [],
          streakDays: 0,
          lastVisit: null,
          totalXP: 0,
        }),
    }),
    {
      name: "aws-learning-platform",
      partialize: (s) => ({
        completedLessons: s.completedLessons,
        completedModules: s.completedModules,
        completedProjects: s.completedProjects,
        quizScores: s.quizScores,
        achievements: s.achievements,
        streakDays: s.streakDays,
        lastVisit: s.lastVisit,
        totalXP: s.totalXP,
      }),
    }
  )
);
