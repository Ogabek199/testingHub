"use client";

import { Hero } from "@/components/sections/Hero";
import { BugCostChart } from "@/components/sections/BugCostChart";
import { QACalculator } from "@/components/sections/QACalculator";
import { QAExplanation } from "@/components/sections/QAExplanation";
import { ServicesComparison } from "@/components/sections/ServicesComparison";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { CTA } from "@/components/sections/CTA";

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  SoftwareApplicationJsonLd,
  ProfessionalServiceJsonLd,
  FAQJsonLd,
} from "@/components/seo/JsonLd";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SEO: Structured Data (JSON-LD) */}
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SoftwareApplicationJsonLd />
      <ProfessionalServiceJsonLd />
      <FAQJsonLd />

      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary>
        <BugCostChart />
      </ErrorBoundary>
      <ErrorBoundary>
        <QACalculator />
      </ErrorBoundary>
      <ErrorBoundary>
        <QAExplanation />
      </ErrorBoundary>
      <ErrorBoundary>
        <ServicesComparison />
      </ErrorBoundary>
      <ErrorBoundary>
        <ProcessTimeline />
      </ErrorBoundary>
      <ErrorBoundary>
        <CaseStudies />
      </ErrorBoundary>
      <ErrorBoundary>
        <CTA />
      </ErrorBoundary>
    </div>
  );
}
