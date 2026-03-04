'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PageContainer, IconButton, BackIcon } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { RIDE_HISTORY } from '@/data/rideHistory';
import type { RideHistoryItem } from '@/types/booking';

/** Single ride card – matches screenshot: vehicle/date/time, status (red/green), cost, route box, Book Again → */
function RideCard({ ride, onBookAgain }: { ride: RideHistoryItem; onBookAgain: () => void }) {
  const dateTime = ride.time ? `${ride.date}, ${ride.time}` : ride.date;

  return (
    <article className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[15px] font-semibold text-gray-900">
              {ride.vehicleSubtitle} {dateTime}
            </p>
            <div className="relative h-12 w-14 flex-shrink-0">
              <Image src={ride.vehicleImage} alt={ride.vehicleName} fill className="object-contain object-right" />
            </div>
          </div>
          <p
            className={`mt-1 text-[14px] font-bold ${
              ride.status === 'completed' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
          </p>
          {ride.amount != null && (
            <p className="mt-0.5 text-[14px] text-gray-700">{ride.amount}</p>
          )}
        </div>
      </div>
      {/* Route details box – darker gray, rounded */}
      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-100/80 p-3">
        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-0.5">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-white" />
            <div className="my-1 w-px flex-1 min-h-[16px] bg-gray-300" />
            <svg className="h-4 w-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="text-[14px] font-bold text-gray-900">{ride.fromName}</p>
              <p className="text-[12px] text-gray-600 line-clamp-1">{ride.fromAddress}</p>
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900">{ride.toName}</p>
              <p className="text-[12px] text-gray-600 line-clamp-2">{ride.toAddress}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onBookAgain}
        className="mt-4 w-full rounded-xl border border-gray-300 bg-white py-3 text-[15px] font-semibold text-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        Book Again
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </article>
  );
}

export default function HistoryPage() {
  const router = useRouter();

  const handleBookAgain = () => {
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageContainer className="pb-10">
        <header className="flex items-center gap-3 pt-6 pb-4 border-b border-gray-100">
          <IconButton aria-label="Back" onClick={() => router.back()} className="h-10 w-10">
            <BackIcon />
          </IconButton>
          <h1 className="text-[20px] font-bold text-gray-900">History</h1>
        </header>

        <h2 className="mt-4 text-[18px] font-bold text-gray-900">Your rides</h2>

        {RIDE_HISTORY.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center mt-4">
            <p className="text-[16px] font-medium text-gray-600">No rides yet</p>
            <p className="mt-2 text-[14px] text-gray-500">Book a trip from the dashboard to see history here.</p>
            <button
              type="button"
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="mt-4 w-full rounded-2xl bg-[var(--color-primary)] py-3.5 text-[16px] font-semibold text-white"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <ul className="mt-4 space-y-4" aria-label="Ride history">
            {RIDE_HISTORY.map((ride) => (
              <li key={ride.id}>
                <RideCard ride={ride} onBookAgain={handleBookAgain} />
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </div>
  );
}
