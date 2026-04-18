'use client';

import { useMemo, useState } from 'react';

const SWATCHES = [
  { primary: '#E8521A', label: 'Liftngo Orange — full wrap' },
  { primary: '#0F1C2E', label: 'Midnight navy — full wrap' },
  { primary: '#FFC53D', label: 'Amber gold — full wrap' },
  { primary: '#1DA462', label: 'Forest green — full wrap' },
] as const;

function darken(hex: string, amount = 0.15): string {
  const n = hex.replace('#', '');
  const num = parseInt(n, 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0xff) * (1 - amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function FleetBrandingBikePreview() {
  const [active, setActive] = useState(0);
  const primary = SWATCHES[active].primary;
  const lower = useMemo(() => darken(primary, 0.12), [primary]);

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/12 bg-[#0D1B2E] p-6 pb-5 pt-10 shadow-xl sm:p-8 sm:pb-6 sm:pt-11">
      <p className="absolute left-5 top-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
        Liftngo fleet wrap preview
      </p>
      <div className="absolute right-4 top-2.5 flex gap-2">
        {SWATCHES.map((s, i) => (
          <button
            key={s.label}
            type="button"
            title={s.label}
            onClick={() => setActive(i)}
            className={`h-[18px] w-[18px] shrink-0 rounded-full border-2 transition ${
              i === active ? 'border-white shadow-md' : 'border-transparent opacity-90 hover:opacity-100'
            }`}
            style={{ backgroundColor: s.primary }}
            aria-label={s.label}
          />
        ))}
      </div>

      <svg className="h-auto w-full" viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="110" cy="195" r="50" fill="#1a1a2e" stroke="#333" strokeWidth="3" />
        <circle cx="110" cy="195" r="38" fill="none" stroke="#444" strokeWidth="2" />
        <circle cx="110" cy="195" r="8" fill="#555" />
        <line x1="110" y1="157" x2="110" y2="233" stroke="#444" strokeWidth="1.5" />
        <line x1="72" y1="195" x2="148" y2="195" stroke="#444" strokeWidth="1.5" />
        <line x1="83" y1="168" x2="137" y2="222" stroke="#444" strokeWidth="1.5" />
        <line x1="137" y1="168" x2="83" y2="222" stroke="#444" strokeWidth="1.5" />

        <circle cx="370" cy="195" r="50" fill="#1a1a2e" stroke="#333" strokeWidth="3" />
        <circle cx="370" cy="195" r="38" fill="none" stroke="#444" strokeWidth="2" />
        <circle cx="370" cy="195" r="8" fill="#555" />
        <line x1="370" y1="157" x2="370" y2="233" stroke="#444" strokeWidth="1.5" />
        <line x1="332" y1="195" x2="408" y2="195" stroke="#444" strokeWidth="1.5" />
        <line x1="343" y1="168" x2="397" y2="222" stroke="#444" strokeWidth="1.5" />
        <line x1="397" y1="168" x2="343" y2="222" stroke="#444" strokeWidth="1.5" />

        <path d="M130 145 L340 130 L360 185 L110 185 Z" fill={primary} />
        <path d="M220 80 L350 90 L360 130 L220 130 Z" fill={primary} />
        <path d="M125 180 L355 178 L360 190 L115 192 Z" fill={lower} />

        <path d="M170 128 L290 120 L300 140 L165 145 Z" fill="#1a1a1a" />

        <rect x="60" y="110" width="100" height="75" rx="6" fill={primary} />
        <rect x="65" y="115" width="90" height="65" rx="4" fill="rgba(0,0,0,0.15)" />
        <text
          x="110"
          y="142"
          fill="white"
          fontFamily="system-ui,sans-serif"
          fontSize="9"
          fontWeight="800"
          textAnchor="middle"
          letterSpacing="1"
        >
          LIFTNGO
        </text>
        <text
          x="110"
          y="155"
          fill="rgba(255,255,255,0.85)"
          fontFamily="system-ui,sans-serif"
          fontSize="6"
          textAnchor="middle"
        >
          YOUR BRAND HERE
        </text>
        <rect x="60" y="110" width="100" height="8" rx="2" fill="rgba(0,0,0,0.22)" />

        <line x1="350" y1="135" x2="370" y2="195" stroke="#666" strokeWidth="5" strokeLinecap="round" />
        <line x1="360" y1="130" x2="378" y2="195" stroke="#555" strokeWidth="4" strokeLinecap="round" />

        <path d="M340 100 Q360 88 385 95" fill="none" stroke="#777" strokeWidth="5" strokeLinecap="round" />
        <circle cx="385" cy="95" r="5" fill="#888" />

        <ellipse cx="400" cy="155" rx="18" ry="14" fill={primary} />
        <ellipse cx="400" cy="155" rx="10" ry="8" fill="rgba(255,240,150,0.9)" />

        <text
          x="245"
          y="158"
          fill="white"
          fontFamily="system-ui,sans-serif"
          fontSize="18"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="-0.5"
          opacity="0.95"
        >
          LIFTNGO
        </text>
        <text
          x="245"
          y="172"
          fill="rgba(255,255,255,0.75)"
          fontFamily="system-ui,sans-serif"
          fontSize="7"
          textAnchor="middle"
          letterSpacing="2.5"
          fontWeight="600"
        >
          ON EVERY ROUTE
        </text>

        <text
          x="290"
          y="113"
          fill="rgba(255,255,255,0.85)"
          fontFamily="system-ui,sans-serif"
          fontSize="7"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          WhatsApp us
        </text>

        <path d="M160 195 Q240 205 320 195" fill="none" stroke="#444" strokeWidth="3" strokeDasharray="4 3" />

        <path d="M130 192 L80 200 L75 195 L78 188 L125 182" fill="#555" />

        <ellipse cx="245" cy="108" rx="16" ry="8" fill="#0D1B2E" opacity="0.6" />
      </svg>

      <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wide text-white/40">
        {SWATCHES[active].label}
      </p>
    </div>
  );
}
