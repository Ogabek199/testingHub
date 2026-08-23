"use client";

import { Hero } from "@/components/sections/Hero";
import { BugCostChart } from "@/components/sections/BugCostChart";
import { QACalculator } from "@/components/sections/QACalculator";
import { QAExplanation } from "@/components/sections/QAExplanation";
import { ServicesComparison } from "@/components/sections/ServicesComparison";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <BugCostChart />
      <QACalculator />
      <QAExplanation />
      <ServicesComparison />
      <ProcessTimeline />
      <CaseStudies />
      <CTA />
    </div>
  );
}
