'use client';

import { ArrowRight } from 'lucide-react';
import { trackCheckoutStarted, trackViewCart } from '@/lib/analytics';
import { useCoconutCartStore, coconutCartSubtotal } from './coconutCartStore';
import { COCONUT_VENDOR } from './products';

// CSS Styles for cart bar animations
const cartBarStyles = `
  @keyframes cartGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.4); }
    50% { box-shadow: 0 0 12px 8px rgba(255, 140, 0, 0.15); }
  }
  @keyframes cartShine {
    0% { transform: translateX(-115%) skewX(-16deg); opacity: 0; }
    8% { opacity: 1; }
    58% { opacity: 0.85; }
    100% { transform: translateX(155%) skewX(-16deg); opacity: 0; }
  }
  @keyframes cartPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  .cart-glow { animation: cartGlow 2s ease-in-out infinite; }
  .cart-pulse { animation: cartPulse 2s ease-in-out infinite; }
  .cart-shine {
    position: relative;
    overflow: hidden;
  }
  .cart-shine::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 24%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.18) 22%,
      rgba(255,255,255,1) 48%,
      rgba(255,255,255,0.25) 70%,
      rgba(255,255,255,0) 100%
    );
    filter: contrast(1.08);
    animation: cartShine 0.9s linear infinite;
    pointer-events: none;
  }
`;

type CoconutCartBarProps = {
  onCheckout: () => void;
};

export default function CoconutCartBar({ onCheckout }: CoconutCartBarProps) {
  const items = useCoconutCartStore((s) => s.items);
  if (items.length === 0) return null;

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = coconutCartSubtotal(items);
  const handlingCharge = COCONUT_VENDOR.handlingChargeInr ?? 0;
  const platformFee = COCONUT_VENDOR.platformFeeInr ?? 0;
  const grand = subtotal + COCONUT_VENDOR.deliveryFlatInr + handlingCharge + platformFee;

  const goCheckout = () => {
    trackViewCart(count, grand, 'noida_coconut_menu');
    trackCheckoutStarted('noida_coconut_checkout', grand);
    onCheckout();
  };

  return (
    <>
      <style>{cartBarStyles}</style>
      <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 pt-1" style={{ background: 'linear-gradient(to top, #F0FAF4 90%, transparent)' }}>
        <div className="cart-glow cart-shine mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-[12px] px-4 py-3 sm:max-w-2xl" style={{ background: '#2C2D5B' }}>
          <div className="min-w-0 leading-tight">
            <p className="text-xl font-bold tabular-nums text-white" style={{ fontWeight: 900 }}>₹{grand}</p>
            <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{count} item{count === 1 ? '' : 's'}</p>
          </div>
          <button
            type="button"
            onClick={goCheckout}
            className="cart-pulse flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm"
            style={{ background: '#fff', color: '#2C2D5B', fontWeight: 900 }}
          >
            Checkout
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </>
  );
}
