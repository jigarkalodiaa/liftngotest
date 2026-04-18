'use client';

import { Printer, CheckCircle } from 'lucide-react';
import type { FleetVehicleKind, PrintingTier4W } from '@/lib/branding/fleetBrandingPricing';
import { ACCENT, PRINTING_OPTIONS } from '../constants';

interface PrintingSelectorProps {
  value: PrintingTier4W;
  vehicleType: FleetVehicleKind;
  onChange: (value: PrintingTier4W) => void;
}

export function PrintingSelector({ value, vehicleType, onChange }: PrintingSelectorProps) {
  if (vehicleType === '3w') {
    return (
      <div className="flex items-center gap-3 rounded-xl border-2 p-4" style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}08` }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
          <Printer className="h-5 w-5 shrink-0" style={{ color: ACCENT }} />
        </div>
        <p className="text-sm" style={{ color: ACCENT }}>
          <strong>₹1,500</strong> one-time printing & install per 3W vehicle
        </p>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-gray-700">Printing Quality</label>
      <div className="grid grid-cols-3 gap-3">
        {PRINTING_OPTIONS.map((opt) => {
          const isActive = value === opt.value;
          const isPopular = 'highlight' in opt && opt.highlight;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value as PrintingTier4W)}
              className={`selector-card relative rounded-xl border-2 bg-white p-3 text-center ${isActive ? 'active' : 'border-gray-100'}`}
              style={isActive ? { borderColor: ACCENT } : undefined}
            >
              {isPopular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: ACCENT }}>
                  POPULAR
                </span>
              )}
              {isActive && (
                <CheckCircle className="absolute right-2 top-2 h-3.5 w-3.5" style={{ color: ACCENT }} />
              )}
              <p className="text-sm font-bold text-gray-900">{opt.label}</p>
              <p className="mt-1 text-lg font-black" style={{ color: isActive ? ACCENT : '#6B7280' }}>{opt.price}</p>
              <p className="text-[10px] text-gray-400">{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
