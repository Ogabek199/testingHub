import { TestDetailClient } from "@/components/tests/TestDetailClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test tafsilotlari — QA sinov natijalari",
  description:
    "QA test ijrosi, test kodi va batafsil natijalar. Professional dasturiy ta'minot sinov hisoboti.",
  robots: {
    index: true,
    follow: true,
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

export default function TestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <TestDetailClient id={params.id} />;
}
