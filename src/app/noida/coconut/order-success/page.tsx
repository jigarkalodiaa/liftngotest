'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Clock, MessageCircle, ShoppingBag } from 'lucide-react';
import { Suspense } from 'react';

const successStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  
  @keyframes checkpop {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes progressLoad {
    from { width: 0%; }
    to { width: 30%; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .check-pop { animation: checkpop 0.6s ease forwards; }
  .progress-load { animation: progressLoad 2s ease forwards; }
  .pulse-dot { animation: pulse 1.5s ease-in-out infinite; }
  .fade-in { animation: fadeIn 0.4s ease forwards; }
`;

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get('paymentId') || '';
  const total = searchParams.get('total') || '0';
  const itemCount = searchParams.get('items') || '0';
  const phone = searchParams.get('phone') || '';

  const handleTrackWhatsApp = () => {
    window.open('https://wa.me/918588808581', '_blank');
  };

  const handleOrderMore = () => {
    router.push('/noida/coconut');
  };

  return (
    <div className="min-h-screen" style={{ background: '#F0FAF4', fontFamily: 'Nunito, sans-serif' }}>
      <style>{successStyles}</style>

      {/* SUCCESS ANIMATION HEADER */}
      <div className="px-6 pb-10 pt-12 text-center" style={{ background: '#1B6B3A' }}>
        {/* Animated checkmark circle */}
        <div
          className="check-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: '#4ADE80' }}
        >
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </div>

        <h1 className="mt-4 text-[26px] text-white" style={{ fontWeight: 900 }}>
          Order Placed!
        </h1>
        <p className="mt-1.5 text-[14px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Your fresh nariyal pani is on its way!
        </p>
      </div>

      <div className="mx-auto max-w-xl sm:max-w-2xl">
        {/* DELIVERY TIMER CARD */}
        <div
          className="fade-in mx-3.5 -mt-5 rounded-[18px] border bg-white p-5"
          style={{ borderColor: '#C6E8D2', animationDelay: '0.1s' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px]" style={{ background: '#E8F5EC' }}>
              <Clock className="h-5 w-5" style={{ color: '#1B6B3A' }} />
            </div>
            <div>
              <p className="text-[12px]" style={{ color: '#6B7280' }}>Estimated delivery</p>
              <p className="text-[22px]" style={{ color: '#1B6B3A', fontWeight: 900 }}>15 – 25 minutes</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: '#E8F5EC' }}>
            <div className="progress-load h-full rounded-full" style={{ background: '#1B6B3A' }} />
          </div>
        </div>

        {/* ORDER SUMMARY CARD */}
        <div
          className="fade-in mx-3.5 mt-3 rounded-[18px] border bg-white p-4"
          style={{ borderColor: '#C6E8D2', animationDelay: '0.2s' }}
        >
          <p className="text-[11px] tracking-wider" style={{ color: '#1B6B3A', fontWeight: 800, letterSpacing: '1.5px' }}>
            YOUR ORDER
          </p>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px]" style={{ color: '#4B5563' }}>
                {itemCount} item{parseInt(itemCount) !== 1 ? 's' : ''}
              </span>
              <span className="text-[13px]" style={{ color: '#1A1A1A', fontWeight: 700 }}>
                Coconut order
              </span>
            </div>

            <div className="border-t pt-2" style={{ borderColor: '#E5F0EA' }}>
              <div className="flex items-center justify-between">
                <span className="text-[14px]" style={{ color: '#1B6B3A', fontWeight: 800 }}>Total Paid</span>
                <span className="text-[18px]" style={{ color: '#1B6B3A', fontWeight: 900 }}>₹{total}</span>
              </div>
            </div>
          </div>

          {paymentId && (
            <p className="mt-3 font-mono text-[11px]" style={{ color: '#9CA3AF' }}>
              Payment ID: {paymentId}
            </p>
          )}
        </div>

        {/* LIFTNGO DELIVERY CARD */}
        <div
          className="fade-in mx-3.5 mt-3 rounded-[14px] border p-3.5"
          style={{ background: '#EDF2FA', borderColor: '#C7D8F0', animationDelay: '0.3s' }}
        >
          <div className="flex items-start gap-3">
            <span
              className="shrink-0 rounded-lg border bg-white px-2 py-1 text-[11px]"
              style={{ borderColor: '#C7D8F0', color: '#2C2D5B', fontWeight: 900 }}
            >
              LiftNGo
            </span>
            <p className="flex-1 text-[12px]" style={{ color: '#2C2D5B', fontWeight: 600 }}>
              Your order is being prepared and will be picked up by LiftNGo for delivery
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="pulse-dot h-2 w-2 rounded-full" style={{ background: '#10B981' }} />
              <span className="text-[10px]" style={{ color: '#059669', fontWeight: 700 }}>Live soon</span>
            </div>
          </div>
        </div>

        {/* WHATSAPP CONFIRMATION CARD */}
        <div
          className="fade-in mx-3.5 mt-3 rounded-[14px] border-[1.5px] p-3.5"
          style={{ background: '#F0FFF4', borderColor: '#86EFAC', animationDelay: '0.4s' }}
        >
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0" style={{ color: '#22C55E' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <p className="text-[12px]" style={{ color: '#065F46', fontWeight: 700 }}>
              Order confirmation sent to our team on WhatsApp. You&apos;ll receive a call/message shortly.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="fade-in mx-3.5 mt-4 flex flex-col gap-2.5" style={{ animationDelay: '0.5s' }}>
          <button
            type="button"
            onClick={handleTrackWhatsApp}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] px-4 py-3.5 text-[14px]"
            style={{ background: '#25D366', color: '#fff', fontWeight: 900 }}
          >
            <MessageCircle className="h-5 w-5" />
            Track on WhatsApp
          </button>

          <button
            type="button"
            onClick={handleOrderMore}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] px-4 py-3.5 text-[14px]"
            style={{ background: '#fff', borderColor: '#C6E8D2', color: '#1B6B3A', fontWeight: 700 }}
          >
            <ShoppingBag className="h-5 w-5" />
            Order More
          </button>
        </div>

        {/* FOOTER NOTE */}
        <p className="py-6 text-center text-[11px]" style={{ color: '#9CA3AF' }}>
          Fresh from farm · Delivered by LiftNGo · Thank you for your order!
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F0FAF4' }}>
        <p className="text-sm" style={{ color: '#6B7280' }}>Loading...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
