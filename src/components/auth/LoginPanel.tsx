'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { maskIndianMobile } from '@/lib/auth/mobileE164';
import { useSendOtp, useResendOtp, useVerifyOtp } from '@/hooks/auth';
import { loginPhoneSchema, loginOtpSchema, MOBILE_LENGTH, normalizePhoneInput, type LoginPhoneForm } from '@/lib/validations';

const SEND_DEBOUNCE_MS = 2500;
const RESEND_COOLDOWN_SEC = 60;

type LoginStep = 'phone' | 'otp';

export type LoginPanelProps = {
  variant: 'modal' | 'page';
  isActive?: boolean;
  onDismiss?: () => void;
  onCompleted: (nextPath: string) => void;
};

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">!</span>
      <span>{message}</span>
    </div>
  );
}

export default function LoginPanel({ variant, isActive = true, onDismiss, onCompleted }: LoginPanelProps) {
  const [step, setStep] = useState<LoginStep>('phone');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [sendError, setSendError] = useState('');
  const lastSendRef = useRef(0);
  const sendOtpMutation = useSendOtp();
  const resendOtpMutation = useResendOtp();
  const verifyOtpMutation = useVerifyOtp();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LoginPhoneForm & { otp?: string }>({
    resolver: zodResolver(loginPhoneSchema),
    mode: 'onTouched',
    defaultValues: { phone: '', termsAccepted: true, otp: '' },
  });

  const phoneNumber = watch('phone') ?? '';
  const termsChecked = watch('termsAccepted') ?? true;

  const panelRef = useRef<HTMLDivElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      reset({ phone: '', termsAccepted: true, otp: '' });
      setStep('phone');
      setOtp(['', '', '', '']);
      setOtpError('');
      setSendError('');
    }
    wasActiveRef.current = isActive;
  }, [isActive, reset]);

  useEffect(() => {
    if (variant !== 'modal' || !isActive || !onDismiss) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [variant, isActive, onDismiss]);

  useEffect(() => {
    if (step === 'otp') {
      const t = setTimeout(() => otpInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (variant !== 'modal' || !isActive || !panelRef.current) return;
    const panel = panelRef.current;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener('keydown', handleTab);
    return () => panel.removeEventListener('keydown', handleTab);
  }, [variant, isActive]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (step === 'phone') {
        if (key === 'backspace') setValue('phone', phoneNumber.slice(0, -1), { shouldValidate: true });
        else if (/^\d$/.test(key) && phoneNumber.replace(/\D/g, '').length < 10)
          setValue('phone', phoneNumber + key, { shouldValidate: true });
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
    },
    [step, phoneNumber, otp, setValue],
  );

  const runSendOtp = useCallback(async () => {
    setSendError('');
    const now = Date.now();
    if (now - lastSendRef.current < SEND_DEBOUNCE_MS) {
      setSendError(`Please wait ${Math.ceil((SEND_DEBOUNCE_MS - (now - lastSendRef.current)) / 1000)}s before another request.`);
      return;
    }
    lastSendRef.current = now;
    try {
      await sendOtpMutation.mutateAsync(phoneNumber);
      setStep('otp');
      setOtp(['', '', '', '']);
      setOtpError('');
      setCountdown(RESEND_COOLDOWN_SEC);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not send OTP. Try again.';
      setSendError(msg);
    }
  }, [phoneNumber, sendOtpMutation]);

  const runResendOtp = useCallback(async () => {
    setSendError('');
    const now = Date.now();
    if (now - lastSendRef.current < SEND_DEBOUNCE_MS) {
      setSendError(`Please wait ${Math.ceil((SEND_DEBOUNCE_MS - (now - lastSendRef.current)) / 1000)}s before another request.`);
      return;
    }
    lastSendRef.current = now;
    try {
      await resendOtpMutation.mutateAsync(phoneNumber);
      setOtp(['', '', '', '']);
      setOtpError('');
      setCountdown(RESEND_COOLDOWN_SEC);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not resend OTP. Try again.';
      setSendError(msg);
    }
  }, [phoneNumber, resendOtpMutation]);

  const onPhoneSubmit = useCallback(() => {
    void runSendOtp();
  }, [runSendOtp]);

  const handleVerify = useCallback(async () => {
    setOtpError('');
    const result = loginOtpSchema.safeParse({ otp: otp.join('') });
    if (!result.success) {
      const first = result.error.issues[0];
      setOtpError(first?.message ?? 'Please enter a valid 4-digit OTP');
      return;
    }

    try {
      const { nextPath } = await verifyOtpMutation.mutateAsync({
        phone: phoneNumber,
        otp: otp.join(''),
      });
      setTimeout(() => onCompleted(nextPath), variant === 'page' ? 0 : 400);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      setOtpError(msg);
      setOtp(['', '', '', '']);
    }
  }, [otp, phoneNumber, onCompleted, variant, verifyOtpMutation]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const keypadKeys: { key: string; id: string }[][] = [
    [{ key: '1', id: 'k1' }, { key: '2', id: 'k2' }, { key: '3', id: 'k3' }],
    [{ key: '4', id: 'k4' }, { key: '5', id: 'k5' }, { key: '6', id: 'k6' }],
    [{ key: '7', id: 'k7' }, { key: '8', id: 'k8' }, { key: '9', id: 'k9' }],
    [{ key: 'backspace', id: 'backspace' }, { key: '0', id: 'k0' }, { key: 'enter', id: 'enter' }],
  ];

  const phoneDigits = normalizePhoneInput(phoneNumber);
  const otpValid = loginOtpSchema.safeParse({ otp: otp.join('') }).success;
  const otpFilled = otp.every((d) => d !== '');
  const canSend = phoneDigits.length === MOBILE_LENGTH && termsChecked && !sendOtpMutation.isPending;

  const shellClass =
    variant === 'modal'
      ? 'flex-1 flex flex-col w-full mt-auto md:mt-0 md:flex-initial md:max-h-[28rem] md:max-w-md md:rounded-2xl bg-white rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl'
      : 'w-full max-w-md mx-auto rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden';

  if (!isActive) return null;

  return (
    <div ref={panelRef} className={shellClass}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Login to Liftngo</h2>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <span className="w-9" aria-hidden />
        )}
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
                  maxLength={10}
                  {...register('phone')}
                  value={normalizePhoneInput(phoneNumber)}
                  onChange={(e) => {
                    const digits = normalizePhoneInput(e.target.value);
                    setValue('phone', digits, { shouldValidate: true });
                  }}
                  className={`flex-1 min-w-0 bg-transparent outline-none ${phoneNumber ? 'text-gray-900' : 'text-gray-400'}`}
                />
                {phoneDigits.length === MOBILE_LENGTH && (
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              {errors.phone && <ErrorMessage message={errors.phone.message ?? 'Invalid phone'} />}
              {sendError && <ErrorMessage message={sendError} />}
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                {...register('termsAccepted')}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-[var(--color-primary)]"
              />
              <span className="text-xs text-gray-600">
                By continuing, you agree to calls, including by{' '}
                <span className="font-semibold text-gray-800">IVR auto-dialer, WhatsApp, or Emails</span> from Liftngo and its
                affiliates.
              </span>
            </label>
            {errors.termsAccepted && <ErrorMessage message={errors.termsAccepted.message ?? 'Please accept the terms'} />}
          </form>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <p className="text-sm text-gray-700">
                Sent to <span className="font-semibold text-gray-900 tabular-nums">{maskIndianMobile(phoneNumber)}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp(['', '', '', '']);
                  setOtpError('');
                  setSendError('');
                }}
                className="p-1.5 rounded-lg text-[var(--color-primary)] hover:bg-gray-100"
                aria-label="Edit phone number"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <label
              htmlFor="login-otp-input-page"
              className="flex justify-center gap-2 mb-4 cursor-text select-none relative"
              role="group"
              aria-label="OTP digits – click to type"
            >
              <input
                id="login-otp-input-page"
                ref={otpInputRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={4}
                value={otp.join('')}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 4).split('');
                  setOtp([digits[0] ?? '', digits[1] ?? '', digits[2] ?? '', digits[3] ?? '']);
                }}
                className="absolute opacity-0 w-0 h-0 p-0 m-0 border-0 pointer-events-none overflow-hidden"
                aria-label="Enter 4-digit OTP"
              />
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
            </label>

            {otpFilled && !otpValid && <ErrorMessage message="Please enter a valid 4-digit OTP" />}
            {otpError && <ErrorMessage message={otpError} />}
            {sendError && step === 'otp' && <ErrorMessage message={sendError} />}

            <p className="text-sm text-gray-600 mb-4">
              Didn&apos;t receive OTP?{' '}
              {countdown > 0 ? (
                <span className="font-semibold text-[var(--color-primary)]">Resend in {formatTimer(countdown)}</span>
              ) : (
                <button
                  type="button"
                  disabled={resendOtpMutation.isPending}
                  onClick={() => {
                    void runResendOtp();
                  }}
                  className="font-semibold text-[var(--color-primary)] disabled:opacity-50"
                >
                  {resendOtpMutation.isPending ? 'Sending…' : 'Resend OTP'}
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
                By continuing, you agree to calls, including by{' '}
                <span className="font-semibold text-gray-800">IVR auto-dialer, WhatsApp, or Emails</span> from Liftngo and its
                affiliates.
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
            disabled={!canSend}
            className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sendOtpMutation.isPending ? 'Sending OTP…' : 'Send OTP'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void handleVerify()}
            disabled={!otpFilled || verifyOtpMutation.isPending}
            className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {verifyOtpMutation.isPending ? 'Verifying…' : 'Verify & login'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        )}
      </div>

      <div className="bg-gray-100 p-4 md:hidden">
        <div className="grid grid-cols-3 gap-2">
          {keypadKeys.flat().map(({ key: k, id }) => (
            <button
              key={id}
              type="button"
              aria-label={k === 'backspace' ? 'Backspace' : k === 'enter' ? 'Submit' : `Digit ${k}`}
              onClick={() => {
                if (k === 'enter') {
                  if (step === 'phone') handleSubmit(onPhoneSubmit)();
                  else void handleVerify();
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z"
                  />
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
  );
}
