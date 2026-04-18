'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Bike,
  Calculator,
  CarFront,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Route,
  Shield,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { LOGO_PATH } from '@/lib/site';
import {
  FARE_SLABS,
  INTERSTATE_TOLL_CHARGE,
  PEAK_HOUR_MULTIPLIER,
  calculateFare,
  estimateTripTimeMinutes,
  normalizeDistanceKm,
  type FareVehicleType,
} from '@/lib/pricing/fareCalculator';

const PRIMARY = '#2C2D5B';
const ACCENT = 'rgb(255, 140, 0)';

const VEHICLE_OPTIONS: Array<{
  id: FareVehicleType;
  label: string;
  subtitle: string;
  icon: typeof Bike;
}> = [
  {
    id: 'twoWheeler',
    label: '2 Wheeler',
    subtitle: 'Small parcels',
    icon: Bike,
  },
  {
    id: 'threeWheeler',
    label: '3 Wheeler',
    subtitle: 'Medium goods',
    icon: Truck,
  },
  {
    id: 'fourWheeler',
    label: '4 Wheeler',
    subtitle: 'Bulk loads',
    icon: CarFront,
  },
];

const FARE_CALCULATOR_WHATSAPP_DIGITS = '917763094869';
const MAX_DISTANCE_KM = 150;

function formatInr(value: number): string {
  return value.toLocaleString('en-IN');
}

export default function FareCalculatorPage() {
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
    const fareStatus = canCalculate ? `Rs ${formatInr(fareQuote.totalFare)}` : 'Not calculated yet';
    return `LiftNGo Fare Request

Pickup: ${pickup}
Drop: ${drop}
Vehicle: ${selectedVehicle.label}
Distance: ${distanceText}
Estimated Time: ${timeText}
Interstate: ${isInterstate ? 'Yes' : 'No'}
Peak Hour: ${isPeakHour ? 'On' : 'Off'}

Total Fare: ${fareStatus}`;
  }, [pickupLocation, dropLocation, normalizedDistance, estimatedTime, isInterstate, isPeakHour, canCalculate, selectedVehicle.label, fareQuote.totalFare]);

  const whatsappHref = useMemo(
    () => `https://wa.me/${FARE_CALCULATOR_WHATSAPP_DIGITS}?text=${encodeURIComponent(whatsappPayload)}`,
    [whatsappPayload]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/98 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 sm:gap-3">
            <Image src={LOGO_PATH} alt="Liftngo" width={120} height={36} className="h-7 w-auto object-contain sm:h-8" priority />
            <span className="hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:inline sm:px-3 sm:text-[11px]" style={{ borderColor: `${ACCENT}20`, color: ACCENT }}>
              Fare Calculator
            </span>
          </Link>
          <Link
            href={ROUTES.HOME}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 sm:h-10 sm:text-sm"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: `linear-gradient(135deg, ${PRIMARY}08 0%, white 100%)` }}>
        <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-6xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider sm:px-4 sm:py-2 sm:text-[11px]" style={{ borderColor: `${ACCENT}30`, color: ACCENT }}>
              <Calculator className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Instant Estimation
            </span>
            <h1 className="mt-4 text-2xl font-black leading-tight tracking-tight text-gray-900 sm:mt-6 sm:text-3xl md:text-4xl">
              Calculate Your
              <span className="block" style={{ color: PRIMARY }}>Delivery Fare</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 sm:mt-4 sm:text-base">
              Get instant fare estimates using Liftngo&apos;s transparent slab-based pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-gray-50">
        <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-[1fr,360px] lg:items-start">
              {/* Left: Input Form */}
              <div className="space-y-5">
                {/* Trip Details Card */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" style={{ borderLeftWidth: '4px', borderLeftColor: ACCENT }}>
                  <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                        <MapPin className="h-4 w-4" style={{ color: ACCENT }} />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-gray-900">Trip Details</h2>
                        <p className="text-[11px] text-gray-500">Enter pickup, drop & distance</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-gray-600">Pickup Location</span>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            placeholder="Enter pickup"
                            className="h-11 w-full rounded-xl bg-white pl-10 pr-3 text-sm text-gray-800 transition-all"
                            style={{ border: '2px solid #D1D5DB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                            onFocus={(e) => { e.target.style.border = `2px solid ${ACCENT}`; e.target.style.boxShadow = `0 0 0 3px ${ACCENT}20`; }}
                            onBlur={(e) => { e.target.style.border = '2px solid #D1D5DB'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
                          />
                        </div>
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-gray-600">Drop Location</span>
                        <div className="relative">
                          <Route className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={dropLocation}
                            onChange={(e) => setDropLocation(e.target.value)}
                            placeholder="Enter drop"
                            className="h-11 w-full rounded-xl bg-white pl-10 pr-3 text-sm text-gray-800 transition-all"
                            style={{ border: '2px solid #D1D5DB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                            onFocus={(e) => { e.target.style.border = `2px solid ${ACCENT}`; e.target.style.boxShadow = `0 0 0 3px ${ACCENT}20`; }}
                            onBlur={(e) => { e.target.style.border = '2px solid #D1D5DB'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
                          />
                        </div>
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-gray-600">Distance (KM)</span>
                        <div className="relative">
                          <Route className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            min="0"
                            max={MAX_DISTANCE_KM}
                            step="0.1"
                            inputMode="decimal"
                            value={distanceInput}
                            onChange={(e) => handleDistanceChange(e.target.value)}
                            placeholder="Enter distance"
                            className="h-11 w-full rounded-xl bg-white pl-10 pr-3 text-sm text-gray-800 transition-all"
                            style={{ border: '2px solid #D1D5DB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                            onFocus={(e) => { e.target.style.border = `2px solid ${ACCENT}`; e.target.style.boxShadow = `0 0 0 3px ${ACCENT}20`; }}
                            onBlur={(e) => { e.target.style.border = '2px solid #D1D5DB'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
                          />
                        </div>
                        {distanceError && <p className="mt-1 text-xs font-medium text-red-600">{distanceError}</p>}
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-gray-600">Estimated Time</span>
                        <div className="flex h-11 items-center rounded-xl bg-gray-50 px-3" style={{ border: '2px solid #D1D5DB' }}>
                          <Clock className="mr-2 h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {estimatedTime > 0 ? `${estimatedTime} min` : 'Auto-calculated'}
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3">
                        <p className="text-xs font-semibold text-gray-700">Interstate Trip?</p>
                        <div className="mt-2 inline-flex rounded-lg border border-gray-200 bg-white p-1">
                          <button
                            type="button"
                            onClick={() => setIsInterstate(false)}
                            className="min-h-8 rounded-md px-4 text-xs font-semibold transition-all"
                            style={!isInterstate ? { backgroundColor: ACCENT, color: 'white' } : { color: '#6B7280' }}
                          >
                            No
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsInterstate(true)}
                            className="min-h-8 rounded-md px-4 text-xs font-semibold transition-all"
                            style={isInterstate ? { backgroundColor: ACCENT, color: 'white' } : { color: '#6B7280' }}
                          >
                            Yes (+₹{INTERSTATE_TOLL_CHARGE})
                          </button>
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3">
                        <p className="text-xs font-semibold text-gray-700">Peak Hour?</p>
                        <div className="mt-2 inline-flex rounded-lg border border-gray-200 bg-white p-1">
                          <button
                            type="button"
                            onClick={() => setIsPeakHour(false)}
                            className="min-h-8 rounded-md px-4 text-xs font-semibold transition-all"
                            style={!isPeakHour ? { backgroundColor: ACCENT, color: 'white' } : { color: '#6B7280' }}
                          >
                            Off
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsPeakHour(true)}
                            className="min-h-8 rounded-md px-4 text-xs font-semibold transition-all"
                            style={isPeakHour ? { backgroundColor: ACCENT, color: 'white' } : { color: '#6B7280' }}
                          >
                            On ({PEAK_HOUR_MULTIPLIER}x)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Selection Card */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" style={{ borderLeftWidth: '4px', borderLeftColor: ACCENT }}>
                  <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                        <Truck className="h-4 w-4" style={{ color: ACCENT }} />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-gray-900">Select Vehicle</h2>
                        <p className="text-[11px] text-gray-500">Choose based on load size</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-3">
                      {VEHICLE_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isActive = option.id === vehicleType;
                        const isRecommended = option.id === 'threeWheeler';
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setVehicleType(option.id)}
                            className="relative rounded-xl border-2 bg-white p-3 text-center transition-all duration-300 hover:shadow-md sm:p-4"
                            style={isActive ? { borderColor: ACCENT, boxShadow: `0 0 0 3px ${ACCENT}20` } : { borderColor: '#E5E7EB' }}
                          >
                            {isRecommended && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[8px] font-bold uppercase text-white sm:text-[9px]" style={{ backgroundColor: ACCENT }}>
                                Popular
                              </span>
                            )}
                            {isActive && (
                              <CheckCircle className="absolute right-2 top-2 h-4 w-4" style={{ color: ACCENT }} />
                            )}
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg sm:h-12 sm:w-12" style={{ backgroundColor: isActive ? `${ACCENT}15` : '#F3F4F6' }}>
                              <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: isActive ? ACCENT : '#6B7280' }} />
                            </div>
                            <p className="mt-2 text-xs font-bold text-gray-900 sm:text-sm">{option.label}</p>
                            <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">{option.subtitle}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Price Summary */}
              <div className="lg:sticky lg:top-20">
                <div className="overflow-hidden rounded-2xl border shadow-xl" style={{ borderColor: `${ACCENT}30`, background: PRIMARY }}>
                  {canCalculate && (
                    <div className="flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold text-white" style={{ backgroundColor: ACCENT }}>
                      <Sparkles className="h-3.5 w-3.5" />
                      Live Estimate
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Your Fare</h3>
                      <span className="relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase" style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}>
                        <span className="relative h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                        Live
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-white/10 p-3">
                      <p className="text-[11px] font-semibold uppercase text-white/60">Selected</p>
                      <p className="mt-1 text-sm font-bold text-white">{selectedVehicle.label}</p>
                      <p className="mt-1 text-xs text-white/50">Slab up to {slabEndKm} km</p>
                    </div>

                    {!canCalculate ? (
                      <div className="mt-5 rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center">
                        <Zap className="mx-auto h-6 w-6 text-white/40" />
                        <p className="mt-2 text-sm font-semibold text-white/80">Enter distance to see fare</p>
                        <p className="mt-1 text-xs text-white/50">Updates instantly</p>
                      </div>
                    ) : (
                      <>
                        <div className="mt-5 space-y-3 text-sm">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="text-white/60">Slab fare ({fareBreakdown.distance} km)</span>
                            <span className="font-semibold text-white">₹{formatInr(fareBreakdown.slabFare)}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="text-white/60">Toll</span>
                            <span className="font-semibold text-white">₹{formatInr(fareBreakdown.toll)}</span>
                          </div>
                          {fareBreakdown.surgeAmount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-white/60">Peak surge ({fareBreakdown.surgeMultiplier}x)</span>
                              <span className="font-semibold" style={{ color: ACCENT }}>+₹{formatInr(fareBreakdown.surgeAmount)}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: `2px solid ${ACCENT}40` }}>
                          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Total Fare</p>
                          <p className="mt-1 text-3xl font-black tabular-nums text-white sm:text-4xl">₹{formatInr(fareQuote.totalFare)}</p>
                          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            <CheckCircle className="h-3 w-3" />
                            Best Price Applied
                          </div>
                        </div>
                      </>
                    )}

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Share on WhatsApp
                      <ArrowRight className="h-4 w-4" />
                    </a>

                    <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-white/40">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Transparent pricing
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        No hidden fees
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Image src={LOGO_PATH} alt="Liftngo" width={100} height={28} className="h-7 w-auto object-contain sm:h-8" />
              <div className="border-l border-gray-200 pl-3">
                <p className="text-sm font-bold text-gray-900">
                  <span style={{ color: PRIMARY }}>Fare Calculator</span>
                </p>
                <p className="text-[10px] text-gray-500 sm:text-xs">Transparent Pricing</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 sm:text-xs">
              © {new Date().getFullYear()} Liftngo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
