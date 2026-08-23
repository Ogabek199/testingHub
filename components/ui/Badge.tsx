import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  dot = false,
}: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide";

  const variants = {
    default:
      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    success:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    warning:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    danger:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    info:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
    outline:
      "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  const dotColors = {
    default: "bg-zinc-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-indigo-500",
    outline: "bg-zinc-400",
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0 animate-pulse", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
