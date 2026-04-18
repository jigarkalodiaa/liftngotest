export interface Step {
  step: number;
  title: string;
  description: string;
}

export interface HowItWorksProps {
  title: string;
  subtitle?: string;
  steps: Step[];
  accentColor?: string;
  bgColor?: string;
}

export default function HowItWorks({
  title,
  subtitle,
  steps,
  accentColor = 'bg-purple-600',
  bgColor = 'bg-gray-50',
}: HowItWorksProps) {
  return (
    <section className={bgColor}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-4 text-gray-600">{subtitle}</p>}
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="relative text-center">
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${accentColor} text-2xl font-bold text-white`}>
                {step.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
