import Razorpay from 'razorpay';

const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.warn(
    '[Razorpay] Missing NEXT_PUBLIC_RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET — payment creation will fail at runtime.',
  );
}

const razorpay = new Razorpay({
  key_id: key_id ?? '',
  key_secret: key_secret ?? '',
});

export default razorpay;
