import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, Clock, Copy } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Test tafsilotlari",
};

const testRuns = [
  { id: 1, status: "passed", duration: "1.2s", date: "2026-08-23 14:30", by: "Ali V." },
  { id: 2, status: "failed", duration: "1.8s", date: "2026-08-23 11:15", by: "Auto" },
  { id: 3, status: "passed", duration: "1.1s", date: "2026-08-22 16:45", by: "Bekzod T." },
  { id: 4, status: "passed", duration: "0.9s", date: "2026-08-22 09:20", by: "Auto" },
];

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
  return (
    <div className="container-max section-padding py-10">
      {/* Back */}
      <Link
        href="/tests"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Testlarga qaytish
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              API autentifikatsiya testi
            </h1>
            <Badge variant="success" dot>O&apos;tdi</Badge>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Test ID: <span className="font-mono text-zinc-700 dark:text-zinc-300">test_{params.id}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            Qayta ishga tushir
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4" />
            Ishga tushir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Code */}
          <Card variant="elevated" padding="none">
            <CardHeader className="px-6 pt-5 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Test kodi</CardTitle>
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <pre className="px-6 py-4 font-mono text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 rounded-b-2xl overflow-x-auto leading-relaxed">
                <code>{`describe('API Auth Tests', () => {
  it('should login with valid credentials', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'secret123'
      })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'wrong@email.com',
        password: 'wrongpass'
      })
    });
    
    expect(response.status).toBe(401);
  });
});`}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Run history */}
          <Card variant="elevated" padding="none">
            <CardHeader className="px-6 pt-5 pb-4">
              <CardTitle>Ishga tushirish tarixi</CardTitle>
              <CardDescription>So&apos;nggi 4 ta natija</CardDescription>
            </CardHeader>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {testRuns.map((run) => (
                <div key={run.id} className="flex items-center gap-4 px-6 py-4">
                  {run.status === "passed" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {run.date}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {run.by} tomonidan
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {run.duration}
                    </span>
                    <Badge
                      variant={run.status === "passed" ? "success" : "danger"}
                      size="sm"
                    >
                      {run.status === "passed" ? "O'tdi" : "Xato"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card variant="elevated" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Test ma&apos;lumotlari</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Kategoriya", value: "API" },
                  { label: "Oxirgi ishlash", value: "14:30, bugun" },
                  { label: "O'rtacha vaqt", value: "1.25s" },
                  { label: "Muvaffaqiyat darajasi", value: "92%" },
                  { label: "Yaratildi", value: "2026-07-01" },
                  { label: "Muallif", value: "Ali Valiyev" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">{item.label}</dt>
                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card variant="elevated" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Teglar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["auth", "api", "jwt", "security", "login"].map((tag) => (
                  <Badge key={tag} variant="outline" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
