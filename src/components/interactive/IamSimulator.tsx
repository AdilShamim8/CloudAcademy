"use client";

import * as React from "react";
import {
  ArrowLeft,
  ShieldCheck,
  FileJson,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Lock,
  Sparkles,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PolicyStatement {
  Effect: "Allow" | "Deny";
  Action: string | string[];
  Resource: string | string[];
}

interface PolicyDocument {
  Version?: string;
  Statement?: PolicyStatement | PolicyStatement[];
}

interface TestScenario {
  id: string;
  label: string;
  action: string;
  resource: string;
  expected: "Allow" | "Deny";
}

interface EvaluationResult {
  decision: "Allow" | "Deny";
  matchedStatements: {
    index: number;
    effect: "Allow" | "Deny";
    reason: string;
  }[];
  explanation: string;
}

interface PolicyParseResult {
  ok: boolean;
  policy?: PolicyDocument;
  error?: string;
  warnings?: string[];
}

// ---------------------------------------------------------------------------
// Sample policy & test scenarios
// ---------------------------------------------------------------------------

const SAMPLE_POLICY = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::my-bucket"
    }
  ]
}`;

const TEST_SCENARIOS: TestScenario[] = [
  {
    id: "s1",
    label: "Read object from my-bucket",
    action: "s3:GetObject",
    resource: "arn:aws:s3:::my-bucket/file.txt",
    expected: "Allow",
  },
  {
    id: "s2",
    label: "Write object to my-bucket",
    action: "s3:PutObject",
    resource: "arn:aws:s3:::my-bucket/file.txt",
    expected: "Deny",
  },
  {
    id: "s3",
    label: "Delete object from my-bucket",
    action: "s3:DeleteObject",
    resource: "arn:aws:s3:::my-bucket/file.txt",
    expected: "Deny",
  },
  {
    id: "s4",
    label: "List my-bucket contents",
    action: "s3:ListBucket",
    resource: "arn:aws:s3:::my-bucket",
    expected: "Allow",
  },
  {
    id: "s5",
    label: "Read object from other-bucket",
    action: "s3:GetObject",
    resource: "arn:aws:s3:::other-bucket/file.txt",
    expected: "Deny",
  },
];

// ---------------------------------------------------------------------------
// Policy parsing & validation
// ---------------------------------------------------------------------------

function parsePolicy(raw: string): PolicyParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Policy is empty." };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `Invalid JSON: ${msg}` };
  }
  const policy = parsed as PolicyDocument;
  if (typeof policy !== "object" || policy === null) {
    return { ok: false, error: "Policy must be a JSON object." };
  }
  const warnings: string[] = [];
  if (!policy.Version) {
    warnings.push(
      'Missing "Version" field. AWS recommends "2012-10-17" for all new policies.',
    );
  }
  if (!policy.Statement) {
    return {
      ok: false,
      error: 'Policy must contain a "Statement" field (array or object).',
    };
  }
  const statements = Array.isArray(policy.Statement)
    ? policy.Statement
    : [policy.Statement];
  if (statements.length === 0) {
    return { ok: false, error: '"Statement" array is empty.' };
  }
  for (let i = 0; i < statements.length; i++) {
    const s = statements[i];
    if (!s.Effect || (s.Effect !== "Allow" && s.Effect !== "Deny")) {
      return {
        ok: false,
        error: `Statement ${i + 1}: "Effect" must be "Allow" or "Deny".`,
      };
    }
    if (!s.Action) {
      warnings.push(`Statement ${i + 1}: missing "Action" field.`);
    }
    if (!s.Resource) {
      warnings.push(`Statement ${i + 1}: missing "Resource" field.`);
    }
  }
  return { ok: true, policy: { ...policy, Statement: statements }, warnings };
}

// ---------------------------------------------------------------------------
// Wildcard matching
// ---------------------------------------------------------------------------

function wildcardMatch(pattern: string, value: string): boolean {
  // Convert glob-style pattern to regex: '*' -> '.*', '?' -> '.'
  // Escape regex special characters except * and ?
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const regexStr = escaped.replace(/\*/g, ".*").replace(/\?/g, ".");
  const re = new RegExp(`^${regexStr}$`, "i");
  return re.test(value);
}

function actionMatches(pattern: string | string[], action: string): boolean {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  return patterns.some((p) => wildcardMatch(p, action));
}

function resourceMatches(
  pattern: string | string[],
  resource: string,
): boolean {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  return patterns.some((p) => wildcardMatch(p, resource));
}

// ---------------------------------------------------------------------------
// Policy evaluation logic
// ---------------------------------------------------------------------------

function evaluatePolicy(
  policy: PolicyDocument,
  action: string,
  resource: string,
): EvaluationResult {
  const statements = Array.isArray(policy.Statement)
    ? policy.Statement
    : policy.Statement
      ? [policy.Statement]
      : [];
  const matched: EvaluationResult["matchedStatements"] = [];
  let hasAllow = false;
  let hasDeny = false;

  statements.forEach((s, idx) => {
    const actionOk = s.Action ? actionMatches(s.Action, action) : false;
    const resourceOk = s.Resource
      ? resourceMatches(s.Resource, resource)
      : true; // If no resource specified, matches all (rare in practice)
    if (actionOk && resourceOk) {
      matched.push({
        index: idx + 1,
        effect: s.Effect,
        reason: `Action "${action}" matched pattern ${JSON.stringify(s.Action)} and resource "${resource}" matched pattern ${JSON.stringify(s.Resource)}.`,
      });
      if (s.Effect === "Allow") hasAllow = true;
      if (s.Effect === "Deny") hasDeny = true;
    }
  });

  let decision: "Allow" | "Deny" = "Deny";
  let explanation = "";
  if (hasDeny) {
    decision = "Deny";
    explanation =
      "Explicit Deny wins. At least one matching statement denies this request — Deny always overrides Allow.";
  } else if (hasAllow) {
    decision = "Allow";
    explanation =
      "At least one matching Allow statement grants this request, and no Deny statement matched.";
  } else {
    decision = "Deny";
    explanation =
      "Implicit Deny. No statement in the policy matched this action/resource combination — AWS starts from a default deny.";
  }

  return { decision, matchedStatements: matched, explanation };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function IamSimulator() {
  const navigate = useAppStore((s) => s.navigate);
  const [policyText, setPolicyText] = React.useState(SAMPLE_POLICY);
  const [parseResult, setParseResult] = React.useState<PolicyParseResult>(() =>
    parsePolicy(SAMPLE_POLICY),
  );
  const [results, setResults] = React.useState<
    Record<string, EvaluationResult>
  >({});

  const validate = React.useCallback(() => {
    setParseResult(parsePolicy(policyText));
  }, [policyText]);

  const runAllTests = React.useCallback(() => {
    const parsed = parsePolicy(policyText);
    setParseResult(parsed);
    if (!parsed.ok || !parsed.policy) {
      setResults({});
      return;
    }
    const next: Record<string, EvaluationResult> = {};
    for (const scenario of TEST_SCENARIOS) {
      next[scenario.id] = evaluatePolicy(
        parsed.policy,
        scenario.action,
        scenario.resource,
      );
    }
    setResults(next);
  }, [policyText]);

  // Re-validate on text change (debounced via React's typical render cycle is fine here)
  React.useEffect(() => {
    const id = setTimeout(() => {
      setParseResult(parsePolicy(policyText));
    }, 250);
    return () => clearTimeout(id);
  }, [policyText]);

  const passedCount = TEST_SCENARIOS.filter(
    (s) => results[s.id]?.decision === s.expected,
  ).length;

  return (
    <div className="space-y-6">
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
              style={{ backgroundColor: "var(--aws-rose)", opacity: 0.12 }}
            >
              <ShieldCheck
                className="w-7 h-7"
                style={{ color: "var(--aws-rose)" }}
              />
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-aws-rose/15 text-aws-rose border-aws-rose/30 hover:bg-aws-rose/20">
                <Lock className="w-3 h-3 mr-1" />
                Safe Simulated Environment
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                IAM Policy Simulator
              </h1>
              <p className="text-muted-foreground mt-1 max-w-3xl">
                Write an IAM policy in JSON, then test how AWS evaluates it
                against real-world API calls. This is a{" "}
                <strong>safe, simulated environment</strong> — no real AWS
                resources are accessed. Perfect for understanding how Allow,
                Deny, and wildcards interact before deploying to production.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main grid: editor (left) + scenarios (right) */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Policy editor */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileJson className="w-5 h-5 text-aws-cyan" />
              Policy Editor
            </CardTitle>
            <CardDescription>
              Edit the JSON policy below. Validation runs automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            <Textarea
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              spellCheck={false}
              className="font-mono text-xs min-h-[320px] leading-relaxed resize-y"
              aria-label="IAM policy JSON editor"
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={validate}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Validate Policy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPolicyText(SAMPLE_POLICY)}
              >
                Reset to sample
              </Button>
            </div>

            {/* Validation result */}
            {parseResult.ok ? (
              <Alert className="border-aws-emerald/40 bg-aws-emerald/10">
                <CheckCircle2 className="w-4 h-4 text-aws-emerald" />
                <AlertTitle className="text-aws-emerald">
                  Valid policy structure
                </AlertTitle>
                <AlertDescription className="text-xs">
                  {Array.isArray(parseResult.policy?.Statement)
                    ? `${parseResult.policy?.Statement.length} statement(s) detected.`
                    : "1 statement detected."}
                  {parseResult.warnings && parseResult.warnings.length > 0 && (
                    <span className="block mt-1 text-aws-amber">
                      ⚠ {parseResult.warnings.join(" ")}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert
                variant="destructive"
                className="border-aws-rose/40 bg-aws-rose/10"
              >
                <XCircle className="w-4 h-4 text-aws-rose" />
                <AlertTitle className="text-aws-rose">
                  Invalid policy
                </AlertTitle>
                <AlertDescription className="text-xs">
                  {parseResult.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Test scenarios */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="w-5 h-5 text-aws-orange" />
                  Test Scenarios
                </CardTitle>
                <CardDescription>
                  Evaluate API calls against the policy.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={runAllTests}
                disabled={!parseResult.ok}
              >
                <Play className="w-4 h-4 mr-1" />
                Run All Tests
              </Button>
            </div>
            {Object.keys(results).length > 0 && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <Badge
                  className={
                    passedCount === TEST_SCENARIOS.length
                      ? "bg-aws-emerald/20 text-aws-emerald"
                      : "bg-aws-amber/20 text-aws-amber"
                  }
                >
                  {passedCount} / {TEST_SCENARIOS.length} passed
                </Badge>
                <span className="text-muted-foreground">
                  Expected vs actual decision
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3 max-h-[520px] overflow-y-auto scroll-area-thin pr-1">
              {TEST_SCENARIOS.map((scenario) => {
                const result = results[scenario.id];
                const actual = result?.decision;
                const pass = actual === scenario.expected;
                return (
                  <div
                    key={scenario.id}
                    className={cn(
                      "rounded-lg border p-3 transition-colors",
                      actual
                        ? pass
                          ? "border-aws-emerald/40 bg-aws-emerald/5"
                          : "border-aws-rose/40 bg-aws-rose/5"
                        : "border-border",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-medium text-sm">
                        {scenario.label}
                      </div>
                      {actual ? (
                        pass ? (
                          <CheckCircle2 className="w-4 h-4 text-aws-emerald shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-aws-rose shrink-0" />
                        )
                      ) : (
                        <Play className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                      )}
                    </div>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-16 shrink-0">
                          action:
                        </span>
                        <code className="text-aws-cyan">{scenario.action}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-16 shrink-0">
                          resource:
                        </span>
                        <code className="text-aws-cyan break-all">
                          {scenario.resource}
                        </code>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        Expected:
                      </span>
                      <ResultBadge decision={scenario.expected} muted />
                      <span className="text-xs text-muted-foreground ml-1">
                        Actual:
                      </span>
                      {actual ? (
                        <ResultBadge decision={actual} />
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Not run
                        </Badge>
                      )}
                    </div>

                    {result && (
                      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1.5">
                        <div className="flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-aws-cyan mt-0.5 shrink-0" />
                          <span>{result.explanation}</span>
                        </div>
                        {result.matchedStatements.length > 0 && (
                          <div className="pl-5 space-y-1">
                            <div className="text-xs font-medium">
                              Matching statements:
                            </div>
                            {result.matchedStatements.map((m, i) => (
                              <div key={i} className="text-xs">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] mr-1",
                                    m.effect === "Allow"
                                      ? "border-aws-emerald/40 text-aws-emerald"
                                      : "border-aws-rose/40 text-aws-rose",
                                  )}
                                >
                                  #{m.index} {m.effect}
                                </Badge>
                                <span className="text-muted-foreground">
                                  {m.reason}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational content */}
      <Card className="border-aws-violet/30 bg-aws-violet/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-aws-violet" />
            How IAM Policy Evaluation Works
          </CardTitle>
          <CardDescription>
            AWS evaluates every API request through this exact decision flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <EvalStep
              num={1}
              title="Default Deny"
              description="Every request starts as denied. Nothing is allowed unless explicitly granted."
              color="aws-rose"
            />
            <EvalStep
              num={2}
              title="Evaluate all statements"
              description="AWS walks through every Statement in every applicable policy (identity-based, resource-based, SCPs, permission boundaries)."
              color="aws-cyan"
            />
            <EvalStep
              num={3}
              title="Explicit Deny wins"
              description="If any matching statement has Effect: Deny, the final decision is Deny — period. Deny always overrides Allow."
              color="aws-rose"
            />
            <EvalStep
              num={4}
              title="Allow grants access"
              description="If no Deny matched and at least one Allow matched (action AND resource), the request is allowed."
              color="aws-emerald"
            />
            <EvalStep
              num={5}
              title="Result: Allow only if explicitly allowed and not explicitly denied"
              description="Otherwise the implicit Deny from step 1 holds."
              color="aws-violet"
            />
          </ol>
          <Separator className="my-4" />
          <Alert className="border-aws-cyan/30 bg-aws-cyan/5">
            <Info className="w-4 h-4 text-aws-cyan" />
            <AlertTitle className="text-aws-cyan">
              Real-world tip
            </AlertTitle>
            <AlertDescription className="text-xs">
              AWS provides a production-grade{" "}
              <a
                href="https://policysim.aws.amazon.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="underline font-medium hover:text-aws-cyan"
              >
                IAM Policy Simulator
              </a>{" "}
              in the AWS console that can test against your real IAM principals.
              Use this sandbox to learn the model, then verify with the real
              tool before deploying.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ResultBadge({
  decision,
  muted = false,
}: {
  decision: "Allow" | "Deny";
  muted?: boolean;
}) {
  if (decision === "Allow") {
    return (
      <Badge
        className={cn(
          "text-xs",
          muted
            ? "bg-muted text-muted-foreground"
            : "bg-aws-emerald/20 text-aws-emerald",
        )}
      >
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Allow
      </Badge>
    );
  }
  return (
    <Badge
      className={cn(
        "text-xs",
        muted
          ? "bg-muted text-muted-foreground"
          : "bg-aws-rose/20 text-aws-rose",
      )}
    >
      <XCircle className="w-3 h-3 mr-1" />
      Deny
    </Badge>
  );
}

function EvalStep({
  num,
  title,
  description,
  color,
}: {
  num: number;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{
          backgroundColor: `var(--${color})`,
          color: "white",
          opacity: 0.9,
        }}
      >
        {num}
      </div>
      <div>
        <div
          className="font-medium text-sm"
          style={{ color: `var(--${color})` }}
        >
          {title}
        </div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </li>
  );
}
