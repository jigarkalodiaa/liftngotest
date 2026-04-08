'use client';

import { memo } from 'react';

type Props = {
  phone: string;
  whatsappOpened: boolean;
  onRetryWhatsApp: () => void;
};

function BookingSuccess({ phone, whatsappOpened, onRetryWhatsApp }: Props) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-2.5">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-sm font-bold text-white">✓</span>
        <div>
          <p className="text-base font-semibold text-emerald-900">Booking request sent successfully</p>
          <p className="mt-1 text-xs text-emerald-700">
            Our expert will contact you shortly on your WhatsApp number ({phone}).
          </p>
        </div>
      </div>
      {!whatsappOpened ? (
        <button
          type="button"
          onClick={onRetryWhatsApp}
          className="mt-3 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
        >
          Open WhatsApp again
        </button>
      ) : null}
    </section>
  );
}

export default memo(BookingSuccess);
