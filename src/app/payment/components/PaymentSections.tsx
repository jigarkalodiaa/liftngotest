'use client';

import Image from '@/components/OptimizedImage';
import PageHeader from '@/components/ui/PageHeader';
import { theme } from '@/config/theme';
import type { ServiceId } from '@/types/booking';
import type { DeliveryGoodsDescription } from '@/lib/storage';
import type { HotelBookingDraft } from '@/types/booking';
import { parsePrice } from '@/data/restaurantsKhatushyam';

const VEHICLE_LABELS: Record<ServiceId, { name: string; subtitle: string; image: string }> = {
  walk: { name: 'Big Saver', subtitle: 'Quick Fleet ride', image: '/dashboard/service-walk.png' },
  twoWheeler: { name: 'Two Wheeler', subtitle: 'Quick Fleet ride', image: '/dashboard/service-2wheeler.png' },
  threeWheeler: { name: 'Three Wheeler', subtitle: 'Quick Fleet ride', image: '/dashboard/service-3wheeler.png' },
  fourWheeler: { name: 'Four Wheeler', subtitle: 'Mini truck cargo', image: '/services/four-wheeler.svg' },
};

export function PaymentHeader({ onBack }: { onBack: () => void }) {
  return (
    <PageHeader
      title="Payment"
      onBack={onBack}
      titleStyle={{ fontSize: theme.fontSizes['2xl'], color: theme.colors.gray900 }}
    />
  );
}

export function VehicleCard({ serviceId }: { serviceId: ServiceId | null }) {
  const info = serviceId ? VEHICLE_LABELS[serviceId] : VEHICLE_LABELS.threeWheeler;
  return (
    <section
      className="rounded-2xl border p-4"
      style={{ borderColor: theme.colors.borderLight, backgroundColor: theme.colors.white }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>
            {info.name}
          </h2>
          <p className="mt-0.5" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray500 }}>
            {info.subtitle}
          </p>
          <p className="mt-2 font-medium" style={{ fontSize: theme.fontSizes.base, color: theme.colors.success }}>
            20 Min Away
          </p>
        </div>
        <div className="relative h-20 w-24 flex-shrink-0">
          <Image src={info.image} alt={info.name} fill className="object-contain object-right" sizes="96px" />
        </div>
      </div>
    </section>
  );
}

export function AddressCta({ onClick }: { onClick: () => void }) {
  return (
    <section className="mt-4">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between rounded-full px-4 py-3 text-left transition-opacity hover:opacity-90"
        style={{ backgroundColor: theme.colors.primaryTint }}
      >
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: theme.colors.primary }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium" style={{ fontSize: theme.fontSizes.md, color: theme.colors.primary }}>
            Address detail
          </span>
        </div>
        <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: theme.colors.primary }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}

export function GstSection({
  gstin,
  businessName,
  onAddOrEdit,
}: {
  gstin: string;
  businessName: string;
  onAddOrEdit: () => void;
}) {
  return (
    <section className="mt-5">
      <h2 className="font-semibold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>
        GST Details
      </h2>
      <div
        className="mt-2 flex items-center justify-between rounded-2xl border px-4 py-3"
        style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.white }}
      >
        <span style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray600 }}>
          {gstin || businessName ? [gstin, businessName].filter(Boolean).join(' • ') : 'Have a GST Number?'}
        </span>
        <button type="button" onClick={onAddOrEdit} className="font-medium" style={{ fontSize: theme.fontSizes.base, color: theme.colors.primary }}>
          {gstin || businessName ? 'Edit GSTIN' : 'Add GSTIN'}
        </button>
      </div>
    </section>
  );
}

export function HotelStaySummarySection({ draft }: { draft: HotelBookingDraft }) {
  return (
    <section className="mt-5">
      <h2 className="font-semibold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>
        Hotel booking
      </h2>
      <div
        className="mt-2 rounded-2xl border p-4"
        style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.white }}
      >
        <p className="font-medium" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray900 }}>
          {draft.hotelName}
        </p>
        <p className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray600 }}>
          {draft.addressLine} · {draft.distanceKmFromTemple.toFixed(1)} km from mandir
        </p>
        <ul className="mt-3 space-y-1.5" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray700 }}>
          <li>
            <span className="font-medium text-gray-900">Stay: </span>
            {draft.checkIn} → {draft.checkOut} ({draft.nights} night{draft.nights === 1 ? '' : 's'})
          </li>
          <li>
            <span className="font-medium text-gray-900">Guests: </span>
            {draft.guests}
          </li>
          <li>
            <span className="font-medium text-gray-900">Listed rate: </span>₹{draft.pricePerNight}/night
          </li>
          <li>
            <span className="font-medium text-gray-900">Est. total: </span>₹{draft.estimatedTotalInr.toLocaleString('en-IN')}
          </li>
        </ul>
        {draft.guestNote ? (
          <p className="mt-3 text-xs leading-relaxed" style={{ color: theme.colors.gray500 }}>
            Your note: {draft.guestNote}
          </p>
        ) : null}
        <p className="mt-3 text-xs leading-relaxed" style={{ color: theme.colors.gray500 }}>
          You already sent full details to the property via WhatsApp. Paying here confirms your Liftngo booking record;
          final tariff may be adjusted by the hotel.
        </p>
      </div>
    </section>
  );
}

export function GoodsSection({
  goodTypeTitle,
  weightKg,
  packages,
  onChangeGoods,
  onViewRestrictedList,
  deliveryGoods,
}: {
  goodTypeTitle: string;
  weightKg: number;
  packages: number;
  onChangeGoods: () => void;
  onViewRestrictedList: () => void;
  deliveryGoods?: DeliveryGoodsDescription | null;
}) {
  const isFoodOrder = deliveryGoods && deliveryGoods.items.length > 0;
  const merchantOrderHeading =
    isFoodOrder && deliveryGoods
      ? deliveryGoods.source === 'marketplace'
        ? `Shop order — ${deliveryGoods.restaurantName}`
        : `Food order from ${deliveryGoods.restaurantName}`
      : '';

  return (
    <section className="mt-5">
      <h2 className="font-semibold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>
        Goods Description
      </h2>
      <div
        className="mt-2 rounded-2xl border p-4"
        style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.white }}
      >
        {isFoodOrder ? (
          <>
            <p className="font-medium" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray900 }}>
              {merchantOrderHeading}
            </p>
            <ul className="mt-3 space-y-2" style={{ fontSize: theme.fontSizes.sm }}>
              {deliveryGoods.items.map((item) => (
                <li key={item.name} className="flex justify-between gap-2 text-gray-700">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-900">₹{parsePrice(item.price) * item.quantity}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray900 }}>
                {goodTypeTitle || 'Select goods type'}
              </p>
              <p className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray500 }}>
                {weightKg}kg • ({packages} {packages === 1 ? 'Package' : 'Packages'})
              </p>
            </div>
            <button type="button" onClick={onChangeGoods} className="font-medium" style={{ fontSize: theme.fontSizes.base, color: theme.colors.primary }}>
              Change
            </button>
          </div>
        )}
        {!isFoodOrder && (
          <div
            className="mt-3 flex items-center justify-between rounded-xl px-3 py-2.5 border"
            style={{ backgroundColor: theme.colors.warningBg, borderColor: theme.colors.warningBorder }}
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: theme.colors.gray700 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray700 }}>Do Not send restricted items</span>
            </div>
            <button type="button" onClick={onViewRestrictedList} className="font-medium" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.primary }}>
              View List
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function CouponSection({
  appliedCoupon,
  onToggleCoupon,
}: {
  appliedCoupon: string | null;
  onToggleCoupon: () => void;
}) {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>
          Coupon & Bank offers
        </h2>
        <button type="button" className="font-medium" style={{ fontSize: theme.fontSizes.base, color: theme.colors.primary }}>
          All Offers &gt;
        </button>
      </div>
      <div
        className="mt-3 rounded-2xl border-2 p-4"
        style={{
          borderColor: appliedCoupon ? theme.colors.success : theme.colors.primary,
          backgroundColor: theme.colors.surfaceMuted,
          borderStyle: appliedCoupon ? 'dashed' : 'solid',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>Extra ₹400 OFF</p>
            <p className="mt-0.5" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray500 }}>10% off</p>
          </div>
          <button
            type="button"
            onClick={onToggleCoupon}
            className="rounded-xl border px-4 py-2 font-semibold"
            style={{
              backgroundColor: appliedCoupon ? theme.colors.primary : theme.colors.white,
              borderColor: theme.colors.primary,
              color: appliedCoupon ? theme.colors.white : theme.colors.primary,
              fontSize: theme.fontSizes.sm,
            }}
          >
            {appliedCoupon ? 'APPLIED' : 'APPLY COUPON'}
          </button>
        </div>
      </div>
    </section>
  );
}

export function PriceDetailsSection({
  tripFare,
  gst,
  platformFee,
  totalAmount,
  foodFlatInr,
  hotelStay,
}: {
  tripFare: number;
  gst: number;
  platformFee: number;
  totalAmount: number;
  /** When set (`payment?from=food`), show one fixed all-in line + total only */
  foodFlatInr?: number;
  /** Khatu hotel — estimated stay total for payment step */
  hotelStay?: {
    totalInr: number;
    nights: number;
    pricePerNight: number;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}) {
  if (hotelStay != null && hotelStay.totalInr > 0) {
    return (
      <section className="mt-5">
        <h2 id="price-details-title" className="font-bold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>
          Price details
        </h2>
        <p className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray500 }}>
          Estimated stay (per listing). Hotel may confirm final amount on WhatsApp.
        </p>
        <div className="mt-3 space-y-2" style={{ fontSize: theme.fontSizes.base }}>
          <div className="flex justify-between">
            <span style={{ color: theme.colors.gray700 }}>
              ₹{hotelStay.pricePerNight} × {hotelStay.nights} night{hotelStay.nights === 1 ? '' : 's'}
            </span>
            <span style={{ color: theme.colors.gray900 }}>₹{hotelStay.totalInr.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-xs" style={{ color: theme.colors.gray500 }}>
            {hotelStay.checkIn} → {hotelStay.checkOut} · {hotelStay.guests} guest{hotelStay.guests === 1 ? '' : 's'}
          </p>
        </div>
        <div className="mt-3 flex justify-between items-center border-t pt-3" style={{ borderColor: theme.colors.border }}>
          <span className="font-bold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>
            Pay to confirm
          </span>
          <span className="font-bold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>
            ₹{hotelStay.totalInr.toLocaleString('en-IN')}
          </span>
        </div>
      </section>
    );
  }

  if (foodFlatInr != null && foodFlatInr > 0) {
    return (
      <section className="mt-5">
        <h2 id="price-details-title" className="font-bold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>
          Price Details
        </h2>
        <p className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray500 }}>
          Fixed food delivery charge (includes taxes &amp; fees)
        </p>
        <div className="mt-3 space-y-2" style={{ fontSize: theme.fontSizes.base }}>
          <div className="flex justify-between">
            <span style={{ color: theme.colors.gray700 }}>Delivery fee</span>
            <span style={{ color: theme.colors.gray900 }}>₹{foodFlatInr}</span>
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center pt-3 border-t" style={{ borderColor: theme.colors.border }}>
          <span className="font-bold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>Total Amount</span>
          <span className="font-bold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>₹{foodFlatInr}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-5">
      <h2 id="price-details-title" className="font-bold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>
        Price Details
      </h2>
      <div className="mt-3 space-y-2" style={{ fontSize: theme.fontSizes.base }}>
        <div className="flex justify-between">
          <span style={{ color: theme.colors.gray700 }}>Trip fare</span>
          <span style={{ color: theme.colors.gray900 }}>₹{tripFare}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: theme.colors.gray700 }}>GST</span>
          <span style={{ color: theme.colors.gray900 }}>₹{gst}</span>
        </div>
        <div className="flex justify-between items-center">
          <span style={{ color: theme.colors.gray700 }}>Platform fee</span>
          <span className="flex items-center gap-1">
            <span style={{ color: theme.colors.gray900 }}>₹{platformFee}</span>
            <button type="button" className="font-medium" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.primary }}>Know more</button>
          </span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center pt-3 border-t" style={{ borderColor: theme.colors.border }}>
        <span className="font-bold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>Total Amount</span>
        <span className="font-bold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>₹{totalAmount}</span>
      </div>
    </section>
  );
}

export function PaymentFooterBar({
  onBookNow,
  totalInr,
  busy,
  disabled,
}: {
  onBookNow: () => void;
  /** When set, show amount on the primary CTA (e.g. food flat ₹50) */
  totalInr?: number;
  /** Disable button while payment is in progress. */
  busy?: boolean;
  /** Extra disable (e.g. legal consent not accepted). */
  disabled?: boolean;
}) {
  const payBlocked = Boolean(busy || disabled);

  return (
    <div
      className="fixed inset-x-0 bottom-0 border-t py-4"
      style={{ borderColor: theme.colors.borderLight, backgroundColor: theme.colors.white }}
    >
      <div className="mx-auto w-full max-w-[520px] px-4">
        <button
          type="button"
          onClick={onBookNow}
          disabled={payBlocked}
          className="w-full rounded-2xl py-3.5 font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: theme.colors.primary, fontSize: theme.fontSizes.lg }}
        >
          {busy ? 'Processing…' : totalInr != null ? `Pay ₹${totalInr}` : 'Book now'}
          {!busy && (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
