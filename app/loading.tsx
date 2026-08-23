import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-max section-padding py-12 md:py-16 space-y-12 animate-in fade-in duration-300">
      {/* Hero Section Skeleton */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-8 w-48 rounded-full" />
        </div>
        <Skeleton className="h-12 md:h-16 w-3/4 mx-auto rounded-2xl" />
        <Skeleton className="h-6 w-2/3 mx-auto rounded-lg" />
        
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-12 w-40 rounded-xl" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] space-y-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-7 w-24 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 rounded-3xl border border-black/[0.06] dark:border-white/[0.06] space-y-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <div className="pt-2 flex justify-between">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
