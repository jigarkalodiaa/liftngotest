'use client';

import { PRIMARY } from '../constants';

interface VehicleSliderProps {
  value: number;
  onChange: (value: number) => void;
  progress: number;
}

export function VehicleSlider({ value, onChange, progress }: VehicleSliderProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">Number of Vehicles</label>
        <div className="rounded-xl border-2 border-gray-100 bg-white px-4 py-2 text-center shadow-sm">
          <span className="text-2xl font-black" style={{ color: PRIMARY }}>{value}</span>
          <span className="ml-1 text-sm text-gray-500">Vehicle{value > 1 ? 's' : ''}</span>
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="premium-slider w-full"
        style={{ '--progress': `${progress}%` } as React.CSSProperties}
      />
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>1</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}
