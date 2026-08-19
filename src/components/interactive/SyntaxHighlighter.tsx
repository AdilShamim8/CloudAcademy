"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  caption?: string;
}

// Simple syntax highlighter — uses Prism-like coloring but lightweight
// Highlights comments, strings, numbers, keywords, and commands

const languageKeywords: Record<string, string[]> = {
  bash: ["aws", "sudo", "yum", "apt", "npm", "docker", "kubectl", "git", "cd", "ls", "cat", "echo", "export", "for", "in", "do", "done", "if", "then", "fi", "while", "read"],
  python: ["def", "import", "from", "as", "if", "else", "elif", "for", "while", "return", "class", "try", "except", "finally", "with", "lambda", "True", "False", "None", "and", "or", "not", "in", "is", "print", "lambda", "yield", "global", "nonlocal", "pass", "break", "continue", "raise", "assert", "del"],
  javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "extends", "import", "export", "default", "async", "await", "new", "this", "typeof", "instanceof", "true", "false", "null", "undefined", "try", "catch", "finally", "throw", "break", "continue", "yield", "static"],
  typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "extends", "implements", "import", "export", "default", "async", "await", "new", "this", "typeof", "instanceof", "true", "false", "null", "undefined", "try", "catch", "finally", "throw", "interface", "type", "enum", "namespace", "public", "private", "protected", "readonly", "static"],
  json: ["true", "false", "null"],
  yaml: ["Resources", "Properties", "Type", "Description", "Service", "Effect", "Action", "Resource", "Principal", "Version", "Statement", "DependsOn", "Metadata", "Outputs"],
  dockerfile: ["FROM", "RUN", "COPY", "ADD", "WORKDIR", "CMD", "ENTRYPOINT", "ENV", "ARG", "EXPOSE", "VOLUME", "USER", "LABEL", "HEALTHCHECK", "ONBUILD", "STOPSIGNAL", "SHELL", "AS", "MAINTAINER"],
};

interface Token {
  type: "plain" | "comment" | "string" | "keyword" | "number" | "punct" | "function";
  value: string;
}

function tokenizeLine(line: string, language: string): Token[] {
  const keywords = languageKeywords[language] || [];
  const tokens: Token[] = [];
  let i = 0;
  let buffer = "";

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    if (keywords.includes(buffer)) {
      tokens.push({ type: "keyword", value: buffer });
    } else if (/^\d+$/.test(buffer)) {
      tokens.push({ type: "number", value: buffer });
    } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(buffer)) {
      // Check if next non-space char is '(' (function call)
      tokens.push({ type: "function", value: buffer });
    } else {
      tokens.push({ type: "plain", value: buffer });
    }
    buffer = "";
  };

  while (i < line.length) {
    const ch = line[i];

    // Line comment
    if (language === "bash" && ch === "#") {
      tokens.push({ type: "plain", value: buffer });
      buffer = "";
      tokens.push({ type: "comment", value: line.slice(i) });
      break;
    }
    if ((language === "python" || language === "yaml") && ch === "#") {
      tokens.push({ type: "plain", value: buffer });
      buffer = "";
      tokens.push({ type: "comment", value: line.slice(i) });
      break;
    }
    if (language === "dockerfile" && (i === 0 || line.slice(0, i).trim() === "") && /^[A-Z]+$/.test(line.slice(i).split(/\s/)[0])) {
      flushBuffer();
      const kw = line.slice(i).split(/\s/)[0];
      tokens.push({ type: "keyword", value: kw });
      i += kw.length;
      continue;
    }

    // String (single or double quote)
    if (ch === '"' || ch === "'") {
      flushBuffer();
      const quote = ch;
      let str = ch;
      i++;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === "\\" && i + 1 < line.length) {
          str += line[i] + line[i + 1];
          i += 2;
          continue;
        }
        str += line[i];
        i++;
      }
      if (i < line.length) {
        str += line[i];
        i++;
      }
      tokens.push({ type: "string", value: str });
      continue;
    }

    // Word boundary
    if (/\s/.test(ch) || /[(){}\[\],.;:]/.test(ch)) {
      flushBuffer();
      tokens.push({ type: "punct", value: ch });
      i++;
      continue;
    }

    buffer += ch;
    i++;
  }
  flushBuffer();
  return tokens;
}

function tokenColor(type: Token["type"]): string {
  switch (type) {
    case "comment": return "text-muted-foreground italic";
    case "string": return "text-aws-emerald";
    case "keyword": return "text-aws-violet font-medium";
    case "number": return "text-aws-orange";
    case "function": return "text-aws-cyan";
    case "punct": return "text-muted-foreground";
    default: return "text-foreground";
  }
}

export function SyntaxHighlighter({ code, language, caption }: SyntaxHighlighterProps) {
  const [copied, setCopied] = React.useState(false);
  const lines = code.split("\n");

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-4">
      <div className="rounded-lg overflow-hidden border border-border bg-zinc-950 text-zinc-50">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground uppercase">{language}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={copy}
            className="h-7 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
        <pre className="code-block p-4 overflow-x-auto">
          <code className="text-sm">
            {lines.map((line, idx) => (
              <div key={idx} className="flex">
                <span className="select-none text-zinc-700 pr-4 text-right w-10 shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1 whitespace-pre">
                  {line.length === 0 ? (
                    <span>&nbsp;</span>
                  ) : (
                    tokenizeLine(line, language).map((token, i) => (
                      <span key={i} className={tokenColor(token.type)}>
                        {token.value}
                      </span>
                    ))
                  )}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
      {caption && <div className="text-xs text-muted-foreground mt-2">{caption}</div>}
    </div>
  );
}
