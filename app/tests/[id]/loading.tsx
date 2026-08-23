import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TestDetailLoading() {
  return (
    <div className="container-max section-padding py-8 space-y-8 animate-in fade-in duration-200">
      {/* Back button + Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24 rounded-lg" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-64 rounded-xl" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-96 rounded-md" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-card space-y-2"
          >
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-7 w-28 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Details Box Skeleton */}
      <div className="p-6 md:p-8 rounded-3xl border border-black/[0.06] dark:border-white/[0.06] bg-card space-y-6">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-black/[0.03] dark:border-white/[0.03] flex items-center justify-between"
            >
              <div className="space-y-1">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
