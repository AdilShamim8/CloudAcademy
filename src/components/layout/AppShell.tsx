"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Cloud, Layers, ShieldCheck, Server, Database, Network, Zap, Container,
  GitBranch, BrainCircuit, Terminal, Home, LayoutDashboard, BookOpen,
  Wrench, FlaskConical, Trophy, Menu, X, Sun, Moon, ChevronRight,
  ExternalLink, Award, ListChecks, MonitorPlay, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore, type Route } from "@/lib/store";
import { modules } from "@/lib/curriculum";

const moduleIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Cloud, Layers, ShieldCheck, Server, Database, Network, Zap, Container,
  GitBranch, BrainCircuit, Terminal,
};

interface NavItem {
  label: string;
  route: Route;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Home", route: { name: "home" }, icon: Home },
      { label: "Dashboard", route: { name: "dashboard" }, icon: LayoutDashboard },
      { label: "Learning Path", route: { name: "learning-path" }, icon: BookOpen },
      { label: "AWS Services", route: { name: "services" }, icon: Layers },
    ],
  },
  {
    title: "Curriculum",
    items: [
      { label: "Projects", route: { name: "projects" }, icon: Wrench, badge: "10" },
      { label: "Labs & Simulators", route: { name: "labs" }, icon: FlaskConical },
      { label: "AWS Console Clone", route: { name: "aws-console" }, icon: MonitorPlay, badge: "New" },
      { label: "Quizzes", route: { name: "quizzes" }, icon: Trophy },
      { label: "Troubleshooting", route: { name: "troubleshooting" }, icon: ListChecks },
      { label: "Certification", route: { name: "certification" }, icon: Award },
    ],
  },
];

function routeMatches(a: Route, b: Route): boolean {
  if (a.name !== b.name) return false;
  if ("moduleId" in a && "moduleId" in b) return a.moduleId === b.moduleId;
  if ("lessonId" in a && "lessonId" in b) return a.lessonId === b.lessonId;
  if ("projectId" in a && "projectId" in b) return a.projectId === b.projectId;
  if ("quizId" in a && "quizId" in b) return a.quizId === b.quizId;
  if ("scenarioId" in a && "scenarioId" in b) return a.scenarioId === b.scenarioId;
  return true;
}

export function Sidebar() {
  const route = useAppStore((s) => s.route);
  const navigate = useAppStore((s) => s.navigate);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const [expandedModule, setExpandedModule] = React.useState<string | null>(null);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 shrink-0",
          "bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
          "transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-aws-orange via-aws-amber to-aws-rose flex items-center justify-center text-white shadow-lg">
              <Cloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-base leading-tight">CloudAcademy</div>
              <div className="text-xs text-muted-foreground leading-tight">AWS Learning Platform</div>
            </div>
            <button
              className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto scroll-area-thin py-4 px-3">
            {navSections.map((section) => (
              <div key={section.title} className="mb-6">
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </div>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = routeMatches(route, item.route);
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <button
                          onClick={() => {
                            navigate(item.route);
                            if (typeof window !== "undefined" && window.innerWidth < 1024) {
                              setSidebarOpen(false);
                            }
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all relative group",
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                          )}
                        >
                          {isActive && (
                            <span
                              className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full"
                              style={{ background: "var(--aws-orange)" }}
                            />
                          )}
                          <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive && "text-aws-orange")} />
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span className={cn(
                              "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                              item.badge === "New"
                                ? "bg-aws-emerald/20 text-aws-emerald"
                                : "bg-aws-orange/20 text-aws-orange"
                            )}>
                              {item.badge}
                            </span>
                          )}
                          {isActive && <ChevronRight className="w-4 h-4" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="mb-6">
              <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Modules
              </div>
              <ul className="space-y-0.5">
                {modules.map((mod) => {
                  const Icon = moduleIconMap[mod.icon] || Cloud;
                  const isActiveRoute =
                    (route.name === "module" && route.moduleId === mod.id) ||
                    (route.name === "lesson" && route.moduleId === mod.id);
                  const isExpanded = expandedModule === mod.id;
                  return (
                    <li key={mod.id}>
                      <button
                        onClick={() => {
                          setExpandedModule(isExpanded ? null : mod.id);
                          navigate({ name: "module", moduleId: mod.id });
                          if (typeof window !== "undefined" && window.innerWidth < 1024) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all relative",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActiveRoute && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        {isActiveRoute && (
                          <span
                            className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full"
                            style={{ background: `var(--${mod.color})` }}
                          />
                        )}
                        <Icon className="w-4 h-4 shrink-0" style={{ color: `var(--${mod.color})` }} />
                        <span className="flex-1 text-left truncate">{mod.short}</span>
                        <ChevronRight
                          className={cn("w-4 h-4 transition-transform text-muted-foreground", isExpanded && "rotate-90")}
                        />
                      </button>
                      {isExpanded && (
                        <ul className="ml-7 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                          {mod.lessons.slice(0, 4).map((lesson) => (
                            <li key={lesson.id}>
                              <button
                                onClick={() => {
                                  navigate({ name: "lesson", moduleId: mod.id, lessonId: lesson.id });
                                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                                    setSidebarOpen(false);
                                  }
                                }}
                                className="w-full text-left text-xs px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors truncate"
                              >
                                {lesson.title}
                              </button>
                            </li>
                          ))}
                          {mod.lessons.length > 4 && (
                            <li className="px-2 py-1 text-xs text-muted-foreground">
                              +{mod.lessons.length - 4} more lessons
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div className="px-3 py-3 border-t border-sidebar-border shrink-0">
            <Link
              href="https://docs.aws.amazon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              AWS Official Docs
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const navigate = useAppStore((s) => s.navigate);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-sm border-b border-border flex items-center px-4 gap-3">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-accent"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-md">
        <button
          onClick={() => navigate({ name: "home" })}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 w-full"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="truncate hidden sm:inline">Search modules, lessons, projects...</span>
          <span className="truncate sm:hidden">Search...</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ name: "dashboard" })}
          aria-label="My Progress"
        >
          <LayoutDashboard className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden sm:inline">My Progress</span>
        </Button>
      </div>
    </header>
  );
}
