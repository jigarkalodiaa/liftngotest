export interface CoverageArea {
  area: string;
  time: string;
}

export interface CoverageAreasProps {
  title: string;
  subtitle?: string;
  areas: CoverageArea[];
  accentColor?: string;
  bgColor?: string;
}

export default function CoverageAreas({
  title,
  subtitle,
  areas,
  accentColor = 'bg-purple-100 text-purple-700',
  bgColor = 'bg-gray-50',
}: CoverageAreasProps) {
  return (
    <section className={bgColor}>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-4 text-gray-600">{subtitle}</p>}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((item) => (
            <div
              key={item.area}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
            >
              <span className="font-medium text-gray-900">{item.area}</span>
              <span className={`rounded-full ${accentColor} px-3 py-1 text-sm font-bold`}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
