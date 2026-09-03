import { TestDetailClient } from "@/components/tests/TestDetailClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

const testInfoMap: Record<string, { title: string; desc: string }> = {
  "1": {
    title: "API Autentifikatsiya Testi",
    desc: "Token-based auth va JWT tekshiruvi bo'yicha QA sinov hisoboti va test kodi.",
  },
  "2": {
    title: "Ma'lumotlar Bazasi Ulanish Testi",
    desc: "PostgreSQL connection pool va query tezligini sinovdan o'tkazish hisoboti.",
  },
  "3": {
    title: "Fayl Yuklash Xizmati Testi",
    desc: "S3 bucket upload va download tezligini sinash bo'yicha QA hisoboti.",
  },
  "4": {
    title: "Email Xabarnomalar Testi",
    desc: "SMTP server va elektron pochta shablonlari renderini tekshirish hisoboti.",
  },
  "5": {
    title: "To'lov Tizimi Integratsiyasi Testi",
    desc: "Payme va Click to'lov tizimlari API integratsiyasini sinovdan o'tkazish natijalari.",
  },
  "6": {
    title: "Cache Invalidation Testi",
    desc: "Redis cache va TTL ma'lumotlar dolzarbligini sinash bo'yicha hisobot.",
  },
};

export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const testInfo = testInfoMap[params.id] || {
    title: `QA Test #${params.id}`,
    desc: "Professional QA sinov hisoboti, test kodi va ijro natijalari.",
  };

  const title = `${testInfo.title} — QA Test Natijalari`;
  const url = `https://testinghub.uz/tests/${params.id}`;

  return {
    title,
    description: testInfo.desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | QA.TestingHub`,
      description: testInfo.desc,
      url,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default function TestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const testInfo = testInfoMap[params.id] || {
    title: `Test #${params.id}`,
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "https://testinghub.uz" },
          { name: "Testlar", url: "https://testinghub.uz/tests" },
          { name: testInfo.title, url: `https://testinghub.uz/tests/${params.id}` },
        ]}
      />
      <TestDetailClient id={params.id} />
    </>
  );
}
