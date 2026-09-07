import type { Metadata } from "next";
import { TestsListClient } from "@/components/tests/TestsListClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "QA Testlar va Sinov Natijalari",
  description:
    "QA test natijalari, test hisobotlari va avtomatlashtirilgan test keyslari. API, Ma'lumotlar bazasi, Storage va Payment bo'yicha batafsil hisobotlar.",
  alternates: {
    canonical: `${SITE_URL}/tests`,
  },
  openGraph: {
    title: "QA Testlar va Sinov Natijalari | QA.TestingHub",
    description:
      "QA test natijalari va test hisobotlari. Dasturiy ta'minotingiz sifatini tekshirish uchun testlar ro'yxati.",
    url: `${SITE_URL}/tests`,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "QA Testlar va Sinov Natijalari | QA.TestingHub",
      },
    ],
  },
};

export default function TestsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: SITE_URL },
          { name: "Testlar", url: `${SITE_URL}/tests` },
        ]}
      />
      <TestsListClient />
    </>
  );
}
