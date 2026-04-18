export interface StatItem {
  value: string;
  label: string;
}

export interface StatsStripProps {
  stats: StatItem[];
  accentColor?: string;
}

export default function StatsStrip({ stats, accentColor = 'text-purple-600' }: StatsStripProps) {
  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-3xl font-black ${accentColor} sm:text-4xl`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
