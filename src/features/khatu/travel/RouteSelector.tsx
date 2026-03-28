'use client';

import { ArrowRight, Clock, MapPin } from 'lucide-react';
import type { KhatuTravelRoute, TravelRouteId } from '@/types/khatu';

type RouteSelectorProps = {
  routes: KhatuTravelRoute[];
  value: TravelRouteId;
  onChange: (id: TravelRouteId) => void;
};

export default function RouteSelector({ routes, value, onChange }: RouteSelectorProps) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Choose route">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--khatu-stone-muted)]">
        Corridor
      </p>
      <div className="flex flex-col gap-2.5">
        {routes.map((r) => {
          const selected = r.id === value;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(r.id)}
              className={`w-full rounded-2xl border px-4 py-3.5 text-left transition ${
                selected
                  ? 'border-[var(--khatu-saffron)] bg-white shadow-md ring-2 ring-[var(--khatu-saffron)]/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--khatu-cream)] ring-1 ring-stone-200/80">
                  <MapPin className="h-4 w-4 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-[var(--khatu-stone)]">{r.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--khatu-stone-muted)]" aria-hidden />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--khatu-stone-muted)]">{r.labelHi}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium text-[var(--khatu-stone)]">
                    <span className="inline-flex items-center gap-1">
                      <span className="tabular-nums">{r.distanceKm} km</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[var(--khatu-stone-muted)]">
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />~{r.typicalMinutes} min
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
