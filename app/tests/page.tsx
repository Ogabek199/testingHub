import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  Plus,
  Search,
  Filter,
  FlaskConical,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Testlar",
  description: "Barcha test holatlarini ko'ring va boshqaring",
};

const tests = [
  {
    id: "1",
    name: "API autentifikatsiya testi",
    description: "Token-based auth va JWT tekshiruvi",
    status: "passed",
    category: "API",
    duration: "1.2s",
    lastRun: "2 soat oldin",
    passRate: 100,
  },
  {
    id: "2",
    name: "Ma'lumotlar bazasi ulanish",
    description: "PostgreSQL connection pool va query tezligi",
    status: "passed",
    category: "Database",
    duration: "2.8s",
    lastRun: "3 soat oldin",
    passRate: 98,
  },
  {
    id: "3",
    name: "Fayl yuklash xizmat",
    description: "S3 bucket upload va download tezligi",
    status: "failed",
    category: "Storage",
    duration: "4.1s",
    lastRun: "5 soat oldin",
    passRate: 67,
  },
  {
    id: "4",
    name: "Email xabarnomalar",
    description: "SMTP server va template render",
    status: "pending",
    category: "Notification",
    duration: "—",
    lastRun: "Hozir",
    passRate: 89,
  },
  {
    id: "5",
    name: "To'lov tizimi integratsiya",
    description: "Payme va Click API test suite",
    status: "passed",
    category: "Payment",
    duration: "3.5s",
    lastRun: "1 kun oldin",
    passRate: 95,
  },
  {
    id: "6",
    name: "Cache invalidation",
    description: "Redis cache va TTL tekshiruvi",
    status: "failed",
    category: "Performance",
    duration: "0.9s",
    lastRun: "1 kun oldin",
    passRate: 45,
  },
];

const statusConfig = {
  passed: {
    label: "O'tdi",
    variant: "success" as const,
    icon: CheckCircle,
    color: "text-emerald-500",
  },
  failed: {
    label: "Xato",
    variant: "danger" as const,
    icon: XCircle,
    color: "text-red-500",
  },
  pending: {
    label: "Kutmoqda",
    variant: "warning" as const,
    icon: Clock,
    color: "text-amber-500",
  },
};

export default function TestsPage() {
  return (
    <div className="container-max section-padding py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Testlar
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {tests.length} ta test topildi
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Yangi test
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Testlarni qidiring..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button variant="outline" size="md">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["Barchasi", "O'tdi", "Xato", "Kutmoqda"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              i === 0
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Test cards */}
      <div className="grid gap-3">
        {tests.map((test) => {
          const cfg = statusConfig[test.status as keyof typeof statusConfig];
          return (
            <Link key={test.id} href={`/tests/${test.id}`}>
              <Card
                variant="elevated"
                padding="md"
                hover
                className="group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                    <FlaskConical className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-primary transition-colors">
                          {test.name}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                          {test.description}
                        </p>
                      </div>
                      <Badge variant={cfg.variant} dot className="flex-shrink-0">
                        {cfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="outline" size="sm">
                        {test.category}
                      </Badge>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {test.duration}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {test.lastRun}
                      </span>
                      <span className="ml-auto text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {test.passRate}% muvaffaqiyat
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-primary flex-shrink-0 transition-colors mt-3" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
