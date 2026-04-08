'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileFormSchema, type UserProfileForm } from '@/lib/validations';
import { getUserProfile, setUserProfile, isUserAuthenticated } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { trackFormSubmit } from '@/lib/analytics';

const emptyDefaults: UserProfileForm = {
  fullName: '',
  alternatePhone: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  accountNumber: '',
  address: '',
  email: '',
};

export default function MyDetailsForm() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (!isUserAuthenticated()) {
      router.replace(ROUTES.HOME);
      return;
    }
    setAllowed(true);
  }, [router]);

  useEffect(() => {
    if (!allowed) return;
    const p = getUserProfile();
    if (p) {
      reset({
        fullName: p.fullName,
        alternatePhone: p.alternatePhone,
        emergencyContactName: p.emergencyContactName,
        emergencyContactPhone: p.emergencyContactPhone,
        accountNumber: p.accountNumber,
        address: p.address,
        email: p.email,
      });
    }
  }, [allowed, reset]);

  const onSubmit = (data: UserProfileForm) => {
    trackFormSubmit('my_details');
    setUserProfile({
      fullName: data.fullName,
      alternatePhone: data.alternatePhone,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      accountNumber: data.accountNumber,
      address: data.address,
      email: data.email,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  };

  const inputClass =
    'w-full min-h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10';
  const labelClass = 'mb-1.5 block text-xs font-semibold text-gray-700';
  const errorClass = 'mt-1 text-[11px] text-red-600';

  if (!allowed) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-16 text-sm text-gray-500 sm:px-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">My details</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
          Keep your saved profile up to date for faster checkout and support.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:p-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-600">Basic profile</h2>
            <div className="mt-3 space-y-4">
              <div>
                <label className={labelClass} htmlFor="fullName">Full name *</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={100}
                  {...register('fullName')}
                  className={inputClass}
                  aria-required
                />
                {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  maxLength={120}
                  {...register('email')}
                  className={inputClass}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:p-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-600">Contact details</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="alternatePhone">Alternate mobile</label>
                <input
                  id="alternatePhone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit number"
                  autoComplete="tel-national"
                  maxLength={10}
                  {...register('alternatePhone')}
                  className={inputClass}
                />
                {errors.alternatePhone && <p className={errorClass}>{errors.alternatePhone.message}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="emergencyContactPhone">Emergency mobile</label>
                <input
                  id="emergencyContactPhone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit number"
                  autoComplete="tel-national"
                  maxLength={10}
                  {...register('emergencyContactPhone')}
                  className={inputClass}
                />
                {errors.emergencyContactPhone && <p className={errorClass}>{errors.emergencyContactPhone.message}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass} htmlFor="emergencyContactName">Emergency contact name</label>
              <input
                id="emergencyContactName"
                type="text"
                placeholder="Person to contact in urgency"
                autoComplete="off"
                maxLength={100}
                {...register('emergencyContactName')}
                className={inputClass}
              />
              {errors.emergencyContactName && <p className={errorClass}>{errors.emergencyContactName.message}</p>}
            </div>
          </section>

          <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:p-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-600">Billing and address</h2>
            <div className="mt-3 space-y-4">
              <div>
                <label className={labelClass} htmlFor="accountNumber">Bank account number</label>
                <input
                  id="accountNumber"
                  type="text"
                  inputMode="numeric"
                  placeholder="9-18 digits"
                  autoComplete="off"
                  maxLength={18}
                  {...register('accountNumber')}
                  className={inputClass}
                />
                {errors.accountNumber && <p className={errorClass}>{errors.accountNumber.message}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="address">Address</label>
                <textarea
                  id="address"
                  rows={3}
                  placeholder="House/Flat, area, landmark"
                  maxLength={500}
                  {...register('address')}
                  className={`${inputClass} min-h-[96px] resize-y py-2.5`}
                />
                {errors.address && <p className={errorClass}>{errors.address.message}</p>}
              </div>
            </div>
          </section>

          {saved && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
              Details saved successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save details'}
          </button>

          <Link
            href={ROUTES.DASHBOARD}
            className="block py-1 text-center text-sm font-medium text-[var(--color-primary)]"
          >
            Back to dashboard
          </Link>
        </form>
      </div>
    </div>
  );
}
