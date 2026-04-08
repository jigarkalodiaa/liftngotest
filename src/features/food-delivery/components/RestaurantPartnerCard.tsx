import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { Leaf, Star } from 'lucide-react';
import type { Restaurant } from '@/data/restaurantsKhatushyam';
import { getRestaurantCoverImage } from '@/data/restaurantsKhatushyam';

type Props = { restaurant: Restaurant };

function listingMetaLine(r: Restaurant): string {
  const eta = r.listingEta?.trim();
  const dist = r.listingDistance?.trim();
  if (eta && dist) return `${eta}   ${dist}`;
  if (eta) return eta;
  if (dist) return dist;
  const est = r.deliveryEstimate?.replace(/^Est\.\s*delivery\s*/i, '').trim();
  return [est, r.distanceLabel].filter(Boolean).join('   ') || '';
}

export function RestaurantPartnerCard({ restaurant }: Props) {
  const cover = getRestaurantCoverImage(restaurant);
  const meta = listingMetaLine(restaurant);
  const rating = restaurant.rating != null ? restaurant.rating.toFixed(1) : null;
  const pureVeg = restaurant.pureVeg ?? /veg|vegetarian/i.test(restaurant.description);
  const nearTemple =
    restaurant.nearTemple ??
    (/temple|khatushyam/i.test(restaurant.distanceLabel ?? '') ||
      /temple|khatushyam/i.test(restaurant.listingTags ?? ''));

  return (
    <li className="h-full">
      <Link
        href={`/find-restaurant/${restaurant.id}`}
        className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      >
        <article className="flex h-full flex-col overflow-hidden rounded-[15px] border border-neutral-200/90 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-200 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]">
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-neutral-100 sm:aspect-[16/8]">
            <Image
              src={cover}
              alt={`Food at ${restaurant.name}`}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
            />
          </div>
          <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="min-w-0 flex-1 text-[15px] font-bold leading-snug tracking-tight text-neutral-900 sm:text-base">
                {restaurant.name}
              </h3>
              {rating ? (
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-800 ring-1 ring-emerald-100">
                  <Star className="h-3 w-3 fill-emerald-600 stroke-emerald-600" strokeWidth={0} aria-hidden />
                  {rating}
                </span>
              ) : null}
            </div>

            {meta ? (
              <p className="mt-1.5 text-xs font-medium text-neutral-500 sm:text-[13px]">{meta}</p>
            ) : null}

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {pureVeg ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-900 ring-1 ring-emerald-100 sm:text-xs">
                  <Leaf className="h-3 w-3 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
                  Pure Veg restaurant
                </span>
              ) : null}
              {nearTemple ? (
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-900/90 ring-1 ring-amber-100/90 sm:text-xs">
                  Near Temple
                </span>
              ) : null}
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
}
