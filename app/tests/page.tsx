import type { Metadata } from "next";
import { TestsListClient } from "@/components/tests/TestsListClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "QA Testlar va Sinov Natijalari",
  description:
    "QA test natijalari, test hisobotlari va avtomatlashtirilgan test keyslari. API, Ma'lumotlar bazasi, Storage va Payment bo'yicha batafsil hisobotlar.",
  alternates: {
    canonical: "https://testinghub.uz/tests",
  },
  openGraph: {
    title: "QA Testlar va Sinov Natijalari | QA.TestingHub",
    description:
      "QA test natijalari va test hisobotlari. Dasturiy ta'minotingiz sifatini tekshirish uchun testlar ro'yxati.",
    url: "https://testinghub.uz/tests",
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
          { name: "Bosh sahifa", url: "https://testinghub.uz" },
          { name: "Testlar", url: "https://testinghub.uz/tests" },
        ]}
      />
      <TestsListClient />
    </>
  );
}
