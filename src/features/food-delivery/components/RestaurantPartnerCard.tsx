import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import type { Restaurant } from '@/data/restaurantsKhatushyam';
import { getRestaurantCoverImage } from '@/data/restaurantsKhatushyam';
import { FOOD_RESTAURANT_CARD_TAGS } from '@/features/food-delivery/constants';
import { AddressWithKhatushyamMapsLink } from '@/features/food-delivery/components/AddressWithKhatushyamMapsLink';
import { IconCheck, IconClock, IconShield, IconStar } from '@/features/food-delivery/components/FoodDeliveryListingIcons';

type Props = { restaurant: Restaurant };

export function RestaurantPartnerCard({ restaurant }: Props) {
  const cover = getRestaurantCoverImage(restaurant);

  return (
    <li className="group h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--landing-primary)]/15 bg-white shadow-[0_2px_20px_-6px_rgba(44,45,91,0.12)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_-10px_rgba(44,45,91,0.22)]">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FFF5EB]">
          <Image
            src={cover}
            alt={`Food at ${restaurant.name}`}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/50 via-transparent to-amber-400/15" />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">{restaurant.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{restaurant.description}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {FOOD_RESTAURANT_CARD_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--landing-orange)]/25 bg-gradient-to-b from-amber-50 to-orange-50/80 px-2.5 py-1 text-[0.6875rem] font-semibold text-orange-950/85"
              >
                {tag}
              </span>
            ))}
          </div>

          <ul className="mt-3 space-y-1.5 text-xs text-gray-700 sm:text-[0.8125rem]" role="list">
            <li className="flex items-start gap-2">
              <IconCheck className="mt-0.5 text-[var(--color-primary)]" />
              <span>Verified by Liftngo</span>
            </li>
            <li className="flex items-start gap-2">
              <IconStar className="mt-0.5 text-[var(--color-primary)]" />
              <span>Trusted food partners</span>
            </li>
            <li className="flex items-start gap-2">
              <IconShield className="mt-0.5 text-[var(--color-primary)]" />
              <span>Fresh &amp; hygienic</span>
            </li>
          </ul>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 pt-3 text-xs text-gray-600">
            {restaurant.deliveryEstimate && (
              <span className="inline-flex items-center gap-1 font-medium text-gray-800">
                <IconClock className="!h-3.5 !w-3.5 !min-h-3.5 !min-w-3.5 !max-h-3.5 !max-w-3.5 text-[var(--color-primary)]" />
                {restaurant.deliveryEstimate}
              </span>
            )}
            {restaurant.rating != null && (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <IconStar className="!h-3.5 !w-3.5 !min-h-3.5 !min-w-3.5 !max-h-3.5 !max-w-3.5 text-[var(--color-primary)]" />
                {restaurant.rating.toFixed(1)}
              </span>
            )}
          </div>

          {restaurant.address && (
            <p className="mt-2 line-clamp-2 text-xs text-gray-500">
              <AddressWithKhatushyamMapsLink address={restaurant.address} />
            </p>
          )}

          <div className="mt-auto pt-5">
            <Link
              href={`/find-restaurant/${restaurant.id}`}
              className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              View Menu &amp; Order
            </Link>
          </div>
        </div>
      </article>
    </li>
  );
}
