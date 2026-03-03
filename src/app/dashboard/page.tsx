'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import MobileMenu from '@/components/landing/MobileMenu';
import { useRouter } from 'next/navigation';

type ServiceId = 'walk' | 'twoWheeler' | 'threeWheeler';

type DefaultTrip = {
  id: string;
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  contactName: string;
  contactPhone: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pickup, setPickup] = useState('');
  const [activeService, setActiveService] = useState<ServiceId>('walk');
  const [isChooseTripOpen, setIsChooseTripOpen] = useState(false);

  const services = useMemo(
    () => [
      { id: 'walk' as const, label: 'Walk', image: '/services/walk.svg' },
      { id: 'twoWheeler' as const, label: '2 Wheeler', image: '/services/two-wheeler.svg' },
      { id: 'threeWheeler' as const, label: '3 Wheeler', image: '/services/three-wheeler.svg' },
    ],
    []
  );

  const defaultTrips: DefaultTrip[] = useMemo(
    () => [
      {
        id: 't1',
        fromName: 'Shipra Mall',
        fromAddress: 'Vaibhav Khand, Indirapuram, Ghaziabad, Uttar',
        toName: 'HRC Professionals Hub,',
        toAddress: 'Middle Circle, Vaibhav Khand, Indirapuram, Ghaziabad, Uttar Pradesh 201014',
        contactName: 'Prateek Jha',
        contactPhone: '9065847341',
      },
      {
        id: 't2',
        fromName: 'Shipra Mall',
        fromAddress: 'Vaibhav Khand, Indirapuram, Ghaziabad, Uttar',
        toName: 'HRC Professionals Hub,',
        toAddress: 'Middle Circle, Vaibhav Khand, Indirapuram, Ghaziabad, Uttar Pradesh 201014',
        contactName: 'Prateek Jha',
        contactPhone: '9065847341',
      },
    ],
    []
  );

  const handleBookNow = (trip: DefaultTrip) => {
    try {
      // Save pickup location
      localStorage.setItem('pickup_location', JSON.stringify({
        name: trip.fromName,
        address: trip.fromAddress,
        contact: `${trip.contactName} | ${trip.contactPhone}`,
      }));

      // Save drop location
      localStorage.setItem('drop_location', JSON.stringify({
        name: trip.toName,
        address: trip.toAddress,
        contact: `${trip.contactName} | ${trip.contactPhone}`,
      }));

      // Save sender details
      localStorage.setItem('sender_details', JSON.stringify({
        name: trip.contactName,
        mobile: trip.contactPhone,
      }));

      // Save receiver details
      localStorage.setItem('receiver_details', JSON.stringify({
        name: trip.contactName,
        mobile: trip.contactPhone,
      }));

      // Save selected service
      localStorage.setItem('selected_service', activeService);
    } catch {
      // ignore storage errors
    }

    setIsChooseTripOpen(false);
    router.push('/trip-options');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dim overlay when menu open */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Choose trip modal */}
      <div
        className={`fixed inset-0 z-[80] transition-opacity ${
          isChooseTripOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Choose trip"
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsChooseTripOpen(false)} />
        <div className="absolute inset-0 grid place-items-center px-3 py-6">
          <div className="w-full max-w-[520px] rounded-[28px] bg-white shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <div className="text-[28px] font-bold text-gray-900">Choose trip</div>
              <button
                type="button"
                onClick={() => setIsChooseTripOpen(false)}
                aria-label="Close"
                className="h-12 w-12 rounded-full bg-gray-100 grid place-items-center text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 pb-5 max-h-[76vh] overflow-y-auto">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <button
                  type="button"
                  onClick={() => router.push('/trip-options')}
                  className="w-full rounded-2xl border border-gray-600/70 py-3 text-[18px] font-semibold text-gray-600 flex items-center justify-center gap-2"
                >
                  Book Now
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {defaultTrips.map((trip) => (
                  <div key={trip.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center pt-1">
                        <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-white" />
                        <div className="my-2 w-px flex-1 bg-gray-300" />
                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[16px] font-bold text-gray-900">{trip.fromName}</div>
                            <div className="mt-1 text-[14px] text-gray-400">{trip.fromAddress}</div>
                            <div className="mt-2 text-[13px] text-gray-400">
                              {trip.contactName} <span className="mx-1">|</span> {trip.contactPhone}
                            </div>
                          </div>
                          <button type="button" aria-label="Edit pickup" className="h-10 w-10 grid place-items-center text-gray-600">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-4 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[16px] font-bold text-gray-900">{trip.toName}</div>
                            <div className="mt-1 text-[14px] text-gray-400">{trip.toAddress}</div>
                            <div className="mt-2 text-[13px] text-gray-400">
                              {trip.contactName} <span className="mx-1">|</span> {trip.contactPhone}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="Swap"
                              className="h-9 w-9 rounded-full bg-[#1F2456] grid place-items-center text-white shadow-sm"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3l4 4-4 4M20 7H4" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 21l-4-4 4-4M4 17h16" />
                              </svg>
                            </button>
                            <button type="button" aria-label="Edit drop" className="h-10 w-10 grid place-items-center text-gray-600">
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="mt-5">
                          <button
                            type="button"
                            className="w-full rounded-2xl border border-gray-600/70 py-3 text-[18px] font-semibold text-gray-600 flex items-center justify-center gap-2"
                            onClick={() => handleBookNow(trip)}
                          >
                            Book Now
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-2xl bg-[#1F2456] py-4 text-[20px] font-semibold text-white flex items-center justify-center gap-3"
              >
                Add More Default Location
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[520px] px-4 pb-10">
        {/* Header */}
        <header className="pt-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Liftngo Logistics" width={140} height={44} className="h-8 w-auto" priority />
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="h-10 w-10 rounded-full border border-gray-200 bg-white shadow-sm grid place-items-center"
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Pickup input */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            <button
              type="button"
              onClick={() => router.push('/pickup-location')}
              className="w-full text-left bg-transparent outline-none text-[15px] text-gray-900 placeholder:text-gray-500"
            >
              {pickup || 'Enter Pickup Location'}
            </button>
          </div>
        </div>

        {/* Book row */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-stretch">
              <button
                type="button"
                onClick={() => setIsChooseTripOpen(true)}
                className="flex-1 px-4 py-3 text-left text-[14px] font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Book Your Ride Instantly
              </button>
              <div className="w-px bg-gray-200" />
              <button
                type="button"
                className="flex-1 px-4 py-3 text-left text-[14px] font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Book Your Item
              </button>
            </div>
          </div>

          <button
            type="button"
            className="h-12 w-12 rounded-xl bg-[#3B82F6] shadow-sm grid place-items-center"
            aria-label="Continue"
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Choose service */}
        <h2 className="mt-6 text-[18px] font-bold text-gray-900">Choose service</h2>

        <div className="mt-3 grid grid-cols-3 gap-4">
          {services.map((s) => {
            const active = s.id === activeService;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveService(s.id)}
                className={`rounded-2xl bg-white border border-gray-100 px-3 pt-4 pb-3 text-center transition-shadow ${
                  active ? 'shadow-2xl' : 'shadow-lg'
                }`}
              >
                <div className="mx-auto h-[58px] w-[72px] relative">
                  <Image src={s.image} alt={s.label} fill className="object-contain" />
                </div>
                <div className="mt-2 text-[14px] font-semibold text-gray-700">{s.label}</div>
              </button>
            );
          })}
        </div>

        {/* Hero illustration */}
        <div className="relative mt-8 rounded-3xl bg-gradient-to-b from-white to-[#F3F7FF] px-2 pt-8 pb-6 overflow-hidden">
          {/* dotted arc */}
          <div className="pointer-events-none absolute left-1/2 top-6 h-[220px] w-[220px] -translate-x-1/2 rounded-full border border-dashed border-[#94A3B8]/70 opacity-70" />
          {/* soft clouds */}
          <div className="pointer-events-none absolute -right-6 top-14 h-16 w-28 rounded-full bg-[#E6F0FF] opacity-70 blur-[0.5px]" />
          <div className="pointer-events-none absolute right-10 top-10 h-10 w-16 rounded-full bg-[#E6F0FF] opacity-70 blur-[0.5px]" />

          <div className="relative mx-auto h-[240px] w-full max-w-[430px]">
            <Image src="/hero-delivery.svg" alt="Delivery illustration" fill className="object-contain" priority />
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-8">
          <div className="text-[40px] leading-[1.05] font-extrabold tracking-tight text-gray-900">
            Goods time pe
            <br />
            Business prime pe
          </div>
        </div>
      </div>
    </div>
  );
}

