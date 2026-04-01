'use client';

import Image from '@/components/OptimizedImage';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { RideVehicleType } from '@/types/khatu';

export type VehicleCardOption = {
  type: RideVehicleType;
  label: string;
  seats: number;
  fareInr: number;
  imageSrc: string;
  comfortTag?: string;
};

type VehicleCardProps = {
  option: VehicleCardOption;
  selected: boolean;
  onSelect: () => void;
};

export default function VehicleCard({ option, selected, onSelect }: VehicleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full gap-3 rounded-2xl border p-3 text-left transition sm:p-3.5 ${
        selected
          ? 'border-[var(--khatu-saffron)] bg-white shadow-md ring-2 ring-[var(--khatu-saffron)]/20'
          : 'border-stone-200 bg-white hover:border-stone-300'
      }`}
    >
      <div className="relative h-[72px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[var(--khatu-cream)] ring-1 ring-stone-200/80">
        <Image
          src={option.imageSrc}
          alt={`${option.label} vehicle option`}
          fill
          className="object-contain p-2"
          sizes="88px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-semibold text-[var(--khatu-stone)]">{option.label}</span>
            {option.comfortTag ? (
              <Badge variant="popular" className="mt-1.5 normal-case tracking-normal">
                {option.comfortTag}
              </Badge>
            ) : null}
            {option.type === 'two_wheeler' ? (
              <p className="mt-1 text-[11px] text-[var(--khatu-stone-muted)]">Light luggage · solo hops</p>
            ) : null}
          </div>
          <span className="shrink-0 text-right text-base font-semibold tabular-nums text-[var(--khatu-stone)]">
            ₹{option.fareInr}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs text-[var(--khatu-stone-muted)]">
          <Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Up to {option.seats} seats (incl. driver)
        </p>
      </div>
    </button>
  );
}
