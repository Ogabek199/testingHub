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

export const metadata: Metadata = {
  title: "QA.TestingHub — Professional QA Testing Platform | O'zbekiston",
  description:
    "Professional QA va dasturiy ta'minot sinov xizmati. Dasturiy ta'minotingizdagi kritik xatolarni foydalanuvchilarga yetib bormasdan toping. O'zbekistonning #1 QA platformasi.",
  alternates: {
    canonical: "https://testinghub.uz",
  },
  openGraph: {
    title: "QA.TestingHub — Professional QA Testing Platform | O'zbekiston",
    description:
      "Dasturingizdagi kritik xatolarni foydalanuvchilarga yetib bormasdan toping. Manual & Automated QA xizmatlari.",
    url: "https://testinghub.uz",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "QA.TestingHub — Professional QA Testing Platform",
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
