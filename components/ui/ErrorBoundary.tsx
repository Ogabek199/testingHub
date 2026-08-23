"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 my-4 rounded-2xl border border-red-500/20 bg-red-500/[0.04] dark:bg-red-500/[0.06] flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Xatolik yuz berdi
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">
            {this.state.error?.message || "Ushbu modulni yuklashda xatolik yuz berdi."}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-coral-glow"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Qayta urinish</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
