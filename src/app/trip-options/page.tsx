'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SavedLocation = {
  name: string;
  address: string;
  contact: string;
};

type PersonDetails = {
  name: string;
  mobile: string;
};

type OptionId = 'walk' | 'two' | 'three';

export default function TripOptionsPage() {
  const router = useRouter();
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [stop, setStop] = useState<SavedLocation | null>(null);
  const [sender, setSender] = useState<PersonDetails | null>(null);
  const [receiver, setReceiver] = useState<PersonDetails | null>(null);
  const [stopDetails, setStopDetails] = useState<PersonDetails | null>(null);
  const [selected, setSelected] = useState<OptionId>('two');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawPickup = window.localStorage.getItem('pickup_location');
      if (rawPickup) {
        const parsed = JSON.parse(rawPickup) as SavedLocation;
        if (parsed?.name && parsed?.address) setPickup(parsed);
      }
      const rawDrop = window.localStorage.getItem('drop_location');
      if (rawDrop) {
        const parsed = JSON.parse(rawDrop) as SavedLocation;
        if (parsed?.name && parsed?.address) setDrop(parsed);
      }

      const rawStop = window.localStorage.getItem('stop_location');
      if (rawStop) {
        const parsed = JSON.parse(rawStop) as SavedLocation;
        if (parsed?.name && parsed?.address) setStop(parsed);
      }

      const rawSender = window.localStorage.getItem('sender_details');
      if (rawSender) {
        const parsed = JSON.parse(rawSender) as PersonDetails;
        if (parsed?.name && parsed?.mobile) setSender(parsed);
      }

      const rawReceiver = window.localStorage.getItem('receiver_details');
      if (rawReceiver) {
        const parsed = JSON.parse(rawReceiver) as PersonDetails;
        if (parsed?.name && parsed?.mobile) setReceiver(parsed);
      }

      const rawStopDetails = window.localStorage.getItem('stop_details');
      if (rawStopDetails) {
        const parsed = JSON.parse(rawStopDetails) as PersonDetails;
        if (parsed?.name && parsed?.mobile) setStopDetails(parsed);
      }

      // Read selected service from dashboard
      const savedService = window.localStorage.getItem('selected_service');
      if (savedService === 'walk') {
        setSelected('walk');
      } else if (savedService === 'twoWheeler') {
        setSelected('two');
      } else if (savedService === 'threeWheeler') {
        setSelected('three');
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[520px] h-full flex flex-col">
        {/* Top map + card */}
        <div className="relative flex-1">
          {/* Fake map background */}
          <div className="absolute inset-0 bg-[url('/globe.svg')] bg-cover bg-center opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-slate-200/80" />

          {/* Back + menu row */}
          <div className="relative z-10 flex items-center justify-between px-4 pt-6">
            <button
              type="button"
              aria-label="Back"
              onClick={() => router.back()}
              className="h-9 w-9 rounded-full bg-white/90 grid place-items-center shadow"
            >
              <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Options"
              className="h-9 w-9 rounded-full bg-white/90 grid place-items-center shadow"
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
            </button>
          </div>

          {/* Locations card */}
          <div className="relative z-10 mt-20 px-4 pb-4">
            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden">
              <div className="px-5 pt-5 pb-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-white" />
                    <div className="my-2 w-px flex-1 bg-gray-300" />
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Pickup */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[15px] font-semibold text-gray-900">
                          {pickup?.name || 'Pickup not set'}
                        </div>
                        {pickup && (
                          <>
                            <div className="mt-1 text-[12px] text-gray-500">{pickup.address}</div>
                            <div className="mt-1 text-[11px] text-gray-400">
                              {sender
                                ? `${sender.name} | ${sender.mobile}`
                                : pickup.contact}
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Edit pickup"
                        onClick={() => router.push('/pickup-location?step=1')}
                        className="h-9 w-9 grid place-items-center text-gray-600"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                        </svg>
                      </button>
                    </div>

                    {/* Optional Stop */}
                    {stop && (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[15px] font-semibold text-gray-900">
                            {stop.name}
                          </div>
                          <div className="mt-1 text-[12px] text-gray-500">{stop.address}</div>
                          <div className="mt-1 text-[11px] text-gray-400">
                            {stopDetails
                              ? `${stopDetails.name} | ${stopDetails.mobile}`
                              : stop.contact}
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove stop"
                          onClick={() => {
                            setStop(null);
                            try {
                              if (typeof window !== 'undefined') {
                                window.localStorage.removeItem('stop_location');
                              }
                            } catch {
                              // ignore
                            }
                          }}
                          className="h-8 w-8 rounded-full border border-gray-200 grid place-items-center text-gray-500 text-sm"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Drop */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[15px] font-semibold text-gray-900">
                          {drop?.name || 'Drop not set'}
                        </div>
                        {drop && (
                          <>
                            <div className="mt-1 text-[12px] text-gray-500">{drop.address}</div>
                            <div className="mt-1 text-[11px] text-gray-400">
                              {receiver
                                ? `${receiver.name} | ${receiver.mobile}`
                                : drop.contact}
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Edit drop"
                        onClick={() => router.push('/pickup-location?step=2')}
                        className="h-9 w-9 grid place-items-center text-gray-600"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 border-t border-gray-200 bg-white/90 py-3 text-[13px] font-medium text-gray-700"
                onClick={() => router.push('/add-stop')}
              >
                <span className="h-6 w-6 rounded-full border border-gray-300 grid place-items-center text-gray-500 text-xs">
                  +
                </span>
                <span>Add Stop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Options list */}
        <div className="bg-white px-4 pt-4 pb-6">
          <OptionCard
            id="walk"
            selected={selected}
            setSelected={setSelected}
            title="Big Saver"
            subtitle="Walking"
            price="₹75"
            oldPrice="₹105"
            image="/services/walk.svg"
          />
          <OptionCard
            id="two"
            selected={selected}
            setSelected={setSelected}
            title="Faster to your door"
            subtitle="Two wheeler / 40kg"
            price="₹160"
            oldPrice="₹195"
            image="/services/two-wheeler.svg"
            note="Orders can be picked up within 1 km only."
          />
          <OptionCard
            id="three"
            selected={selected}
            setSelected={setSelected}
            title="Faster to your door"
            subtitle="Three wheeler / 500 kg"
            price="₹450"
            oldPrice="₹495"
            image="/services/three-wheeler.svg"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-2xl border border-gray-300 bg-white py-3 text-[15px] font-semibold text-gray-800"
            >
              Book Now
            </button>
            <button
              type="button"
              className="flex-1 rounded-2xl bg-[#1F2456] py-3 text-[15px] font-semibold text-white"
            >
              Schedule later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type OptionCardProps = {
  id: OptionId;
  selected: OptionId;
  setSelected: (id: OptionId) => void;
  title: string;
  subtitle: string;
  price: string;
  oldPrice: string;
  image: string;
  note?: string;
};

function OptionCard({
  id,
  selected,
  setSelected,
  title,
  subtitle,
  price,
  oldPrice,
  image,
  note,
}: OptionCardProps) {
  const isActive = id === selected;
  return (
    <button
      type="button"
      onClick={() => setSelected(id)}
      className={`mt-3 w-full rounded-2xl border px-3 py-3 text-left flex gap-3 ${
        isActive ? 'border-[#1F2456] bg-[#EEF0FF]' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="relative h-14 w-16 flex-shrink-0">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[14px] font-semibold text-gray-900">{title}</div>
            <div className="mt-1 text-[12px] text-gray-500">{subtitle}</div>
          </div>
          <div className="text-right">
            <div className="text-[15px] font-semibold text-gray-900">{price}</div>
            <div className="text-[11px] text-gray-400 line-through">{oldPrice}</div>
          </div>
        </div>
        {note && (
          <div className="mt-2 rounded-xl bg-white/90 px-3 py-1 text-[11px] text-blue-700 border border-blue-100">
            {note}
          </div>
        )}
      </div>
    </button>
  );
}

