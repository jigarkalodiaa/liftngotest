import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { KhatuNearbyPlace } from '@/types/khatu';

export default function NearbyPlaceCard({ place }: { place: KhatuNearbyPlace }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] bg-stone-100">
        <Image src={place.image} alt="" fill className="object-cover" sizes="320px" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[var(--khatu-stone)]">{place.name}</h3>
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[var(--khatu-stone-muted)]">
          <MapPin className="h-3.5 w-3.5 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />~
          {place.distanceFromKhatuKm} km from Khatu
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--khatu-stone-muted)]">{place.shortDescription}</p>
      </div>
    </article>
  );
}
