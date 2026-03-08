'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { getLandingPickupLocation, setStoredPhone, setLoggedIn, setLandingPickupLocation, setPickupLocation } from '@/lib/storage';
import { ROUTES, getValidOtp } from '@/lib/constants';
import { loginPhoneSchema, loginOtpSchema, type LoginPhoneForm } from '@/lib/validations';

type LoginStep = 'phone' | 'otp';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        !
      </span>
      <span>{message}</span>
    </div>
  );
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('phone');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LoginPhoneForm & { otp?: string }>({
    resolver: zodResolver(loginPhoneSchema),
    defaultValues: { phone: '', termsAccepted: true, otp: '' },
  });

  const phoneNumber = watch('phone') ?? '';
  const termsChecked = watch('termsAccepted') ?? true;

  useEffect(() => {
    if (isOpen) {
      reset({ phone: '', termsAccepted: true, otp: '' });
      setStep('phone');
      setOtp(['', '', '', '']);
      setOtpError('');
    } else {
      document.body.style.overflow = '';
    }
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const panel = panelRef.current;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    if (first) first.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    panel.addEventListener('keydown', handleTab);
    return () => panel.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleKeyPress = useCallback((key: string) => {
    if (step === 'phone') {
      if (key === 'backspace') setValue('phone', phoneNumber.slice(0, -1), { shouldValidate: true });
      else if (/^\d$/.test(key) && phoneNumber.replace(/\D/g, '').length < 10) setValue('phone', phoneNumber + key, { shouldValidate: true });
    } else {
      const emptyIndex = otp.findIndex((d) => d === '');
      if (key === 'backspace') {
        const lastFilled = otp.map((d, i) => (d !== '' ? i : -1)).filter((i) => i !== -1).pop();
        if (lastFilled !== undefined) {
          const next = [...otp];
          next[lastFilled] = '';
          setOtp(next);
        }
      } else if (/^\d$/.test(key) && emptyIndex !== -1) {
        const next = [...otp];
        next[emptyIndex] = key;
        setOtp(next);
      }
    }
  }, [step, phoneNumber, otp, setValue]);

  const onPhoneSubmit = useCallback((data: LoginPhoneForm) => {
    setStep('otp');
    setCountdown(30);
  }, []);

  const handleVerify = useCallback(() => {
    setOtpError('');
    const result = loginOtpSchema.safeParse({ otp: otp.join('') });
    if (!result.success) {
      const first = result.error.issues[0];
      setOtpError(first?.message ?? 'Please enter a valid 4-digit OTP');
      return;
    }
    const entered = otp.join('');
    if (entered !== getValidOtp()) {
      setOtpError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '']);
      return;
    }
    setLoggedIn(true);
    setStoredPhone(phoneNumber.trim().replace(/\s/g, '').replace(/\D/g, '').slice(0, 10));
    const landingPickupValue = getLandingPickupLocation()?.trim();
    const hasLandingPickup = Boolean(landingPickupValue);
    if (hasLandingPickup && landingPickupValue) {
      const name = landingPickupValue.split(',')[0]?.trim() || 'Pickup location';
      setPickupLocation({ name, address: landingPickupValue, contact: '' });
      setLandingPickupLocation(null);
    }
    setTimeout(() => {
      onClose();
      router.push(hasLandingPickup ? ROUTES.PICKUP_LOCATION : ROUTES.DASHBOARD);
    }, 500);
  }, [otp, phoneNumber, router, onClose, setValue]);

  const formatTimer = (seconds: number) => {
    const s = seconds % 60;
    return `00:${String(s).padStart(2, '0')}s`;
  };

  if (!isOpen) return null;

  const keypadKeys: { key: string; id: string }[][] = [
    [{ key: '1', id: 'k1' }, { key: '2', id: 'k2' }, { key: '3', id: 'k3' }],
    [{ key: '4', id: 'k4' }, { key: '5', id: 'k5' }, { key: '6', id: 'k6' }],
    [{ key: '7', id: 'k7' }, { key: '8', id: 'k8' }, { key: '9', id: 'k9' }],
    [{ key: 'backspace', id: 'backspace' }, { key: '0', id: 'k0' }, { key: 'enter', id: 'enter' }],
  ];

  const digitsOnly = phoneNumber.trim().replace(/\s/g, '').replace(/\D/g, '');
  const otpValid = loginOtpSchema.safeParse({ otp: otp.join('') }).success;
  const otpFilled = otp.every((d) => d !== '');

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/50 backdrop-blur-sm">
      <div ref={panelRef} className="flex-1 flex flex-col mt-auto bg-white rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Login to Liftngo</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0 p-6 overflow-y-auto">
          {step === 'phone' ? (
            <form onSubmit={handleSubmit(onPhoneSubmit)}>
              <div className="mb-3">
                <div className="h-14 flex items-center border border-gray-300 rounded-xl px-4 bg-white">
                  <span className="text-gray-700 font-medium mr-1">+91</span>
                  <span className="text-gray-400 mr-2">|</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="Enter mobile number"
                    {...register('phone')}
                    className={`flex-1 min-w-0 bg-transparent outline-none ${phoneNumber ? 'text-gray-900' : 'text-gray-400'}`}
                  />
                  {digitsOnly.length === 10 && (
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {errors.phone && <ErrorMessage message={errors.phone.message ?? 'Invalid phone'} />}
              </div>

              <label className="flex items-start gap-3 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  {...register('termsAccepted')}
                  className="mt-0.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-[var(--color-primary)]"
                />
                <span className="text-xs text-gray-600">
                  By continuing, you agree to calls, including by <span className="font-semibold text-gray-800">IVR auto-dialer, WhatsApp, or Emails</span> from Liftngo and its affiliates.
                </span>
              </label>
              {errors.termsAccepted && <ErrorMessage message={errors.termsAccepted.message ?? 'Please accept the terms'} />}
            </form>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-2">
                <p className="text-sm text-gray-700">Sent to <span className="font-semibold text-gray-900">+91{phoneNumber}</span></p>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(['', '', '', '']); }}
                  className="p-1.5 rounded-lg text-[var(--color-primary)] hover:bg-gray-100"
                  aria-label="Edit phone number"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center gap-2 mb-4" role="group" aria-label="OTP digits">
                {otp.map((digit, i) => (
                  <div
                    key={i}
                    className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold tabular-nums ${
                      digit ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-white' : 'border-gray-300 text-gray-400 bg-gray-50'
                    }`}
                  >
                    {digit}
                  </div>
                ))}
              </div>

              {otpFilled && !otpValid && (
                <ErrorMessage message="Please enter a valid 4-digit OTP" />
              )}
              {otpError && <ErrorMessage message={otpError} />}

              <p className="text-sm text-gray-600 mb-4">
                Didn&apos;t receive OTP?{' '}
                {countdown > 0 ? (
                  <span className="font-semibold text-[var(--color-primary)]">{formatTimer(countdown)}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setCountdown(30); setOtp(['', '', '', '']); setOtpError(''); }}
                    className="font-semibold text-[var(--color-primary)]"
                  >
                    Resend OTP
                  </button>
                )}
              </p>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setValue('termsAccepted', e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-[var(--color-primary)]"
                />
                <span className="text-xs text-gray-600">
                  By continuing, you agree to calls, including by <span className="font-semibold text-gray-800">IVR auto-dialer, WhatsApp, or Emails</span> from Liftngo and its affiliates.
                </span>
              </label>
            </>
          )}
        </div>

        <div className="px-6 pb-4">
          {step === 'phone' ? (
            <button
              type="button"
              onClick={handleSubmit(onPhoneSubmit)}
              disabled={digitsOnly.length !== 10 || !termsChecked}
              className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Login
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVerify}
              disabled={!otpFilled}
              className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Verify
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>

        <div className="bg-gray-100 p-4">
          <div className="grid grid-cols-3 gap-2">
            {keypadKeys.flat().map(({ key: k, id }) => (
              <button
                key={id}
                type="button"
                aria-label={k === 'backspace' ? 'Backspace' : k === 'enter' ? 'Submit' : `Digit ${k}`}
                onClick={() => {
                  if (k === 'enter') {
                    if (step === 'phone') handleSubmit(onPhoneSubmit)();
                    else handleVerify();
                  } else {
                    handleKeyPress(k);
                  }
                }}
                className={`h-14 rounded-xl text-xl font-medium flex items-center justify-center transition-colors ${
                  k === 'backspace'
                    ? 'bg-[#E8E8ED] text-gray-700 hover:bg-gray-200 col-span-1'
                    : k === 'enter'
                    ? 'bg-[var(--color-primary)] text-white hover:opacity-90 col-span-1'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                {k === 'backspace' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
                  </svg>
                ) : k === 'enter' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                ) : (
                  k
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
