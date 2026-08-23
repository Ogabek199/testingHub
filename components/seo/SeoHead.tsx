"use client";

import React from "react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  breadcrumbs?: { name: string; url: string }[];
}

/**
 * Client-side SEO head component.
 * Sets document title and meta description dynamically for "use client" pages.
 * Also injects breadcrumb JSON-LD structured data.
 */
export function SeoHead({
  title,
  description,
  canonical,
  noindex = false,
  breadcrumbs,
}: SeoHeadProps) {
  React.useEffect(() => {
    // Set document title
    document.title = title.includes("TestingHub")
      ? title
      : `${title} | QA.TestingHub`;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Set canonical
    if (canonical) {
      let link = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // Set robots
    if (noindex) {
      let metaRobots = document.querySelector('meta[name="robots"]');
      if (!metaRobots) {
        metaRobots = document.createElement("meta");
        metaRobots.setAttribute("name", "robots");
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute("content", "noindex, nofollow");
    }
  }, [title, description, canonical, noindex]);

  return (
    <>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbJsonLd items={breadcrumbs} />
      )}
    </>
  );
}
