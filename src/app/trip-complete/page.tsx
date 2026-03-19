'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { getDropLocation, clearDeliveryGoodsDescription } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { PageContainer, IconButton, BackIcon, Button } from '@/components/ui';
import PriceBreakupSheet from '@/components/booking/PriceBreakupSheet';

const DRIVER_NAME = 'Rakesh Patel';
const AMOUNT = 400;
const TRIP_FARE = 522;
const GST = 8;
const PLATFORM_FEE = 10;
const TOTAL_AMOUNT = 540;

function formatTripDateTime() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day}/${month}/${year}, ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

export default function TripCompletePage() {
  const router = useRouter();
  const [drop, setDrop] = useState(getDropLocation());
  const [rating, setRating] = useState(0);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);

  useEffect(() => setDrop(getDropLocation()), []);
  useEffect(() => {
    clearDeliveryGoodsDescription();
  }, []);

  const destination = drop?.name || drop?.address || 'Your destination';
  const tripDateTime = useMemo(() => formatTripDateTime(), []);

  return (
    <div className="min-h-screen bg-gray-100">
      <PageContainer className="py-6">
        <div className="mb-4">
          <IconButton aria-label="Back to dashboard" onClick={() => router.push(ROUTES.DASHBOARD)} className="h-10 w-10">
            <BackIcon />
          </IconButton>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[13px] text-gray-500">Trip to</p>
          <p className="mt-1 text-[17px] font-bold text-gray-900">{destination}</p>
          <p className="mt-1 text-[13px] text-gray-500">{tripDateTime}</p>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[14px] font-semibold text-gray-900">Amount Payable</p>
              <p className="mt-0.5 text-[13px] text-gray-500">Cash</p>
            </div>
            <div className="text-right">
              <p className="text-[18px] font-bold text-gray-900">₹{AMOUNT}</p>
              <button type="button" onClick={() => setShowPriceBreakup(true)} className="mt-1 text-[13px] font-medium text-[var(--color-primary)]">
                View breakup
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm flex">
          <div >
          <p className="text-[14px] font-semibold text-gray-900">Remaining Amount to be paid</p>
          <p className="mt-2 text-[20px] font-bold text-gray-900">₹{AMOUNT}</p>
          <p className="mt-2 text-[13px] text-gray-600 flex items-center gap-1">
            You are paying in cash <span className="text-base" aria-hidden>💰</span>
          </p>
          </div>
          
          <div className="mt-8 ml-4  justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-[#3D76F1]/30 bg-[#EEF3FD] px-4 py-2 text-[14px] font-semibold text-[#3D76F1] hover:bg-[#E6EEFF] transition-colors"
            >
              Pay Online
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[14px] font-semibold text-gray-900">Rate your Driver, {DRIVER_NAME.toUpperCase()}</p>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                className="p-1"
              >
                {rating >= star ? (
                  <svg className="h-10 w-10 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {rating > 0 && (
          <div className="mt-6">
            <Button fullWidth onClick={() => router.push(ROUTES.DASHBOARD)}>Done</Button>
          </div>
        )}
      </PageContainer>

      <PriceBreakupSheet
        isOpen={showPriceBreakup}
        onClose={() => setShowPriceBreakup(false)}
        tripFare={TRIP_FARE}
        gst={GST}
        platformFee={PLATFORM_FEE}
        totalAmount={TOTAL_AMOUNT}
      />
    </div>
  );
}
