'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, CheckCircle } from 'lucide-react';
import type { FleetBrandingQuote } from '@/lib/branding/fleetBrandingPricing';
import { PRIMARY, ACCENT, formatInr } from '../constants';

interface PriceSummaryProps {
  quote: FleetBrandingQuote | null;
  durationMonths: number;
  whatsappLockEstimateHref: string;
}

export function PriceSummary({ quote, durationMonths, whatsappLockEstimateHref }: PriceSummaryProps) {
  return (
    <div className="sticky top-20">
      <div className="overflow-hidden rounded-2xl border shadow-2xl" style={{ borderColor: `${ACCENT}30`, background: PRIMARY }}>
        {/* Best Value Badge */}
        {durationMonths >= 3 && (
          <div className="flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold text-white" style={{ backgroundColor: ACCENT }}>
            <Sparkles className="h-3.5 w-3.5" />
            Best Value — {durationMonths}+ Month Campaign
          </div>
        )}
        
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Your Estimate</h3>
            <span className="relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase" style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}>
              <span className="pulse-ring relative h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              Live
            </span>
          </div>
          
          {quote && (
            <>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/60">Rent / vehicle / month</span>
                  <span className="price-animate text-base font-bold text-white">₹{formatInr(quote.monthlyRatePerVehicle)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/60">Monthly fleet cost</span>
                  <span className="price-animate text-base font-bold text-white">₹{formatInr(quote.monthlyFleetCost)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">One-time printing</span>
                  <span className="price-animate text-base font-bold text-white">₹{formatInr(quote.printingCost)}</span>
                </div>
              </div>
              
              <div className="mt-6 rounded-xl p-4 sm:p-5" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: `2px solid ${ACCENT}40` }}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>Total Campaign Cost</p>
                <p className="price-animate mt-1 text-3xl font-black tabular-nums text-white sm:text-4xl">₹{formatInr(quote.totalCampaignCost)}</p>
                <p className="mt-1 text-xs text-white/50">
                  {quote.durationMonths} mo × ₹{formatInr(quote.monthlyFleetCost)} + printing
                </p>
              </div>
            </>
          )}
          
          <Link
            href={whatsappLockEstimateHref}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-btn mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            Lock This Quote
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          {/* Trust indicators */}
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-white/40">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              No commitment
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Talk to sales first
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
