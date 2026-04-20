'use client';

import { useMemo, useState } from 'react';

const SWATCHES = [
  { primary: '#E8521A', label: 'Liftngo Orange — Full Wrap' },
  { primary: '#2C2D5B', label: 'Liftngo Navy — Full Wrap' },
  { primary: '#FFC53D', label: 'Amber Gold — Full Wrap' },
  { primary: '#1DA462', label: 'Forest Green — Full Wrap' },
] as const;

function darken(hex: string, amount = 0.15): string {
  const n = hex.replace('#', '');
  const num = parseInt(n, 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0xff) * (1 - amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function lighten(hex: string, amount = 0.2): string {
  const n = hex.replace('#', '');
  const num = parseInt(n, 16);
  const r = Math.min(255, Math.floor(((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * amount));
  const g = Math.min(255, Math.floor(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount));
  const b = Math.min(255, Math.floor((num & 0xff) + (255 - (num & 0xff)) * amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function FleetBrandingVanPreview() {
  const [active, setActive] = useState(0);
  const primary = SWATCHES[active].primary;
  const darker = useMemo(() => darken(primary, 0.15), [primary]);
  const lighter = useMemo(() => lighten(primary, 0.1), [primary]);

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0D1B2E] p-6 pb-5 pt-10 shadow-xl sm:p-8 sm:pb-6 sm:pt-11">
      {/* Header */}
      <p className="absolute left-5 top-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
        Liftngo Fleet Wrap Preview
      </p>
      
      {/* Color Swatches */}
      <div className="absolute right-4 top-2.5 flex items-center gap-1.5">
        <span className="mr-1 text-[8px] font-medium uppercase tracking-wider text-white/30">Choose Color</span>
        {SWATCHES.map((s, i) => (
          <button
            key={s.label}
            type="button"
            title={s.label}
            onClick={() => setActive(i)}
            className={`h-[18px] w-[18px] shrink-0 rounded-full border-2 transition-all duration-200 ${
              i === active 
                ? 'scale-110 border-white shadow-lg' 
                : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
            }`}
            style={{ backgroundColor: s.primary }}
            aria-label={s.label}
          />
        ))}
      </div>

      {/* 4-Wheeler Cargo Van SVG */}
      <svg className="h-auto w-full" viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {/* Ground shadow */}
        <ellipse cx="260" cy="248" rx="180" ry="12" fill="rgba(0,0,0,0.3)" />
        
        {/* Rear wheel */}
        <g>
          <circle cx="120" cy="215" r="38" fill="#1a1a2e" stroke="#333" strokeWidth="3" />
          <circle cx="120" cy="215" r="28" fill="none" stroke="#444" strokeWidth="2" />
          <circle cx="120" cy="215" r="10" fill="#555" />
          <circle cx="120" cy="215" r="5" fill="#333" />
          {/* Wheel spokes */}
          <line x1="120" y1="187" x2="120" y2="243" stroke="#444" strokeWidth="1.5" />
          <line x1="92" y1="215" x2="148" y2="215" stroke="#444" strokeWidth="1.5" />
          <line x1="100" y1="195" x2="140" y2="235" stroke="#444" strokeWidth="1.5" />
          <line x1="140" y1="195" x2="100" y2="235" stroke="#444" strokeWidth="1.5" />
        </g>
        
        {/* Front wheel */}
        <g>
          <circle cx="400" cy="215" r="38" fill="#1a1a2e" stroke="#333" strokeWidth="3" />
          <circle cx="400" cy="215" r="28" fill="none" stroke="#444" strokeWidth="2" />
          <circle cx="400" cy="215" r="10" fill="#555" />
          <circle cx="400" cy="215" r="5" fill="#333" />
          {/* Wheel spokes */}
          <line x1="400" y1="187" x2="400" y2="243" stroke="#444" strokeWidth="1.5" />
          <line x1="372" y1="215" x2="428" y2="215" stroke="#444" strokeWidth="1.5" />
          <line x1="380" y1="195" x2="420" y2="235" stroke="#444" strokeWidth="1.5" />
          <line x1="420" y1="195" x2="380" y2="235" stroke="#444" strokeWidth="1.5" />
        </g>
        
        {/* Van body - cargo area */}
        <rect x="55" y="85" width="280" height="115" rx="8" fill={primary} />
        <rect x="55" y="85" width="280" height="12" rx="4" fill={darker} />
        
        {/* Van body - lower trim */}
        <rect x="55" y="188" width="380" height="12" rx="2" fill={darker} />
        
        {/* Cabin */}
        <path 
          d="M335 85 L335 200 L455 200 L455 130 Q455 100 430 90 L360 85 Z" 
          fill={primary} 
        />
        
        {/* Cabin roof curve */}
        <path 
          d="M335 85 L360 85 Q380 70 410 75 L430 90 Q455 100 455 130 L455 85 Q450 70 420 65 L370 65 Q345 68 335 85 Z" 
          fill={lighter} 
        />
        
        {/* Windshield */}
        <path 
          d="M355 95 L420 100 Q440 105 445 125 L445 155 L355 155 Z" 
          fill="#1a2a3a" 
          stroke="#555"
          strokeWidth="2"
        />
        <path 
          d="M360 100 L415 104 Q432 108 438 125 L438 150 L360 150 Z" 
          fill="rgba(100,150,200,0.15)" 
        />
        
        {/* Side window */}
        <rect x="345" y="105" width="8" height="45" rx="2" fill="#1a2a3a" stroke="#555" strokeWidth="1" />
        
        {/* Door line */}
        <line x1="335" y1="90" x2="335" y2="200" stroke={darker} strokeWidth="2" />
        <line x1="280" y1="90" x2="280" y2="200" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        
        {/* Door handle */}
        <rect x="290" y="140" width="25" height="6" rx="2" fill={darker} />
        <rect x="292" y="142" width="21" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
        
        {/* Headlight */}
        <ellipse cx="458" cy="160" rx="8" ry="15" fill="#fff8e0" />
        <ellipse cx="458" cy="160" rx="5" ry="10" fill="#fffbe8" />
        
        {/* Tail light */}
        <rect x="50" y="140" width="8" height="25" rx="2" fill="#ff4444" />
        <rect x="52" y="142" width="4" height="21" rx="1" fill="#ff6666" />
        
        {/* Side mirror */}
        <rect x="458" y="115" width="15" height="20" rx="3" fill="#333" />
        <rect x="460" y="118" width="11" height="14" rx="2" fill="#1a2a3a" />
        
        {/* Wheel wells */}
        <path d="M82 200 Q120 175 158 200" fill={darker} />
        <path d="M362 200 Q400 175 438 200" fill={darker} />
        
        {/* ===== BRANDING CONTENT ===== */}
        
        {/* Main brand panel on cargo area */}
        <rect x="80" y="105" width="180" height="70" rx="6" fill="rgba(0,0,0,0.2)" />
        
        {/* Your Logo placeholder */}
        <rect x="95" y="115" width="50" height="50" rx="8" fill="rgba(255,255,255,0.95)" />
        <text
          x="120"
          y="138"
          fill={primary}
          fontFamily="system-ui,sans-serif"
          fontSize="8"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          YOUR
        </text>
        <text
          x="120"
          y="150"
          fill={primary}
          fontFamily="system-ui,sans-serif"
          fontSize="8"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          LOGO
        </text>
        
        {/* Brand name */}
        <text
          x="155"
          y="132"
          fill="white"
          fontFamily="system-ui,sans-serif"
          fontSize="22"
          fontWeight="900"
          letterSpacing="-0.5"
        >
          LIFTNGO
        </text>
        
        {/* Tagline */}
        <text
          x="155"
          y="150"
          fill="rgba(255,255,255,0.8)"
          fontFamily="system-ui,sans-serif"
          fontSize="8"
          fontWeight="600"
          letterSpacing="2"
        >
          ON EVERY ROUTE
        </text>
        
        {/* Contact / CTA */}
        <rect x="155" y="156" width="95" height="14" rx="3" fill="rgba(255,255,255,0.15)" />
        <text
          x="202"
          y="166"
          fill="rgba(255,255,255,0.9)"
          fontFamily="system-ui,sans-serif"
          fontSize="7"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          📞 WhatsApp Us
        </text>
        
        {/* Secondary branding on cabin door */}
        <rect x="285" y="105" width="45" height="30" rx="4" fill="rgba(255,255,255,0.95)" />
        <text
          x="307"
          y="120"
          fill={primary}
          fontFamily="system-ui,sans-serif"
          fontSize="7"
          fontWeight="800"
          textAnchor="middle"
          letterSpacing="0.3"
        >
          LIFTNGO
        </text>
        <text
          x="307"
          y="130"
          fill={darker}
          fontFamily="system-ui,sans-serif"
          fontSize="5"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          DELIVERY
        </text>
        
        {/* Website URL on lower body */}
        <text
          x="195"
          y="196"
          fill="rgba(255,255,255,0.6)"
          fontFamily="system-ui,sans-serif"
          fontSize="8"
          fontWeight="600"
          textAnchor="middle"
          letterSpacing="1"
        >
          www.goliftngo.in
        </text>
        
        {/* Bumper */}
        <rect x="450" y="195" width="15" height="8" rx="2" fill="#333" />
        <rect x="50" y="195" width="10" height="8" rx="2" fill="#333" />
        
        {/* Ground line */}
        <line x1="60" y1="253" x2="460" y2="253" stroke="#333" strokeWidth="1" strokeDasharray="8 4" />
      </svg>

      {/* Label */}
      <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-wide text-white/40">
        {SWATCHES[active].label}
      </p>
      
      {/* CTA hint */}
      <p className="mt-1 text-center text-[9px] text-white/25">
        Click colors above to preview different wrap options
      </p>
    </div>
  );
}
