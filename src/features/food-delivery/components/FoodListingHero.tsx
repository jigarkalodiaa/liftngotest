import Image from '@/components/OptimizedImage';
import { FOOD_LISTING_HERO_IMAGE } from '@/features/food-delivery/constants';
import { scrollToElementId } from '@/features/food-delivery/utils/scrollToElementId';

type Props = {
  title: string;
  subtitle: string;
  ctaTargetId: string;
  ctaLabel?: string;
};

export function FoodListingHero({
  title,
  subtitle,
  ctaTargetId,
  ctaLabel = 'Start Delivery Now',
}: Props) {
  return (
    <header className="relative mb-10 min-h-[220px] overflow-hidden rounded-3xl border border-[var(--landing-primary)]/12 shadow-md sm:mb-12 sm:min-h-[280px]">
      <Image
        src={FOOD_LISTING_HERO_IMAGE}
        alt="Colourful Indian vegetarian thali and curries"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1152px) 100vw, 1152px"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/88 via-[var(--color-primary)]/55 to-[var(--landing-orange)]/45"
        aria-hidden
      />
      <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-end px-5 py-8 sm:min-h-[280px] sm:px-10 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/90 sm:text-sm">Food delivery · Khatu Shyam Ji</p>
        <h1 className="mt-2 max-w-3xl text-balance text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-base text-white/90 sm:text-lg md:mx-0">{subtitle}</p>
        <button
          type="button"
          onClick={() => scrollToElementId(ctaTargetId)}
          className="mt-6 inline-flex min-h-12 min-w-[12rem] w-fit items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 text-base font-semibold text-white shadow-md transition-[transform,opacity] hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]"
        >
          {ctaLabel}
        </button>
      </div>
    </header>
  );
}
