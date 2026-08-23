import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "rounded" | "circular";
}

export function Skeleton({
  className,
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-black/[0.06] dark:bg-white/[0.08]",
        variant === "default" && "rounded-lg",
        variant === "rounded" && "rounded-2xl",
        variant === "circular" && "rounded-full",
        className
      )}
      {...props}
    />
  );
}
