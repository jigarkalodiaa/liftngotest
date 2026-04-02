/**
 * Auth helpers: NextAuth server methods and session finalization after OTP.
 */
export { auth, signIn, signOut } from '@/auth';
export { finalizeLoginSessionAfterOtp, type FinalizeLoginOptions } from './finalizeLoginSession';
