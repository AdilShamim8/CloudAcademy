"use client";

import * as React from "react";
import {
  Cloud, Server, Database, Network, Shield, Container, Zap,
  Globe, Lock, Monitor, Box, HardDrive, Cpu, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchitectureNode {
  id: string;
  label: string;
  type: string;
}

interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

interface ArchitectureDiagramProps {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  caption?: string;
}

const nodeConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}> = {
  global: { icon: Globe, color: "text-aws-violet", bg: "bg-aws-violet/10 border-aws-violet/30" },
  region: { icon: Globe, color: "text-aws-cyan", bg: "bg-aws-cyan/10 border-aws-cyan/30" },
  az: { icon: Layers, color: "text-aws-teal", bg: "bg-aws-teal/10 border-aws-teal/30" },
  vpc: { icon: Cloud, color: "text-aws-violet", bg: "bg-aws-violet/10 border-aws-violet/30" },
  subnet: { icon: Layers, color: "text-aws-cyan", bg: "bg-aws-cyan/10 border-aws-cyan/30" },
  client: { icon: Monitor, color: "text-foreground", bg: "bg-muted border-border" },
  external: { icon: Globe, color: "text-aws-orange", bg: "bg-aws-orange/10 border-aws-orange/30" },
  compute: { icon: Server, color: "text-aws-orange", bg: "bg-aws-orange/10 border-aws-orange/30" },
  container: { icon: Container, color: "text-aws-violet", bg: "bg-aws-violet/10 border-aws-violet/30" },
  database: { icon: Database, color: "text-aws-amber", bg: "bg-aws-amber/10 border-aws-amber/30" },
  storage: { icon: HardDrive, color: "text-aws-emerald", bg: "bg-aws-emerald/10 border-aws-emerald/30" },
  network: { icon: Network, color: "text-aws-cyan", bg: "bg-aws-cyan/10 border-aws-cyan/30" },
  security: { icon: Shield, color: "text-aws-rose", bg: "bg-aws-rose/10 border-aws-rose/30" },
  iam: { icon: Lock, color: "text-aws-rose", bg: "bg-aws-rose/10 border-aws-rose/30" },
  gateway: { icon: Network, color: "text-aws-cyan", bg: "bg-aws-cyan/10 border-aws-cyan/30" },
  edge: { icon: Globe, color: "text-aws-teal", bg: "bg-aws-teal/10 border-aws-teal/30" },
  observability: { icon: Cpu, color: "text-aws-violet", bg: "bg-aws-violet/10 border-aws-violet/30" },
  service: { icon: Box, color: "text-aws-cyan", bg: "bg-aws-cyan/10 border-aws-cyan/30" },
  org: { icon: Layers, color: "text-aws-violet", bg: "bg-aws-violet/10 border-aws-violet/30" },
  ou: { icon: Layers, color: "text-aws-cyan", bg: "bg-aws-cyan/10 border-aws-cyan/30" },
  account: { icon: Box, color: "text-aws-amber", bg: "bg-aws-amber/10 border-aws-amber/30" },
  platform: { icon: Cpu, color: "text-aws-violet", bg: "bg-aws-violet/10 border-aws-violet/30" },
  source: { icon: Monitor, color: "text-foreground", bg: "bg-muted border-border" },
  build: { icon: Cpu, color: "text-aws-orange", bg: "bg-aws-orange/10 border-aws-orange/30" },
  pipeline: { icon: Zap, color: "text-aws-amber", bg: "bg-aws-amber/10 border-aws-amber/30" },
  deploy: { icon: Box, color: "text-aws-emerald", bg: "bg-aws-emerald/10 border-aws-emerald/30" },
  gate: { icon: Shield, color: "text-aws-rose", bg: "bg-aws-rose/10 border-aws-rose/30" },
  process: { icon: Cpu, color: "text-aws-cyan", bg: "bg-aws-cyan/10 border-aws-cyan/30" },
};

export function ArchitectureDiagram({ nodes, edges, caption }: ArchitectureDiagramProps) {
  // Simple layered layout: detect root nodes (no incoming edges) and put them at top
  const incomingCount = React.useMemo(() => {
    const counts: Record<string, number> = {};
    nodes.forEach((n) => (counts[n.id] = 0));
    edges.forEach((e) => {
      counts[e.to] = (counts[e.to] || 0) + 1;
    });
    return counts;
  }, [nodes, edges]);

  // Group by BFS levels
  const levels = React.useMemo(() => {
    const visited = new Set<string>();
    const result: string[][] = [];
    let current = nodes.filter((n) => incomingCount[n.id] === 0).map((n) => n.id);
    if (current.length === 0) current = [nodes[0]?.id].filter(Boolean) as string[];

    while (current.length > 0) {
      result.push(current);
      current.forEach((id) => visited.add(id));
      const next: string[] = [];
      edges.forEach((e) => {
        if (current.includes(e.from) && !visited.has(e.to) && !next.includes(e.to)) {
          next.push(e.to);
        }
      });
      current = next;
    }
    // Add any unvisited nodes
    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        if (result.length === 0) result.push([n.id]);
        else result[result.length - 1].push(n.id);
      }
    });
    return result;
  }, [nodes, edges, incomingCount]);

  const nodeMap = React.useMemo(() => {
    const map: Record<string, ArchitectureNode> = {};
    nodes.forEach((n) => (map[n.id] = n));
    return map;
  }, [nodes]);

  return (
    <div className="my-6">
      <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
        <div className="flex flex-col items-center gap-8 min-w-fit">
          {levels.map((level, levelIdx) => (
            <React.Fragment key={levelIdx}>
              <div className="flex flex-wrap items-stretch justify-center gap-3">
                {level.map((nodeId) => {
                  const node = nodeMap[nodeId];
                  if (!node) return null;
                  const config = nodeConfig[node.type] || nodeConfig.service;
                  const Icon = config.icon;
                  return (
                    <div
                      key={nodeId}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 min-w-[140px] max-w-[200px] text-center",
                        config.bg
                      )}
                    >
                      <Icon className={cn("w-6 h-6", config.color)} />
                      <div className={cn("text-xs font-medium", config.color)}>{node.label}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono">{node.type}</div>
                    </div>
                  );
                })}
              </div>
              {levelIdx < levels.length - 1 && (
                <div className="flex flex-col items-center gap-1">
                  {/* Arrows from this level to next */}
                  <div className="flex flex-wrap gap-2 max-w-2xl justify-center">
                    {edges
                      .filter((e) => level.includes(e.from) && levels[levelIdx + 1]?.includes(e.to))
                      .map((e, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="text-[10px] text-muted-foreground mb-1 max-w-[120px] truncate">
                            {e.label || "→"}
                          </div>
                          <div className="text-aws-orange text-2xl">↓</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {caption && <div className="text-xs text-muted-foreground mt-2 text-center">{caption}</div>}
    </div>
  );
}
