'use client';

import { CheckCircle } from 'lucide-react';
import type { BrandingPackage, FleetVehicleKind } from '@/lib/branding/fleetBrandingPricing';
import { ACCENT, BRANDING_OPTIONS } from '../constants';

interface BrandingSelectorProps {
  value: BrandingPackage;
  vehicleType: FleetVehicleKind;
  onChange: (value: BrandingPackage) => void;
}

export function BrandingSelector({ value, vehicleType, onChange }: BrandingSelectorProps) {
  const options = vehicleType === '4w' 
    ? BRANDING_OPTIONS 
    : BRANDING_OPTIONS.filter(opt => opt.value !== 'fullWrap');

  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-gray-700">Branding Type</label>
      <div className={`grid gap-3 ${vehicleType === '4w' ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((opt) => {
          const isActive = value === opt.value;
          const isRecommended = 'recommended' in opt && opt.recommended;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value as BrandingPackage)}
              className={`selector-card relative rounded-xl border-2 bg-white p-4 text-center ${isActive ? 'active' : 'border-gray-100'}`}
              style={isActive ? { borderColor: ACCENT } : undefined}
            >
              {isRecommended && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: ACCENT }}>
                  RECOMMENDED
                </span>
              )}
              {isActive && (
                <CheckCircle className="absolute right-2 top-2 h-4 w-4" style={{ color: ACCENT }} />
              )}
              <span className="text-3xl" style={{ color: isActive ? ACCENT : '#9CA3AF' }}>{opt.icon}</span>
              <p className="mt-2 text-sm font-bold text-gray-900">{opt.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
