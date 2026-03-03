'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useGeolocation } from '@/hooks';

type SavedLocation = {
  name: string;
  address: string;
  contact: string;
};

const recentSearches: SavedLocation[] = [
  {
    name: 'Shyam Restaurant',
    address: 'Zaildar Enclave Hastal, Vaibhav khand New Delhi,',
    contact: 'Prateek Jha | 9065847341',
  },
  {
    name: 'Shyam Restaurant',
    address: 'Zaildar Enclave Hastal, Vaibhav khand New Delhi,',
    contact: 'Prateek Jha | 9065847341',
  },
  {
    name: 'Shyam Restaurant',
    address: 'Zaildar Enclave Hastal, Vaibhav khand New Delhi,',
    contact: 'Prateek Jha | 9065847341',
  },
  {
    name: 'Shyam Restaurant',
    address: 'Zaildar Enclave Hastal, Vaibhav khand New Delhi,',
    contact: 'Prateek Jha | 9065847341',
  },
];

export default function AddStopPage() {
  const router = useRouter();
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [stop, setStop] = useState<SavedLocation | null>(null);
  const [personName, setPersonName] = useState('');
  const [personMobile, setPersonMobile] = useState('');
  const [useCurrentMobile, setUseCurrentMobile] = useState(false);
  const [currentMobile, setCurrentMobile] = useState('');
  const { isLoading: isGeoLoading, error: geoError, getLocation } = useGeolocation();

  const handleUseCurrentLocation = async () => {
    const result = await getLocation();
    if (result) {
      const locationData: SavedLocation = {
        name: 'Current Location',
        address: result.shortAddress,
        contact: '',
      };
      setStop(locationData);
      localStorage.setItem('stop_location', JSON.stringify(locationData));
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // Get logged-in phone number
      const storedPhone = window.localStorage.getItem('liftngo_phone') || '';
      setCurrentMobile(storedPhone);

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

      const rawStopDetails = window.localStorage.getItem('stop_details');
      if (rawStopDetails) {
        const details = JSON.parse(rawStopDetails) as { name: string; mobile: string };
        if (details?.name) setPersonName(details.name);
        if (details?.mobile) {
          setPersonMobile(details.mobile);
          // Check if stop mobile matches logged-in phone
          if (storedPhone && details.mobile === storedPhone) setUseCurrentMobile(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectStop = (loc: SavedLocation) => {
    setStop(loc);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('stop_location', JSON.stringify(loc));
        
        // Parse contact field to extract name and phone
        if (loc.contact) {
          const parts = loc.contact.split('|').map(p => p.trim());
          const name = parts[0] || '';
          const mobile = parts[1] || '';
          
          setPersonName(name);
          setPersonMobile(mobile);
          
          // Save stop details
          window.localStorage.setItem('stop_details', JSON.stringify({
            name,
            mobile,
          }));
          
          // Check if mobile matches logged-in phone
          if (currentMobile && mobile === currentMobile) {
            setUseCurrentMobile(true);
          }
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (useCurrentMobile) {
      setPersonMobile(currentMobile);
    }
  }, [useCurrentMobile]);

  const isMobileValid = useMemo(() => {
    const digits = personMobile.replace(/\D/g, '');
    return digits.length === 10;
  }, [personMobile]);

  const isFormValid = useMemo(
    () => Boolean(stop && personName.trim() && isMobileValid),
    [stop, personName, isMobileValid]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[520px] px-4 pb-6 pt-6">
        {/* Header */}
        <header className="pt-2 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back"
              className="h-9 w-9 rounded-full border border-gray-200 bg-white grid place-items-center"
            >
              <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-[18px] font-semibold text-gray-900">Add Stop</div>
          </div>
        </header>

        {/* Stops list */}
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 space-y-3">
            {/* Pickup row */}
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-gray-300 bg-[#F5F7FF] px-3 py-2.5 text-[14px] text-gray-900">
                {pickup?.name || 'Pickup'}
              </div>
              <div className="h-7 w-7 rounded-full bg-gray-100 border border-gray-300 grid place-items-center text-gray-400 text-xs">
                ||
              </div>
            </div>

            {/* Add stop row */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-dashed border-gray-400 bg-white px-3 py-2.5 text-left text-[14px] text-gray-400"
              >
                {stop?.name || 'Add a Stop'}
              </button>
              {stop && (
                <button
                  type="button"
                  aria-label="Remove stop"
                  onClick={() => setStop(null)}
                  className="h-7 w-7 rounded-full border border-gray-300 grid place-items-center text-gray-500 text-sm"
                >
                  ×
                </button>
              )}
            </div>

            {/* Drop row */}
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-gray-300 bg-[#F5F7FF] px-3 py-2.5 text-[14px] text-gray-900">
                {drop?.name || 'Drop'}
              </div>
              <button
                type="button"
                aria-label="Remove drop"
                className="h-7 w-7 rounded-full border border-gray-300 grid place-items-center text-gray-500 text-sm"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Stop contact details */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-600">Stop person name</label>
            <input
              type="text"
              placeholder="Name at stop"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-600">Stop Mobile Number</label>
            <input
              type="tel"
              placeholder="Mobile number at stop"
              value={personMobile}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPersonMobile(digits);
                if (digits !== currentMobile) setUseCurrentMobile(false);
              }}
              className={`w-full rounded-xl border bg-white px-3 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none ${
                personMobile && !isMobileValid ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {personMobile && !isMobileValid && (
              <p className="mt-1 text-[11px] text-red-500">Enter a valid 10-digit mobile number.</p>
            )}
          </div>

          <label className="mt-1 flex items-center gap-2 text-[12px] text-gray-600">
            <input
              type="checkbox"
              checked={useCurrentMobile}
              onChange={(e) => {
                const checked = e.target.checked;
                setUseCurrentMobile(checked);
                if (!checked) setPersonMobile('');
              }}
              className="h-4 w-4 rounded border-gray-300 text-[#1F2456]"
            />
            <span>
              Use My current Mobile number : <span className="font-semibold text-gray-800">{currentMobile}</span>
            </span>
          </label>
        </div>

        {/* Recent search */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-gray-700">Recent Search</div>
          <button type="button" className="text-[12px] font-medium text-blue-500">
            Clear All
          </button>
        </div>

        <div className="mt-3 divide-y divide-gray-200 border-t border-b border-gray-200">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGeoLoading}
            className="flex w-full items-center justify-between px-1 py-3 text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              {isGeoLoading ? (
                <svg className="h-4 w-4 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              <span className="text-[13px] text-gray-800">
                {isGeoLoading ? 'Getting location...' : 'Use my current location'}
              </span>
            </div>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {geoError && <p className="px-1 py-2 text-sm text-red-500">{geoError}</p>}

          {recentSearches.map((item, idx) => (
            <button
              key={`${item.name}-${idx}`}
              type="button"
              onClick={() => handleSelectStop(item)}
              className="flex w-full items-start gap-3 px-1 py-3 text-left"
            >
              <span className="mt-1">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
              </span>
              <span>
                <div className="text-[14px] font-semibold text-gray-900">{item.name}</div>
                <div className="mt-1 text-[12px] text-gray-500">{item.address}</div>
                <div className="mt-1 text-[11px] text-gray-400">{item.contact}</div>
              </span>
            </button>
          ))}
        </div>

        {/* Bottom confirm button */}
        <div className="mt-5">
          <button
            type="button"
            disabled={!isFormValid}
            onClick={() => {
              if (!isFormValid) return;
              try {
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem(
                    'stop_details',
                    JSON.stringify({ name: personName.trim(), mobile: personMobile })
                  );
                }
              } catch {
                // ignore
              }
              router.back();
            }}
            className="w-full rounded-2xl bg-[#1F2456] py-3.5 text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm stop details
          </button>
        </div>
      </div>
    </div>
  );
}

