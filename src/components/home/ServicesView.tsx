"use client";

import * as React from "react";
import {
  Cloud, Layers, ShieldCheck, Server, Database, Network, Zap, Container,
  GitBranch, BrainCircuit, Terminal, ArrowRight, Search, Filter,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { modules } from "@/lib/curriculum";

const moduleIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Cloud, Layers, ShieldCheck, Server, Database, Network, Zap, Container,
  GitBranch, BrainCircuit, Terminal,
};

const categories = [
  { id: "all", label: "All Categories" },
  { id: "fundamentals", label: "Fundamentals" },
  { id: "core", label: "Core Services" },
  { id: "compute", label: "Compute" },
  { id: "storage", label: "Storage" },
  { id: "database", label: "Database" },
  { id: "networking", label: "Networking" },
  { id: "security", label: "Security" },
  { id: "serverless", label: "Serverless" },
  { id: "containers", label: "Containers" },
  { id: "devops", label: "DevOps" },
  { id: "aiml", label: "AI/ML" },
];

export function ServicesView() {
  const navigate = useAppStore((s) => s.navigate);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");

  const filtered = modules.filter((m) => {
    if (category !== "all" && m.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.short.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AWS Service Catalog</h1>
        <p className="text-muted-foreground mt-2">
          Browse all {modules.length} modules in the curriculum. Filter by category or search to find what you need.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search modules, services, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scroll-area-thin pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                category === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-muted-foreground">No modules match your search.</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mod) => {
            const Icon = moduleIconMap[mod.icon] || Cloud;
            const lessonsCompleted = mod.lessons.filter((l) =>
              completedLessons[`${mod.id}:${l.id}`]
            ).length;
            const progress = mod.lessons.length > 0
              ? Math.round((lessonsCompleted / mod.lessons.length) * 100)
              : 0;

            return (
              <Card
                key={mod.id}
                className="card-lift cursor-pointer group"
                onClick={() => navigate({ name: "module", moduleId: mod.id })}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `var(--${mod.color})`, opacity: 0.15 }}
                    >
                      <Icon className="w-5 h-5" style={{ color: `var(--${mod.color})` }} />
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {mod.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3 group-hover:text-aws-orange transition-colors">
                    {mod.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{mod.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{mod.lessons.length} lessons</span>
                    <span>{mod.estimatedHours}h</span>
                    <span className="capitalize">{mod.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{lessonsCompleted} / {mod.lessons.length}</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: `var(--${mod.color})`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
