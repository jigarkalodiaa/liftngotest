'use client';

import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';
import { RESTAURANTS_KHATUSHYAM } from '@/data/restaurantsKhatushyam';

// Food & category icons (inline SVGs)
const IconRestaurant = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V8l7-4v17" />
    <path d="M19 21V8l-5 3" />
    <path d="M9 8v13" />
  </svg>
);

const IconPlate = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
  </svg>
);

const IconLocation = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconPhone = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

/** Locality suffix used in Khatushyam area addresses; opens Maps for the temple / town. */
const KHATUSHYAM_JI_SUFFIX = ', Khatushyam Ji';
const GOOGLE_MAPS_KHATUSHYAM_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Khatu Shyam Ji Temple, Khatu, Sikar, Rajasthan, India');

function AddressWithKhatushyamMapsLink({ address }: { address: string }) {
  if (address.endsWith(KHATUSHYAM_JI_SUFFIX)) {
    const prefix = address.slice(0, -KHATUSHYAM_JI_SUFFIX.length);
    return (
      <>
        {prefix}
        {', '}
        <a
          href={GOOGLE_MAPS_KHATUSHYAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Khatushyam Ji area in Google Maps (opens in new tab)"
          className="font-medium text-[var(--color-primary)] hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1 rounded-sm"
        >
          Khatushyam Ji
        </a>
      </>
    );
  }
  return <>{address}</>;
}

const IconUtensils = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4M8 4v14a2 2 0 0 0 4 0V4M8 4h8M12 2v4M12 4v14a2 2 0 0 0 4 0V4" />
    <path d="M4 8h2v10a2 2 0 0 1-2 2v0M20 8h-2v10a2 2 0 0 0 2 2v0" />
  </svg>
);

/** Appetizing thali/food illustration – warm colours, no external assets */
const FoodThaliIllustration = ({ className = 'w-full h-full' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Plate */}
    <ellipse cx="60" cy="58" rx="42" ry="14" fill="#F5F0E8" stroke="#E8E0D5" strokeWidth="1.5" />
    <ellipse cx="60" cy="54" rx="35" ry="11" fill="#FFFBF7" stroke="#E8E0D5" strokeWidth="1" />
    {/* Small bowls on plate - curry/dal */}
    <ellipse cx="40" cy="52" rx="10" ry="4" fill="#C45C26" opacity="0.9" />
    <ellipse cx="60" cy="50" rx="10" ry="4" fill="#8B4513" opacity="0.95" />
    <ellipse cx="80" cy="52" rx="10" ry="4" fill="#D2691E" opacity="0.9" />
    {/* Rice mound */}
    <ellipse cx="60" cy="48" rx="12" ry="5" fill="#FFF8E7" stroke="#E8DCC8" strokeWidth="0.8" />
    {/* Steam */}
    <path d="M35 38 Q38 34 41 38" stroke="#D4C4B0" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round" />
    <path d="M60 34 Q63 30 66 34" stroke="#D4C4B0" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round" />
    <path d="M85 38 Q88 34 91 38" stroke="#D4C4B0" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round" />
  </svg>
);

export default function FindRestaurantClient() {
  return (
    <ContentLayout>
      <main className="flex-1 min-h-screen bg-[var(--landing-bg)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 -mt-2"
            aria-label="Back to home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          {/* How to order food – clear, efficient journey */}
          <div
            className="rounded-xl border p-6 sm:p-8 mb-10"
            style={{
              borderWidth: '1px',
              borderColor: 'var(--landing-primary)',
              backgroundColor: 'rgba(255, 247, 242, 0.45)',
              backdropFilter: 'blur(35px)',
              WebkitBackdropFilter: 'blur(35px)',
              boxShadow: '0 75px 50px -40px rgba(235, 193, 193, 0.75)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--landing-primary)]/15 flex items-center justify-center">
                <IconUtensils className="w-6 h-6 text-[var(--landing-primary)]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  How to order food
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Restaurants near Khatushyam Ji — simple 4-step flow
                </p>
              </div>
            </div>
            <ol className="space-y-4 text-gray-700 text-sm sm:text-base" role="list" aria-label="How to order food">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--landing-primary)] text-white text-xs font-bold flex items-center justify-center mt-0.5" aria-hidden>1</span>
                <div>
                  <span className="font-semibold text-gray-900">Choose a restaurant</span>
                  <span className="block mt-0.5">Pick from the list below and tap <strong className="text-[var(--landing-primary)]">Menu</strong> to open that restaurant’s menu page.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--landing-primary)] text-white text-xs font-bold flex items-center justify-center mt-0.5" aria-hidden>2</span>
                <div>
                  <span className="font-semibold text-gray-900">Add items &amp; send order</span>
                  <span className="block mt-0.5">Use <strong className="text-[var(--landing-primary)]">Add</strong> / <strong className="text-[var(--landing-primary)]">+</strong> for each item, check the <strong className="text-gray-900">total</strong>, then tap <strong className="text-[var(--landing-primary)]">Send order via WhatsApp</strong>. Complete payment with the restaurant (call or as they confirm).</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--landing-primary)] text-white text-xs font-bold flex items-center justify-center mt-0.5" aria-hidden>3</span>
                <div>
                  <span className="font-semibold text-gray-900">Book delivery (optional)</span>
                  <span className="block mt-0.5">After you open <strong className="text-[var(--landing-primary)]">Send order via WhatsApp</strong> and pay the restaurant, <strong className="text-[var(--landing-primary)]">Book delivery boy</strong> unlocks on the menu page. Pickup is the restaurant; you only enter your <strong className="text-gray-900">drop address</strong> next.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--landing-primary)] text-white text-xs font-bold flex items-center justify-center mt-0.5" aria-hidden>4</span>
                <div>
                  <span className="font-semibold text-gray-900">Or call to order</span>
                  <span className="block mt-0.5">Prefer to order by phone? Use <strong className="text-[var(--landing-primary)]">Call to order</strong> on any restaurant card or menu page.</span>
                </div>
              </li>
            </ol>
            {/* Visual flow: Order → Pay → Deliver */}
            <div className="mt-5 pt-4 border-t border-[var(--landing-primary)]/20 flex items-center justify-between gap-2 text-center">
              <div className="flex-1">
                <span className="inline-flex w-8 h-8 rounded-full bg-[var(--landing-primary)] text-white text-xs font-bold items-center justify-center">1</span>
                <p className="mt-1.5 text-xs font-medium text-gray-700">Order</p>
                <p className="text-[10px] text-gray-500">Menu → WhatsApp</p>
              </div>
              <span className="text-gray-300">→</span>
              <div className="flex-1">
                <span className="inline-flex w-8 h-8 rounded-full bg-[var(--landing-primary)] text-white text-xs font-bold items-center justify-center">2</span>
                <p className="mt-1.5 text-xs font-medium text-gray-700">Pay</p>
                <p className="text-[10px] text-gray-500">Restaurant</p>
              </div>
              <span className="text-gray-300">→</span>
              <div className="flex-1">
                <span className="inline-flex w-8 h-8 rounded-full bg-[var(--landing-primary)] text-white text-xs font-bold items-center justify-center">3</span>
                <p className="mt-1.5 text-xs font-medium text-gray-700">Deliver</p>
                <p className="text-[10px] text-gray-500">Your address</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              <strong className="text-gray-700">Tip:</strong> Add items → tap WhatsApp (this unlocks delivery) → pay the restaurant → book delivery and enter your address.
            </p>
          </div>

          {/* Restaurant list – LiftnGo themed cards with food illustration */}
          <div className="space-y-5">
            {RESTAURANTS_KHATUSHYAM.map((restaurant) => (
              <div
                key={restaurant.id}
                className="rounded-2xl border overflow-hidden flex flex-col sm:flex-row sm:items-stretch transition-all hover:shadow-lg"
                style={{
                  borderColor: 'var(--landing-primary)',
                  borderWidth: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 24px -4px rgba(74, 44, 204, 0.15)',
                }}
              >
                <div className="flex flex-1 min-w-0 p-4 sm:p-5 gap-4">
                  <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FFF8F0] flex items-center justify-center border border-[#E8E0D5]">
                    <FoodThaliIllustration className="w-14 h-14 sm:w-16 sm:h-16" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-gray-900">{restaurant.name}</h2>
                    <p className="text-gray-600 text-sm mt-1">{restaurant.description}</p>
                    {restaurant.address && (
                      <p className="text-gray-500 text-xs mt-2 flex items-start gap-1.5">
                        <IconLocation className="flex-shrink-0 w-5 h-5 max-w-[20px] max-h-[20px] text-[var(--color-primary)] mt-0.5" />
                        <span>
                          <AddressWithKhatushyamMapsLink address={restaurant.address} />
                        </span>
                      </p>
                    )}
                    {restaurant.phone && (
                      <p className="text-gray-500 text-xs mt-1.5 flex items-center gap-1.5">
                        <IconPhone className="flex-shrink-0 w-4 h-4 max-w-[20px] max-h-[20px] text-[var(--color-primary)]" />
                        {restaurant.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2 p-4 sm:pr-5 sm:pl-0 border-t sm:border-t-0 sm:border-l border-[var(--landing-primary)]/20">
                  <Link
                    href={`/find-restaurant/${restaurant.id}`}
                    className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 flex items-center justify-center gap-2"
                  >
                    <IconPlate className="w-4 h-4 opacity-90" />
                    Menu
                  </Link>
                  {restaurant.phone && (
                    <a
                      href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
                      className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 flex items-center justify-center gap-2"
                    >
                      <IconPhone className="w-4 h-4 opacity-90" />
                      Call to order
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </ContentLayout>
  );
}
