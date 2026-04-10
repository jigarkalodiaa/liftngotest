/**
 * Auth component types
 */

export type LoginStep = 'phone' | 'otp';

export interface LoginPanelProps {
  variant: 'modal' | 'page';
  isActive?: boolean;
  onDismiss?: () => void;
  onCompleted: (nextPath: string) => void;
}

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isValid: boolean;
  register: ReturnType<typeof import('react-hook-form').useForm>['register'];
}

export interface OtpInputProps {
  otp: string[];
  onChange: (otp: string[]) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export interface LoginFormState {
  step: LoginStep;
  otp: string[];
  countdown: number;
  otpError: string;
  sendError: string;
}

export interface LoginFormActions {
  setStep: (step: LoginStep) => void;
  setOtp: (otp: string[]) => void;
  setOtpError: (error: string) => void;
  setSendError: (error: string) => void;
  resetOtpState: () => void;
}
