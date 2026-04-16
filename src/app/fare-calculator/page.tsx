'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bike,
  CarFront,
  CheckCircle2,
  ChevronLeft,
  CircleOff,
  MapPin,
  MessageCircle,
  Route,
  Sparkles,
  Truck,
  Wallet,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import {
  FARE_SLABS,
  INTERSTATE_TOLL_CHARGE,
  PEAK_HOUR_MULTIPLIER,
  calculateFare,
  estimateTripTimeMinutes,
  normalizeDistanceKm,
  type FareVehicleType,
} from '@/lib/pricing/fareCalculator';

const VEHICLE_OPTIONS: Array<{
  id: FareVehicleType;
  label: string;
  subtitle: string;
  icon: typeof Bike;
  accent: string;
}> = [
  {
    id: 'twoWheeler',
    label: '2 Wheeler',
    subtitle: 'Best for small parcels',
    icon: Bike,
    accent: 'from-sky-500/18 to-sky-50',
  },
  {
    id: 'threeWheeler',
    label: '3 Wheeler',
    subtitle: 'Ideal for medium goods',
    icon: Truck,
    accent: 'from-emerald-500/18 to-emerald-50',
  },
  {
    id: 'fourWheeler',
    label: '4 Wheeler',
    subtitle: 'For heavy and bulk loads',
    icon: CarFront,
    accent: 'from-violet-500/18 to-violet-50',
  },
];

const FARE_CALCULATOR_WHATSAPP_DIGITS = '917763094869';
const MAX_DISTANCE_KM = 150;

function formatInr(value: number): string {
  return value.toLocaleString('en-IN');
}

export default function FareCalculatorPage() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [distanceInput, setDistanceInput] = useState('');
  const [distanceError, setDistanceError] = useState('');
  const [vehicleType, setVehicleType] = useState<FareVehicleType>('threeWheeler');
  const [isInterstate, setIsInterstate] = useState(false);
  const [isPeakHour, setIsPeakHour] = useState(false);

  const normalizedDistance = useMemo(() => normalizeDistanceKm(distanceInput), [distanceInput]);
  const estimatedTime = useMemo(
    () =>
      estimateTripTimeMinutes({
        vehicleType,
        distanceKm: normalizedDistance,
        isPeakHour,
      }),
    [vehicleType, normalizedDistance, isPeakHour]
  );
  const canCalculate = normalizedDistance > 0;
  const selectedVehicle = VEHICLE_OPTIONS.find((option) => option.id === vehicleType) ?? VEHICLE_OPTIONS[0];
  const selectedSlabs = FARE_SLABS[vehicleType];
  const slabStartKm = selectedSlabs[0]?.upto ?? 0;
  const slabEndKm = selectedSlabs[selectedSlabs.length - 1]?.upto ?? 0;

  const fareQuote = useMemo(
    () =>
      calculateFare({
        vehicleType,
        distance: normalizedDistance,
        isInterstate,
        isPeakHour,
      }),
    [vehicleType, normalizedDistance, isInterstate, isPeakHour]
  );
  const fareBreakdown = fareQuote.breakdown;

  const handleDistanceChange = (rawValue: string) => {
    if (rawValue === '') {
      setDistanceInput('');
      setDistanceError('');
      return;
    }

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) return;

    if (parsed < 0) {
      setDistanceInput('0');
      setDistanceError('Distance cannot be negative.');
      return;
    }

    if (parsed > MAX_DISTANCE_KM) {
      setDistanceInput(String(MAX_DISTANCE_KM));
      setDistanceError(`Maximum allowed distance is ${MAX_DISTANCE_KM} km.`);
      return;
    }

    setDistanceInput(rawValue);
    setDistanceError('');
  };

  const whatsappPayload = useMemo(() => {
    const pickup = pickupLocation.trim() || 'Not provided';
    const drop = dropLocation.trim() || 'Not provided';
    const distanceText = normalizedDistance > 0 ? `${normalizedDistance} km` : 'Not provided';
    const timeText = estimatedTime > 0 ? `${estimatedTime} min` : 'Not available';
    const interstateText = isInterstate ? 'Yes' : 'No';
    const peakText = isPeakHour ? 'On' : 'Off';
    const fareStatus = canCalculate ? `Rs ${formatInr(fareQuote.totalFare)}` : 'Not calculated yet';

    return `LiftNGo Fare Request

Pickup: ${pickup}
Drop: ${drop}
Vehicle: ${selectedVehicle.label}
Distance: ${distanceText}
Estimated Time: ${timeText}
Interstate: ${interstateText}
Peak Hour: ${peakText}
Best Price: ${canCalculate ? 'Applied' : 'Pending distance'}

Total Fare: ${fareStatus}`;
  }, [
    pickupLocation,
    dropLocation,
    normalizedDistance,
    estimatedTime,
    isInterstate,
    isPeakHour,
    canCalculate,
    selectedVehicle.label,
    fareQuote.totalFare,
  ]);
  const whatsappHref = useMemo(
    () => `https://wa.me/${FARE_CALCULATOR_WHATSAPP_DIGITS}?text=${encodeURIComponent(whatsappPayload)}`,
    [whatsappPayload]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/60">
      <div className="bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#3d3f7a] px-4 pb-9 pt-3 text-white md:px-6 md:pb-11 md:pt-4 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <button
            type="button"
            onClick={() => router.push(ROUTES.HOME)}
            className="mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white md:mb-4 md:text-sm"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back to home
          </button>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white/95 backdrop-blur-sm md:text-[11px]">
            Instant estimation
          </div>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight md:mt-3 md:text-2xl lg:text-3xl">
            Fare Calculator
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            Enter trip details and get an instant estimate using LiftNGo base pricing logic.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-white/90">
            {['1. Enter locations', '2. Select vehicle', '3. View live fare'].map((step) => (
              <span key={step} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="-mt-7 mx-auto w-full max-w-6xl px-4 pb-24 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr),370px] lg:items-start lg:gap-6">
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_35px_-20px_rgba(15,23,42,0.18)] sm:p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                Step 1 - Trip details
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">Pickup location</span>
                  <div className="relative rounded-xl border-2 border-slate-300 bg-white shadow-sm transition-all focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/20 focus-within:shadow-md">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(event) => setPickupLocation(event.target.value)}
                      placeholder="Enter pickup location"
                      className="h-12 w-full rounded-xl bg-transparent pl-10 pr-3 text-sm text-slate-800 focus:outline-none"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">Drop location</span>
                  <div className="relative rounded-xl border-2 border-slate-300 bg-white shadow-sm transition-all focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/20 focus-within:shadow-md">
                    <Route className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={dropLocation}
                      onChange={(event) => setDropLocation(event.target.value)}
                      placeholder="Enter drop location"
                      className="h-12 w-full rounded-xl bg-transparent pl-10 pr-3 text-sm text-slate-800 focus:outline-none"
                    />
                  </div>
                </label>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">Distance (KM)</span>
                  <div className="relative rounded-xl border-2 border-slate-300 bg-white shadow-sm transition-all focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/20 focus-within:shadow-md">
                    <Route className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      min="0"
                      max={MAX_DISTANCE_KM}
                      step="0.1"
                      inputMode="decimal"
                      value={distanceInput}
                      onChange={(event) => handleDistanceChange(event.target.value)}
                      placeholder="Enter distance in kilometers"
                      className="h-12 w-full rounded-xl bg-transparent pl-10 pr-3 text-sm text-slate-800 focus:outline-none"
                    />
                  </div>
                  {distanceError && <p className="mt-1 text-xs font-medium text-red-600">{distanceError}</p>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">Estimated time (minutes)</span>
                  <div className="relative rounded-xl border-2 border-slate-300 bg-slate-50 shadow-sm">
                    <Route className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <div className="flex h-12 w-full items-center pl-10 pr-3 text-sm font-medium text-slate-700">
                      {estimatedTime > 0 ? `${estimatedTime} min` : 'Calculated from distance + vehicle'}
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Uses vehicle speed + city traffic factor (+ peak adjustment).</p>
                </label>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700">Interstate trip?</p>
                  <div className="mt-2 inline-flex rounded-lg border border-slate-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setIsInterstate(false)}
                      className={`min-h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
                        !isInterstate ? 'bg-[#1e1f4b] text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInterstate(true)}
                      className={`min-h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
                        isInterstate ? 'bg-[#1e1f4b] text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700">Peak hour pricing?</p>
                  <div className="mt-2 inline-flex rounded-lg border border-slate-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setIsPeakHour(false)}
                      className={`min-h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
                        !isPeakHour ? 'bg-[#1e1f4b] text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Off
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPeakHour(true)}
                      className={`min-h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
                        isPeakHour ? 'bg-[#1e1f4b] text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      On
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Slab-based fare is auto-selected by distance. Interstate adds ₹{INTERSTATE_TOLL_CHARGE}. Peak hour applies {PEAK_HOUR_MULTIPLIER}x.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_35px_-20px_rgba(15,23,42,0.18)] sm:p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                <Truck className="h-4 w-4 text-[var(--color-primary)]" />
                Step 2 - Select vehicle
              </h3>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-2.5">
                {VEHICLE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isActive = option.id === vehicleType;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setVehicleType(option.id)}
                      className={`group relative overflow-hidden rounded-xl border p-2.5 text-left transition-all duration-300 sm:p-3 ${
                        isActive
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/[0.06] shadow-md shadow-[var(--color-primary)]/20'
                          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br ${option.accent} blur-xl transition-opacity ${
                          isActive ? 'opacity-90' : 'opacity-50'
                        }`}
                      />
                      <div className="relative">
                        <div
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${option.accent} ${
                            isActive ? 'text-[var(--color-primary)]' : 'text-slate-600'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-slate-900 sm:text-sm">{option.label}</p>
                        <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">{option.subtitle}</p>
                        {isActive && (
                          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--color-primary)] sm:mt-2 sm:text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Selected</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-20">
            <section
              className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.2)] transition-all duration-300 sm:p-5 ${
                canCalculate ? 'opacity-100' : 'opacity-90'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Step 3 - Fare estimate</h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  <Sparkles className="h-3 w-3 text-[var(--color-primary)]" />
                  Live
                </span>
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Selected vehicle</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{selectedVehicle.label}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Slab up to {fareBreakdown.slabUptoApplied} km selected.
                  {fareBreakdown.overageKm > 0 ? ` Extra km billed at ₹${fareBreakdown.overageRate}/km.` : ''}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">Slab bands available: up to {slabStartKm} km - {slabEndKm} km.</p>
              </div>

              {!canCalculate ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                  <CircleOff className="mx-auto h-5 w-5 text-slate-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-700">Add distance to see fare instantly</p>
                  <p className="mt-1 text-xs text-slate-500">The estimate will update automatically on each change.</p>
                </div>
              ) : (
                <>
                  <div className="mt-4 space-y-2.5 text-sm">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Slab fare ({fareBreakdown.distance} km)</span>
                      <span className="font-semibold text-slate-900">₹{formatInr(fareBreakdown.slabFare)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Toll</span>
                      <span className={`font-semibold ${fareBreakdown.toll > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                        ₹{formatInr(fareBreakdown.toll)}
                      </span>
                    </div>
                    {fareBreakdown.surgeAmount > 0 && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Peak hour surge ({fareBreakdown.surgeMultiplier}x)</span>
                        <span className="font-semibold text-rose-700">+₹{formatInr(fareBreakdown.surgeAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/12 to-white p-4 transition-all duration-300">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">Total fare</p>
                    <div className="mt-1 flex items-end justify-between gap-2">
                      <p className="text-3xl font-extrabold tracking-tight text-[#1e1f4b]">₹{formatInr(fareQuote.totalFare)}</p>
                      <Wallet className="h-5 w-5 text-[#1e1f4b]" aria-hidden />
                    </div>
                    <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      Best price
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">Subtotal before surge: ₹{formatInr(fareBreakdown.subtotal)}</p>
                  </div>
                </>
              )}

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-700">Trip summary</p>
                <p className="mt-1">Pickup: {pickupLocation.trim() || 'Not provided'}</p>
                <p className="mt-1">Drop: {dropLocation.trim() || 'Not provided'}</p>
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                This is an indicative fare for quick planning. Final fare may vary with route and service conditions.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Share details on WhatsApp
              </a>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
