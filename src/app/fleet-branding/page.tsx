'use client';

import { useEffect, useState } from 'react';
import {
  Header,
  Hero,
  StatsStrip,
  WhyBranding,
  FleetVisual,
  HowItWorks,
  VehicleTypes,
  CalculatorContainer,
  TrustSection,
  CTASection,
  useBrandingCalculator,
  configuratorStyles,
} from '@/components/fleet-branding';

export default function FleetBrandingPage() {
  const [mounted, setMounted] = useState(false);
  
  const {
    whatsappStartCampaignHref,
    whatsappContactSalesHref,
    whatsappBrandFleetHref,
    scrollToCalculator,
  } = useBrandingCalculator();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip" style={{ background: '#FAFAFA' }}>
      <style>{configuratorStyles}</style>

      <Header 
        whatsappStartCampaignHref={whatsappStartCampaignHref} 
        scrollToCalculator={scrollToCalculator} 
      />

      <Hero 
        mounted={mounted} 
        scrollToCalculator={scrollToCalculator} 
      />

      <StatsStrip />

      <WhyBranding whatsappBrandFleetHref={whatsappBrandFleetHref} />

      <FleetVisual whatsappBrandFleetHref={whatsappBrandFleetHref} />

      <HowItWorks />

      <VehicleTypes />

      <CalculatorContainer />

      <TrustSection />

      <CTASection whatsappContactSalesHref={whatsappContactSalesHref} />
    </div>
  );
}
