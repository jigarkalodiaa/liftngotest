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
    'w-full min-h-[52px] rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] border-gray-300';

  if (!allowed) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 flex items-center justify-center text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My details</h1>
      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
        Your profile is saved on this device. Update anything you need below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1 block text-[12px] font-medium text-gray-600">Name *</label>
          <input type="text" placeholder="Full name" {...register('fullName')} className={inputClass} aria-required />
          {errors.fullName && <p className="mt-1 text-[11px] text-red-500">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[12px] font-medium text-gray-600">Alternate mobile</label>
          <input type="tel" inputMode="numeric" placeholder="Optional" {...register('alternatePhone')} className={inputClass} />
          {errors.alternatePhone && <p className="mt-1 text-[11px] text-red-500">{errors.alternatePhone.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[12px] font-medium text-gray-600">Emergency contact</label>
          <input type="text" placeholder="Optional" {...register('emergencyContactName')} className={inputClass} />
          {errors.emergencyContactName && <p className="mt-1 text-[11px] text-red-500">{errors.emergencyContactName.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[12px] font-medium text-gray-600">Emergency mobile</label>
          <input type="tel" inputMode="numeric" placeholder="Optional" {...register('emergencyContactPhone')} className={inputClass} />
          {errors.emergencyContactPhone && <p className="mt-1 text-[11px] text-red-500">{errors.emergencyContactPhone.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[12px] font-medium text-gray-600">Account number</label>
          <input type="text" placeholder="Optional" autoComplete="off" {...register('accountNumber')} className={inputClass} />
          {errors.accountNumber && <p className="mt-1 text-[11px] text-red-500">{errors.accountNumber.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[12px] font-medium text-gray-600">Address</label>
          <textarea
            rows={3}
            placeholder="Optional"
            {...register('address')}
            className={`${inputClass} min-h-[100px] py-3 resize-y`}
          />
          {errors.address && <p className="mt-1 text-[11px] text-red-500">{errors.address.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[12px] font-medium text-gray-600">Email</label>
          <input type="email" inputMode="email" placeholder="Optional" {...register('email')} className={inputClass} />
          {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>}
        </div>

        {saved && (
          <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800" role="status">
            Saved.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-[15px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Save
        </button>

        <Link href={ROUTES.DASHBOARD} className="block text-center text-sm font-medium text-[var(--color-primary)] py-2">
          Back to dashboard
        </Link>
      </form>
    </div>
  );
}
