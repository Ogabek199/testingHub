import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { BugCostChart } from "@/components/sections/BugCostChart";
import { QACalculator } from "@/components/sections/QACalculator";
import { QAExplanation } from "@/components/sections/QAExplanation";
import { ServicesComparison } from "@/components/sections/ServicesComparison";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { CTA } from "@/components/sections/CTA";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* FAQ Structured Data for Google Rich Snippets */}
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
