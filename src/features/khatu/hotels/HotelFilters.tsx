'use client';

import type { KhatuHotelListQuery } from '@/lib/api/khatu';

type HotelFiltersProps = {
  value: KhatuHotelListQuery;
  onChange: (next: KhatuHotelListQuery) => void;
};

const selectCls =
  'mt-1.5 w-full min-h-11 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-[var(--khatu-stone)] shadow-sm focus:border-[var(--khatu-saffron)] focus:outline-none focus:ring-2 focus:ring-[var(--khatu-saffron)]/20';

const labelCls = 'text-[11px] font-semibold uppercase tracking-wide text-[var(--khatu-stone-muted)]';

export default function HotelFilters({ value, onChange }: HotelFiltersProps) {
  const set = (patch: Partial<KhatuHotelListQuery>) => onChange({ ...value, ...patch });

  return (
    <section
      aria-label="Filter stays"
      className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-[var(--khatu-stone)]">Refine your stay</h2>
      <p className="mt-0.5 text-xs leading-relaxed text-[var(--khatu-stone-muted)]">
        Liftngo-verified properties only. Tune distance, budget, and comfort.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className={labelCls} htmlFor="khatu-hotel-distance">
            Distance from temple
          </label>
          <select
            id="khatu-hotel-distance"
            className={selectCls}
            value={value.distance || ''}
            onChange={(e) =>
              set({ distance: (e.target.value || '') as KhatuHotelListQuery['distance'] })
            }
          >
            <option value="">Any</option>
            <option value="0-1">Within 1 km</option>
            <option value="1-3">1 – 3 km</option>
            <option value="3+">Beyond 3 km</option>
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={labelCls} htmlFor="khatu-hotel-price">
            Price per night
          </label>
          <select
            id="khatu-hotel-price"
            className={selectCls}
            value={
              value.minPrice === 0 && value.maxPrice === 800
                ? 'u800'
                : value.minPrice === 800 && value.maxPrice === 1200
                  ? '800-1200'
                  : value.minPrice === 1200 && value.maxPrice === 50000
                    ? '1200p'
                    : ''
            }
            onChange={(e) => {
              const v = e.target.value;
              if (v === 'u800') set({ minPrice: 0, maxPrice: 800 });
              else if (v === '800-1200') set({ minPrice: 800, maxPrice: 1200 });
              else if (v === '1200p') set({ minPrice: 1200, maxPrice: 50000 });
              else {
                const next = { ...value };
                delete next.minPrice;
                delete next.maxPrice;
                onChange(next);
              }
            }}
          >
            <option value="">Any</option>
            <option value="u800">Under ₹800</option>
            <option value="800-1200">₹800 – ₹1,200</option>
            <option value="1200p">₹1,200+</option>
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="khatu-hotel-avail">
            Availability
          </label>
          <select
            id="khatu-hotel-avail"
            className={selectCls}
            value={value.availability || ''}
            onChange={(e) =>
              set({
                availability: (e.target.value || '') as KhatuHotelListQuery['availability'],
              })
            }
          >
            <option value="">Any</option>
            <option value="available">Available</option>
            <option value="few">Limited</option>
            <option value="full">Full</option>
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="khatu-hotel-rating">
            Guest rating
          </label>
          <select
            id="khatu-hotel-rating"
            className={selectCls}
            value={value.minRating != null ? String(value.minRating) : ''}
            onChange={(e) => {
              const r = e.target.value;
              set({ minRating: r === '' ? undefined : Number(r) });
            }}
          >
            <option value="">Any</option>
            <option value="4">4.0+</option>
            <option value="4.3">4.3+</option>
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="khatu-hotel-parking">
            Parking
          </label>
          <select
            id="khatu-hotel-parking"
            className={selectCls}
            value={value.parking || ''}
            onChange={(e) => set({ parking: (e.target.value || '') as KhatuHotelListQuery['parking'] })}
          >
            <option value="">Any</option>
            <option value="yes">Available</option>
            <option value="no">Not available</option>
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="khatu-hotel-ac">
            Rooms
          </label>
          <select
            id="khatu-hotel-ac"
            className={selectCls}
            value={value.ac || ''}
            onChange={(e) => set({ ac: (e.target.value || '') as KhatuHotelListQuery['ac'] })}
          >
            <option value="">Any</option>
            <option value="yes">AC</option>
            <option value="no">Non-AC</option>
          </select>
        </div>
      </div>
    </section>
  );
}
