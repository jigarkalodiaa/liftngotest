'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
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
import { useDirections } from '@/hooks/booking';
import { useCreateBooking } from '@/hooks/booking';
import { toApiVehicleType } from '@/api/services/tripService';
import { toIndianE164 } from '@/lib/auth/mobileE164';

const FOOD_PAYMENT_FLAT_INR = 50;

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromFood = searchParams.get('from') === 'food';
  const fromKhatuHotel = searchParams.get('from') === 'khatu_hotel';
  const [vehicle, setVehicle] = useState<ServiceId | null>(null);
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

  const createBookingMutation = useCreateBooking();

  const { data: directionsData } = useDirections(pickup, drop);

  const routeFares = useMemo(() => {
    const route = directionsData?.routes?.[0];
    if (!route) return null;
    return {
      fares: route.vehicleFares,
      distance: route.distanceFormatted,
      duration: route.durationFormatted,
      currency: route.currency,
    };
  }, [directionsData]);

  const selectedFare = useMemo(() => {
    if (!routeFares?.fares || !vehicle) return null;
    const apiType = toApiVehicleType(vehicle);
    const fareMap: Record<string, number> = {
      BIKE: routeFares.fares.bike,
      AUTO: routeFares.fares.auto,
      MINI_TRUCK: routeFares.fares.miniTruck,
      TRUCK: routeFares.fares.truck,
    };
    return fareMap[apiType] ?? null;
  }, [routeFares, vehicle]);

  const tripFare = selectedFare ?? 0;
  const gstAmount = Math.round(tripFare * 0.05 * 100) / 100;
  const platformFee = 10;
  const couponDiscount = appliedCoupon ? Math.min(400, Math.round(tripFare * 0.1)) : 0;
  const totalAmount = Math.round((tripFare + gstAmount + platformFee - couponDiscount) * 100) / 100;

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

  const handleBookNow = useCallback(() => {
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

    if (
      pickup?.latitude != null && pickup?.longitude != null &&
      drop?.latitude != null && drop?.longitude != null &&
      sender && receiver && vehicle
    ) {
      const goodsDesc = selectedGoodType?.title
        ? `${selectedGoodType.title} - ${weightKg}kg, ${packages} pkg`
        : undefined;

      createBookingMutation.mutate(
        {
          origin: {
            address: pickup.address,
            latitude: pickup.latitude,
            longitude: pickup.longitude,
          },
          destination: {
            address: drop.address,
            latitude: drop.latitude,
            longitude: drop.longitude,
          },
          vehicleType: toApiVehicleType(vehicle),
          sender: {
            name: sender.name,
            mobile: toIndianE164(sender.mobile),
          },
          receiver: {
            name: receiver.name,
            mobile: toIndianE164(receiver.mobile),
          },
          packageDescription: goodsDesc,
          packageWeight: weightKg > 0 ? weightKg : undefined,
          gstin: gstin || undefined,
          couponCode: appliedCoupon || undefined,
        },
        {
          onSuccess: () => {
            router.push(ROUTES.BOOKING);
          },
        },
      );
      return;
    }

    router.push(ROUTES.BOOKING);
  }, [
    fromKhatuHotel, hotelDraft, fromFood, deliveryGoods,
    pickup, drop, sender, receiver, vehicle,
    selectedGoodType, weightKg, packages, gstin, appliedCoupon,
    createBookingMutation, router,
  ]);

  const isBooking = createBookingMutation.isPending;

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

        {routeFares && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/5 px-4 py-2.5">
            <svg className="h-4 w-4 shrink-0 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-[13px] font-semibold text-gray-900">{routeFares.distance}</span>
            <span className="text-gray-300">·</span>
            <span className="text-[13px] text-gray-600">{routeFares.duration}</span>
          </div>
        )}

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
          tripFare={tripFare}
          gst={gstAmount}
          platformFee={platformFee}
          totalAmount={totalAmount}
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

        {createBookingMutation.isError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {createBookingMutation.error?.message || 'Booking failed. Please try again.'}
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
        onBookNow={handleBookNow}
        disabled={isBooking}
        totalInr={
          fromKhatuHotel && hotelDraft
            ? hotelDraft.estimatedTotalInr
            : fromFood
              ? FOOD_PAYMENT_FLAT_INR
              : selectedFare != null ? totalAmount : undefined
        }
      />
    </div>
  );
}
