"use client";

import React from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ===== Structured Data Generators =====

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "QA.TestingHub",
    alternateName: "TestingHub",
    url: "https://testinghub.uz",
    logo: "https://testinghub.uz/favicon.svg",
    description:
      "Professional QA va dasturiy ta'minot sinov xizmati. O'zbekistonning #1 QA testing platformasi.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://t.me/Javohiir",
      availableLanguage: ["uz", "ru", "en"],
    },
    sameAs: ["https://t.me/Javohiir"],
    areaServed: {
      "@type": "Country",
      name: "Uzbekistan",
    },
    knowsLanguage: ["uz", "ru", "en"],
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "QA.TestingHub",
    alternateName: "TestingHub — Professional QA Testing Platform",
    url: "https://testinghub.uz",
    inLanguage: ["uz", "ru", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://testinghub.uz/tests?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

export function SoftwareApplicationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "QA.TestingHub",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: "https://testinghub.uz",
    description:
      "Dasturiy ta'minotingizdagi kritik xatolarni foydalanuvchilarga yetib bormasdan toping. Professional QA testing xizmati.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "UZS",
      description: "Bepul konsultatsiya mavjud",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "28",
      bestRating: "5",
    },
  };

  return <JsonLd data={data} />;
}

export function ProfessionalServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "QA.TestingHub",
    url: "https://testinghub.uz",
    description:
      "Professional QA va dasturiy ta'minot sinov xizmati. Dasturingizni bug'lardan tozalang.",
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "Uzbekistan",
    },
    serviceType: [
      "Software Testing",
      "QA Testing",
      "Test Automation",
      "Manual Testing",
      "API Testing",
      "Security Testing",
      "Performance Testing",
      "Mobile App Testing",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "QA Testing Xizmatlari",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Manual Testing",
            description:
              "Har bir ekranni, tugmani va funksiyani qo'lda tekshirish",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Test Automation",
            description:
              "Avtomatik testlar yozish va CI/CD integratsiyasi",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "API Testing",
            description:
              "REST va GraphQL API endpoint'larni sinash",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Security Testing",
            description:
              "Xavfsizlik zaifliklarini aniqlash va penetration testing",
          },
        },
      ],
    },
  };

  return <JsonLd data={data} />;
}

export function FAQJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "QA testing nima?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "QA (Quality Assurance) testing — dasturiy ta'minotning sifatini ta'minlash jarayoni. Bug'larni topish, funksionallikni tekshirish va foydalanuvchi tajribasini yaxshilash uchun qo'llaniladi.",
        },
      },
      {
        "@type": "Question",
        name: "QA testing xizmati qancha turadi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Narx loyihaning hajmi va murakkabligiga bog'liq. Bepul konsultatsiya olish uchun saytdagi kalkulyatordan foydalaning yoki Telegram orqali bog'laning.",
        },
      },
      {
        "@type": "Question",
        name: "Qanday turdagi testlar o'tkaziladi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Biz Manual testing, Test automation, API testing, Security testing, Performance testing, Mobile app testing va boshqa ko'plab test turlarini o'tkazamiz.",
        },
      },
      {
        "@type": "Question",
        name: "ISTQB sertifikati nima?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ISTQB (International Software Testing Qualifications Board) — xalqaro QA sertifikat organi. Bizning jamoamiz ISTQB standartlariga mos keladigan testing metodologiyalaridan foydalanadi.",
        },
      },
      {
        "@type": "Question",
        name: "QA xizmati qancha vaqt oladi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oddiy loyihalar 3-5 kun, o'rta darajali loyihalar 1-2 hafta, murakkab loyihalar 2-4 hafta vaqt olishi mumkin. Batafsil ma'lumot uchun bepul konsultatsiya oling.",
        },
      },
    ],
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}
