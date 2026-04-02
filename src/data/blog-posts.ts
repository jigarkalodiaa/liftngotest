import type { BlogPost } from '@/types/blog';
import {
  indiaPhotoBangaloreLoadedTruck,
  indiaPhotoMumbaiLoading,
  indiaPhotoWarehouseLogistics,
  indiaPhotoCargoBayLoading,
  indiaPhotoDeliveryRiderGoods,
  indiaPhotoRetailMarketGoods,
  indiaPhotoLogisticsHubScale,
} from '@/config/indiaLogisticsImages';

const W = 1200;
const imgTruck = indiaPhotoBangaloreLoadedTruck(W);
const imgLoading = indiaPhotoMumbaiLoading(W);
const imgWarehouse = indiaPhotoWarehouseLogistics(W);
const imgCargoBay = indiaPhotoCargoBayLoading(W);
const imgRider = indiaPhotoDeliveryRiderGoods(W);
const imgMarket = indiaPhotoRetailMarketGoods(W);
const imgHub = indiaPhotoLogisticsHubScale(W);

function rel(...slugs: string[]) {
  return slugs;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-logistics-works-khatu-shyam-ji-local-businesses',
    title: 'How Logistics Works in Khatu Shyam Ji for Local Businesses',
    description:
      'A practical look at logistics in Khatu Shyam Ji: temple vendors, food outlets, and shops—how on-demand booking and hyperlocal lanes change day-to-day stock movement.',
    excerpt:
      'Local businesses near the mandir run on repeat runs, not one-off gigs. Here is how modern logistics fits that reality.',
    keywords: [
      'logistics in khatu shyam ji',
      'delivery service khatu',
      'goods transport khatu',
      'temple town logistics',
      'local business delivery',
    ],
    publishedAt: '2025-03-08',
    featured: true,
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgLoading,
    featuredImageAlt: 'Goods being loaded for local delivery in India',
    relatedSlugs: rel(
      'hyperlocal-logistics-temple-towns',
      'liftngo-logistics-ecosystem-delhi-ncr',
      'last-mile-delivery-challenges-india',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'Khatu Shyam Ji is a high-trust, high-density micro-market. Sweet shops, kitchens, prasad supply, and retail stockists depend on short, repeatable legs—not long-haul freight spreadsheets. That is why ',
          { text: 'logistics in Khatu Shyam Ji', href: '/khatu-shyam-logistics' },
          ' should feel like infrastructure, not improvisation.',
        ],
      },
      {
        type: 'h2',
        text: 'What “local logistics” means here',
      },
      {
        type: 'ul',
        items: [
          'Shop-to-shop cartons during peak footfall',
          'Food ingredients and packed meals when lanes are tight',
          'Temple-corridor event inventory with strict time empathy',
        ],
      },
      {
        type: 'h2',
        text: 'Why on-demand booking matters',
      },
      {
        type: 'p',
        segments: [
          'Calling five drivers to find one available vehicle burns manager time. App-first flows—pickup, drop, and ',
          { text: 'vehicle class', href: '/services' },
          '—create an upfront estimate and a clear handoff, which is how you scale without hiring a full transport desk.',
        ],
      },
      {
        type: 'h2',
        text: 'Start a run',
      },
      {
        type: 'p',
        segments: [
          { text: 'Book Liftngo', href: '/book-delivery' },
          ' when you know today’s pickup and drop; same-day feasibility still depends on demand and lane.',
        ],
      },
    ],
  },
  {
    slug: 'b2b-logistics-noida-complete-guide-companies',
    title: 'B2B Logistics in Noida: A Complete Guide for Companies',
    description:
      'B2B logistics Noida: dedicated coordination, verified vendors, multi-vehicle programmes (2W–4W), and how corporates structure daily inventory movement in Delhi NCR.',
    excerpt:
      'Noida is not “just another pin code”—it is warehousing, electronics retail, and office parks. Here is a company-first framing.',
    keywords: [
      'b2b logistics noida',
      'logistics company delhi ncr',
      'corporate delivery solutions',
      'warehouse logistics Noida',
      'business goods transport',
    ],
    publishedAt: '2025-03-05',
    featured: true,
    featuredImage: imgTruck,
    featuredImageAlt: 'Commercial truck suited for B2B deliveries',
    relatedSlugs: rel(
      'liftngo-logistics-ecosystem-delhi-ncr',
      'why-businesses-need-dedicated-delivery-experts',
      'electronics-retailers-optimize-delivery',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'If you operate a warehouse-to-store or hub-to-branch rhythm in Uttar Pradesh’s industrial belt, ',
          { text: 'B2B logistics in Noida', href: '/noida-b2b-logistics' },
          ' is less about “cheapest per km” and more about predictable completions.',
        ],
      },
      {
        type: 'h2',
        text: 'Programme pieces that mature teams standardise',
      },
      {
        type: 'ul',
        items: [
          'Vehicle banding: when to use 2W vs 3W cargo vs 4W mini truck',
          'Time windows that respect dock labour, not only customer-facing SLAs',
          'Proof-of-handoff discipline for finance reconciliation',
        ],
      },
      {
        type: 'h2',
        text: 'Delhi NCR context',
      },
      {
        type: 'p',
        segments: [
          'Noida often pairs with Gurgaon/Delhi movements. A ',
          { text: 'logistics company Delhi NCR', href: '/noida-b2b-logistics' },
          ' should explain how it governs cross-city lanes—not only hyperlocal bursts.',
        ],
      },
      {
        type: 'h2',
        text: 'Next step',
      },
      {
        type: 'p',
        segments: [
          { text: 'Get started with Liftngo', href: '/book-delivery' },
          ' or message us with your lane pattern if you need programme-level coordination.',
        ],
      },
    ],
  },
  {
    slug: 'liftngo-logistics-ecosystem-delhi-ncr',
    title: 'How Liftngo is Building a Logistics Ecosystem in Delhi NCR',
    description:
      'Liftngo’s Delhi NCR strategy: verified partners, multi-vehicle booking, and B2B-first operations starting from Noida with deep local coverage.',
    excerpt:
      'Ecosystem means trust density, not a map pin everywhere. Here is how we are approaching the National Capital Region.',
    keywords: [
      'logistics company delhi ncr',
      'b2b logistics noida',
      'Liftngo Delhi NCR',
      'corporate delivery solutions',
      'verified logistics partners',
    ],
    publishedAt: '2025-02-28',
    featured: true,
    featuredImage: imgHub,
    featuredImageAlt: 'Intermodal logistics hub — corporate freight and scalable B2B movement',
    relatedSlugs: rel(
      'b2b-logistics-noida-complete-guide-companies',
      'why-businesses-need-dedicated-delivery-experts',
      'future-logistics-ev-ai-automation',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'We are explicit: Liftngo is not pitching infinite national coverage. In ',
          { text: 'Delhi NCR', href: '/noida-b2b-logistics' },
          ', we are assembling a curated partner mesh with product surfaces that enterprises actually audit—vehicle classes, estimates, and completion accountability.',
        ],
      },
      {
        type: 'h2',
        text: 'What “ecosystem” means in practice',
      },
      {
        type: 'ul',
        items: [
          'Partners vetted for commercial handoffs',
          'Repeat-route economics rather than one-off gig chasing',
          'Escalation paths when a receiving dock is late—not when a star rating is vague',
        ],
      },
      {
        type: 'h2',
        text: 'Hyperlocal vs B2B trunk',
      },
      {
        type: 'p',
        segments: [
          'We still care deeply about ',
          { text: 'Khatu Shyam Ji', href: '/khatu-shyam-logistics' },
          '-style density. The NCR playbook inherits the same obsession with handoff quality—just at a different scale and paperwork cadence.',
        ],
      },
    ],
  },
  {
    slug: 'why-businesses-need-dedicated-delivery-experts',
    title: 'Why Businesses Need Dedicated Delivery Experts',
    description:
      'Corporate delivery solutions fail when nobody owns the lane. Here is why dedicated delivery experts improve SLA adherence, vendor coherence, and cost visibility.',
    excerpt:
      '“Someone in ops will handle it” is not a logistics strategy—here is the upgrade.',
    keywords: [
      'corporate delivery solutions',
      'dedicated delivery manager',
      'B2B logistics',
      'logistics company delhi ncr',
      'delivery operations',
    ],
    publishedAt: '2025-02-20',
    featuredImage: imgWarehouse,
    featuredImageAlt: 'Warehouse interior — pallets, sorting, and B2B last-mile planning',
    relatedSlugs: rel(
      'b2b-logistics-noida-complete-guide-companies',
      'electronics-retailers-optimize-delivery',
      'last-mile-delivery-challenges-india',
    ),
    body: [
      {
        type: 'h2',
        text: 'The hidden cost of ad-hoc coordination',
      },
      {
        type: 'p',
        segments: [
          'When every store manager books drivers independently, finance sees noise: duplicate surges, unpaired returns, and no single throat to choke during a service failure.',
        ],
      },
      {
        type: 'h2',
        text: 'What a delivery expert actually does',
      },
      {
        type: 'ul',
        items: [
          'Standardises vehicle choice against payload bands',
          'Aligns time windows with docks and security checks',
          'Creates a single escalation owner when proof-of-delivery is disputed',
        ],
      },
      {
        type: 'h2',
        text: 'Liftngo positioning',
      },
      {
        type: 'p',
        segments: [
          'We instrument the booking surface so experts spend less time on phone tag. Start with ',
          { text: 'Noida / NCR B2B logistics', href: '/noida-b2b-logistics' },
          ' if your pattern is multi-site.',
        ],
      },
    ],
  },
  {
    slug: 'last-mile-delivery-challenges-india',
    title: 'Last-Mile Delivery Challenges in India',
    description:
      'Last-mile delivery in India: density, regulation, labour, and lane physics—what breaks, and how B2B shippers design around failure modes.',
    excerpt:
      'The final kilometre still eats margin. This article names the constraints honestly.',
    keywords: [
      'last mile delivery India',
      'last mile delivery optimization',
      'hyperlocal delivery service',
      'B2B logistics',
      'urban freight',
    ],
    publishedAt: '2025-02-12',
    featuredImage: imgRider,
    featuredImageAlt: 'Delivery professional with equipment — goods and meal logistics, not passenger transport',
    relatedSlugs: rel(
      'electronics-retailers-optimize-delivery',
      'future-logistics-ev-ai-automation',
      'how-logistics-works-khatu-shyam-ji-local-businesses',
    ),
    body: [
      {
        type: 'h2',
        text: 'Structural pressures',
      },
      {
        type: 'ul',
        items: [
          'Low drop sizes vs trunk haul',
          'Parking and loading illegibility at retail kerbs',
          'Peak-hour volatility that breaks naive routing',
        ],
      },
      {
        type: 'h2',
        text: 'B2B vs consumer gloss',
      },
      {
        type: 'p',
        segments: [
          'Food delivery metrics do not translate to appliance cartons. If you move inventory for ',
          { text: 'electronics or retail', href: '/noida-b2b-logistics' },
          ', your last mile KPI is successful handoff with paperwork sanity.',
        ],
      },
      {
        type: 'h2',
        text: 'Actionable takeaway',
      },
      {
        type: 'p',
        segments: [
          'Right-size vehicles, publish internal SLAs, and ',
          { text: 'book with transparent estimates', href: '/book-delivery' },
          '.',
        ],
      },
    ],
  },
  {
    slug: 'electronics-retailers-optimize-delivery',
    title: 'How Electronics Retailers Can Optimize Delivery',
    description:
      'From Vijay Sales-style stores to multi-brand outlets: how electronics retailers optimise delivery with scheduling, 3W/4W choice, and service-level governance.',
    excerpt:
      'Large boxes, nervous customers, and strict finance audits—electronics needs different last mile DNA.',
    keywords: [
      'electronics retail delivery',
      'appliance delivery logistics',
      'b2b logistics noida',
      'store to customer delivery',
      'last mile delivery optimization',
    ],
    publishedAt: '2025-02-01',
    featuredImage: imgTruck,
    featuredImageAlt: 'Delivery truck in urban setting',
    relatedSlugs: rel(
      'why-businesses-need-dedicated-delivery-experts',
      'b2b-logistics-noida-complete-guide-companies',
      'last-mile-delivery-challenges-india',
    ),
    body: [
      {
        type: 'h2',
        text: 'Why electronics breaks consumer-style networks',
      },
      {
        type: 'p',
        segments: [
          'Two-wheelers rarely suffice; three- and four-wheel cargo dominates. Routing must respect installation windows, not only promise 10-minute miracles.',
        ],
      },
      {
        type: 'h2',
        text: 'Optimisation levers',
      },
      {
        type: 'ul',
        items: [
          'Slot discipline at the warehouse gate',
          'Damage prevention SOPs—straps, orientation, handoff photos',
          'Clear escalation when customer reschedules after dispatch',
        ],
      },
      {
        type: 'h2',
        text: 'Liftngo in NCR',
      },
      {
        type: 'p',
        segments: [
          { text: 'Corporate delivery in Delhi NCR', href: '/noida-b2b-logistics' },
          ' benefits when vehicle menus and estimates are explicit before dispatch.',
        ],
      },
    ],
  },
  {
    slug: 'hyperlocal-logistics-temple-towns',
    title: 'Hyperlocal Logistics in Temple Towns',
    description:
      'Temple towns like Khatu Shyam Ji combine pilgrimage peaks, narrow lanes, and intense retail—hyperlocal logistics must respect footfall physics and trust networks.',
    excerpt:
      'Density without discipline becomes chaos during festivals. Here is a sober playbook.',
    keywords: [
      'hyperlocal logistics',
      'temple town logistics',
      'logistics in khatu shyam ji',
      'pilgrimage corridor supply chain',
      'local goods transport',
    ],
    publishedAt: '2025-01-22',
    featuredImage: imgMarket,
    featuredImageAlt: 'Retail market goods — temple-town and small-corridor vendor logistics',
    relatedSlugs: rel(
      'how-logistics-works-khatu-shyam-ji-local-businesses',
      'last-mile-delivery-challenges-india',
      'future-logistics-ev-ai-automation',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'In ',
          { text: 'Khatu Shyam Ji', href: '/khatu-shyam-logistics' },
          ', your “competition” is often reputation: did the stock arrive before the evening rush? Hyperlocal logistics wins when repeat routes are boringly reliable.',
        ],
      },
      {
        type: 'h2',
        text: 'Peak design',
      },
      {
        type: 'p',
        segments: [
          'Pre-book capacity for predictable festivals. Surge-only psychology punishes vendors who cannot hedge inventory.',
        ],
      },
      {
        type: 'h2',
        text: 'Vehicle realism',
      },
      {
        type: 'p',
        segments: [
          'Compact ',
          { text: 'three-wheel cargo', href: '/services/3-wheeler' },
          ' frequently beats oversized trucks near pedestrian cores—if payloads allow.',
        ],
      },
    ],
  },
  {
    slug: 'future-logistics-ev-ai-automation',
    title: 'Future of Logistics: EV + AI + Automation',
    description:
      'How EV cargo, forecasting models, and automation reshape Indian logistics—without pretending software alone fixes loading-dock reality.',
    excerpt:
      'The future is hybrid: electric short haul, smarter dispatch assists, and humans who still own exception handling.',
    keywords: [
      'EV cargo delivery',
      'logistics automation India',
      'AI dispatch logistics',
      'future of logistics',
      'sustainable freight',
    ],
    publishedAt: '2025-01-10',
    featuredImage: imgWarehouse,
    featuredImageAlt: 'Modern warehouse operations — EV, automation, and B2B logistics systems',
    relatedSlugs: rel(
      'liftngo-logistics-ecosystem-delhi-ncr',
      'last-mile-delivery-challenges-india',
      'electronics-retailers-optimize-delivery',
    ),
    body: [
      {
        type: 'h2',
        text: 'EV where the lane agrees',
      },
      {
        type: 'p',
        segments: [
          'Electric three-wheel cargo shines on short, dense loops. Liftngo ',
          { text: 'still mixes powertrains', href: '/about/electric-three-wheel-cargo' },
          ' when distance or charging access disagrees.',
        ],
      },
      {
        type: 'h2',
        text: 'AI as assistant, not oracle',
      },
      {
        type: 'p',
        segments: [
          'Demand forecasts and ETA assists help—but docks run late, addresses mismatch, and customers change minds. Automation should reduce coordinator toil, not erase accountability.',
        ],
      },
      {
        type: 'h2',
        text: 'Operational truth',
      },
      {
        type: 'p',
        segments: [
          'Whether in ',
          { text: 'Noida B2B', href: '/noida-b2b-logistics' },
          ' or ',
          { text: 'Khatu hyperlocal', href: '/khatu-shyam-logistics' },
          ', the winning stack pairs software with partner trust density.',
        ],
      },
    ],
  },
  {
    slug: 'ev-cargo-cost-per-km-india-2024',
    title: 'EV Cargo Fleet Cost per km in India: A 2024–2026 Primer',
    description:
      'How to think about electric three- and four-wheel cargo cost per kilometre in India: tariffs, duty cycles, incentives, charging, and when diesel or CNG still wins on unit economics.',
    excerpt:
      'Headline “₹/km” numbers go viral; sensible ops teams model load factor, depot charging, and lane length before they standardise on EV.',
    keywords: [
      'EV cargo cost per km India',
      'electric three wheeler logistics',
      'FAME subsidy commercial vehicle',
      'intra city EV freight',
      'cargo EV TCO',
    ],
    publishedAt: '2026-03-28',
    featured: true,
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgWarehouse,
    featuredImageAlt: 'Warehouse and cargo bay — planning EV and mixed fleet cost per kilometre',
    relatedSlugs: rel(
      'future-logistics-ev-ai-automation',
      'hyperlocal-b2b-logistics-noida-manufacturing-hub',
      'b2b-managed-fleet-vs-on-demand-truck-apps-india',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'Government pushes for cleaner commercial mobility and refreshed subsidy frameworks get headlines—but your fleet manager still needs a spreadsheet that survives Diwali week. Cost per kilometre for ',
          { text: 'EV cargo', href: '/about/electric-three-wheel-cargo' },
          ' is not one national number; it is a function of route length, average speed, payload utilisation, electricity tariff at the depot or swap point, finance rate, and how honestly you amortise battery replacement.',
        ],
      },
      {
        type: 'h2',
        text: 'What belongs in a ₹/km model',
      },
      {
        type: 'ul',
        items: [
          'Capital: vehicle, battery (owned vs leased), insurance, and subsidy timing if applicable',
          'Energy: blended ₹/kWh—night depot charging vs public DC premiums on odd days',
          'Labour and downtime: driver shifts, queueing at slow gates, and missed slots that burn shift hours',
          'Maintenance: tyres, brakes, and electrical systems—usually lower than ICE but not zero',
        ],
      },
      {
        type: 'h2',
        text: 'Why short loops favour electric cargo',
      },
      {
        type: 'p',
        segments: [
          'Dense intra-city shuttles—where a three-wheel cargo cage makes dozens of stops below twenty-five kilometres total—recover batteries overnight and avoid range anxiety. Stretch the same vehicle into unpredictable long radial trips without charging visibility, and your “cheap EV” story collapses into tow-truck anecdotes.',
        ],
      },
      {
        type: 'h2',
        text: 'Mixed fleet is still the adult default',
      },
      {
        type: 'p',
        segments: [
          'Platforms that book ',
          { text: '2W through 4W goods legs', href: '/services' },
          ' should label powertrain transparently. The operational win is matching payload and corridor to the right asset—not painting every pin code green.',
        ],
      },
      {
        type: 'h2',
        text: 'Takeaway for shippers',
      },
      {
        type: 'p',
        segments: [
          'Ask for an all-in estimate per trip, not influencer-grade ₹/km. If you run ',
          { text: 'B2B lanes in NCR', href: '/noida-b2b-logistics' },
          ', pilot one repeatable route, log actual kWh and minutes at load, then decide whether EV stays primary or becomes the daylight inner loop only.',
        ],
      },
    ],
  },
  {
    slug: 'hyperlocal-b2b-logistics-noida-manufacturing-hub',
    title: 'Hyperlocal B2B Logistics for the Noida Manufacturing & Industrial Belt',
    description:
      'How Greater Noida and Noida’s electronics, components, and light manufacturing clusters use hyperlocal B2B logistics: milk runs, vendor parks, and why consumer-style metrics fail plant gates.',
    excerpt:
      'The “manufacturing hub” is not one address—it is a mesh of ECNs, supplier rows, and third-party kitting rooms that need predictable sixty-minute windows.',
    keywords: [
      'B2B logistics Noida',
      'Greater Noida manufacturing logistics',
      'hyperlocal industrial delivery',
      'vendor park milk run India',
      'Delhi NCR factory supply chain',
    ],
    publishedAt: '2026-03-25',
    featured: true,
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgHub,
    featuredImageAlt: 'Industrial logistics hub — crates and dispatch for Noida manufacturing corridors',
    relatedSlugs: rel(
      'b2b-logistics-noida-complete-guide-companies',
      'gst-compliant-delivery-small-manufacturers-india',
      'ev-cargo-cost-per-km-india-2024',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'Noida and Greater Noida grew as a deliberate corridor: housing, offices, and industrial blocks within awkward distances of each other. For ops teams, that creates ',
          { text: 'hyperlocal B2B logistics', href: '/b2b-transport' },
          '—not interstate trunk haul, but the unglamorous shuttles that keep SMT lines and retail DCs from idling.',
        ],
      },
      {
        type: 'h2',
        text: 'What “hyperlocal” means past the mall',
      },
      {
        type: 'p',
        segments: [
          'Hyperlocal here is eight to twenty-five kilometre legs between supplier parks, contract manufacturers, and brand-owned rework centres. The constraint is gate time, not influencer delivery speed. If security holds your three-wheeler for twenty minutes, every downstream ETA rotates.',
        ],
      },
      {
        type: 'h2',
        text: 'Pillar content for your cluster',
      },
      {
        type: 'ul',
        items: [
          'Map the top twenty recurring origin–destination pairs; optimise vehicle class per lane, not per brand slogan',
          'Split emergency “line down” trips from scheduled milk runs so pricing stays honest',
          'Document handoff: carton photos, seal state, and receiver OTP discipline—finance audits care',
        ],
      },
      {
        type: 'h2',
        text: 'Why platform booking helps',
      },
      {
        type: 'p',
        segments: [
          'Calling a favourite tempo uncle works until he is double-booked during component shortages. App-first booking with ',
          { text: 'upfront estimates', href: '/book-delivery' },
          ' creates a paper trail and lets you compare two-wheel document sprints against ',
          { text: 'four-wheel mini truck', href: '/services/4-wheeler' },
          ' deck space without guilt.',
        ],
      },
      {
        type: 'h2',
        text: 'Linking to wider NCR playbooks',
      },
      {
        type: 'p',
        segments: [
          'Pair this note with our ',
          { text: 'Delhi NCR ecosystem overview', href: '/blog/liftngo-logistics-ecosystem-delhi-ncr' },
          ' and the dedicated ',
          { text: 'Noida corporate delivery landing', href: '/noida-b2b-logistics' },
          ' when you brief management.',
        ],
      },
    ],
  },
  {
    slug: 'khatu-shyam-ji-pilgrimage-logistics-management',
    title: 'Khatu Shyam Ji Pilgrimage Logistics: Managing Peaks Without Breaking Stock',
    description:
      'Practical pilgrimage logistics for Khatu Shyam Ji: crowd surges, corridor vendors, prasad and kitchen supply, and how temple-town businesses coordinate goods movement with Liftngo-style cargo booking.',
    excerpt:
      'Darshan peaks are predictable; chaos happens when restock and waste removal still run on phone tag.',
    keywords: [
      'Khatu Shyam Ji logistics',
      'pilgrimage logistics India',
      'temple town supply chain',
      'festival delivery management',
      'Khatu goods transport',
    ],
    publishedAt: '2026-03-22',
    featured: true,
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgMarket,
    featuredImageAlt: 'Busy market and temple-town retail — pilgrimage peak logistics',
    relatedSlugs: rel(
      'how-logistics-works-khatu-shyam-ji-local-businesses',
      'hyperlocal-logistics-temple-towns',
      'gst-compliant-delivery-small-manufacturers-india',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'High-traffic pilgrimage nodes combine devotion, retail density, and narrow physical corridors. ',
          { text: 'Khatu Shyam Ji', href: '/khatu-shyam-logistics' },
          ' is exactly that pattern: multipliers of daily footfall on event days, informal parking competition, and vendors who still have to boil milk and fry snacks on schedule.',
        ],
      },
      {
        type: 'h2',
        text: 'Inventory rhythm vs crowd rhythm',
      },
      {
        type: 'p',
        segments: [
          'Pilgrimage logistics management is synchronising stock arrivals with crowd ingress, not bragging about nationwide coverage. Win early-morning restocks before processions tighten lanes; schedule ice, oil, and perishables in shorter batches rather than one heroic truck that cannot turn.',
        ],
      },
      {
        type: 'h2',
        text: 'Waste and reverse legs matter',
      },
      {
        type: 'ul',
        items: [
          'Empty crates, spoiled batches, and linen returns need slots too—treat reverse logistics as capacity, not an afterthought',
          'Coordinate handoffs at named landmarks drivers can find without shouting on the phone',
          'Keep photos of load condition when disputes spike during rush',
        ],
      },
      {
        type: 'h2',
        text: 'Using structured booking during peaks',
      },
      {
        type: 'p',
        segments: [
          'When verbal promises fail, ',
          { text: 'goods transport booked with clear vehicle class', href: '/khatu-goods-transport' },
          ' survives the evening better than “someone will send a bike.” Same-day feasibility still depends on live demand—plan buffer for the lanes you already know choke.',
        ],
      },
      {
        type: 'h2',
        text: 'Partner with local realism',
      },
      {
        type: 'p',
        segments: [
          'Drivers who understand mandir-adjacent psychology outperform optimisers trained only on highway ETAs. ',
          { text: 'Food partners and shops', href: '/find-restaurant' },
          ' benefit when kitchens and riders share one consistent thread: confirmed pickup and honest delays.',
        ],
      },
    ],
  },
  {
    slug: 'gst-compliant-delivery-small-manufacturers-india',
    title: 'GST-Compliant Delivery for Small Manufacturers in India',
    description:
      'What small factories and job shops should demand from delivery partners: tax invoices, matching HSN discipline, e-way nuance on short legs, and record-keeping that survives a desk audit.',
    excerpt:
      'Consumer couriers optimise for speed and app ratings; manufacturer books optimise for traceability.',
    keywords: [
      'GST compliant logistics',
      'small manufacturer delivery India',
      'tax invoice logistics',
      'e way bill short haul',
      'B2B delivery documentation',
    ],
    publishedAt: '2026-03-18',
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgCargoBay,
    featuredImageAlt: 'Loading bay with cartons — GST documentation and B2B delivery compliance',
    relatedSlugs: rel(
      'b2b-logistics-noida-complete-guide-companies',
      'hyperlocal-b2b-logistics-noida-manufacturing-hub',
      'b2b-managed-fleet-vs-on-demand-truck-apps-india',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'Small manufacturers—tool rooms, cable harness shops, injection moulders feeding larger OEMs—move goods daily but lack in-house fleet desks. The risk is not only late delivery; it is a GST and documentation mismatch between what finance booked and what actually crossed the gate.',
        ],
      },
      {
        type: 'p',
        segments: [
          'Formal ',
          { text: 'B2B transport playbooks', href: '/b2b-transport' },
          ' reduce that gap when invoices, challans, and proofs follow one pattern.',
        ],
      },
      {
        type: 'h2',
        text: 'Minimum viable compliance checklist',
      },
      {
        type: 'ul',
        items: [
          'Tax invoice or delivery challan patterns agreed with your CA for recurring lanes',
          'Clear ship-to and bill-to when drops go via job workers or third-party storerooms',
          'Receiver acknowledgement—OTP, stamp, or signed mobile photo policy—published internally',
        ],
      },
      {
        type: 'h2',
        text: 'E-way thinking on short hops',
      },
      {
        type: 'p',
        segments: [
          'Not every hyperlocal hop triggers the same documentation drama as interstate trunk—but assumptions bite. Train store managers to escalate edge cases before the vehicle leaves, not after customer WhatsApp groups litigate.',
        ],
      },
      {
        type: 'h2',
        text: 'How platforms can help without magical promises',
      },
      {
        type: 'p',
        segments: [
          'Choose partners who separate ',
          { text: 'ad-hoc spot trips', href: '/book-delivery' },
          ' from retainer-style B2B when you need monthly statements. If someone only offers selfie proofs and no formal billing path, they are solving a different customer than a fifty-lakh turnover factory.',
        ],
      },
      {
        type: 'h2',
        text: 'Scale-up path',
      },
      {
        type: 'p',
        segments: [
          'Start with one export-heavy lane where documentation fights already hurt you. Stabilise timing, paperwork, and escalation contacts; only then expand SKU breadth. ',
          { text: 'Delhi NCR B2B lanes', href: '/noida-b2b-logistics' },
          ' reward this discipline because finance and operations sit in the same building more often than in remote cottage clusters.',
        ],
      },
    ],
  },
  {
    slug: 'last-mile-delivery-solutions-electronics-retailers-india',
    title: 'Last Mile Delivery Solutions for Electronics Retailers in India',
    description:
      'Fragility, high ticket size, and installation expectations reshape last mile for electronics retail: scheduling, vehicle choice, damage SOPs, and coordination with finance for deliveries across India’s metros and tier-two cities.',
    excerpt:
      'The right last mile is not the fastest bike—it is the trip where the TV arrives square and the invoice matches the cart.',
    keywords: [
      'electronics retail last mile',
      'appliance delivery India',
      'fragile goods logistics',
      'scheduled delivery retail',
      'electronics store logistics',
    ],
    publishedAt: '2026-03-12',
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgRider,
    featuredImageAlt: 'Delivery rider with packaged goods — careful handling for electronics retail',
    relatedSlugs: rel(
      'electronics-retailers-optimize-delivery',
      'last-mile-delivery-challenges-india',
      'hyperlocal-b2b-logistics-noida-manufacturing-hub',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'Consumer electronics and large appliances punish sloppy last mile: vibration cracks screens, torque strips mounts, and customers remember the scratch more than the discount. This guide complements our earlier ',
          { text: 'electronics retailer optimisation note', href: '/blog/electronics-retailers-optimize-delivery' },
          ' with a solutions lens for 2026 store operations.',
        ],
      },
      {
        type: 'h2',
        text: 'Solution stack: scheduling first',
      },
      {
        type: 'p',
        segments: [
          'Slot discipline beats heroic same-hour narratives. Warehouse cut-off rules, route batching by pin, and honest buffers at stairwell buildings reduce re-dispatch—your silent margin killer.',
        ],
      },
      {
        type: 'h2',
        text: 'Vehicle menu realism',
      },
      {
        type: 'ul',
        items: [
          'Two-wheeler: documents, accessories, and tightly boxed SKUs under safe weight limits',
          'Three-wheel cargo: mid-size cartons when weather and vibration risk stay controlled',
          'Mini truck: cubic volume or strap-down needs; see Liftngo service pages for booking',
        ],
      },
      {
        type: 'p',
        segments: [
          'Match the menu to payload: ',
          { text: '2W', href: '/services/2-wheeler' },
          ', ',
          { text: '3W cargo', href: '/services/3-wheeler' },
          ', ',
          { text: '4W mini truck', href: '/services/4-wheeler' },
          '.',
        ],
      },
      {
        type: 'h2',
        text: 'Damage governance customers feel',
      },
      {
        type: 'p',
        segments: [
          'Train partners on orientation language—“this side up” is useless if the cage rotated loading. Photo at pickup, photo at threshold, and a clear hotline for escalation beat apology credits alone.',
        ],
      },
      {
        type: 'h2',
        text: 'Metro vs tier-two nuance',
      },
      {
        type: 'p',
        segments: [
          'In NCR you fight parking bylaws; in smaller cities you fight address imprecision. Last mile solutions should map ',
          { text: 'local B2B coordinators', href: '/noida-b2b-logistics' },
          ' who understand both—not generic national scripts.',
        ],
      },
    ],
  },
  {
    slug: 'b2b-managed-fleet-vs-on-demand-truck-apps-india',
    title: 'B2B Managed Fleet vs On-Demand Truck Apps: Choosing the Right Layer in India',
    description:
      'When widely used consumer-oriented truck-hailing apps are enough—and when manufacturers and distributors need managed B2B coordination, SLAs, and lane memory instead of one-off spot loads.',
    excerpt:
      'Spot-booking platforms solve urgency; recurring B2B solves trust density. The mistake is expecting one product philosophy to do both.',
    keywords: [
      'B2B managed logistics India',
      'on demand truck booking comparison',
      'corporate fleet vs spot cargo',
      'recurring lane logistics',
      'manufacturer delivery coordination',
    ],
    publishedAt: '2026-03-08',
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgTruck,
    featuredImageAlt: 'Goods truck — B2B managed coordination versus ad hoc on-demand booking',
    relatedSlugs: rel(
      'why-businesses-need-dedicated-delivery-experts',
      'b2b-logistics-noida-complete-guide-companies',
      'gst-compliant-delivery-small-manufacturers-india',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'India’s on-demand logistics layer reshaped how individuals book small trucks for house moves and urgent parcels. Those consumer-grade experiences—fast taps, visible maps, and casual payout rules—are brilliant for ',
          { text: 'spot demand', href: '/book-delivery' },
          '. They are often the wrong mental model when your plant manager measures “line stopped minutes” and your CFO measures invoice reconciliation.',
        ],
      },
      {
        type: 'h2',
        text: 'What consumer-style apps optimise for',
      },
      {
        type: 'ul',
        items: [
          'Single-trip liquidity: matching the next available asset to the next hungry fare',
          'Low-friction signup for occasional shippers without procurement committees',
          'Speed narratives tuned to individual senders, not weekly milk-run repeatability',
        ],
      },
      {
        type: 'h2',
        text: 'What B2B managed coordination adds',
      },
      {
        type: 'ul',
        items: [
          'Named escalation paths when a customs-cleared component misses a dock window',
          'Documentation hygiene—GST lines, challan patterns, receiver proofs—that internal audit can trace',
          'Vehicle class discipline so a two-wheeler is never “good enough” when the payload is a CNC spindle',
        ],
      },
      {
        type: 'h2',
        text: 'Hybrid reality: neither religion is complete',
      },
      {
        type: 'p',
        segments: [
          'Mature ops teams stitch both: app-backed booking for transparency with human coordination for exceptions. If a vendor promises nationwide homogeneity with zero footnotes, keep your incumbent brokers on speed dial a little longer.',
        ],
      },
      {
        type: 'h2',
        text: 'Where Liftngo biases without naming rivals',
      },
      {
        type: 'p',
        segments: [
          'We are deliberately ',
          { text: 'goods-first', href: '/b2b-transport' },
          ': dense work in ',
          { text: 'Khatu Shyam Ji', href: '/khatu-shyam-logistics' },
          ' and structured ',
          { text: 'Noida / Delhi NCR B2B', href: '/noida-b2b-logistics' },
          ' rather than pretending every pin code behaves like a metro sprint. Evaluate any alternative the same way: does it deepen trust on your heaviest lanes, or only win the cheapest quoted trip?',
        ],
      },
    ],
  },
  {
    slug: 'b2b-delivery-noida',
    title: 'B2B Delivery in Noida: How Wholesale and Retail Teams Book Reliable Legs',
    description:
      'Practical guide to B2B delivery in Noida and Delhi NCR: dock windows, vehicle classes (2W–4W), GST rhythm, and why repeat lanes beat one-off surge pricing for goods transport.',
    excerpt:
      'Noida is not “just Delhi adjacent”—it is vendor parks, electronics retail, and office towers that punish vague dispatch.',
    keywords: [
      'B2B delivery Noida',
      'goods transport Noida',
      'Delhi NCR logistics',
      'wholesale delivery Noida',
      'commercial mini truck booking',
    ],
    publishedAt: '2026-04-02',
    featured: true,
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgHub,
    featuredImageAlt: 'Industrial and logistics hub — B2B delivery context for Noida',
    relatedSlugs: rel(
      'delivery-cost-noida',
      'b2b-logistics-noida-complete-guide-companies',
      'hyperlocal-b2b-logistics-noida-manufacturing-hub',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'If your ops team wakes up in ',
          { text: 'Noida', href: '/noida-b2b-logistics' },
          ', you already know the problem: not interstate mystery, but the twenty-kilometre shuttle that misses a dock window and costs you a retail shelf. ',
          { text: 'B2B delivery in Noida', href: '/b2b-transport' },
          ' succeeds when vehicle class, paperwork, and recurring lane memory line up—exactly where consumer-style “fastest bike” marketplaces fail.',
        ],
      },
      {
        type: 'h2',
        text: 'What B2B means on the ground in Sector belts and expressway-adjacent parks',
      },
      {
        type: 'p',
        segments: [
          'Wholesalers moving cartons between supplier rows and retail back rooms care about strap points, not star ratings. Electronics retailers care about damage photos. Offices moving sealed documents care about chain-of-custody language. The ',
          { text: 'delivery service', href: '/book-delivery' },
          ' layer has to speak freight, not commuter slang.',
        ],
      },
      {
        type: 'ul',
        items: [
          'Segment emergency “line-down” trips from Tuesday-morning milk runs so finance sees honest surcharges.',
          'Publish internal SLAs: fifteen-minute docking tolerance, receiver OTP, photo-at-threshold—whatever your audit actually checks.',
          'Right-size vehicles: 2W for inter-campus documents, 3W cargo for cartons, 4W when pallet mock-ups exceed safe 3W stacks.',
        ],
      },
      {
        type: 'h2',
        text: 'Delhi NCR context: why “Noida only” is the wrong lens',
      },
      {
        type: 'p',
        segments: [
          'Drivers cross ',
          { text: 'Delhi NCR', href: '/blog/liftngo-logistics-ecosystem-delhi-ncr' },
          ' borders even when your ERP says “Noida.” Factor toll behaviour, odd-even memory, and festival routing into corridor playbooks—then freeze a pilot lane before you debate pan-NCR “coverage.”',
        ],
      },
      {
        type: 'h2',
        text: 'GST, challans, and why finance joins the stand-up',
      },
      {
        type: 'p',
        segments: [
          'Small manufacturers and distributors cannot live in “we will fix the invoice later” territory. Ask whether your ',
          { text: 'goods transport partner', href: '/gst-compliant-delivery-small-manufacturers-india' },
          ' separates spot trips from retainer lanes, and whether receiver proofs map to your ERP line items.',
        ],
      },
      {
        type: 'h3',
        text: 'Pilot checklist (four weeks)',
      },
      {
        type: 'ul',
        items: [
          'Pick one origin cluster and ≤3 drops with stable gate contacts.',
          'Log minutes-at-gate; if security adds twelve minutes, your template ETA must swallow that.',
          'Rotate vehicle class deliberately twice to learn breakage rates, not randomly to chase cheapest fare.',
          'Review finance match weekly—GST drift is cheaper to fix in week two than month four.',
        ],
      },
      {
        type: 'h2',
        text: 'When leadership asks for “visibility”',
      },
      {
        type: 'p',
        segments: [
          'Visibility without timestamps is theatre. Export trip start, gate-in, handoff, and exception notes weekly. If your ',
          { text: 'B2B transport partner', href: '/b2b-transport' },
          ' cannot give that skeleton, you are buying anecdotes—not operations.',
        ],
      },
      {
        type: 'h2',
        text: 'Linking back to what Liftngo ships today',
      },
      {
        type: 'p',
        segments: [
          'Book walk through ',
          { text: 'four-wheel mini truck', href: '/services' },
          ' modes when lanes allow; read ',
          { text: 'hyperlocal B2B manufacturing notes', href: '/blog/hyperlocal-b2b-logistics-noida-manufacturing-hub' },
          ' if you feed plants around Greater Noida. When pricing anxiety dominates, pair this article with ',
          { text: 'delivery cost dynamics in Noida', href: '/blog/delivery-cost-noida' },
          ' before you negotiate with leadership.',
        ],
      },
      {
        type: 'p',
        segments: [
          'Driver partners evaluating dense programmes should skim ',
          { text: 'Become a driver', href: '/become-driver' },
          '—cargo-first incentives matter more here than in passenger networks.',
        ],
      },
    ],
  },
  {
    slug: 'logistics-khatu-shyam',
    title: 'Logistics in Khatu Shyam Ji: Pilgrimage Peaks, Lanes, and Goods-First Delivery',
    description:
      'Long-form look at logistics in Khatu Shyam Ji: temple-town congestion, restaurant supply, vendor restocks, vehicle choice (2W–4W), and how hyperlocal goods transport differs from highway freight.',
    excerpt:
      'Footfall multiplies faster than phone books—structured booking wins when verbal promises collapse.',
    keywords: [
      'Khatu Shyam Ji logistics',
      'temple town delivery',
      'hyperlocal goods transport Rajasthan',
      'Khatu delivery service',
    ],
    publishedAt: '2026-04-05',
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgMarket,
    featuredImageAlt: 'Market street India — Khatu Shyam Ji corridor logistics',
    relatedSlugs: rel(
      'how-logistics-works-khatu-shyam-ji-local-businesses',
      'khatu-shyam-ji-pilgrimage-logistics-management',
      'delivery-cost-noida',
    ),
    body: [
      {
        type: 'p',
        segments: [
          { text: 'Khatu Shyam Ji', href: '/khatu-shyam-logistics' },
          ' compresses devotion, retail, and kitchen supply into corridors that were never designed for simultaneous procession and carton drops. Logistics here is not “same as Jaipur but smaller”—it is scheduling empathy: knowing when the lane dies, when ice melts, and when a compact ',
          { text: 'three-wheel cargo', href: '/services/3-wheeler' },
          ' beats pretending a full van can turn.',
        ],
      },
      {
        type: 'h2',
        text: 'Inventory rhythm versus crowd rhythm',
      },
      {
        type: 'p',
        segments: [
          'Shops that win restock before peak footfall; kitchens that prep in waves; guest houses that launder linens on quiet mornings. ',
          { text: 'Goods transport', href: '/khatu-goods-transport' },
          ' fails when you optimistically batch everything into one heroic afternoon run. Split perishables, documents, and bulky stock so each booking matches a realistic vehicle.',
        ],
      },
      {
        type: 'h2',
        text: 'Vehicle menu without passenger confusion',
      },
      {
        type: 'ul',
        items: [
          'Walk and 2W: documents, light food bags, samples—when the last hundred metres are faster on foot.',
          '3W cargo: cartons, crates, midsize vendor loads—EV or ICE depending on lane, not marketing.',
          '4W mini truck: when strap rails and height beat playing Tetris on a three-wheel deck.',
        ],
      },
      {
        type: 'h2',
        text: 'Food partners, WhatsApp, and structured handoffs',
      },
      {
        type: 'p',
        segments: [
          'Kitchens confirm tweaks on WhatsApp; riders still need structured pickup metadata. Browse ',
          { text: 'partner restaurants', href: '/find-restaurant' },
          ', then book ',
          { text: 'delivery service', href: '/book-delivery' },
          ' so cargo incentives—not ride-hail games—own the trip.',
        ],
      },
      {
        type: 'h2',
        text: 'When to read B2B NCR context in parallel',
      },
      {
        type: 'p',
        segments: [
          'Temple-town operators sometimes supply Mumbai-facing relatives operating in ',
          { text: 'Noida', href: '/noida-b2b-logistics' },
          '. If your finance team lives in Delhi NCR while ops stay in Khatu, align vocabulary: proof-of-delivery in one ledger, ',
          { text: 'B2B logistics India', href: '/b2b-transport' },
          ' expectations in another.',
        ],
      },
      {
        type: 'h2',
        text: 'Reverse logistics and waste legs',
      },
      {
        type: 'p',
        segments: [
          'Empty crates, spoiled batches, and linen returns need slots too. Treat reverse legs as capacity in your ',
          { text: 'booking flow', href: '/book-delivery' },
          ', not as favours—drivers plan round-trips when they trust the dispatcher.',
        ],
      },
      {
        type: 'h2',
        text: 'Action list before the next peak',
      },
      {
        type: 'ul',
        items: [
          'Map three recurring lanes with named landmarks drivers can find without shouting.',
          'Photograph load condition on first week of each festival season—disputes spike when everyone is tired.',
          'Keep a fallback vehicle class documented when rain or processions invalidate your default choice.',
        ],
      },
      {
        type: 'p',
        segments: [
          'For pilgrimage-specific playbooks see ',
          { text: 'pilgrimage logistics management', href: '/blog/khatu-shyam-ji-pilgrimage-logistics-management' },
          '—it complements this corridor overview.',
        ],
      },
    ],
  },
  {
    slug: 'delivery-cost-noida',
    title: 'Delivery Cost in Noida: What Moves B2B and Retail Estimates (Delhi NCR)',
    description:
      'Transparent guide to delivery cost drivers in Noida and Delhi NCR: distance, vehicle class, gate time, demand surges, and how to compare quotes without getting burned.',
    excerpt:
      'Cheap trips that miss docks are the most expensive line item on your P&L.',
    keywords: [
      'delivery cost Noida',
      'goods transport pricing Delhi NCR',
      'B2B delivery rates',
      'mini truck fare India',
    ],
    publishedAt: '2026-04-08',
    author: { name: 'Liftngo Editorial' },
    featuredImage: imgTruck,
    featuredImageAlt: 'Commercial delivery truck — cost drivers for Noida corridors',
    relatedSlugs: rel(
      'b2b-delivery-noida',
      'b2b-logistics-noida-complete-guide-companies',
      'last-mile-delivery-challenges-india',
    ),
    body: [
      {
        type: 'p',
        segments: [
          'Talking about ',
          { text: 'delivery cost in Noida', href: '/book-delivery' },
          ' without naming vehicle class is how spreadsheets lie. A four-wheel mini truck quote that ignores your thirty-minute dock queue is “cheap” until overtime, returns, and apology credits arrive.',
        ],
      },
      {
        type: 'h2',
        text: 'Core drivers everyone should publish internally',
      },
      {
        type: 'ul',
        items: [
          'Lane distance and realistic speed—not open-road fantasy maps.',
          'Vehicle class minimum: 2W documents vs 3W cartons vs 4W pallets.',
          'Waiting at origin and destination—especially retail kerbs and industrial estates.',
          'Demand spikes during month-end, rain, and local event compression.',
        ],
      },
      {
        type: 'h2',
        text: 'Delhi NCR is one labour market, many toll behaviours',
      },
      {
        type: 'p',
        segments: [
          'Trips starting in ',
          { text: 'Noida', href: '/noida-b2b-logistics' },
          ' may still traverse Delhi loops. If your procurement compares vendors on headline rupees only, rotate the same lane for two weeks with timestamped gate logs—you will learn who bakes reality into estimates.',
        ],
      },
      {
        type: 'h2',
        text: 'How Khatu benchmarking differs',
      },
      {
        type: 'p',
        segments: [
          'Hyperlocal ',
          { text: 'Khatu Shyam Ji', href: '/khatu-shyam-logistics' },
          ' pricing encodes crowd risk, not highway tariffs. If you import NCR spreadsheets into temple-town ops without adjusting, you will misread margin.',
        ],
      },
      {
        type: 'h2',
        text: 'Negotiation frames that protect ops',
      },
      {
        type: 'ul',
        items: [
          'Ask for all-in pilot pricing on a fixed lane before debating national mandates.',
          'Separate surge policy for festivals versus ordinary Tuesdays.',
          'Require photo or OTP proof standards before finance signs retainer addenda.',
        ],
      },
      {
        type: 'h2',
        text: 'Benchmarking EV and conventional cargo fairly',
      },
      {
        type: 'p',
        segments: [
          'Electric three-wheel cargo can win on short loops; diesel or CNG may still own certain gradients. Read ',
          { text: 'EV cargo economics', href: '/blog/ev-cargo-cost-per-km-india-2024' },
          ' before finance declares a fleet mandate—unit economics are lane-specific.',
        ],
      },
      {
        type: 'h2',
        text: 'Where to go next on Liftngo',
      },
      {
        type: 'p',
        segments: [
          'Open the ',
          { text: 'services index', href: '/services' },
          ' to compare walk through 4W modes, read ',
          { text: 'B2B delivery Noida', href: '/blog/b2b-delivery-noida' },
          ' for process depth, and book when pins are honest—estimates follow reality, not slides.',
        ],
      },
      {
        type: 'p',
        segments: [
          'Questions before you phone support? Try ',
          { text: 'Contact', href: '/contact' },
          ' after scanning ',
          { text: 'FAQs', href: '/faq' },
          '—include corridor, vehicle class, and booking ID to skip ping-pong.',
        ],
      },
    ],
  },
];
