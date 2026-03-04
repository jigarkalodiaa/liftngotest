'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  getPickupLocation,
  getDropLocation,
  getSelectedService,
  getSenderDetails,
  getReceiverDetails,
} from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import type { ServiceId } from '@/types/booking';
import SelectGoodTypesModal from '@/components/booking/SelectGoodTypesModal';
import AddressDetailsModal from '@/components/booking/AddressDetailsModal';
import AddGstModal from '@/components/booking/AddGstModal';
import type { GoodTypeOption } from '@/data/goodTypes';
import { GOOD_TYPES } from '@/data/goodTypes';
import { PageContainer, IconButton, BackIcon, Button } from '@/components/ui';

const VEHICLE_LABELS: Record<ServiceId, { name: string; subtitle: string; image: string }> = {
  walk: { name: 'Big Saver', subtitle: 'Quick Fleet ride', image: '/services/walk.svg' },
  twoWheeler: { name: 'Two Wheeler', subtitle: 'Quick Fleet ride', image: '/services/two-wheeler.svg' },
  threeWheeler: { name: 'Tata Ace', subtitle: 'Quick Fleet ride', image: '/services/three-wheeler.svg' },
};

export default function PaymentPage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<ServiceId | null>(null);
  const [pickup, setPickup] = useState(getPickupLocation());
  const [drop, setDrop] = useState(getDropLocation());
  const [sender, setSender] = useState(getSenderDetails());
  const [receiver, setReceiver] = useState(getReceiverDetails());
  const [showAddressDetailsModal, setShowAddressDetailsModal] = useState(false);
  const [showGstModal, setShowGstModal] = useState(false);
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedGoodType, setSelectedGoodType] = useState<GoodTypeOption | null>(
    () => GOOD_TYPES.find((t) => t.id === 'household') ?? null
  );
  const [weightKg, setWeightKg] = useState(500);
  const [packages, setPackages] = useState(1);
  const [showGoodTypesModal, setShowGoodTypesModal] = useState(false);
  const [showRestrictedList, setShowRestrictedList] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    const service = getSelectedService();
    setVehicle(service ?? 'threeWheeler');
    setPickup(getPickupLocation());
    setDrop(getDropLocation());
    setSender(getSenderDetails());
    setReceiver(getReceiverDetails());
  }, []);

  // Re-sync from storage when page gains focus (e.g. returning from address edit)
  useEffect(() => {
    const sync = () => {
      setVehicle(getSelectedService() ?? 'threeWheeler');
      setPickup(getPickupLocation());
      setDrop(getDropLocation());
      setSender(getSenderDetails());
      setReceiver(getReceiverDetails());
    };
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  const vehicleInfo = vehicle ? VEHICLE_LABELS[vehicle] : VEHICLE_LABELS.threeWheeler;

  const handleBookNow = useCallback(() => {
    router.push(ROUTES.BOOKING);
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <PageContainer className="pb-28 pt-4">
        <header className="flex items-center gap-3 pb-4">
          <IconButton
            aria-label="Back to trip options"
            onClick={() => router.push(ROUTES.TRIP_OPTIONS)}
            className="h-10 w-10"
          >
            <BackIcon />
          </IconButton>
          <h1 className="flex-1 text-center text-[20px] font-bold text-gray-900">Payment</h1>
          <div className="w-10" />
        </header>

        {/* Vehicle card */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-bold text-gray-900">{vehicleInfo.name}</h2>
              <p className="mt-0.5 text-[14px] text-gray-500">{vehicleInfo.subtitle}</p>
              <p className="mt-2 text-[14px] font-medium text-emerald-600">20 Min Away</p>
            </div>
            <div className="relative h-20 w-24 flex-shrink-0">
              <Image
                src={vehicleInfo.image}
                alt={vehicleInfo.name}
                fill
                className="object-contain object-right"
              />
            </div>
          </div>
        </section>

        {/* Address detail */}
        <section className="mt-4">
          <button
            type="button"
            onClick={() => {
              setPickup(getPickupLocation());
              setDrop(getDropLocation());
              setSender(getSenderDetails());
              setReceiver(getReceiverDetails());
              setShowAddressDetailsModal(true);
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[15px] font-medium text-gray-900">Address detail</span>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>

        {/* GST Details */}
        <section className="mt-5">
          <h2 className="text-[15px] font-semibold text-gray-900">GST Details</h2>
          <div className="mt-2 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
            <span className="text-[14px] text-gray-600">
              {gstin || businessName
                ? [gstin, businessName].filter(Boolean).join(' • ')
                : 'Have a GST Number?'}
            </span>
            <button
              type="button"
              onClick={() => setShowGstModal(true)}
              className="text-[14px] font-medium text-[#2563EB]"
            >
              {gstin || businessName ? 'Edit GSTIN' : 'Add GSTIN'}
            </button>
          </div>
        </section>

        {/* Goods Description */}
        <section className="mt-5">
          <h2 className="text-[15px] font-semibold text-gray-900">Goods Description</h2>
          <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[14px] font-medium text-gray-900">
                  {selectedGoodType?.title ?? 'Select goods type'}
                </p>
                <p className="mt-1 text-[13px] text-gray-500">
                  {weightKg}kg • ({packages} {packages === 1 ? 'Package' : 'Packages'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGoodTypesModal(true)}
                className="text-[14px] font-medium text-[#2563EB]"
              >
                Change
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2.5 border border-amber-100">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-[13px] text-gray-700">Do Not send restricted items</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRestrictedList(true)}
                className="text-[13px] font-medium text-[#2563EB]"
              >
                View List
              </button>
            </div>
          </div>
        </section>

        {/* Coupon & Bank offers */}
        <section className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-gray-900">Coupon & Bank offers</h2>
            <button type="button" className="text-[14px] font-medium text-[#2563EB]">
              All Offers &gt;
            </button>
          </div>
          <div className="mt-3 rounded-2xl border-2 border-[#2563EB] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[15px] font-bold text-gray-900">Extra ₹400 OFF</p>
                <p className="mt-0.5 text-[13px] text-gray-500">10% off</p>
              </div>
              <button
                type="button"
                onClick={() => setAppliedCoupon('extra400')}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white"
              >
                APPLY COUPON
              </button>
            </div>
          </div>
        </section>

        {/* Restricted items modal placeholder - could be a modal later */}
        {showRestrictedList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
              <h3 className="text-[18px] font-bold text-gray-900">Restricted items</h3>
              <p className="mt-2 text-[14px] text-gray-600">
                Do not send explosives, flammables, illegal goods, live animals, or other prohibited items. Contact support for the full list.
              </p>
              <button
                type="button"
                onClick={() => setShowRestrictedList(false)}
                className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-[15px] font-semibold text-white"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* Select Good Types modal */}
        <SelectGoodTypesModal
          isOpen={showGoodTypesModal}
          onClose={() => setShowGoodTypesModal(false)}
          onProceed={(goodType) => {
            setSelectedGoodType(goodType);
            setShowGoodTypesModal(false);
          }}
          initialSelectedId={selectedGoodType?.id ?? null}
        />

        {/* Address Details modal */}
        <AddressDetailsModal
          isOpen={showAddressDetailsModal}
          onClose={() => setShowAddressDetailsModal(false)}
          onEditPickup={() => {
            setShowAddressDetailsModal(false);
            router.push(`${ROUTES.PICKUP_LOCATION_EDIT}?type=pickup`);
          }}
          onEditDrop={() => {
            setShowAddressDetailsModal(false);
            router.push(`${ROUTES.PICKUP_LOCATION_EDIT}?type=drop`);
          }}
          pickup={pickup}
          drop={drop}
          sender={sender}
          receiver={receiver}
          vehicleName={vehicleInfo.name}
          vehicleSubtitle={vehicleInfo.subtitle}
          vehicleImage={vehicleInfo.image}
        />

        {/* Add GST modal */}
        <AddGstModal
          isOpen={showGstModal}
          onClose={() => setShowGstModal(false)}
          onSave={(gstNumber, name) => {
            setGstin(gstNumber);
            setBusinessName(name);
            setShowGstModal(false);
          }}
          initialGstNumber={gstin}
          initialBusinessName={businessName}
        />
      </PageContainer>

      {/* Bottom Book now */}
      <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white">
        <div className="mx-auto w-full max-w-[520px] px-4 py-4">
          <Button fullWidth onClick={handleBookNow} className="!rounded-2xl flex items-center justify-center gap-2">
            Book now
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
