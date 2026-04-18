// Fleet Branding Constants
// Liftngo brand colors
export const PRIMARY = '#2C2D5B';
export const ACCENT = 'rgb(255, 140, 0)';
export const ACCENT_HEX = '#FF8C00';

// CSS styles for the configurator
export const configuratorStyles = `
  /* Slider Styles - Orange accent */
  .premium-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right, ${ACCENT} var(--progress, 0%), #E5E7EB var(--progress, 0%));
    outline: none;
    transition: background 0.2s;
  }
  .premium-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid ${ACCENT};
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(255, 140, 0, 0.25);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .premium-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.4);
  }
  .premium-slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid ${ACCENT};
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(255, 140, 0, 0.25);
  }
  
  /* Card selector styles - Orange active state */
  .selector-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }
  .selector-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(0,0,0,0.1);
    border-color: rgba(255, 140, 0, 0.3);
  }
  .selector-card.active {
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.15), 0 8px 25px -5px rgba(255, 140, 0, 0.2);
  }
  
  /* Animated number */
  .price-animate {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Glass card */
  .glass-card {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
  
  /* Premium button - Orange hover */
  .premium-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .premium-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px -6px rgba(255, 140, 0, 0.4);
  }
  
  /* Feature card with left accent */
  .feature-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.12);
  }
  
  /* Pulse animation for live indicator */
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  .pulse-ring::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #10B981;
    animation: pulse-ring 1.5s ease-out infinite;
  }
  
  /* Badge styles */
  .badge-popular {
    background: rgba(255, 140, 0, 0.1);
    color: rgb(255, 140, 0);
  }
  .badge-recommended {
    background: rgba(16, 185, 129, 0.1);
    color: rgb(16, 185, 129);
  }
`;

// Stats data
export const HERO_STATS = [
  { icon: 'Eye', value: '70K+', label: 'Daily Impressions' },
  { icon: 'MapPin', value: '50+', label: 'Locations Covered' },
  { icon: 'Truck', value: '3W & 4W', label: 'Vehicle Fleet' },
  { icon: 'Clock', value: '24/7', label: 'Brand Visibility' },
] as const;

// Trusted categories
export const TRUSTED_CATEGORIES = [
  'Retail & Kirana',
  'Restaurants',
  'Cloud Kitchens',
  'Hotels & Events',
  'B2B Suppliers',
  'Local Services',
] as const;

// Benefits data for WhyBranding section
export const BENEFITS = [
  {
    icon: 'Eye',
    title: 'Massive Visibility',
    desc: '70K+ potential daily impressions per vehicle. Your brand seen across busy streets, markets, and residential areas.',
    highlight: '70K+',
    highlightLabel: 'Daily Impressions',
  },
  {
    icon: 'TrendingUp',
    title: 'Lower Cost Per View',
    desc: 'Fleet wraps cost a fraction of static billboards while delivering continuous exposure across multiple locations.',
    highlight: '80%',
    highlightLabel: 'Cost Savings',
  },
  {
    icon: 'Clock',
    title: 'Long-Term Impact',
    desc: 'Quality vinyl lasts 3-5 years. One investment, thousands of daily touchpoints — rain or shine.',
    highlight: '3-5 yrs',
    highlightLabel: 'Wrap Lifespan',
  },
  {
    icon: 'Target',
    title: 'Hyperlocal Targeting',
    desc: 'Reach customers exactly where they live, work, and shop. Delhi NCR grids, townships, and growth markets.',
    highlight: '50+',
    highlightLabel: 'Locations',
  },
  {
    icon: 'Users',
    title: 'Trust & Recall',
    desc: 'Branded vehicles feel official and memorable. 3× higher recall versus unmarked delivery bikes and vans.',
    highlight: '3×',
    highlightLabel: 'Better Recall',
  },
  {
    icon: 'Zap',
    title: 'Quick Setup',
    desc: 'From design approval to live on roads in just 48 hours. No lengthy campaigns or complex approvals.',
    highlight: '48 hrs',
    highlightLabel: 'Go Live',
  },
] as const;

// Loss aversion items
export const LOSS_ITEMS = [
  { icon: 'Eye', title: 'Invisible Brand', desc: 'Your vehicles blend in. Competitors with branded fleets capture attention you miss.' },
  { icon: 'TrendingUp', title: 'Lost Impressions', desc: 'Every delivery is a missed billboard. Thousands of daily views going to waste.' },
  { icon: 'Target', title: 'Weak Recall', desc: 'Unmarked vehicles feel generic. Customers forget you the moment delivery ends.' },
] as const;

// Fleet features
export const FLEET_FEATURES = [
  { icon: 'MapPin', title: 'High-Frequency Routes', desc: 'Dense streets, arterial roads, residential clusters' },
  { icon: 'Coins', title: 'Better Value Than Hoardings', desc: 'Fleet wraps amortise over months of daily exposure' },
  { icon: 'Calendar', title: 'Years of Visibility', desc: 'Quality vinyl lasts 3-5 years in all weather' },
] as const;

// Process steps
export const PROCESS_STEPS = [
  { n: '01', title: 'Choose Coverage', desc: 'Single, double, or full wrap — match your visibility goal and budget.' },
  { n: '02', title: 'Share Assets', desc: 'WhatsApp your logo, colours, and copy. We frame safe print zones.' },
  { n: '03', title: 'Approve Mockups', desc: 'Review digital layouts before vinyl goes to production.' },
  { n: '04', title: 'Go Live', desc: 'Installed on fleet and visible across cities and corridors.' },
] as const;

// Trust items
export const TRUST_ITEMS = [
  { icon: 'Truck', title: 'Live Fleet', desc: 'Operational 3W & 4W across active delivery routes — not parked vehicles.' },
  { icon: 'Shield', title: 'Operations-First', desc: 'Built on real logistics infrastructure — not a passive ad network.' },
  { icon: 'Globe', title: 'Multi-Market Reach', desc: 'Delhi NCR density plus towns like Khatu — grow where you need reach.' },
] as const;

// Vehicle type options
export const VEHICLE_OPTIONS = [
  { value: '3w', label: '3W EV', desc: 'Electric vehicle', icon: '⚡' },
  { value: '4w', label: '4W Vehicle', desc: 'Cargo van', icon: '🚐' },
] as const;

// Branding type options
export const BRANDING_OPTIONS = [
  { value: 'single', label: 'Single Side', icon: '◧' },
  { value: 'double', label: 'Double Side', icon: '◨', recommended: true },
  { value: 'fullWrap', label: 'Full Wrap', icon: '▣' },
] as const;

// Printing tier options
export const PRINTING_OPTIONS = [
  { value: 'budget', label: 'Budget', price: '₹3,000', desc: 'Standard vinyl' },
  { value: 'standard', label: 'Standard', price: '₹4,500', desc: 'Premium vinyl', highlight: true },
  { value: 'premium', label: 'Premium', price: '₹6,000', desc: 'UV resistant' },
] as const;

// 3W vehicle features
export const VEHICLE_3W_FEATURES = [
  'Street-level visibility — ideal for food, retail, quick commerce',
  'Dense lanes, societies, markets across Delhi NCR',
  'Last-mile routes plus town coverage like Khatu',
] as const;

// 4W vehicle features
export const VEHICLE_4W_FEATURES = [
  'Larger panels and optional full wrap for maximum recall',
  'Strong for B2B, bulk drops, and highway presence',
  'Coverage across NCR highways and satellite towns',
] as const;

// Helper function
export function formatInr(n: number): string {
  return n.toLocaleString('en-IN');
}
