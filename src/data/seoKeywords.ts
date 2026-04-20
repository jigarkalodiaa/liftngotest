/**
 * SEO Keyword Clusters for Liftngo
 * Organized by topic for natural integration across pages
 */

// CLUSTER 1 — Core service keywords (homepage + service pages)
export const CORE_SERVICE_KEYWORDS = [
  'goods transport services',
  'delivery transport',
  'transportation services near me',
  'transportation charges',
  'pick up and drop service',
  'material shifting',
  'logistics services',
  'courier service',
  'parcel delivery',
  'tempo booking',
  'mini truck booking',
  'auto booking for goods',
  'bike delivery service',
  '2 wheeler delivery',
  '3 wheeler cargo',
  'goods delivery app',
  'instant delivery service',
  'same day delivery',
  'local delivery service',
  'on demand delivery',
  'doorstep delivery',
  'express delivery service',
  'cargo transport',
  'freight services',
  'commercial transport',
  'business delivery solutions',
];

// CLUSTER 2 — City-specific keywords
export const CITY_KEYWORDS = {
  noida: [
    'goods transport noida',
    'delivery service noida',
    'logistics noida',
    'mini truck noida',
    'tempo booking noida',
    'courier service noida',
    'same day delivery noida',
    'local transport noida',
  ],
  delhi: [
    'goods transport delhi',
    'delivery service delhi',
    'logistics delhi',
    'mini truck delhi',
    'tempo booking delhi',
    'courier service delhi',
    'same day delivery delhi',
    'local transport delhi',
  ],
  gurgaon: [
    'goods transport gurgaon',
    'delivery service gurgaon',
    'logistics gurgaon',
    'mini truck gurgaon',
    'tempo booking gurgaon',
    'courier service gurgaon',
  ],
  bangalore: [
    'goods transport bangalore',
    'delivery service bangalore',
    'logistics bangalore',
    'mini truck bangalore',
    'tempo booking bangalore',
    'courier service bangalore',
  ],
  mumbai: [
    'goods transport mumbai',
    'delivery service mumbai',
    'logistics services mumbai',
    'mini truck mumbai',
    'tempo booking mumbai',
    'courier service mumbai',
  ],
  pune: [
    'goods transport pune',
    'delivery service pune',
    'logistics pune',
    'mini truck pune',
    'tempo booking pune',
  ],
  chennai: [
    'goods transport chennai',
    'delivery service chennai',
    'logistics chennai',
    'mini truck chennai',
    'tempo booking chennai',
  ],
  hyderabad: [
    'goods transport hyderabad',
    'delivery service hyderabad',
    'logistics hyderabad',
    'mini truck hyderabad',
    'tempo booking hyderabad',
  ],
  ahmedabad: [
    'goods transport ahmedabad',
    'delivery service ahmedabad',
    'logistics ahmedabad',
    'mini truck ahmedabad',
  ],
  kolkata: [
    'goods transport kolkata',
    'delivery service kolkata',
    'logistics kolkata',
    'mini truck kolkata',
  ],
  indore: [
    'goods transport indore',
    'delivery service indore',
    'logistics indore',
  ],
  coimbatore: [
    'goods transport coimbatore',
    'delivery service coimbatore',
    'logistics coimbatore',
  ],
  thane: [
    'goods transport thane',
    'delivery service thane',
    'logistics thane',
  ],
};

// CLUSTER 3 — Moving and shifting keywords
export const HOME_SHIFTING_KEYWORDS = [
  'packers and movers',
  'packers movers near me',
  'packers and movers near me',
  'packers and movers app',
  'best packers and movers',
  'home shifting',
  'home shifting services',
  'home shifting services near me',
  'house shifting',
  'house shifting services',
  'house shifting services near me',
  'packing and moving services',
  'packing services near me',
  'moving services',
  'relocation services',
  'furniture shifting',
  'office shifting',
  'local shifting',
  'domestic relocation',
  'household goods transport',
];

// CLUSTER 4 — Vehicle and transport type keywords
export const VEHICLE_KEYWORDS = [
  'bike transport',
  'bike delivery service',
  'car transport service',
  'delivery truck',
  '2 wheeler delivery charges',
  'transport charges per km',
  '2W delivery',
  '3W auto cargo',
  'mini truck booking',
  'tempo booking',
  'tata ace booking',
  'pickup truck rental',
  'cargo van booking',
  'commercial vehicle booking',
  'goods carrier',
  'load carrier vehicle',
];

// CLUSTER 5 — Driver and partner keywords
export const PARTNER_KEYWORDS = [
  'delivery partner',
  'driver partner app',
  'delivery driver jobs',
  'logistics partner',
  'transport partner',
  'earn with delivery',
  'delivery jobs near me',
  'driver jobs',
  'cargo driver jobs',
  'mini truck driver jobs',
  'tempo driver jobs',
  'bike delivery jobs',
  'part time delivery jobs',
  'full time driver jobs',
  'fleet owner partnership',
  'attach vehicle for delivery',
];

// CLUSTER 6 — Support and contact keywords
export const SUPPORT_KEYWORDS = [
  'customer care number',
  'helpline number',
  'customer support',
  'contact number',
  'head office',
  'office address',
  'customer service',
  'support helpline',
  'toll free number',
  'whatsapp support',
  '24x7 support',
  'complaint number',
  'feedback',
  'track order',
  'order status',
];

// CLUSTER 7 — FAQ / informational keywords
export const FAQ_KEYWORDS = [
  'what is goods transport service',
  'how to book delivery',
  'delivery charges per km',
  'how delivery service works',
  'same day delivery meaning',
  'express delivery meaning',
  'mini truck capacity',
  'tempo capacity kg',
  'how to track delivery',
  'delivery time estimate',
  'goods insurance',
  'safe delivery',
  'packaging for delivery',
  'fragile goods delivery',
  'bulk goods transport',
];

// CLUSTER 8 — Comparison / intent keywords
export const INTENT_KEYWORDS = [
  'best delivery service',
  'cheapest goods transport',
  'affordable logistics',
  'reliable delivery service',
  'fast delivery service',
  'trusted transport service',
  'professional movers',
  'verified drivers',
  'insured delivery',
  'on time delivery',
  'safe goods transport',
  'budget friendly delivery',
  'quality logistics service',
];

// All keywords combined for metadata
export const ALL_SEO_KEYWORDS = [
  ...CORE_SERVICE_KEYWORDS,
  ...HOME_SHIFTING_KEYWORDS,
  ...VEHICLE_KEYWORDS,
  ...PARTNER_KEYWORDS,
  ...SUPPORT_KEYWORDS,
  ...INTENT_KEYWORDS,
  // City-specific (top cities)
  ...CITY_KEYWORDS.noida,
  ...CITY_KEYWORDS.delhi,
  ...CITY_KEYWORDS.gurgaon,
  ...CITY_KEYWORDS.bangalore.slice(0, 3),
  ...CITY_KEYWORDS.mumbai.slice(0, 3),
];

// Service types for structured data
export const SERVICE_TYPES = [
  'Goods Transport',
  'Home Shifting',
  'Packers and Movers',
  'Courier Service',
  'Same Day Delivery',
  'Express Delivery',
  'Mini Truck Booking',
  'Tempo Booking',
  'Bike Delivery',
  'Commercial Transport',
];

// Areas served
export const AREAS_SERVED = [
  'Noida',
  'Delhi',
  'Gurgaon',
  'Greater Noida',
  'Ghaziabad',
  'Faridabad',
  'Delhi NCR',
  'Bangalore',
  'Mumbai',
  'Pune',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Ahmedabad',
];
