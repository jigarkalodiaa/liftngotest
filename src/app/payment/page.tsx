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
  getHotelBookingDraft,
  clearHotelBookingDraft,
  appendHotelBookingHistoryFromDraft,
  appendFoodDeliveryHistory,
  appendMarketplaceHistoryFromDeliveryGoods,
  setPickupLocation,
  setDropLocation,
  setSenderDetails,
  setReceiverDetails,
  type DeliveryGoodsDescription,
} from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import type { ServiceId, SavedLocation, PersonDetails, HotelBookingDraft } from '@/types/booking';
import type { GoodTypeOption } from '@/data/goodTypes';
import { GOOD_TYPES } from '@/data/goodTypes';
import { PageContainer } from '@/components/ui';
import { theme } from '@/config/theme';
import { trackBookingCompleted } from '@/lib/analytics';
import { useRazorpay } from '@/lib/razorpay';
import {
  PaymentHeader,
  VehicleCard,
  AddressCta,
  GstSection,
  HotelStaySummarySection,
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

/** All-in delivery charge shown on payment when booking from restaurant food flow */
const FOOD_PAYMENT_FLAT_INR = 50;

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromFood = searchParams.get('from') === 'food';
  const fromKhatuHotel = searchParams.get('from') === 'khatu_hotel';
  const [vehicle, setVehicle] = useState<ServiceId | null>(null);
  /** SSR + hydration: always null until useEffect sync — never read localStorage in useState initializer */
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [sender, setSender] = useState<PersonDetails | null>(null);
  const [receiver, setReceiver] = useState<PersonDetails | null>(null);
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
  const [deliveryGoods, setDeliveryGoods] = useState<DeliveryGoodsDescription | null>(null);
  const [hotelDraft, setHotelDraft] = useState<HotelBookingDraft | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const { openPayment } = useRazorpay();

  const syncFromStorage = useCallback(() => {
    setVehicle(getSelectedService() ?? 'threeWheeler');
    setPickup(getPickupLocation());
    setDrop(getDropLocation());
    setSender(getSenderDetails());
    setReceiver(getReceiverDetails());

    if (fromKhatuHotel) {
      const h = getHotelBookingDraft();
      setHotelDraft(h);
      if (getDeliveryGoodsDescription()) clearDeliveryGoodsDescription();
      setDeliveryGoods(null);
    } else {
      clearHotelBookingDraft();
      setHotelDraft(null);
      if (fromFood) {
        setDeliveryGoods(getDeliveryGoodsDescription());
      } else {
        if (getDeliveryGoodsDescription()) clearDeliveryGoodsDescription();
        setDeliveryGoods(null);
      }
    }
  }, [fromFood, fromKhatuHotel]);

  useEffect(() => { syncFromStorage(); }, [syncFromStorage]);

  useEffect(() => {
    if (!fromKhatuHotel) return;
    if (!getHotelBookingDraft()) {
      router.replace(ROUTES.KHATU_HOTELS);
    }
  }, [fromKhatuHotel, router]);
  useEffect(() => {
    window.addEventListener('focus', syncFromStorage);
    return () => window.removeEventListener('focus', syncFromStorage);
  }, [syncFromStorage]);

  useEffect(() => {
    if (searchParams.get('openAddressModal') === '1') {
      syncFromStorage();
      setShowAddressDetailsModal(true);
      const q =
        fromKhatuHotel ? `${ROUTES.PAYMENT}?from=khatu_hotel` : fromFood ? `${ROUTES.PAYMENT}?from=food` : ROUTES.PAYMENT;
      router.replace(q, { scroll: false });
    }
  }, [searchParams, router, syncFromStorage, fromFood, fromKhatuHotel]);

  const vehicleName =
    vehicle === 'walk'
      ? 'Big Saver'
      : vehicle === 'twoWheeler'
        ? 'Two Wheeler'
        : vehicle === 'threeWheeler'
          ? 'Three Wheeler'
          : 'Four Wheeler';
  const vehicleSubtitle = 'Quick Fleet ride';
  const vehicleImage =
    vehicle === 'walk'
      ? '/dashboard/service-walk.png'
      : vehicle === 'twoWheeler'
        ? '/dashboard/service-2wheeler.png'
        : vehicle === 'threeWheeler'
          ? '/dashboard/service-3wheeler.png'
          : '/services/four-wheeler.svg';

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
          onBack={() => {
            if (fromKhatuHotel && hotelDraft) {
              router.push(`${ROUTES.BOOKING_HOTEL}/${hotelDraft.hotelId}`);
              return;
            }
            if (fromFood) {
              router.push(`${ROUTES.TRIP_OPTIONS}?from=food`);
              return;
            }
            router.push(ROUTES.TRIP_OPTIONS);
          }}
        />
        <VehicleCard serviceId={vehicle} />
        <AddressCta onClick={openAddressModal} />
        <GstSection gstin={gstin} businessName={businessName} onAddOrEdit={() => setShowGstModal(true)} />
        {fromKhatuHotel && hotelDraft ? (
          <HotelStaySummarySection draft={hotelDraft} />
        ) : (
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
        )}
        {!fromFood && !fromKhatuHotel ? (
          <CouponSection appliedCoupon={appliedCoupon} onToggleCoupon={() => setAppliedCoupon((c) => (c ? null : 'extra400'))} />
        ) : null}
        <PriceDetailsSection
          tripFare={TRIP_FARE}
          gst={GST_AMOUNT}
          platformFee={PLATFORM_FEE}
          totalAmount={TOTAL_AMOUNT}
          foodFlatInr={fromFood ? FOOD_PAYMENT_FLAT_INR : undefined}
          hotelStay={
            fromKhatuHotel && hotelDraft
              ? {
                  totalInr: hotelDraft.estimatedTotalInr,
                  nights: hotelDraft.nights,
                  pricePerNight: hotelDraft.pricePerNight,
                  checkIn: hotelDraft.checkIn,
                  checkOut: hotelDraft.checkOut,
                  guests: hotelDraft.guests,
                }
              : undefined
          }
        />
        {payError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
            {payError}
          </div>
        )}
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
        fromFood={fromFood}
        fromKhatuHotel={fromKhatuHotel}
      />

      <PaymentFooterBar
        onBookNow={() => {
          const flow = fromKhatuHotel ? 'khatu_hotel' : fromFood ? 'food' : 'standard';
          const payableInr =
            fromKhatuHotel && hotelDraft
              ? hotelDraft.estimatedTotalInr
              : fromFood
                ? FOOD_PAYMENT_FLAT_INR
                : TOTAL_AMOUNT;

          setPayError(null);
          setPayBusy(true);

          openPayment({
            amountInr: payableInr,
            receipt: `liftngo_${flow}_${Date.now()}`,
            description:
              fromKhatuHotel ? 'Hotel booking' : fromFood ? 'Food delivery' : 'Delivery booking',
            notes: { flow, vehicle: vehicle ?? 'unknown' },
            prefill: {
              contact: sender?.mobile ? `+91${sender.mobile.replace(/\D/g, '')}` : undefined,
              name: sender?.name,
            },
            onSuccess: () => {
              setPayBusy(false);
              trackBookingCompleted({ vehicle_type: vehicle ?? 'unknown', flow });

              if (fromKhatuHotel && hotelDraft) {
                appendHotelBookingHistoryFromDraft(hotelDraft);
                clearHotelBookingDraft();
                setHotelDraft(null);
                router.push(`${ROUTES.HISTORY}?tab=hotel`);
                return;
              }
              if (fromFood && deliveryGoods) {
                const amt = `₹${FOOD_PAYMENT_FLAT_INR.toLocaleString('en-IN')}`;
                const addrHint = drop?.address?.trim() || pickup?.address?.trim() || undefined;
                if (deliveryGoods.source === 'marketplace') {
                  appendMarketplaceHistoryFromDeliveryGoods(deliveryGoods, amt, addrHint);
                } else {
                  appendFoodDeliveryHistory(deliveryGoods, amt, pickup?.name);
                }
                clearDeliveryGoodsDescription();
                setDeliveryGoods(null);
              }
              router.push(ROUTES.BOOKING);
            },
            onError: (err) => {
              setPayBusy(false);
              if (err !== 'Payment cancelled') {
                setPayError(err);
              }
            },
          });
        }}
        totalInr={
          fromKhatuHotel && hotelDraft
            ? hotelDraft.estimatedTotalInr
            : fromFood
              ? FOOD_PAYMENT_FLAT_INR
              : TOTAL_AMOUNT
        }
        busy={payBusy}
      />
    </div>
  );
}
