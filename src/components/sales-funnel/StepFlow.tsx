import type { ReactNode } from 'react';

export type StepItem = {
  title: string;
  description: string;
  icon?: ReactNode;
};

type Props = {
  steps: StepItem[];
};

export default function StepFlow({ steps }: Props) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-4 rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-900/5 funnel-card-lift">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-extrabold text-white"
            aria-hidden
          >
            {i + 1}
          </div>
          <div className="min-w-0">
            {step.icon ? <div className="mb-2 text-[var(--funnel-action)]">{step.icon}</div> : null}
            <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
