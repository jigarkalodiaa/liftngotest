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

  // Track keyboard visibility using visualViewport API + fallback
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let initialHeight = window.innerHeight;
    
    const updateKeyboardHeight = () => {
      // Method 1: visualViewport API (most reliable on modern browsers)
      if (window.visualViewport) {
        const height = Math.max(0, window.innerHeight - window.visualViewport.height);
        if (height > 100) { // Keyboard is likely open
          setKeyboardHeight(height);
          return;
        }
      }
      
      // Method 2: Compare window height (fallback for older browsers)
      const currentHeight = window.innerHeight;
      const diff = initialHeight - currentHeight;
      if (diff > 100) {
        setKeyboardHeight(diff);
      } else {
        setKeyboardHeight(0);
      }
    };

    // Listen to multiple events for better detection
    const handleResize = () => {
      updateKeyboardHeight();
    };

    const handleFocusIn = () => {
      // Small delay to let keyboard animation complete
      setTimeout(updateKeyboardHeight, 300);
    };

    const handleFocusOut = () => {
      setTimeout(() => setKeyboardHeight(0), 100);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateKeyboardHeight);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateKeyboardHeight);
      }
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
  const isKeyboardOpen = keyboardHeight > 100;

  // Shell styles
  const shellClass =
    variant === 'modal'
      ? 'flex-1 flex flex-col w-full mt-auto md:mt-0 md:flex-initial md:max-h-[28rem] md:max-w-md md:rounded-2xl bg-white rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl'
      : 'w-full max-w-md mx-auto rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden';

  if (!isActive) return null;

  return (
    <div ref={panelRef} className={shellClass}>
      <PanelHeader title="Login to Liftngo" onDismiss={onDismiss} />

      <div 
        className="flex-1 min-h-0 p-6 overflow-y-auto"
        style={{ paddingBottom: isKeyboardOpen ? '80px' : undefined }}
      >
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

      {/* Button container - fixed above keyboard when open */}
      <div
        className="bg-white px-6 py-4 border-t border-gray-100 transition-all duration-200"
        style={{
          position: isKeyboardOpen ? 'fixed' : 'relative',
          bottom: isKeyboardOpen ? 0 : undefined,
          left: isKeyboardOpen ? 0 : undefined,
          right: isKeyboardOpen ? 0 : undefined,
          zIndex: isKeyboardOpen ? 9999 : undefined,
          boxShadow: isKeyboardOpen ? '0 -4px 20px rgba(0,0,0,0.1)' : undefined,
          paddingBottom: isKeyboardOpen ? 'env(safe-area-inset-bottom, 16px)' : '16px',
        }}
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
