'use client';

import { CheckCircle2 } from 'lucide-react';
import { PRIMARY } from '../constants';

interface DurationSliderProps {
  value: number;
  onChange: (value: number) => void;
  progress: number;
}

export function DurationSlider({ value, onChange, progress }: DurationSliderProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">Campaign Duration</label>
        <div className="rounded-xl border-2 border-gray-100 bg-white px-4 py-2 text-center shadow-sm">
          <span className="text-2xl font-black" style={{ color: PRIMARY }}>{value}</span>
          <span className="ml-1 text-sm text-gray-500">Month{value > 1 ? 's' : ''}</span>
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={12}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="premium-slider w-full"
        style={{ '--progress': `${progress}%` } as React.CSSProperties}
      />
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>1 mo</span>
        <span>3 mo</span>
        <span>6 mo</span>
        <span>9 mo</span>
        <span>12 mo</span>
      </div>
      {value >= 3 && value <= 6 && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Best value at 3–6 months
        </p>
      )}
    </div>
  );
}
