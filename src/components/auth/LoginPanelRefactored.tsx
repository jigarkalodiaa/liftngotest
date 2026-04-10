'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginPhoneSchema, MOBILE_LENGTH, normalizePhoneInput, type LoginPhoneForm } from '@/lib/validations';

import { useLoginFlow } from './hooks/useLoginFlow';
import { PanelHeader, PrimaryButton } from './components';
import { PhoneStep } from './views/PhoneStep';
import { OtpStep } from './views/OtpStep';
import type { LoginPanelProps } from './types';

/**
 * LoginPanel - Handles phone number input and OTP verification
 * Refactored with clean architecture:
 * - Separated UI components
 * - Custom hook for business logic
 * - Clear separation of concerns
 */
export default function LoginPanel({ variant, isActive = true, onDismiss, onCompleted }: LoginPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const wasActiveRef = useRef(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Form state
  const {
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LoginPhoneForm>({
    resolver: zodResolver(loginPhoneSchema),
    mode: 'onTouched',
    defaultValues: { phone: '', termsAccepted: true },
  });

  const phoneNumber = watch('phone') ?? '';
  const termsChecked = watch('termsAccepted') ?? true;

  // Login flow logic
  const {
    step,
    otp,
    countdown,
    otpError,
    sendError,
    setOtp,
    sendOtp,
    resendOtp,
    verifyOtp,
    goBackToPhone,
    resetState,
    isSendingOtp,
    isResendingOtp,
    isVerifyingOtp,
  } = useLoginFlow({ variant, onCompleted });

  // Reset state when panel becomes active
  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      reset({ phone: '', termsAccepted: true });
      resetState();
    }
    wasActiveRef.current = isActive;
  }, [isActive, reset, resetState]);

  // Handle escape key for modal
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

  // Focus OTP input when step changes
  useEffect(() => {
    if (step === 'otp') {
      const t = setTimeout(() => otpInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Focus trap for modal
  useEffect(() => {
    if (variant !== 'modal' || !isActive || !panelRef.current) return;
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
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener('keydown', handleTab);
    return () => panel.removeEventListener('keydown', handleTab);
  }, [variant, isActive]);

  // Track keyboard visibility using visualViewport API
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const viewport = window.visualViewport;

    const updateKeyboardHeight = () => {
      const height = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboardHeight(height);
    };

    updateKeyboardHeight();
    viewport.addEventListener('resize', updateKeyboardHeight);
    viewport.addEventListener('scroll', updateKeyboardHeight);

    return () => {
      viewport.removeEventListener('resize', updateKeyboardHeight);
      viewport.removeEventListener('scroll', updateKeyboardHeight);
    };
  }, []);

  // Handlers
  const handlePhoneChange = useCallback(
    (value: string) => {
      setValue('phone', value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleTermsChange = useCallback(
    (checked: boolean) => {
      setValue('termsAccepted', checked);
    },
    [setValue]
  );

  const handleSendOtp = useCallback(() => {
    void sendOtp(phoneNumber);
  }, [sendOtp, phoneNumber]);

  const handleResendOtp = useCallback(() => {
    void resendOtp(phoneNumber);
  }, [resendOtp, phoneNumber]);

  const handleVerifyOtp = useCallback(() => {
    void verifyOtp(phoneNumber);
  }, [verifyOtp, phoneNumber]);

  const handleInputFocus = useCallback((focused: boolean) => {
    setIsInputFocused(focused);
  }, []);

  // Computed values
  const phoneDigits = normalizePhoneInput(phoneNumber);
  const otpFilled = otp.every((d) => d !== '');
  const canSend = phoneDigits.length === MOBILE_LENGTH && termsChecked && !isSendingOtp;
  const isKeyboardOpen = isInputFocused && keyboardHeight > 0;

  // Shell styles
  const shellClass =
    variant === 'modal'
      ? 'flex-1 flex flex-col w-full mt-auto md:mt-0 md:flex-initial md:max-h-[28rem] md:max-w-md md:rounded-2xl bg-white rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl'
      : 'w-full max-w-md mx-auto rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden';

  if (!isActive) return null;

  return (
    <div ref={panelRef} className={shellClass}>
      <PanelHeader title="Login to Liftngo" onDismiss={onDismiss} />

      <div className="flex-1 min-h-0 p-6 overflow-y-auto">
        {step === 'phone' ? (
          <PhoneStep
            phoneNumber={phoneNumber}
            onPhoneChange={handlePhoneChange}
            termsChecked={termsChecked}
            onTermsChange={handleTermsChange}
            phoneError={errors.phone?.message}
            termsError={errors.termsAccepted?.message}
            sendError={sendError}
            onSubmit={handleSendOtp}
            onFocusChange={handleInputFocus}
          />
        ) : (
          <OtpStep
            phoneNumber={phoneNumber}
            otp={otp}
            onOtpChange={setOtp}
            otpInputRef={otpInputRef}
            otpError={otpError}
            sendError={sendError}
            countdown={countdown}
            isResending={isResendingOtp}
            onResend={handleResendOtp}
            onEditPhone={goBackToPhone}
            onFocusChange={handleInputFocus}
          />
        )}
      </div>

      <div
        className={
          isKeyboardOpen
            ? 'fixed left-0 right-0 z-50 bg-white border-t border-gray-100 px-6 py-3 shadow-lg md:static md:border-0 md:shadow-none md:px-6 md:pb-4'
            : 'px-6 pb-4'
        }
        style={isKeyboardOpen ? { bottom: `${keyboardHeight}px` } : undefined}
      >
        {step === 'phone' ? (
          <PrimaryButton onClick={handleSendOtp} disabled={!canSend} isLoading={isSendingOtp} loadingText="Sending OTP…">
            Send OTP
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={handleVerifyOtp}
            disabled={!otpFilled}
            isLoading={isVerifyingOtp}
            loadingText="Verifying…"
          >
            Verify & login
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
