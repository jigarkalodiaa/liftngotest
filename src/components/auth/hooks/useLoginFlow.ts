'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSendOtp, useResendOtp, useVerifyOtp } from '@/hooks/auth';
import { loginOtpSchema } from '@/lib/validations';
import { trackLoginStarted, trackOtpSent, trackOtpVerified } from '@/lib/analytics';
import { trackEvent } from '@/lib/posthogAnalytics';
import type { LoginStep } from '../types';

const SEND_DEBOUNCE_MS = 2500;
const RESEND_COOLDOWN_SEC = 60;

interface UseLoginFlowOptions {
  variant: 'modal' | 'page';
  onCompleted: (nextPath: string) => void;
}

export function useLoginFlow({ variant, onCompleted }: UseLoginFlowOptions) {
  const [step, setStep] = useState<LoginStep>('phone');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [sendError, setSendError] = useState('');
  const lastSendRef = useRef(0);

  const sendOtpMutation = useSendOtp();
  const resendOtpMutation = useResendOtp();
  const verifyOtpMutation = useVerifyOtp();

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const resetState = useCallback(() => {
    setStep('phone');
    setOtp(['', '', '', '']);
    setOtpError('');
    setSendError('');
    setCountdown(0);
  }, []);

  const resetOtpState = useCallback(() => {
    setOtp(['', '', '', '']);
    setOtpError('');
    setSendError('');
  }, []);

  const sendOtp = useCallback(
    async (phoneNumber: string) => {
      setSendError('');
      const now = Date.now();
      if (now - lastSendRef.current < SEND_DEBOUNCE_MS) {
        const waitTime = Math.ceil((SEND_DEBOUNCE_MS - (now - lastSendRef.current)) / 1000);
        setSendError(`Please wait ${waitTime}s before another request.`);
        return false;
      }
      lastSendRef.current = now;

      trackEvent('login_attempt', { method: 'phone_continue', ui: variant });
      trackLoginStarted();

      try {
        await sendOtpMutation.mutateAsync(phoneNumber);
        trackEvent('otp_sent', { ui: variant });
        trackOtpSent();
        setStep('otp');
        setCountdown(RESEND_COOLDOWN_SEC);
        setOtp(['', '', '', '']);
        setOtpError('');
        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Could not send OTP. Try again.';
        setSendError(msg);
        return false;
      }
    },
    [sendOtpMutation, variant]
  );

  const resendOtp = useCallback(
    async (phoneNumber: string) => {
      setSendError('');
      const now = Date.now();
      if (now - lastSendRef.current < SEND_DEBOUNCE_MS) {
        const waitTime = Math.ceil((SEND_DEBOUNCE_MS - (now - lastSendRef.current)) / 1000);
        setSendError(`Please wait ${waitTime}s before another request.`);
        return false;
      }
      lastSendRef.current = now;

      try {
        await resendOtpMutation.mutateAsync(phoneNumber);
        setOtp(['', '', '', '']);
        setOtpError('');
        setCountdown(RESEND_COOLDOWN_SEC);
        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Could not resend OTP. Try again.';
        setSendError(msg);
        return false;
      }
    },
    [resendOtpMutation]
  );

  const verifyOtp = useCallback(
    async (phoneNumber: string) => {
      setOtpError('');
      const otpString = otp.join('');
      const result = loginOtpSchema.safeParse({ otp: otpString });

      if (!result.success) {
        const first = result.error.issues[0];
        setOtpError(first?.message ?? 'Please enter a valid 4-digit OTP');
        return false;
      }

      try {
        const { nextPath } = await verifyOtpMutation.mutateAsync({
          phone: phoneNumber,
          otp: otpString,
        });
        trackOtpVerified();
        setTimeout(() => onCompleted(nextPath), variant === 'page' ? 0 : 400);
        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
        setOtpError(msg);
        setOtp(['', '', '', '']);
        return false;
      }
    },
    [otp, verifyOtpMutation, onCompleted, variant]
  );

  const goBackToPhone = useCallback(() => {
    setStep('phone');
    resetOtpState();
  }, [resetOtpState]);

  return {
    // State
    step,
    otp,
    countdown,
    otpError,
    sendError,

    // Setters
    setOtp,

    // Actions
    sendOtp,
    resendOtp,
    verifyOtp,
    goBackToPhone,
    resetState,
    resetOtpState,

    // Loading states
    isSendingOtp: sendOtpMutation.isPending,
    isResendingOtp: resendOtpMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
  };
}
