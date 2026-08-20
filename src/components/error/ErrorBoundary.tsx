"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

/**
 * Production-grade error boundary that catches render errors
 * and shows a friendly recovery UI instead of a blank screen.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, send to error tracking (Sentry, Datadog, etc.)
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} reset={this.reset} />;
    }
    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const goHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-aws-rose/30 bg-card p-8 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-aws-rose/15 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-aws-rose" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            An unexpected error occurred while rendering this page. Your
            progress is safe — try refreshing or going back home.
          </p>
          <div className="rounded-md bg-muted p-3 mb-6 overflow-x-auto">
            <code className="text-xs font-mono text-aws-rose break-all">
              {error.message || "Unknown error"}
            </code>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={reset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try again
            </Button>
            <Button className="flex-1" onClick={goHome}>
              <Home className="w-4 h-4 mr-2" />
              Go home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
