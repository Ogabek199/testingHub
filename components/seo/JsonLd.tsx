import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT_PHONE,
  CONTACT_TELEGRAM,
  CONTACT_LINKEDIN,
  CONTACT_INSTAGRAM,
} from "@/lib/constants";

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

// ===== Structured Data Generators (Schema.org) =====

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: ["TestingHub", "TestingHub Uzbekistan", "QA TestingHub", "QA.TestingHub Uzbekistan"],
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    description: SITE_DESCRIPTION,
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UZ",
      addressLocality: "Tashkent",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: CONTACT_PHONE,
      url: CONTACT_TELEGRAM,
      availableLanguage: ["uz", "ru", "en"],
    },
    sameAs: [
      CONTACT_TELEGRAM,
      CONTACT_LINKEDIN,
      CONTACT_INSTAGRAM,
      "https://github.com/Ogabek199/testingHub",
    ],
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
    name: SITE_NAME,
    alternateName: "TestingHub — Professional QA Testing Platform",
    url: SITE_URL,
    inLanguage: ["uz", "ru", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tests?q={search_term_string}`,
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
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web, iOS, Android, Cloud",
    url: SITE_URL,
    description:
      "Dasturiy ta'minotingizdagi kritik xatolarni foydalanuvchilarga yetib bormasdan toping. Professional QA testing va test avtomatlashtirish xizmati.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "UZS",
      description: "Bepul QA audit va konsultatsiya",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "34",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return <JsonLd data={data} />;
}

export function ProfessionalServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    image: `${SITE_URL}/og-image.png`,
    url: SITE_URL,
    telephone: CONTACT_PHONE,
    priceRange: "$$",
    currenciesAccepted: "UZS, USD",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, Payme, Click",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UZ",
      addressLocality: "Tashkent",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.2995,
      longitude: 69.2401,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    description:
      "Professional QA va dasturiy ta'minot sinov xizmati. Sayt va ilovalarni ISTQB standartlari asosida bug'lardan tozalash.",
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
      "Load Testing",
      "Regression Testing"
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
              "Har bir ekranni, tugmani va biznes-mantik funksiyasini qo'lda tekshirish",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Test Automation",
            description:
              "Playwright, Cypress, Selenium orqali avtomatik testlar yozish va CI/CD integratsiyasi",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "API Testing",
            description:
              "REST, GraphQL va gRPC API endpoint'larni Postman va avtomatlashtirilgan testlar bilan sinash",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Security & Penetration Testing",
            description:
              "OWASP Top-10 xavfsizlik zaifliklarini aniqlash va penetration testing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Performance & Load Testing",
            description:
              "JMeter va k6 vositalari orqali minglab bir vaqtning o'zidagi foydalanuvchilar yuklamasiga chidamlilikni sinash",
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
        name: "QA testing nima va nima uchun kerak?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "QA (Quality Assurance) testing — dasturiy ta'minotning sifatini, xavfsizligini va barqarorligini ta'minlash jarayoni. Dasturdagi kritik xatolarni real foydalanuvchilarga yetib bormasdan oldin topish va kompaniyani millionlab so'mlik zarardan hamda obro' yo'qotishdan asrash uchun qo'llaniladi.",
        },
      },
      {
        "@type": "Question",
        name: "QA testing xizmati narxi qanday hisoblanadi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Narx loyihaning hajmi, arxitekturasi va test turlariga (manual, avtomatlashtirish, yuklama testi) bog'liq. Saytimizdagi interaktiv kalkulyatordan foydalanib o'z loyihangiz narxini hisoblashingiz yoki Telegram orqali mutaxassisimizdan bepul konsultatsiya olishingiz mumkin.",
        },
      },
      {
        "@type": "Question",
        name: "TestingHub jamoasi qanday test turlarini o'tkazadi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Biz Manual testing, Test Automation (Playwright, Cypress), API testing, Security/Penetration testing, Performance/Load testing, Mobile App testing (iOS & Android) va Regression testing xizmatlarini taqdim etamiz.",
        },
      },
      {
        "@type": "Question",
        name: "TestingHub mutaxassislari ISTQB standartlariga amal qiladimi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ha, bizning barcha QA muhandislarimiz xalqaro ISTQB (International Software Testing Qualifications Board) standartlari va eng ilg'or test metodologiyalari asosida faoliyat yuritadi.",
        },
      },
      {
        "@type": "Question",
        name: "QA tekshiruvi qancha vaqt davom etadi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kichik loyihalar va auditlar 3-5 ish kuni, o'rta hajmdagi tizimlar 1-2 hafta, yirik korporativ loyihalar esa 2-4 hafta vaqt oladi. Shuningdek doimiy 24/7 monitoring xizmatimiz ham mavjud.",
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
