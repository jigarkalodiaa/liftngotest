import Razorpay from 'razorpay';

let _instance: Razorpay | null = null;

/**
 * Lazily creates the Razorpay instance on first call (not at import/build time).
 * Throws a clear error if env vars are missing at runtime.
 */
export function getRazorpay(): Razorpay {
  if (_instance) return _instance;

  // Accept either server-only `RAZORPAY_KEY_ID` or public key id fallback.
  const key_id = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
  const key_secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

  if (!key_id || !key_secret) {
    throw new Error(
      'Razorpay is not configured. Set RAZORPAY_KEY_ID (or NEXT_PUBLIC_RAZORPAY_KEY_ID) and RAZORPAY_KEY_SECRET in your environment.',
    );
  }

  _instance = new Razorpay({ key_id, key_secret });
  return _instance;
}
