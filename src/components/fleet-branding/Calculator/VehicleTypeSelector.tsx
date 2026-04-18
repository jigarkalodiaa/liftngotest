'use client';

import { Zap, Truck, CheckCircle } from 'lucide-react';
import type { FleetVehicleKind } from '@/lib/branding/fleetBrandingPricing';
import { ACCENT, VEHICLE_OPTIONS } from '../constants';

interface VehicleTypeSelectorProps {
  value: FleetVehicleKind;
  onChange: (value: FleetVehicleKind) => void;
}

const ICON_MAP = {
  '3w': Zap,
  '4w': Truck,
} as const;

export function VehicleTypeSelector({ value, onChange }: VehicleTypeSelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-gray-700">Vehicle Type</label>
      <div className="grid grid-cols-2 gap-3">
        {VEHICLE_OPTIONS.map((opt) => {
          const isActive = value === opt.value;
          const IconComponent = ICON_MAP[opt.value as keyof typeof ICON_MAP];
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value as FleetVehicleKind)}
              className={`selector-card relative rounded-xl border-2 bg-white p-4 text-left ${isActive ? 'active' : 'border-gray-100'}`}
              style={isActive ? { borderColor: ACCENT } : undefined}
            >
              {isActive && (
                <CheckCircle className="absolute right-3 top-3 h-5 w-5" style={{ color: ACCENT }} />
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: isActive ? `${ACCENT}15` : '#F3F4F6' }}>
                <IconComponent className="h-5 w-5" style={{ color: isActive ? ACCENT : '#6B7280' }} />
              </div>
              <p className="mt-3 font-bold text-gray-900">{opt.label}</p>
              <p className="text-xs text-gray-500">{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
