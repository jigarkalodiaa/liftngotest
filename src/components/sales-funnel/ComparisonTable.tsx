import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';

export type ComparisonRow = {
  feature: string;
  liftngo: ReactNode;
  traditional: ReactNode;
};

type Props = {
  rows: ComparisonRow[];
  liftngoLabel?: string;
  traditionalLabel?: string;
};

function Cell({ children, highlight }: { children: ReactNode; highlight?: boolean }) {
  return (
    <td
      className={`px-3 py-3 text-sm sm:px-4 sm:text-base ${highlight ? 'bg-[var(--funnel-action-muted)] font-medium text-gray-900' : 'text-gray-700'}`}
    >
      {children}
    </td>
  );
}

export default function ComparisonTable({
  rows,
  liftngoLabel = 'Liftngo',
  traditionalLabel = 'Typical local vendors',
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md ring-1 ring-gray-900/5">
      <table className="w-full min-w-[280px] border-collapse text-left">
        <caption className="sr-only">
          Comparison of {liftngoLabel} and {traditionalLabel} for B2B logistics in Noida and Delhi NCR
        </caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/90">
            <th scope="col" className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 sm:px-4">
              Capability
            </th>
            <th scope="col" className="px-3 py-3 text-xs font-bold uppercase tracking-[0.06em] text-[var(--color-primary)] sm:px-4">
              {liftngoLabel}
            </th>
            <th scope="col" className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 sm:px-4">
              {traditionalLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row.feature)} className="border-b border-gray-100 last:border-0">
              <th scope="row" className="px-3 py-3 text-sm font-semibold text-gray-900 sm:px-4 sm:text-base">
                {row.feature}
              </th>
              <Cell highlight>{row.liftngo}</Cell>
              <Cell>{row.traditional}</Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompareCheck() {
  return (
    <span className="inline-flex items-center gap-1 text-[var(--funnel-action)]">
      <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
      Yes
    </span>
  );
}

export function CompareCross() {
  return (
    <span className="inline-flex items-center gap-1 text-gray-500">
      <X className="h-4 w-4 shrink-0 text-red-500" strokeWidth={2.5} aria-hidden />
      Often missing
    </span>
  );
}
