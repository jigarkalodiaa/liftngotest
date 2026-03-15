'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  getPickupLocation,
  getDropLocation,
  getSelectedService,
  getSenderDetails,
  getReceiverDetails,
  getDeliveryGoodsDescription,
  clearDeliveryGoodsDescription,
  setPickupLocation,
  setDropLocation,
  setSenderDetails,
  setReceiverDetails,
} from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import type { ServiceId } from '@/types/booking';
import type { GoodTypeOption } from '@/data/goodTypes';
import { GOOD_TYPES } from '@/data/goodTypes';
import { PageContainer } from '@/components/ui';
import { theme } from '@/config/theme';
import {
  PaymentHeader,
  VehicleCard,
  AddressCta,
  GstSection,
  GoodsSection,
  CouponSection,
  PriceDetailsSection,
  PaymentFooterBar,
} from './components/PaymentSections';
import PaymentModals from './components/PaymentModals';

const TRIP_FARE = 522;
const GST_AMOUNT = 8;
const PLATFORM_FEE = 10;
const TOTAL_AMOUNT = TRIP_FARE + GST_AMOUNT + PLATFORM_FEE;

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicle, setVehicle] = useState<ServiceId | null>(null);
  const [pickup, setPickup] = useState(getPickupLocation());
  const [drop, setDrop] = useState(getDropLocation());
  const [sender, setSender] = useState(getSenderDetails());
  const [receiver, setReceiver] = useState(getReceiverDetails());
  const [showAddressDetailsModal, setShowAddressDetailsModal] = useState(false);
  const [showGstModal, setShowGstModal] = useState(false);
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedGoodType, setSelectedGoodType] = useState<GoodTypeOption | null>(() => GOOD_TYPES.find((t) => t.id === 'household') ?? null);
  const [weightKg, setWeightKg] = useState(500);
  const [packages, setPackages] = useState(1);
  const [showGoodTypesModal, setShowGoodTypesModal] = useState(false);
  const [showRestrictedList, setShowRestrictedList] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [deliveryGoods, setDeliveryGoods] = useState(getDeliveryGoodsDescription());

  const syncFromStorage = useCallback(() => {
    setVehicle(getSelectedService() ?? 'threeWheeler');
    setPickup(getPickupLocation());
    setDrop(getDropLocation());
    setSender(getSenderDetails());
    setReceiver(getReceiverDetails());
    setDeliveryGoods(getDeliveryGoodsDescription());
  }, []);

  useEffect(() => { syncFromStorage(); }, [syncFromStorage]);
  useEffect(() => {
    window.addEventListener('focus', syncFromStorage);
    return () => window.removeEventListener('focus', syncFromStorage);
  }, [syncFromStorage]);

  useEffect(() => {
    if (searchParams.get('openAddressModal') === '1') {
      syncFromStorage();
      setShowAddressDetailsModal(true);
      router.replace(ROUTES.PAYMENT, { scroll: false });
    }
  }, [searchParams, router, syncFromStorage]);

  const vehicleName = vehicle === 'walk' ? 'Big Saver' : vehicle === 'twoWheeler' ? 'Two Wheeler' : 'Tata Ace';
  const vehicleSubtitle = 'Quick Fleet ride';
  const vehicleImage = vehicle === 'walk' ? '/dashboard/service-walk.png' : vehicle === 'twoWheeler' ? '/dashboard/service-2wheeler.png' : '/dashboard/service-3wheeler.png';

  const openAddressModal = useCallback(() => { syncFromStorage(); setShowAddressDetailsModal(true); }, [syncFromStorage]);

  const handleSwapLocations = useCallback(() => {
    if (!pickup || !drop) return;
    setPickupLocation(drop);
    setDropLocation(pickup);
    if (sender && receiver) { setSenderDetails(receiver); setReceiverDetails(sender); }
    setPickup(drop);
    setDrop(pickup);
    setSender(receiver);
    setReceiver(sender);
  }, [pickup, drop, sender, receiver]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.white }}>
      <PageContainer className="pb-32 pt-4">
        <PaymentHeader
          onBack={() =>
            router.push(
              searchParams.get('from') === 'food'
                ? `${ROUTES.TRIP_OPTIONS}?from=food`
                : ROUTES.TRIP_OPTIONS
            )
          }
        />
        <VehicleCard serviceId={vehicle} />
        <AddressCta onClick={openAddressModal} />
        <GstSection gstin={gstin} businessName={businessName} onAddOrEdit={() => setShowGstModal(true)} />
        <GoodsSection
          goodTypeTitle={selectedGoodType?.title ?? ''}
          weightKg={weightKg}
          packages={packages}
          onChangeGoods={() => {
            if (deliveryGoods) {
              clearDeliveryGoodsDescription();
              setDeliveryGoods(null);
            }
            setShowGoodTypesModal(true);
          }}
          onViewRestrictedList={() => setShowRestrictedList(true)}
          deliveryGoods={deliveryGoods}
        />
        <CouponSection appliedCoupon={appliedCoupon} onToggleCoupon={() => setAppliedCoupon((c) => (c ? null : 'extra400'))} />
        <PriceDetailsSection tripFare={TRIP_FARE} gst={GST_AMOUNT} platformFee={PLATFORM_FEE} totalAmount={TOTAL_AMOUNT} />
        <p className="mt-6 text-center" style={{ fontSize: theme.fontSizes.xs, color: theme.colors.gray500 }}>
          By Placing the order, you agree to Liftngo Terms of use and Privacy Policy
        </p>
      </PageContainer>

      <PaymentModals
        showRestrictedList={showRestrictedList}
        setShowRestrictedList={setShowRestrictedList}
        showGoodTypesModal={showGoodTypesModal}
        setShowGoodTypesModal={setShowGoodTypesModal}
        setSelectedGoodType={setSelectedGoodType}
        selectedGoodType={selectedGoodType}
        showAddressDetailsModal={showAddressDetailsModal}
        setShowAddressDetailsModal={setShowAddressDetailsModal}
        onSwapLocations={handleSwapLocations}
        pickup={pickup}
        drop={drop}
        sender={sender}
        receiver={receiver}
        vehicleName={vehicleName}
        vehicleSubtitle={vehicleSubtitle}
        vehicleImage={vehicleImage}
        showGstModal={showGstModal}
        setShowGstModal={setShowGstModal}
        setGstin={setGstin}
        setBusinessName={setBusinessName}
        gstin={gstin}
        businessName={businessName}
      />

      <PaymentFooterBar onBookNow={() => router.push(ROUTES.BOOKING)} />
    </div>
  );
}
