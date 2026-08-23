"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  label,
  className,
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-3",
    xl: "h-14 w-14 border-4",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-4",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <Loader2
          className={cn(
            "animate-spin text-primary shrink-0",
            sizeMap[size]
          )}
        />
      </div>
      {label && (
        <p className="text-xs md:text-sm font-medium text-muted-foreground animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
