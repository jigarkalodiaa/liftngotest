'use client';

import { memo } from 'react';
import { Building2, Car, ShieldCheck, Sparkles, UtensilsCrossed, Waves, Waypoints } from 'lucide-react';
import type { KhatuPackageServices, KhatuServiceKey } from './types';

const SERVICE_LABELS: Array<{ key: KhatuServiceKey; title: string; subtitle: string; Icon: typeof Car }> = [
  { key: 'cab', title: 'Cab', subtitle: 'Pickup and local commute', Icon: Car },
  { key: 'hotel', title: 'Hotel', subtitle: 'Stay near temple area', Icon: Building2 },
  { key: 'food', title: 'Food', subtitle: 'Meal support for trip window', Icon: UtensilsCrossed },
  { key: 'guide', title: 'Guide', subtitle: 'On-ground help and support', Icon: Sparkles },
  { key: 'darshan', title: 'Darshan', subtitle: 'Queue and darshan assistance', Icon: ShieldCheck },
  { key: 'waterPark', title: 'Water park', subtitle: 'Family activity add-on', Icon: Waves },
  { key: 'returnTrip', title: 'Return trip', subtitle: 'Khatu to source drop', Icon: Waypoints },
];

type Props = {
  services: KhatuPackageServices;
  servicePriceMap: Record<KhatuServiceKey, number>;
  onToggle: (key: KhatuServiceKey) => void;
};

function KhatuPackageBuilder({ services, servicePriceMap, onToggle }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {SERVICE_LABELS.map((item) => {
        const selected = services[item.key];
        const Icon = item.Icon;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className={`rounded-2xl border px-3.5 py-3 text-left shadow-sm transition-all duration-200 active:scale-[0.99] ${
              selected
                ? 'border-[var(--khatu-saffron)]/45 bg-orange-50/70 ring-2 ring-[var(--khatu-saffron)]/15'
                : 'border-stone-200/80 bg-white hover:border-stone-300 hover:shadow-md'
            }`}
            aria-pressed={selected}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className={`grid h-8 w-8 place-items-center rounded-xl ${selected ? 'bg-orange-100 text-[var(--khatu-saffron)]' : 'bg-stone-100 text-stone-600'}`}>
                  <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--khatu-stone)]">{item.title}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{item.subtitle}</p>
                </div>
              </div>
              <span
                className={`inline-flex h-5 min-w-10 items-center rounded-full px-1 text-[10px] font-semibold transition-all ${
                  selected ? 'justify-end bg-[var(--khatu-saffron)] text-white' : 'justify-start bg-stone-200 text-stone-500'
                }`}
              >
                <span className="mx-0.5 inline-block h-3.5 w-3.5 rounded-full bg-white/95" />
              </span>
            </div>
            <div className="mt-2 border-t border-stone-200/70 pt-2">
              <p className="text-xs font-semibold text-stone-700">+ ₹{servicePriceMap[item.key]}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default memo(KhatuPackageBuilder);
