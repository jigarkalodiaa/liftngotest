'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, MapPin, Clock, Leaf, BadgeCheck, Star, Zap, ShieldCheck, Check, Truck } from 'lucide-react';
import { trackEvent as trackGaEvent, trackWhatsAppClick } from '@/lib/analytics';
import { trackEvent as trackPosthogEvent } from '@/lib/posthogAnalytics';
import { COCONUT_PRODUCTS, COCONUT_VENDOR } from '@/features/noida/coconut/products';
import CoconutProductCard from '@/features/noida/coconut/CoconutProductCard';
import CoconutCartBar from '@/features/noida/coconut/CoconutCartBar';

// CSS Styles matching checkout page
const menuStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  @keyframes slidein {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .menu-slidein { animation: slidein 0.4s ease forwards; }
  .menu-float { animation: float 2.5s ease-in-out infinite; }
  .menu-pulse { animation: pulse 2s ease-in-out infinite; }
  .live-dot { animation: livePulse 1.5s ease-in-out infinite; }
`;

export default function CoconutMenuPage() {
  const router = useRouter();
  const [socialProof, setSocialProof] = useState({ people: 23, mins: 4 });
  const [timerText, setTimerText] = useState('');
  const promoEndTimeRef = useRef(Date.now() + 60 * 60 * 1000);

  const singles = COCONUT_PRODUCTS.filter((p) => !p.combo);
  const combos = COCONUT_PRODUCTS.filter((p) => p.combo);

  // Dynamic social proof
  useEffect(() => {
    const updateSocialProof = () => {
      const n = Math.floor(Math.random() * 8) + 18;
      const t = Math.floor(Math.random() * 7) + 2;
      setSocialProof({ people: n, mins: t });
    };
    updateSocialProof();
    const interval = setInterval(updateSocialProof, Math.random() * 60000 + 30000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer - 1 hour window from page load
  useEffect(() => {
    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((promoEndTimeRef.current - Date.now()) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setTimerText(`${h}h ${m}m ${s}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    trackGaEvent('funnel_step', { flow: 'noida_coconut', step: 'menu_view' });
    trackPosthogEvent('funnel_step', { flow: 'noida_coconut', step: 'menu_view' });
  }, []);

  return (
    <div className="min-h-screen pb-36" style={{ background: '#F0FAF4', fontFamily: 'Nunito, sans-serif' }}>
      <style>{menuStyles}</style>
      
      {/* HEADER - Liftngo Theme */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3" style={{ background: '#2C2D5B' }}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              trackGaEvent('cta_click', { cta_name: 'coconut_back', source: 'noida_coconut_menu' });
              trackPosthogEvent('coconut_back_clicked', { source: 'noida_coconut_menu' });
              router.push('/dashboard');
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ChevronLeft className="h-5 w-5 text-white" strokeWidth={2.5} />
          </button>
          <h1
            className="text-base text-white sm:text-lg"
            style={{ fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif', fontWeight: 700, letterSpacing: '-0.01em' }}
          >
            {COCONUT_VENDOR.name}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-[12px] border px-3 py-1" style={{ background: '#ECFDF5', borderColor: '#86EFAC' }}>
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#15803D' }} strokeWidth={2.5} />
          <span className="text-[11px]" style={{ color: '#15803D', fontWeight: 700 }}>Verified Vendor</span>
        </div>
      </header>

      {/* OFFER BANNER */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5" style={{ background: '#10B981' }}>
        <span className="shrink-0 rounded-[12px] px-2.5 py-1 text-[10px]" style={{ background: '#fff', color: '#059669', fontWeight: 900 }}>
          LOWEST PRICE
        </span>
        <span className="flex-1 text-[12px]" style={{ color: '#fff', fontWeight: 700 }}>
          ₹79 only · Same as counter · Zero markup
        </span>
        <span className="shrink-0 rounded-[12px] border px-2 py-1 text-[10px]" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontWeight: 700 }}>
          {timerText}
        </span>
      </div>

      {/* TRUST STRIP */}
      <div className="grid grid-cols-2 gap-2 px-4 py-2.5 sm:grid-cols-4" style={{ background: '#ECFDF5', borderBottom: '1px solid #C6E8D2' }}>
        {[
          { icon: <Leaf className="h-3 w-3" />, text: '100% Fresh' },
          { icon: <Check className="h-3 w-3" />, text: 'Counter price' },
          { icon: <Truck className="h-3 w-3" />, text: 'Free delivery' },
          { icon: <Clock className="h-3 w-3" />, text: '15–25 min' },
        ].map((pill, i) => (
          <span key={i} className="flex items-center justify-center gap-1.5 rounded-[12px] border bg-white px-2 py-1.5 text-[11px] text-center sm:px-3" style={{ borderColor: '#C6E8D2', color: '#1B6B3A', fontWeight: 700 }}>
            {pill.icon}
            {pill.text}
          </span>
        ))}
      </div>

      <div className="mx-auto max-w-xl sm:max-w-2xl">

        {/* HERO TEXT */}
        <div
          className="menu-slidein mx-3 mt-3 rounded-2xl border p-4"
          style={{ borderColor: '#DDEDE7', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FBF9 100%)', animationDelay: '0.05s' }}
        >
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.04em]" style={{ borderColor: '#B7E4CF', color: '#166534', fontWeight: 800 }}>
            <Leaf className="h-3 w-3" strokeWidth={2.2} />
            Summer hydration
          </div>
          <h2 className="text-lg leading-tight text-gray-900" style={{ fontWeight: 900 }}>
            Fresh nariyal, delivered in minutes
          </h2>
          <p className="mt-1 text-sm leading-snug text-gray-600">
            Counter pricing with zero markup. No hidden charges.
          </p>
        </div>
        
        {/* LOCATION */}
        <div className="menu-slidein mx-3 mt-3 flex items-center gap-3 rounded-[12px] border bg-white p-3" style={{ borderColor: '#E5F0EA', animationDelay: '0.1s' }}>
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px]" style={{ background: '#E8F5EC' }}>
            <MapPin className="h-5 w-5" style={{ color: '#1B6B3A' }} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm" style={{ color: '#1A1A1A', fontWeight: 800 }}>{COCONUT_VENDOR.area}</p>
            <p className="text-[11px] truncate" style={{ color: '#6B7280' }}>{COCONUT_VENDOR.pickupAddress}</p>
            <div className="mt-1 flex items-center gap-1">
              <Truck className="h-3 w-3" style={{ color: '#1B6B3A' }} />
              <span className="text-[10px]" style={{ color: '#1B6B3A', fontWeight: 700 }}>Delivered by LiftNGo</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-[12px] px-2.5 py-1.5" style={{ background: '#D1FAE5' }}>
            <Clock className="h-3.5 w-3.5" style={{ color: '#065F46' }} strokeWidth={2} />
            <span className="text-[11px]" style={{ color: '#065F46', fontWeight: 800 }}>{COCONUT_VENDOR.estimatedMinutes} min</span>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="mx-3 mt-4 space-y-4">
          {singles.map((p) => (
            <CoconutProductCard key={p.id} product={p} isFeatured />
          ))}
          {combos.map((p) => (
            <CoconutProductCard key={p.id} product={p} isPack />
          ))}
        </div>

        {/* SOCIAL PROOF */}
        <div className="menu-slidein mx-3 mt-4 flex items-center gap-3 rounded-[12px] border bg-white p-3" style={{ borderColor: '#E5F0EA', animationDelay: '0.2s' }}>
          <div className="flex -space-x-2">
            {['R', 'S', 'A'].map((initial, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] text-white ring-2 ring-white"
                style={{ backgroundColor: ['#1B6B3A', '#059669', '#10B981'][i], fontWeight: 800 }}
              >
                {initial}
              </div>
            ))}
          </div>
          <p className="flex-1 text-[12px]" style={{ color: '#6B7280' }}>
            <span style={{ color: '#1A1A1A', fontWeight: 800 }}>{socialProof.people} people</span> from Sector 53 ordered today · Last order {socialProof.mins} mins ago
            <span className="live-dot ml-1.5 inline-block h-2 w-2 rounded-full" style={{ background: '#EF4444' }} />
          </p>
        </div>

        {/* DELIVERY PARTNER */}
        <div className="menu-slidein mx-3 mt-4 rounded-[12px] border bg-white" style={{ borderColor: '#E5F0EA', animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between rounded-[12px] p-3" style={{ background: '#2C2D5B', margin: '8px' }}>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" style={{ color: '#10B981' }} />
              <span className="text-[11.5px]" style={{ color: '#E0E7FF', fontWeight: 700 }}>Free delivery on pack of 4 · GPS tracked</span>
            </div>
            <span className="rounded-[12px] px-2 py-0.5 text-[10px]" style={{ background: '#10B981', color: '#fff', fontWeight: 900 }}>FREE</span>
          </div>
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-[11px]" style={{ color: '#6B7280', fontWeight: 600 }}>Delivered by our trusted partner</span>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" style={{ color: '#FF8C00' }} strokeWidth={2.5} />
              <span className="text-[10px]" style={{ color: '#2C2D5B', fontWeight: 700 }}>Powered by LiftNGo</span>
            </div>
          </div>
        </div>

        {/* WHATSAPP SUPPORT */}
        <a
          href="https://chat.whatsapp.com/L2L11ZBkjIWGcA6M3kdQ2B"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('noida_coconut_menu')}
          className="menu-slidein mx-3 mt-4 flex items-center justify-center gap-2 rounded-[12px] border p-3 transition-colors hover:bg-white"
          style={{ background: '#ECFDF5', borderColor: '#C6E8D2', animationDelay: '0.35s' }}
        >
          <svg className="h-5 w-5" style={{ color: '#1B6B3A' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="text-[12px]" style={{ color: '#1B6B3A', fontWeight: 800 }}>Need help? Chat with us on WhatsApp</span>
        </a>

      </div>

      <CoconutCartBar onCheckout={() => router.push('/noida/coconut/checkout')} />
    </div>
  );
}
