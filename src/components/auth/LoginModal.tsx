'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type LoginStep = 'phone' | 'otp';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isValid, setIsValid] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setStep('phone');
      setPhoneNumber('');
      setOtp(['', '', '', '']);
      setIsValid(false);
      setOtpError('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleKeyPress = (key: string) => {
    if (step === 'phone') {
      if (key === 'backspace') {
        setPhoneNumber(prev => prev.slice(0, -1));
      } else if (/^\d$/.test(key) && phoneNumber.length < 10) {
        setPhoneNumber(prev => prev + key);
      }
    } else {
      const emptyIndex = otp.findIndex(digit => digit === '');
      if (key === 'backspace') {
        const lastFilledIndex = otp.map((d, i) => d !== '' ? i : -1).filter(i => i !== -1).pop();
        if (lastFilledIndex !== undefined) {
          const newOtp = [...otp];
          newOtp[lastFilledIndex] = '';
          setOtp(newOtp);
        }
        setOtpError('');
        setIsValid(false);
      } else if (/^\d$/.test(key) && emptyIndex !== -1) {
        const newOtp = [...otp];
        newOtp[emptyIndex] = key;
        setOtp(newOtp);
        setOtpError('');
        setIsValid(false);
      }
    }
  };

  const handleLogin = () => {
    if (phoneNumber.length === 10) {
      setStep('otp');
      setCountdown(29);
    }
  };

  const handleVerify = () => {
    if (!otp.every(digit => digit !== '')) return;

    const entered = otp.join('');
    const correctOtp = '4768';

    if (entered !== correctOtp) {
      setIsValid(false);
      setOtpError('Incorrect OTP. Please try again.');
      setOtp(['', '', '', '']);
      return;
    }

    setOtpError('');
    setIsValid(true);

    try {
      localStorage.setItem('liftngo_logged_in', 'true');
      localStorage.setItem('liftngo_phone', phoneNumber);
    } catch {
      // ignore storage errors (private mode, etc.)
    }

    setTimeout(() => {
      onClose();
      router.push('/pickup-location');
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const keypadKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', 'backspace'],
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/60">
      {/* Modal */}
      <div className="flex-1 flex flex-col mt-auto bg-white rounded-t-3xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Login to Liftngo</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {step === 'phone' ? (
            <>
              {/* Phone Input */}
              <div className="mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg p-3">
                  <span className="text-gray-500 mr-2">+91</span>
                  <span className="text-gray-400 mr-2">|</span>
                  <span className={`flex-1 ${phoneNumber ? 'text-gray-900' : 'text-gray-400'}`}>
                    {phoneNumber || 'Enter mobile number'}
                  </span>
                  {phoneNumber.length === 10 && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 mb-6">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  By continuing, you agree to calls, including on <span className="text-[#1e3a5f] font-medium">autodialer, WhatsApp</span>, or texts from Liftngo and its affiliates.
                </span>
              </p>
            </>
          ) : (
            <>
              {/* OTP Display with Edit */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-600">Enter OTP +91{phoneNumber.slice(0, 1)}********{phoneNumber.slice(-2)}</p>
                  <button
                    onClick={() => {
                      setStep('phone');
                      setOtp(['', '', '', '']);
                      setOtpError('');
                      setIsValid(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-[#1e3a5f] hover:text-[#152a45] hover:bg-gray-100 rounded transition-colors"
                    aria-label="Edit phone number"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="text-xs font-medium">Edit</span>
                  </button>
                  {isValid && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex gap-3 mb-4">
                {otp.map((digit, index) => (
                  <div
                    key={index}
                    className={`w-14 h-14 border-2 rounded-lg flex items-center justify-center text-2xl font-semibold ${
                      digit ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {digit}
                  </div>
                ))}
              </div>

              {otpError && (
                <p className="text-sm text-red-600 mb-3">{otpError}</p>
              )}

              {/* Resend Timer */}
              <p className="text-sm text-gray-500 mb-4">
                {countdown > 0 ? (
                  <>Didn&apos;t receive OTP? <span className="text-[#1e3a5f] font-medium">{formatTime(countdown)}</span></>
                ) : (
                  <button className="text-[#1e3a5f] font-medium">Resend OTP</button>
                )}
              </p>

              {/* Terms */}
              <p className="text-xs text-gray-500 mb-4">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  By continuing, you agree to calls, including on <span className="text-[#1e3a5f] font-medium">autodialer, WhatsApp</span>, or texts from Liftngo and its affiliates.
                </span>
              </p>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="px-6 pb-4">
          <button
            onClick={step === 'phone' ? handleLogin : handleVerify}
            disabled={step === 'phone' ? phoneNumber.length !== 10 : !otp.every(d => d !== '')}
            className="w-full py-4 bg-[#1e3a5f] text-white font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
          >
            {step === 'phone' ? 'Login' : 'Verify'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Custom Keypad */}
        <div className="bg-gray-100 p-4">
          <div className="grid grid-cols-3 gap-2">
            {keypadKeys.flat().map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`h-14 rounded-lg text-xl font-medium transition-colors ${
                  key === 'backspace'
                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    : key === '*'
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    : 'bg-white text-gray-900 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {key === 'backspace' ? (
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
