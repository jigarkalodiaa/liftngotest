import Razorpay from 'razorpay';

let _instance: Razorpay | null = null;

/**
 * Lazily creates the Razorpay instance on first call (not at import/build time).
 * Throws a clear error if env vars are missing at runtime.
 */
export function getRazorpay(): Razorpay {
  if (_instance) return _instance;

  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      'Razorpay is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.',
    );
  }

  _instance = new Razorpay({ key_id, key_secret });
  return _instance;
}
