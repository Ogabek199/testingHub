import { Card } from "@/components/ui/Card";
import {
  Zap,
  Shield,
  BarChart3,
  Clock,
  Code2,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Tez ishlaydi",
    description:
      "Parallel test ishga tushirish bilan sekundiga yuzlab testlarni bajaring. Vaqtingizni tejalang.",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Xavfsiz va ishonchli",
    description:
      "Enterprise darajasidagi xavfsizlik. Ma'lumotlaringiz har doim himoyalangan.",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Kuchli analitika",
    description:
      "Testlar natijalarini real vaqtda kuzating. Batafsil hisobotlar va grafiklar.",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    icon: Clock,
    title: "24/7 monitoring",
    description:
      "Tizimingiz holatini doimo kuzatib boring. Muammolar yuz bersa darhol xabar oling.",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-500/10",
  },
  {
    icon: Code2,
    title: "API integratsiya",
    description:
      "Mavjud tizimlaringizga osonlik bilan ulaning. REST API va webhook qo'llab-quvvatlash.",
    color: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-500/10",
  },
  {
    icon: Globe,
    title: "Turli muhitlar",
    description:
      "Development, staging va production muhitlarida bir vaqtda test qiling.",
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-500/10",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 mb-3">
            Imkoniyatlar
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
            Nima uchun{" "}
            <span className="gradient-text">TestingHub</span>?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
            Professional dasturiy ta&apos;minot sifatini ta&apos;minlash uchun zarur
            barcha vositalar bir joyda.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <Card
              key={i}
              variant="default"
              padding="lg"
              hover
              className="group"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg} mb-4 transition-transform duration-200 group-hover:scale-110`}
              >
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
