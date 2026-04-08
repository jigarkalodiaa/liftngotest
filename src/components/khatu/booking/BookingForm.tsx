'use client';

import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const bookingFormSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required'),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, '').slice(0, 10))
    .refine((v) => /^[6-9]\d{9}$/.test(v), 'Enter a valid 10-digit WhatsApp number'),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

type Props = {
  initialName?: string;
  initialPhone?: string;
  loading: boolean;
  onSubmit: (values: BookingFormValues) => void;
};

function BookingForm({ initialName = '', initialPhone = '', loading, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { name: initialName, phone: initialPhone },
  });

  return (
    <section className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--khatu-saffron)]">Traveler details</p>
        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">Required</span>
      </div>
      <form className="mt-2 space-y-3">
        <label className="block text-xs font-medium text-stone-700" htmlFor="khatu-booking-name">
          Full name
          <input
            id="khatu-booking-name"
            {...register('name')}
            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[var(--khatu-saffron)] focus:outline-none focus:ring-2 focus:ring-[var(--khatu-saffron)]/15"
            placeholder="Enter your full name"
          />
          {errors.name ? <span className="mt-1 block text-[11px] text-red-600">{errors.name.message}</span> : null}
        </label>
        <label className="block text-xs font-medium text-stone-700" htmlFor="khatu-booking-phone">
          WhatsApp number
          <input
            id="khatu-booking-phone"
            inputMode="numeric"
            {...register('phone')}
            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[var(--khatu-saffron)] focus:outline-none focus:ring-2 focus:ring-[var(--khatu-saffron)]/15"
            placeholder="10-digit number"
          />
          {errors.phone ? <span className="mt-1 block text-[11px] text-red-600">{errors.phone.message}</span> : null}
        </label>
        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit((values) => onSubmit(values))}
          className="w-full rounded-xl bg-[var(--khatu-saffron)] px-3 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Confirm & Continue'}
        </button>
      </form>
    </section>
  );
}

export default memo(BookingForm);
