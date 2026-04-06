'use client';

import Link from 'next/link';
import { BookOpen, Landmark, Lightbulb, MapPinned, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { KHATU_NEARBY_PLACES } from '@/data/khatuGuidePlaces';
import KhatuScreenShell from '@/features/khatu/common/KhatuScreenShell';
import GuideSection from '@/features/khatu/guide/GuideSection';
import NearbyPlaceCard from '@/features/khatu/guide/NearbyPlaceCard';

export default function KhatuGuidePage() {
  return (
    <>
      <KhatuScreenShell title="Khatu travel guide" eyebrow="Plan with confidence">
        <SectionHeader
          title="Spiritual context & practical travel"
          description="Clear, trustworthy notes for first-time visitors and returning bhaktas — English-first, light Hindi where it helps."
        />

        <nav aria-label="Sections" className="mt-6 flex flex-wrap gap-2">
          {[
            ['#about', 'About'],
            ['#nearby', 'Nearby'],
            ['#travel', 'Travel'],
            ['#tips', 'Tips'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--khatu-stone)] hover:border-[var(--khatu-saffron)]/40"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-6 space-y-5">
          <GuideSection
            id="about"
            icon={Landmark}
            title="About Khatu Shyam Ji"
            subtitle="Historical corridor & living faith"
            imageSrc="https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80"
            imageAlt=""
          >
            <p>
              Khatu Shyam Ji is among Rajasthan’s most visited devotional centres. The mandir draws lakhs on Shukla Paksha
              Ekādaśī, Phalguna Melā, and peak winter weekends — planning ahead keeps darshan calmer for elders and children.
            </p>
            <p>
              <strong>Khatu Shyam</strong> is venerated here as a manifestation of dharma and seva; many yātrīs pair Khatu with{' '}
              <strong>Salasar Balaji</strong> and other shrines on the same circuit.
            </p>
          </GuideSection>

          <section id="nearby" className="scroll-mt-24">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />
              <h2 className="text-base font-semibold text-[var(--khatu-stone)]">Nearby places</h2>
            </div>
            <p className="mt-1 text-sm text-[var(--khatu-stone-muted)]">
              Popular stops pilgrims combine with Khatu — distances are indicative by road.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {KHATU_NEARBY_PLACES.map((place) => (
                <NearbyPlaceCard key={place.id} place={place} />
              ))}
            </div>
          </section>

          <GuideSection
            id="travel"
            icon={MapPinned}
            title="Travel information"
            subtitle="Best season · rush windows · darshan hygiene"
          >
            <ul>
              <li>
                <strong>Best time:</strong> October–March for weather; summers need early morning darshan and hydration.
              </li>
              <li>
                <strong>Rail access:</strong> <strong>Ringas Junction</strong> (~18 km) — pre-book a Liftngo vehicle if travelling
                with luggage or elders.
              </li>
              <li>
                <strong>Peak rush:</strong> winter weekends, festival weeks, and early morning 5–9 AM arti queues. Buffer 30–45
                minutes at the approach road during melā.
              </li>
              <li>
                <strong>Darshan tips:</strong> keep offerings light, follow mandir signage, and avoid crowding narrow exits —
                patience keeps everyone safer.
              </li>
            </ul>
          </GuideSection>

          <GuideSection id="tips" icon={Lightbulb} title="Local tips" subtitle="Parking · stays · crowd strategy">
            <ul>
              <li>
                <strong>Parking:</strong> core lanes tighten during festivals — prefer verified stays with parking or cab
                drop-off.
              </li>
              <li>
                <strong>Stays:</strong> Liftngo-verified hotels show honest temple distance; use filters for walking distance if
                elders need fewer steps.
              </li>
              <li>
                <strong>Avoid peak pinch points:</strong> Saturday late morning and Sunday afternoon see heavy vehicle inflow —
                arrive earlier or use corridor cabs instead of self-drive loops.
              </li>
            </ul>
            <p className="text-sm">
              <BookOpen className="mr-1 inline-block h-4 w-4 align-text-bottom text-[var(--khatu-saffron)]" strokeWidth={1.75} />
              Next:{' '}
              <Link href={ROUTES.KHATU_HOTELS} className="font-semibold text-[var(--khatu-saffron)] underline-offset-2 hover:underline">
                Hotels
              </Link>
              ,{' '}
              <Link href={ROUTES.KHATU_TRAVEL} className="font-semibold text-[var(--khatu-saffron)] underline-offset-2 hover:underline">
                Rides
              </Link>
              ,{' '}
              <Link
                href={ROUTES.KHATU_MARKETPLACE}
                className="font-semibold text-[var(--khatu-saffron)] underline-offset-2 hover:underline"
              >
                Marketplace
              </Link>
              .
            </p>
          </GuideSection>
        </div>
      </KhatuScreenShell>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md">
        <Link
          href={ROUTES.KHATU_TRAVEL}
          className="mx-auto block max-w-xl min-h-[50px] rounded-xl bg-[var(--khatu-saffron)] py-3.5 text-center text-sm font-semibold text-white sm:max-w-2xl"
        >
          Book a corridor ride
        </Link>
      </div>
    </>
  );
}
