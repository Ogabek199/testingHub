import type { Metadata } from "next";
import { PrivacyPolicyClient } from "@/components/privacy/PrivacyPolicyClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Maxfiylik Siyosati",
  description:
    "QA.TestingHub maxfiylik siyosati. Shaxsiy ma'lumotlaringiz qanday himoyalanishi, xavfsizlik choralari va ma'lumotlar daxlsizligi haqida to'liq ma'lumot.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: "Maxfiylik Siyosati | QA.TestingHub",
    description:
      "QA.TestingHub maxfiylik siyosati. Shaxsiy ma'lumotlaringiz xavfsizligi haqida batafsil ma'lumot.",
    url: `${SITE_URL}/privacy`,
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
          { name: "Bosh sahifa", url: SITE_URL },
          { name: "Maxfiylik siyosati", url: `${SITE_URL}/privacy` },
        ]}
      />
      <PrivacyPolicyClient />
    </>
  );
}
