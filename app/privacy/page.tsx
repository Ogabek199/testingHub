import type { Metadata } from "next";
import { PrivacyPolicyClient } from "@/components/privacy/PrivacyPolicyClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Maxfiylik Siyosati",
  description:
    "QA.TestingHub maxfiylik siyosati. Shaxsiy ma'lumotlaringiz qanday himoyalanishi, xavfsizlik choralari va ma'lumotlar daxlsizligi haqida to'liq ma'lumot.",
  alternates: {
    canonical: "https://testinghub.uz/privacy",
  },
  openGraph: {
    title: "Maxfiylik Siyosati | QA.TestingHub",
    description:
      "QA.TestingHub maxfiylik siyosati. Shaxsiy ma'lumotlaringiz xavfsizligi haqida batafsil ma'lumot.",
    url: "https://testinghub.uz/privacy",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Maxfiylik Siyosati | QA.TestingHub",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "https://testinghub.uz" },
          { name: "Maxfiylik siyosati", url: "https://testinghub.uz/privacy" },
        ]}
      />
      <PrivacyPolicyClient />
    </>
  );
}
