const stats = [
  {
    value: "2,400+",
    label: "Faol foydalanuvchilar",
    description: "Dunyo bo'ylab",
  },
  {
    value: "98.9%",
    label: "Uptime kafolati",
    description: "SLA asosida",
  },
  {
    value: "1M+",
    label: "Testlar bajarildi",
    description: "Har oy",
  },
  {
    value: "~50ms",
    label: "O'rtacha javob vaqti",
    description: "API so'rovlari",
  },
];

export function Stats() {
  return (
    <section className="py-16 md:py-24 border-y border-black/[0.06] dark:border-white/[0.08] bg-cream-100/40 dark:bg-[#11162a]">
      <div className="container-max section-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="text-4xl md:text-5xl font-black text-foreground mb-1 tabular-nums group-hover:text-primary transition-colors duration-200">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-foreground/80 mb-0.5">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

