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
    <section className="py-16 md:py-24 border-y border-zinc-200/80 dark:border-zinc-800/80">
      <div className="container-max section-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-1 tabular-nums group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-200">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-0.5">
                {stat.label}
              </div>
              <div className="text-xs text-zinc-400 dark:text-zinc-500">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
