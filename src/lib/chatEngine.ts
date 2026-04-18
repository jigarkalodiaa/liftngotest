/**
 * Liftngo Assistant — pure frontend chat logic.
 * Scored intent matching, dynamic responses, and context-aware conversation.
 *
 * Replace `getBotReply` body later with an API call; keep this module's types stable for the UI.
 */

export type ChatRole = 'user' | 'assistant';

export type Message = {
  role: ChatRole;
  content: string;
  suggestionChips?: string[];
};

export type ChatState = {
  messages: Message[];
  leadStep?: 'ask_name' | 'ask_phone' | null;
  leadData?: {
    name?: string;
    phone?: string;
  };
};

export type BotReplyResult = {
  reply: string;
  action?: { type: 'redirect'; url: string };
  captureLead?: boolean;
  nextLeadStep?: 'ask_name' | 'ask_phone' | null;
  leadDataPatch?: Partial<{ name: string; phone: string }>;
  suggestedChips?: string[];
};

export const LEAD_ASK_NAME = 'To get you a personalized response, may I have your name?';
export const LEAD_ASK_PHONE =
  'Great. And your 10-digit mobile number? Our team will reach out within the hour.';
export const LEAD_THANK_YOU =
  'Thank you! Our team will contact you shortly. Meanwhile, you can start a booking anytime from the site or keep chatting here.';

export const CHAT_WHATSAPP_PREFILL =
  'Hi Liftngo team — I used the website assistant and need help with:\n\n';

export const FALLBACK_SUGGESTION_CHIPS = [
  'Book a delivery',
  'Get a price quote',
  'Which areas do you serve?',
  'B2B logistics',
  'Track my order',
] as const;

/* ── Context extraction ── */

type MessageContext = {
  area: string | null;
  areaFrom: string | null;
  areaTo: string | null;
  vehicle: 'bike' | 'auto' | 'truck' | null;
  weightKg: number | null;
  cargoHint: string | null;
  isRepeatIntent: boolean;
  /** City name mentioned that is outside our core coverage. */
  outsideCity: string | null;
};

const AREA_MAP: [string, string][] = [
  ['greater noida', 'Greater Noida'],
  ['noida extension', 'Noida Extension'],
  ['noida', 'Noida'],
  ['ghaziabad', 'Ghaziabad'],
  ['gurugram', 'Gurugram'],
  ['gurgaon', 'Gurugram'],
  ['manesar', 'Manesar'],
  ['faridabad', 'Faridabad'],
  ['okhla', 'Okhla'],
  ['nehru place', 'Nehru Place'],
  ['dwarka', 'Dwarka'],
  ['connaught', 'Connaught Place'],
  ['saket', 'Saket'],
  ['lajpat nagar', 'Lajpat Nagar'],
  ['karol bagh', 'Karol Bagh'],
  ['rohini', 'Rohini'],
  ['pitampura', 'Pitampura'],
  ['janakpuri', 'Janakpuri'],
  ['delhi', 'Delhi'],
  ['ncr', 'Delhi NCR'],
  ['khatu', 'Khatu Shyam Ji'],
  ['salasar', 'Salasar'],
  ['ringas', 'Ringas'],
  ['reengus', 'Reengus'],
  ['sector 62', 'Sector 62'],
  ['sector 18', 'Sector 18'],
  ['vaishali', 'Vaishali'],
  ['botanical garden', 'Botanical Garden'],
  ['dlf', 'DLF'],
  ['cyber city', 'Cyber City'],
  ['udyog vihar', 'Udyog Vihar'],
  ['indirapuram', 'Indirapuram'],
  ['crossing republik', 'Crossing Republik'],
  ['sohna', 'Sohna Road'],
  ['kundli', 'Kundli'],
  ['sonipat', 'Sonipat'],
  ['bahadurgarh', 'Bahadurgarh'],
];

function extractArea(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [kw, label] of AREA_MAP) {
    if (lower.includes(kw)) return label;
  }
  return null;
}

function extractVehicle(text: string): 'bike' | 'auto' | 'truck' | null {
  const l = text.toLowerCase();
  if (/\b(bike|two.?wheel|2.?wheel|scooter|do pahiya)\b/.test(l)) return 'bike';
  if (/\b(three.?wheel|3.?wheel|tempo|e.?loader|teen pahiya|goods auto|cargo auto)\b/.test(l)) return 'auto';
  // "auto" alone: only match as vehicle if not part of "automatic/automatically"
  if (/\bauto\b/.test(l) && !/\bautomat/.test(l)) return 'auto';
  if (/\b(truck|four.?wheel|4.?wheel|lcv|canter|mini.?truck|tata ace|bolero|chhota hathi|chota hathi|bada vehicle)\b/.test(l)) return 'truck';
  return null;
}

function extractWeight(text: string): number | null {
  const m = text.match(/(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilo|kilogram)/i);
  if (m) return parseFloat(m[1]);
  const t = text.match(/(\d+(?:\.\d+)?)\s*(?:ton|tonne|quintal)/i);
  if (t) {
    const val = parseFloat(t[1]);
    return text.toLowerCase().includes('quintal') ? val * 100 : val * 1000;
  }
  return null;
}

function extractCargo(text: string): string | null {
  const l = text.toLowerCase();
  const hints: [RegExp, string][] = [
    [/\b(document|papers?|file|envelope|letter)\b/, 'documents'],
    [/\b(food|khana|tiffin|lunch|dinner|meal)\b/, 'food'],
    [/\b(furniture|sofa|table|chair|bed|almirah|cupboard)\b/, 'furniture'],
    [/\b(electronics?|laptop|computer|tv|fridge|washing machine|ac|appliance)\b/, 'electronics'],
    [/\b(clothes?|garment|kapde|textile|fabric)\b/, 'garments'],
    [/\b(medicine|pharma|medical|dawai)\b/, 'pharma'],
    [/\b(grocery|groceries|kirana|ration)\b/, 'grocery'],
    [/\b(gift|hamper|birthday|wedding)\b/, 'gifts'],
    [/\b(machine|machinery|equipment|industrial)\b/, 'machinery'],
    [/\b(construction|cement|sand|bricks?|tiles?)\b/, 'construction material'],
  ];
  for (const [re, label] of hints) {
    if (re.test(l)) return label;
  }
  return null;
}

const OUTSIDE_CITY_MAP: [string, string][] = [
  ['mumbai', 'Mumbai'], ['bengaluru', 'Bengaluru'], ['bangalore', 'Bengaluru'],
  ['chennai', 'Chennai'], ['hyderabad', 'Hyderabad'], ['kolkata', 'Kolkata'],
  ['pune', 'Pune'], ['ahmedabad', 'Ahmedabad'], ['lucknow', 'Lucknow'],
  ['indore', 'Indore'], ['jaipur', 'Jaipur'], ['chandigarh', 'Chandigarh'],
  ['kochi', 'Kochi'], ['bhopal', 'Bhopal'], ['patna', 'Patna'],
];

function extractOutsideCity(text: string): string | null {
  const l = text.toLowerCase();
  for (const [kw, label] of OUTSIDE_CITY_MAP) {
    if (l.includes(kw)) return label;
  }
  return null;
}

/** Extract "X to Y" / "X se Y" location pairs. */
function extractLocationPair(text: string): { from: string; to: string } | null {
  const patterns = [
    /(?:from\s+)(.+?)\s+(?:to|→|->)\s+(.+)/i,
    /(.+?)\s+se\s+(.+)/i,
    /(.+?)\s+to\s+(.+)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const from = extractArea(m[1]);
      const to = extractArea(m[2]);
      if (from && to) return { from, to };
    }
  }
  return null;
}

function searchHistory<T>(messages: Message[], extractor: (text: string) => T | null): T | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      const v = extractor(messages[i].content);
      if (v != null) return v;
    }
  }
  return null;
}

function buildContext(message: string, history: Message[], lastIntentName: string | null): MessageContext {
  const lower = message.toLowerCase();

  const pair = extractLocationPair(lower);
  let areaFrom = pair?.from ?? null;
  let areaTo = pair?.to ?? null;

  let area = extractArea(lower) ?? searchHistory(history, (t) => extractArea(t.toLowerCase()));
  if (pair) area = area ?? areaFrom;

  const vehicle = extractVehicle(lower) ?? searchHistory(history, extractVehicle);
  const weightKg = extractWeight(lower) ?? searchHistory(history, extractWeight);
  const cargoHint = extractCargo(lower) ?? searchHistory(history, extractCargo);

  if (!areaFrom) areaFrom = searchHistory(history, (t) => extractLocationPair(t.toLowerCase())?.from ?? null);
  if (!areaTo) areaTo = searchHistory(history, (t) => extractLocationPair(t.toLowerCase())?.to ?? null);

  const outsideCity = extractOutsideCity(lower);

  return { area, areaFrom, areaTo, vehicle, weightKg, cargoHint, isRepeatIntent: lastIntentName != null, outsideCity };
}

function recommendVehicle(weight: number | null, cargo: string | null): 'bike' | 'auto' | 'truck' | null {
  if (weight != null) {
    if (weight <= 15) return 'bike';
    if (weight <= 500) return 'auto';
    return 'truck';
  }
  if (cargo) {
    const bikeItems = ['documents', 'gifts'];
    const truckItems = ['furniture', 'machinery', 'construction material'];
    if (bikeItems.includes(cargo)) return 'bike';
    if (truckItems.includes(cargo)) return 'truck';
    return 'auto';
  }
  return null;
}

const VEHICLE_LABEL = { bike: 'Bike (2W)', auto: 'Auto (3W)', truck: 'Mini truck (4W)' } as const;
const VEHICLE_PRICE = { bike: '₹50-80', auto: '₹100-200', truck: '₹200-500' } as const;
const VEHICLE_CAPACITY = { bike: 'up to 15 kg', auto: 'up to 500 kg', truck: '500 kg+' } as const;

/* ── Intent definitions with dynamic responses ── */

type ResponseFn = (ctx: MessageContext, lastIntentName: string | null) => string;

type IntentDef = {
  name: string;
  keywords: string[];
  respond: ResponseFn;
  captureLead?: true;
  action?: { type: 'redirect'; url: string };
  chips: (ctx: MessageContext) => string[];
};

const intents: IntentDef[] = [
  {
    name: 'pricing',
    keywords: [
      'price', 'cost', 'fare', 'rate', 'quote', 'charges', 'how much',
      'estimate', 'affordable', 'cheap', 'tariff', 'discount', 'promo',
      'promotion', 'coupon', 'offer', 'deal', 'hidden charges',
      'transparent pricing', 'upfront fare',
      'kitna', 'kitne', 'kya rate', 'kya price', 'paisa', 'paise',
      'mehnga', 'sasta', 'kitna lagega', 'kitna hoga', 'price kya',
      'rate kya', 'cost kya', 'kitne paise', 'kharcha',
    ],
    respond(ctx) {
      const v = ctx.vehicle ?? recommendVehicle(ctx.weightKg, ctx.cargoHint);
      const route = ctx.areaFrom && ctx.areaTo ? `${ctx.areaFrom} to ${ctx.areaTo}` : null;

      if (route && v) {
        return `For ${route} via ${VEHICLE_LABEL[v]}, expect around ${VEHICLE_PRICE[v]} depending on exact distance. Book with your exact pins to see the confirmed fare before paying.`;
      }
      if (route) {
        return `For the ${route} route: Bike ₹50-80, Auto ₹100-200, Mini truck ₹200-500 (varies by exact distance). Book with your pins to see the confirmed fare.`;
      }
      if (v) {
        return `${VEHICLE_LABEL[v]} starts at ${VEHICLE_PRICE[v]} for short NCR routes (${VEHICLE_CAPACITY[v]}). Exact fare depends on distance — book with both locations to see the confirmed price.${ctx.area ? ` Active fleet in ${ctx.area}.` : ''}`;
      }
      if (ctx.cargoHint) {
        const rec = recommendVehicle(ctx.weightKg, ctx.cargoHint);
        const hint = rec ? ` ${VEHICLE_LABEL[rec]} is typical for ${ctx.cargoHint} (${VEHICLE_PRICE[rec]}).` : '';
        return `For ${ctx.cargoHint}, pricing depends on distance and vehicle.${hint} Enter pickup and drop on the booking page to see the exact fare.`;
      }

      let base = 'All fares are shown upfront before you confirm. Short NCR routes: Bike ₹50-80, Auto ₹100-200, Mini truck ₹200-500.';
      if (ctx.area) base += ` Active fleet in ${ctx.area}.`;
      base += ' For your exact fare, start a booking with both locations.';
      return base;
    },
    captureLead: true,
    chips(ctx) {
      if (ctx.areaFrom && ctx.areaTo) return ['Book now to see exact fare', 'Compare vehicles'];
      const v = ctx.vehicle ?? recommendVehicle(ctx.weightKg, ctx.cargoHint);
      if (v) return ['Book now to see exact fare', 'Compare vehicles', 'B2B pricing'];
      return ['Book now to see exact fare', 'Which vehicle do I need?', 'B2B pricing'];
    },
  },
  {
    name: 'booking',
    keywords: [
      'book', 'booking', 'hire', 'transport', 'dispatch', 'order pickup',
      'book delivery', 'book a delivery', 'schedule pickup',
      'schedule delivery', 'need pickup', 'need a truck', 'place order',
      'reserve', 'how to book', 'how do i book', 'first booking',
      'new booking', 'start trip', 'create booking', 'get a vehicle',
      'book karo', 'book karna', 'gaadi chahiye', 'vehicle chahiye',
      'gaadi bhejo', 'vehicle bhejo', 'pickup karo', 'send karo',
      'bhejo', 'bhejna hai', 'saman bhejo',
    ],
    respond(ctx) {
      const v = ctx.vehicle ?? recommendVehicle(ctx.weightKg, ctx.cargoHint);
      const route = ctx.areaFrom && ctx.areaTo ? `${ctx.areaFrom} to ${ctx.areaTo}` : null;

      if (route && v) {
        return `I can set up a ${VEHICLE_LABEL[v]} booking for ${route}. You will see the exact fare before confirming. Shall I open the booking page?`;
      }
      if (route) {
        return `I can set up your ${route} delivery. You will pick the vehicle, see the fare, and confirm. Shall I open the booking page?`;
      }
      if (v) {
        return `${VEHICLE_LABEL[v]} (${VEHICLE_CAPACITY[v]}) is ready. Enter your pickup and drop to see the fare and confirm.${ctx.area ? ` Fleet active in ${ctx.area}.` : ''} Shall I open booking?`;
      }
      let r = 'I can open the booking page — you will enter pickup and drop, pick your vehicle (bike / auto / mini truck), see the fare, and confirm.';
      if (ctx.area) r += ` Routes in ${ctx.area} are active.`;
      r += ' Ready to start?';
      return r;
    },
    action: { type: 'redirect', url: '/book' },
    chips(ctx) {
      if (ctx.areaFrom || ctx.vehicle) return ['Yes, open booking', 'Tell me pricing first'];
      return ['Yes, open booking', 'Tell me pricing first', 'Which vehicle do I need?'];
    },
  },
  {
    name: 'escalate',
    keywords: [
      'not satisfied', 'not happy', 'doesnt help', "doesn't help",
      'not helpful', 'useless bot', 'useless', 'waste of time',
      'real person', 'real human', 'talk to agent', 'speak to agent',
      'human agent', 'live agent', 'connect me to', 'transfer me',
      'still confused', 'did not understand', 'do not understand',
      'wrong answer', 'bad answer', 'need someone real',
      'speak to someone', 'want a human', 'no one helps',
      'insaan se baat', 'kisi se baat karo', 'agent chahiye',
    ],
    respond() {
      return 'I understand — let me connect you with our team. You can reach them directly on the Contact page (phone, email, WhatsApp), or keep chatting here and the WhatsApp option appears after a few more messages.';
    },
    chips: () => ['Open Contact page', 'Continue chatting'],
  },
  {
    name: 'cancel_reschedule',
    keywords: [
      'cancel', 'cancellation', 'cancel booking', 'reschedule',
      'change time', 'change pickup time', 'change slot', 'postpone',
      'modify booking', 'edit trip', 'wrong address', 'update address',
      'cancel karo', 'booking cancel', 'time change', 'address change',
    ],
    respond() {
      return 'Open your active trip and tap the modify or cancel option. If a driver is already assigned and the button is greyed out, contact support with your booking ID — they can handle exceptions within the allowed window.';
    },
    chips: () => ['Contact support', 'Track my order'],
  },
  {
    name: 'how_it_works',
    keywords: [
      'how does liftngo', 'how does it work', 'how do you work',
      'how liftngo works', 'what is the process', 'booking process',
      'steps to book', 'workflow',
      'kaise kaam karta', 'kaise karte', 'kya process',
    ],
    respond() {
      return '3 steps: (1) Pin your pickup and drop locations, (2) Choose a vehicle and see the fare, (3) Confirm and track your driver live. The entire flow takes under 2 minutes. Want to try it?';
    },
    action: { type: 'redirect', url: '/book' },
    chips: () => ['Start a booking', 'What vehicles available?', 'Which areas covered?'],
  },
  {
    name: 'delivery_time',
    keywords: [
      'how long', 'delivery time', 'how fast', 'time taken',
      'when will it reach', 'expected time', 'delivery duration',
      'kitna time', 'kab tak pahunchega', 'kitni der',
    ],
    respond(ctx) {
      let r = 'Delivery time depends on distance and traffic. Within the same city zone, bike deliveries typically take 30-60 minutes, auto 45-90 minutes. You see the estimated time after booking.';
      if (ctx.area) r += ` ${ctx.area} routes are generally well-connected.`;
      return r;
    },
    chips: () => ['Book a delivery', 'Get pricing', 'Express delivery'],
  },
  {
    name: 'working_hours',
    keywords: [
      'working hours', 'timing', 'what time', 'open till',
      'available at night', 'night delivery', '24 hours', '24/7',
      'sunday open', 'holiday', 'kab tak open', 'kitne baje',
      'raat ko', 'subah',
    ],
    respond() {
      return 'Booking is available round the clock on the website. Driver availability varies by area and time — peak hours in NCR have the most fleet. For late-night or holiday deliveries, book in advance for better availability.';
    },
    chips: () => ['Book a delivery', 'Express delivery', 'Contact support'],
  },
  {
    name: 'vehicle_recommend',
    keywords: [
      'which vehicle', 'what vehicle', 'suggest vehicle',
      'vehicle for', 'best vehicle', 'right vehicle',
      'konsi gaadi', 'kaun si gaadi', 'kya use karu',
    ],
    respond(ctx) {
      const v = recommendVehicle(ctx.weightKg, ctx.cargoHint);
      if (v) {
        return `Based on what you described, ${VEHICLE_LABEL[v]} would be ideal (handles ${VEHICLE_CAPACITY[v]}, starting at ${VEHICLE_PRICE[v]}). You can confirm the exact option when you book.`;
      }
      return 'It depends on your cargo: Bike handles documents and small parcels up to 15 kg (from ₹50). Auto handles sacks and mid-weight items up to 500 kg (from ₹100). Mini truck handles pallets, furniture, and bulk loads (from ₹200). What are you sending?';
    },
    chips(ctx) {
      const v = recommendVehicle(ctx.weightKg, ctx.cargoHint);
      if (v) return ['Book now', 'Get exact pricing'];
      return ['Small parcel (under 15 kg)', 'Medium load (15-500 kg)', 'Heavy / bulky items'];
    },
  },
  {
    name: 'account_login',
    keywords: [
      'login', 'log in', 'sign in', 'signin', 'sign up', 'signup',
      'register', 'otp', 'otp not', 'verification code', 'cannot log',
      "can't log", 'password', 'locked out', 'session', 'my account',
      'otp nahi aa raha', 'login nahi ho raha',
    ],
    respond() {
      return 'Login uses OTP sent to your registered mobile. Tips: wait 60 seconds between retries, check SMS filters and DND settings, ensure airplane mode is off. If OTPs still do not arrive, contact support with your mobile number and approximate time of attempt.';
    },
    chips: () => ['Contact support', 'Book a delivery'],
  },
  {
    name: 'restrictions_items',
    keywords: [
      'can i send', 'can i ship', 'prohibited', 'not allowed',
      'restricted', 'illegal', 'dangerous', 'hazardous', 'explosive',
      'alcohol', 'liquor', 'cigarette', 'weapon', 'drug', 'cash bundle',
      'gold jewellery', 'live animal', 'pet transport',
      'kya bhej sakte', 'allowed hai kya',
    ],
    respond(ctx) {
      if (ctx.cargoHint === 'pharma') return 'Pharma shipments are generally allowed but must be properly packaged. Controlled substances need documentation. Mention the specifics when booking.';
      if (ctx.cargoHint === 'food') return 'Food delivery is handled through our restaurant section with temperature-appropriate handoffs. Use "Find Restaurant" for prepared food, or regular booking for packaged goods.';
      return 'We transport all legal commercial goods. Not allowed: contraband, undeclared hazmat, cash bundles, live animals. Alcohol and high-value jewellery need pre-approval — mention the item type on the Contact page before booking.';
    },
    chips: () => ['Book a delivery', 'Contact support'],
  },
  {
    name: 'b2b',
    keywords: [
      'bulk', 'b2b', 'warehouse', 'enterprise',
      'fleet', 'corporate', 'freight', 'industrial', 'supplier', 'msme',
      'startup logistics', 'distributor', 'vendor delivery',
      'stock transfer', 'plant to warehouse', 'daily route', 'line haul',
      'indent', 'regular delivery', 'contract', 'monthly contract',
      'business logistics', 'business delivery', 'bulk delivery',
      'company logistics', 'company delivery',
      'daily pickup', 'roz ka kaam', 'business ke liye',
    ],
    respond(ctx) {
      let r = 'We offer dedicated B2B logistics — recurring routes, volume-based pricing, GST invoicing, and digital POD.';
      if (ctx.area) r += ` We run active B2B programs in ${ctx.area}.`;
      r += ' To build your proposal, I need: (1) Origin and destination, (2) Frequency (daily/weekly), (3) Cargo type and approximate weight. Can you share these?';
      return r;
    },
    captureLead: true,
    chips: () => ['Get a B2B quote', 'What areas covered?', 'Vehicle options'],
  },
  {
    name: 'food_restaurant',
    keywords: [
      'find restaurant', 'restaurant menu', 'food order', 'order food',
      'kitchen delivery', 'hotel food', 'devotee food',
      'khana order', 'khana bhejo', 'food delivery',
    ],
    respond() {
      return 'For prepared food orders, use our "Find Restaurant" section — browse menus, place your order, and the kitchen confirms via WhatsApp before a rider picks up. This is a separate flow from goods delivery.';
    },
    chips: () => ['Find a restaurant', 'Book a goods delivery instead'],
  },
  {
    name: 'khatu_corridor',
    keywords: [
      'khatu shyam', 'shyam ji', 'temple delivery', 'ringas', 'reengus',
      'salasar corridor', 'temple corridor', 'darshan', 'khatu vendor',
      'khatu shop', 'khatu hotel', 'khatu marketplace',
      'khatu travel', 'khatu ja raha', 'mandir',
    ],
    respond() {
      return 'We have specialized services around Khatu Shyam Ji: hotel bookings, local marketplace delivery, vendor logistics, and travel between Khatu-Ringas-Salasar. Which one do you need?';
    },
    chips: () => ['Khatu hotels', 'Khatu marketplace', 'Khatu travel', 'Cargo delivery'],
  },
  {
    name: 'express',
    keywords: [
      'same day', 'same-day', 'express', 'urgent', 'fast delivery',
      'quick delivery', 'immediate', 'asap', 'rush', 'today delivery',
      'within hour', 'few hours', 'tonight', 'tomorrow morning',
      'early slot', 'late night', 'weekend delivery', 'sunday delivery',
      'jaldi chahiye', 'abhi chahiye', 'turant', 'foren',
      'aaj hi', 'aaj chahiye', 'urgent hai',
    ],
    respond(ctx) {
      let r = 'For urgent deliveries, book immediately with your real ready time — available express vehicles show instantly.';
      if (ctx.area) r += ` Fleet in ${ctx.area} is usually active during business hours.`;
      r += ' If nothing shows as available, message "URGENT" with pickup, drop, and deadline on Contact — ops will try to prioritize.';
      return r;
    },
    captureLead: true,
    chips: () => ['Book now', 'Contact for urgent', 'Get pricing'],
  },
  {
    name: 'vehicle_two_wheeler',
    keywords: [
      '2 wheeler', '2-wheeler', 'two wheeler', 'two-wheeler',
      'bike delivery', 'scooter delivery', 'motorcycle courier',
      'cycle courier', 'documents only',
      'bike se bhejo', 'bike chahiye', 'do pahiya',
    ],
    respond(ctx) {
      let r = 'Bike delivery is our fastest option — handles documents, small parcels, and packages up to 15 kg. Starting fare: ₹50-80 for short routes in NCR.';
      if (ctx.cargoHint) r += ` Great choice for ${ctx.cargoHint}.`;
      if (ctx.area) r += ` Available in ${ctx.area}.`;
      return r;
    },
    chips: () => ['Book a bike delivery', 'Need something bigger?', 'Get exact pricing'],
  },
  {
    name: 'vehicle_three_wheeler',
    keywords: [
      '3 wheeler', '3-wheeler', 'three wheeler', 'three-wheeler',
      'three wheel', 'tempo', 'goods auto', 'cargo auto',
      'auto vehicle', 'e vehicle', 'e-loader', 'electric three',
      'ev cargo',
      'auto se bhejo', 'auto chahiye', 'teen pahiya',
    ],
    respond(ctx) {
      let r = 'Auto/3W is the versatile middle option — handles sacks, retail stock, and multi-bag loads up to 500 kg. Fits through narrow lanes where trucks cannot go. Starting fare: ₹100-200.';
      if (ctx.cargoHint) r += ` Works well for ${ctx.cargoHint}.`;
      if (ctx.area) r += ` Available in ${ctx.area}.`;
      return r;
    },
    chips: () => ['Book auto delivery', 'Need something bigger?', 'Get exact pricing'],
  },
  {
    name: 'vehicle_four_wheeler',
    keywords: [
      '4 wheeler', '4-wheeler', 'four wheeler', 'four-wheeler',
      'mini truck', 'pickup truck', 'tata ace', 'light truck', 'lcv',
      'canter', 'open body truck', 'chhota hathi', 'chota hathi',
      'mahindra pickup', 'bolero pickup',
      'truck chahiye', 'bada vehicle', 'gaadi chahiye badi',
    ],
    respond(ctx) {
      let r = 'Mini trucks and LCVs carry pallets, appliances, furniture, and bulk loads that smaller vehicles cannot handle. Starting fare: ₹200-500.';
      if (ctx.weightKg != null) r += ` For ${ctx.weightKg} kg, this is the right choice.`;
      else r += ' Mention weight and dimensions when booking so dispatch assigns the best match.';
      if (ctx.area) r += ` Active fleet in ${ctx.area}.`;
      return r;
    },
    chips: () => ['Book mini truck', 'Get exact pricing', 'B2B bulk logistics'],
  },
  {
    name: 'ev_green',
    keywords: [
      'electric vehicle', 'ev fleet', 'green logistics', 'zero emission',
      'sustainability', 'cng vehicle', 'less pollution', 'electric gaadi',
    ],
    respond() {
      return 'We deploy electric 3W cargo on supported NCR routes — great for recurring B2B shuttles with lower emissions. Book normally and EV options appear when available on your route. For a dedicated EV program, contact B2B sales.';
    },
    chips: () => ['Book a delivery', 'B2B logistics', 'Which areas covered?'],
  },
  {
    name: 'outside_core_zones',
    keywords: [
      'mumbai', 'bengaluru', 'bangalore', 'chennai', 'hyderabad',
      'kolkata', 'pune', 'ahmedabad', 'lucknow', 'indore', 'jaipur',
      'pan india', 'all india', 'pan-india', 'international ship',
      'ship abroad', 'export cargo', 'import cargo',
    ],
    respond(ctx) {
      const city = ctx.outsideCity ?? 'that city';
      return `We do not have retail fleet in ${city} yet — our core is Delhi NCR and Khatu Shyam Ji. However, for B2B clients with consistent volume, we can design a dedicated ${city} trunk lane. Share route, frequency, and cargo details on the Contact page.`;
    },
    captureLead: true,
    chips: () => ['Get a B2B quote', 'Contact support', 'NCR coverage details'],
  },
  {
    name: 'delivery_general',
    keywords: [
      'delivery', 'parcel', 'package', 'courier', 'consignment',
      'door to door', 'door-to-door', 'last mile', 'last-mile',
      'pickup and drop', 'pick up and drop', 'ship goods', 'send goods',
      'send package', 'move goods', 'goods movement', 'reverse pickup',
      'reverse pick', 'handover', 'hand over', 'office transfer',
      'interoffice', 'branch to branch', 'samples', 'gift hamper',
      'return pickup', 'amazon return', 'flipkart return',
      'saman bhejna', 'parcel bhejo', 'goods bhejo', 'cheez bhejni hai',
      'delivery karni hai', 'delivery chahiye',
    ],
    respond(ctx) {
      const v = recommendVehicle(ctx.weightKg, ctx.cargoHint);
      let r = 'We handle it all — parcels, office transfers, e-com returns, shop restocks, and more.';
      if (v) r += ` For what you described, ${VEHICLE_LABEL[v]} (${VEHICLE_CAPACITY[v]}) would work well.`;
      if (ctx.area) r += ` Routes in ${ctx.area} are active.`;
      r += ' Pin both locations accurately and add access notes (gate, tower, stairs) for smooth handoff. Ready to book?';
      return r;
    },
    captureLead: true,
    action: { type: 'redirect', url: '/book' },
    chips(ctx) {
      const v = recommendVehicle(ctx.weightKg, ctx.cargoHint);
      if (v) return ['Yes, open booking', 'Get pricing first'];
      return ['Yes, open booking', 'Get pricing first', 'Which vehicle do I need?'];
    },
  },
  {
    name: 'load_weight',
    keywords: [
      'kilogram', 'kilo', 'kg', 'kgs', 'ton', 'tonne', 'weight',
      'heavy', 'bulky', 'oversized', 'pallet', 'dimensions', 'cbm',
      'volume', 'fragile', 'stackable', 'non stackable', 'loading bay',
      'lift gate',
      'kitna wajan', 'bhari', 'bhari saman',
    ],
    respond(ctx) {
      const v = recommendVehicle(ctx.weightKg, ctx.cargoHint);
      if (ctx.weightKg != null && v) {
        return `For ${ctx.weightKg} kg, ${VEHICLE_LABEL[v]} is the right fit (handles ${VEHICLE_CAPACITY[v]}, from ${VEHICLE_PRICE[v]}). Add fragility and stair/lift info in the booking form for an accurate match. Want to book?`;
      }
      return 'Vehicle depends on weight: Bike handles up to 15 kg, Auto up to 500 kg, Mini truck for heavier loads. Also note fragility, dimensions, and access constraints (stairs, lift, narrow lane). How heavy is your cargo?';
    },
    captureLead: true,
    chips(ctx) {
      const v = recommendVehicle(ctx.weightKg, ctx.cargoHint);
      if (v) return ['Book now', 'Get exact pricing'];
      return ['Under 15 kg', '15-500 kg', 'Over 500 kg'];
    },
  },
  {
    name: 'tracking',
    keywords: [
      'track', 'tracking', 'where is my', 'where is my order',
      'order status', 'shipment status', 'live status', 'eta',
      'where is driver', 'call driver', 'driver location', 'not moving',
      'stuck at',
      'kahan hai', 'kahan pahuncha', 'kitna time lagega',
      'driver kahan hai', 'status kya hai',
    ],
    respond() {
      return 'Open your active trip to see live driver location, ETA, and vehicle details. If the driver appears unresponsive or GPS is stuck, try refreshing. For persistent issues, contact support with your booking ID and they will ping the field team directly.';
    },
    chips: () => ['Contact support', 'Cancel or reschedule'],
  },
  {
    name: 'documents_pod',
    keywords: [
      'proof of delivery', 'pod', 'delivery receipt', 'signed copy',
      'lr copy', 'eway', 'e-way', 'gst invoice copy',
      'misplaced invoice', 'digital pod',
    ],
    respond() {
      return 'POD photos, signed challans, and GST documents are attached to completed trips. B2B accounts receive them via email. Missing a document? Contact support with your booking or LR number for quick retrieval.';
    },
    chips: () => ['Contact support', 'B2B logistics'],
  },
  {
    name: 'payment',
    keywords: [
      'payment', 'pay online', 'upi', 'card', 'cod', 'cash on delivery',
      'invoice', 'gst', 'refund', 'billing', 'netbanking', 'net banking',
      'payment failed', 'double charge', 'reconcile', 'tds', 'credit note',
      'payment kaise', 'paise kaise de', 'refund kab',
    ],
    respond() {
      return 'We accept UPI, cards, and COD (route-dependent). B2B accounts get GST invoicing with agreed credit terms. If a payment failed or was double-charged, screenshot the transaction ID and contact support — refunds process within 5-7 business days.';
    },
    chips: () => ['Contact support', 'Book a delivery', 'B2B billing setup'],
  },
  {
    name: 'service_reliability',
    keywords: [
      'safe', 'safety', 'insured', 'insurance', 'damage', 'lost',
      'missing', 'complaint', 'delay', 'late delivery', 'rude driver',
      'misbehaviour', 'misbehavior', 'wrong item',
      'saman kho gaya', 'toot gaya', 'late ho gaya', 'complaint hai',
    ],
    respond() {
      return 'Sorry about that. To resolve this fast: contact support with your booking ID, timestamps, and photos of any damage. Damage claims are prioritized and behaviour complaints are escalated to the field team within 24 hours.';
    },
    chips: () => ['Contact support', 'Track my order'],
  },
  {
    name: 'driver',
    keywords: [
      'driver', 'join liftngo', 'drive for', 'earn', 'partner driver',
      'documents for driver', 'become driver', 'driver onboarding',
      'driver payout', 'driver commission', 'daily payout',
      'driving license', 'rc book', 'vehicle papers', 'incentives',
      'kyc driver',
      'driver banna hai', 'gaadi chalani hai', 'kamana hai',
      'driver chahiye', 'driver registration',
    ],
    respond() {
      return 'To drive with Liftngo you need: (1) Valid KYC documents, (2) Commercially insured vehicle, (3) Matching driving license. Visit our "Become a Driver" page to apply — payout structure and incentives are shared during onboarding.';
    },
    chips: () => ['Become a driver', 'Contact support'],
  },
  {
    name: 'careers_office',
    keywords: [
      'career', 'job opening', 'vacancy', 'hiring', 'hr contact',
      'apply for job', 'office job', 'internship',
      'naukri', 'job chahiye',
    ],
    respond() {
      return 'Check the Careers page for current openings in tech, ops, and field roles. Note: driver partner signup is separate — that is on the "Become a Driver" page.';
    },
    chips: () => ['Become a driver', 'Contact support'],
  },
  {
    name: 'coverage',
    keywords: [
      'noida', 'noids', 'sector', 'delhi', 'gurgaon', 'gurugram',
      'ghaziabad', 'faridabad', 'ncr', 'greater noida',
      'noida extension', 'khatu', 'salasar', 'available in',
      'available at', 'service area', 'which cit', 'where do you',
      'do you serve', 'do you operate', 'coverage', 'operate in',
      'local area', 'hyperlocal', 'okhla', 'nehru place', 'connaught',
      'dwarka', 'dwarka mor', 'manesar', 'bawal', 'dlf', 'cyber city',
      'udyog vihar', 'sector 62', 'sector 18', 'shipra', 'vaishali',
      'kaushambi', 'botanical garden',
      'kahan kahan', 'kahan available', 'kahan milega',
    ],
    respond(ctx) {
      if (ctx.areaFrom && ctx.areaTo) {
        return `Yes, both ${ctx.areaFrom} and ${ctx.areaTo} are in our coverage. The ${ctx.areaFrom} to ${ctx.areaTo} route is active — book now to see available vehicles and fares.`;
      }
      if (ctx.area) {
        return `Yes, ${ctx.area} is in our active coverage zone with fleet available for bike, auto, and mini truck. Want to book a delivery or get a price estimate?`;
      }
      return 'We cover the entire Delhi NCR — Noida, Greater Noida, Ghaziabad, Gurugram, Manesar, Faridabad, and key Delhi zones. Plus dedicated programs around Khatu Shyam Ji. Drop pins in booking to confirm your exact route.';
    },
    chips(ctx) {
      if (ctx.areaFrom && ctx.areaTo) return ['Book this route', 'Get pricing'];
      if (ctx.area) return ['Book a delivery', 'Get pricing for my route'];
      return ['Book a delivery', 'Get pricing', 'B2B logistics'];
    },
  },
  {
    name: 'about',
    keywords: [
      'liftngo', 'what is', 'who are you', 'tell me about', 'know more',
      'your company', 'about you', 'how liftngo', 'lift ngo',
      'is liftngo legit', 'trust liftngo', 'reliable', 'reviews',
      'scam', 'fraud',
      'liftngo kya hai', 'kya karte ho', 'kya service hai',
      'ye kya hai', 'kaun ho tum',
    ],
    respond() {
      return 'Liftngo is a goods transport platform serving Delhi NCR and the Khatu Shyam Ji corridor. We offer upfront pricing, verified drivers, and three vehicle classes (bike, auto, mini truck). Used by individuals for one-off deliveries and by businesses for daily logistics. How can I help you today?';
    },
    chips: () => ['Book a delivery', 'Get pricing', 'B2B logistics', 'Which areas?'],
  },
  {
    name: 'compare_players',
    keywords: [
      'porter alternative', 'porter vs', 'dunzo for business',
      'shadowfax', 'delhivery', 'elastic run', 'compare with porter',
      'difference from', 'better than',
      'porter se accha', 'porter jaisa',
    ],
    respond() {
      return 'Unlike broad aggregators, we focus specifically on NCR and Khatu with multi-vehicle goods transport, mandatory POD, and real B2B tooling (GST invoices, recurring routes, credit terms). Tell us your specific lane and requirements — we will show concrete pricing and SLA comparison.';
    },
    captureLead: true,
    chips: () => ['Get a B2B quote', 'Book a delivery', 'Contact support'],
  },
  {
    name: 'privacy_data',
    keywords: [
      'privacy policy', 'data delete', 'delete my data', 'gdpr',
      'personal data', 'how you use data', 'cookies',
    ],
    respond() {
      return 'Privacy policy and terms are on the site legal pages. For account deletion or data export, email via the Contact page with your registered mobile number. Identity verification is required before any data is processed.';
    },
    chips: () => ['Contact support'],
  },
  {
    name: 'help',
    keywords: [
      'help', 'support', 'human', 'someone', 'talk to team', 'issue',
      'madad', 'sahayata', 'help chahiye',
    ],
    respond() {
      return 'Happy to help! What specifically do you need? Pick a topic below or just describe your situation in a line.';
    },
    chips: () => ['Book a delivery', 'Get pricing', 'Track my order', 'Contact support'],
  },
  {
    name: 'contact_channel',
    keywords: [
      'contact', 'call', 'email', 'whatsapp', 'phone number',
      'number do', 'contact number', 'phone do',
    ],
    respond() {
      return 'You can reach our team through the Contact page — phone, email, and WhatsApp are all listed there. For booking-specific issues, mention your booking ID for faster resolution.';
    },
    chips: () => ['Open Contact page'],
  },
  {
    name: 'thanks',
    keywords: ['thanks', 'thank you', 'thx', 'appreciate', 'shukriya', 'dhanyavaad', 'ok thanks', 'okay thanks'],
    respond() {
      return 'Glad I could help! Need anything else — a booking, price quote, or vehicle recommendation?';
    },
    chips: () => ['Book a delivery', 'Get pricing'],
  },
  {
    name: 'affirmative',
    keywords: ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'haan', 'ha', 'ji', 'theek hai', 'chalo'],
    respond(_ctx, lastIntentName) {
      if (lastIntentName === 'booking' || lastIntentName === 'how_it_works' || lastIntentName === 'delivery_general') {
        return 'Opening the booking page for you now. You will set locations, pick a vehicle, and see your fare before confirming.';
      }
      if (lastIntentName === 'pricing') {
        return 'Let me open the booking page so you can see exact fares for your route.';
      }
      return 'Great! What would you like to do — book a delivery, get pricing, or something else?';
    },
    action: { type: 'redirect', url: '/book' },
    chips: () => ['Book a delivery', 'Get pricing', 'Something else'],
  },
  {
    name: 'negative',
    keywords: ['no', 'nah', 'nope', 'not now', 'later', 'nahi', 'abhi nahi', 'baad mein'],
    respond() {
      return 'No problem. Feel free to ask anything else or come back when you are ready.';
    },
    chips: () => ['Get pricing', 'Which areas covered?', 'B2B logistics'],
  },
  {
    name: 'greeting',
    keywords: [
      'hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon',
      'good evening', 'hola', 'kaise ho',
    ],
    respond() {
      return 'Hi, welcome to Liftngo! I can help you book a delivery, get pricing, choose the right vehicle, or answer any logistics question. What do you need?';
    },
    chips: () => ['Book a delivery', 'Get a price quote', 'Which areas do you serve?', 'B2B logistics'],
  },
];

/* ── Matching logic: scored, not first-match ── */

function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(-10);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(-10);
  if (digits.length === 10) return digits;
  return null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function keywordMatches(haystack: string, keyword: string): boolean {
  const k = keyword.toLowerCase();
  if (k.includes(' ')) return haystack.includes(k);
  if (k === 'kg' || k === 'kgs') {
    return /\d\s*kgs?\b|\bkgs?\b/i.test(haystack);
  }
  if (k.length <= 3) {
    return new RegExp(`\\b${escapeRegex(k)}\\b`, 'i').test(haystack);
  }
  return haystack.includes(k);
}

function scoreIntent(lower: string, intent: IntentDef): number {
  let score = 0;
  for (const kw of intent.keywords) {
    if (keywordMatches(lower, kw)) score++;
  }
  return score;
}

function matchIntent(lower: string): IntentDef | null {
  let best: IntentDef | null = null;
  let bestScore = 0;
  for (const intent of intents) {
    const score = scoreIntent(lower, intent);
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return best;
}

/** Infer the last bot intent from message content patterns — avoids calling respond(). */
const INTENT_SIGNATURES: [string, RegExp][] = [
  ['pricing', /exact fare|₹\d|starts at|upfront|fare/i],
  ['booking', /booking page|open it\?|shall i open|ready to start/i],
  ['coverage', /coverage zone|cover the|serve|active fleet/i],
  ['b2b', /b2b|proposal|recurring|gst invoic/i],
  ['delivery_general', /goods delivery|parcels|e-com|handoff/i],
  ['tracking', /active trip|live.*location|driver.*unresponsive/i],
  ['express', /express|urgent|deadline|prioritize/i],
  ['vehicle_recommend', /depends on your cargo|bike handles|auto handles/i],
  ['vehicle_two_wheeler', /bike delivery|fastest.*option|15\s*kg/i],
  ['vehicle_three_wheeler', /auto\/3w|500\s*kg|tight lanes/i],
  ['vehicle_four_wheeler', /mini truck|lcv|pallets/i],
  ['load_weight', /weight.*vehicle|bike handles up to/i],
  ['how_it_works', /3 steps|pin your pickup/i],
  ['greeting', /welcome to liftngo/i],
  ['help', /happy to help/i],
];

function inferLastIntentName(messages: Message[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      const c = messages[i].content;
      for (const [name, re] of INTENT_SIGNATURES) {
        if (re.test(c)) return name;
      }
      return null;
    }
  }
  return null;
}

/**
 * Detect short follow-up messages that modify previous context
 * (e.g. "in Noida?", "for bike?", "50 kg") rather than starting a new query.
 */
function isContinuation(lower: string, lastIntent: string | null): boolean {
  if (!lastIntent) return false;
  const words = lower.split(/\s+/);
  if (words.length > 5) return false;
  const hasContext = extractArea(lower) || extractVehicle(lower) || extractWeight(lower) || extractCargo(lower);
  const hasActionWord = /\b(book|track|cancel|contact|compare|help|become)\b/.test(lower);
  return Boolean(hasContext) && !hasActionWord;
}

/** Edge case detection. */
function isJunk(text: string): boolean {
  const clean = text.replace(/[\s?!.,;:]+/g, '');
  return clean.length < 2;
}

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Smarter fallback: analyze what the message contains and steer appropriately. */
function buildSmartFallback(lower: string): BotReplyResult {
  const area = extractArea(lower);
  const vehicle = extractVehicle(lower);
  const weight = extractWeight(lower);
  const cargo = extractCargo(lower);

  if (area) {
    return {
      reply: `I see you mentioned ${area} — we do cover that area. Are you looking to book a delivery there, or get a price estimate?`,
      suggestedChips: ['Book a delivery', 'Get pricing', 'B2B logistics'],
    };
  }
  if (vehicle || weight || cargo) {
    const hint = cargo ?? (vehicle ? VEHICLE_LABEL[vehicle] : `${weight} kg`);
    return {
      reply: `Got it — ${hint}. Would you like to book a delivery for that, or see the pricing first?`,
      suggestedChips: ['Book a delivery', 'Get pricing'],
    };
  }
  if (/\?$/.test(lower)) {
    return {
      reply: 'Good question — I want to give you the right answer. Could you tell me if this is about booking, pricing, tracking, or something else?',
      suggestedChips: [...FALLBACK_SUGGESTION_CHIPS],
    };
  }
  return {
    reply: 'I want to help but need a bit more clarity. Are you looking to book a delivery, get a price estimate, or something else?',
    suggestedChips: [...FALLBACK_SUGGESTION_CHIPS],
  };
}

/* ── Main reply function ── */

export function getBotReply(message: string, state: ChatState): BotReplyResult {
  const trimmed = message.trim();
  const step = state.leadStep ?? null;

  if (step === 'ask_name') {
    const name = trimmed.replace(/\s+/g, ' ');
    if (name.length < 2) {
      return { reply: 'Please enter your name so we can get back to you.', nextLeadStep: 'ask_name' };
    }
    return {
      reply: LEAD_ASK_PHONE,
      nextLeadStep: 'ask_phone',
      leadDataPatch: { name: name.slice(0, 120) },
    };
  }

  if (step === 'ask_phone') {
    const phone = normalizePhone(trimmed);
    if (!phone) {
      return {
        reply: 'That does not look right. Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).',
        nextLeadStep: 'ask_phone',
      };
    }
    return {
      reply: LEAD_THANK_YOU,
      nextLeadStep: null,
      leadDataPatch: { phone },
      suggestedChips: ['Book a delivery', 'Get pricing'],
    };
  }

  if (isJunk(trimmed)) {
    return {
      reply: 'Could you type a bit more? For example: "book a delivery", "Noida to Delhi price", or "which vehicle for 50 kg?"',
      suggestedChips: [...FALLBACK_SUGGESTION_CHIPS],
    };
  }

  const lower = trimmed.toLowerCase();
  const lastIntentName = inferLastIntentName(state.messages);

  // Continuation detection: short follow-up that adds context to the previous intent
  if (isContinuation(lower, lastIntentName)) {
    const prevIntent = intents.find((i) => i.name === lastIntentName);
    if (prevIntent) {
      const ctx = buildContext(trimmed, state.messages, lastIntentName);
      const responseText = prevIntent.respond(ctx, lastIntentName);
      const chips = prevIntent.chips(ctx);
      const result: BotReplyResult = { reply: responseText, suggestedChips: chips.length > 0 ? chips : undefined };
      if (prevIntent.action) result.action = prevIntent.action;
      if (prevIntent.captureLead) result.captureLead = true;
      return result;
    }
  }

  let intent = matchIntent(lower);

  // Time-aware greeting
  if (intent?.name === 'greeting') {
    const greeting = getTimeGreeting();
    const ctx = buildContext(trimmed, state.messages, lastIntentName);
    return {
      reply: `${greeting}! Welcome to Liftngo. I can help you book a delivery, get pricing, choose the right vehicle, or answer logistics questions. What do you need?`,
      suggestedChips: intent.chips(ctx),
    };
  }

  if (!intent) {
    return buildSmartFallback(lower);
  }

  const ctx = buildContext(trimmed, state.messages, lastIntentName);
  const responseText = intent.respond(ctx, lastIntentName);
  const chips = intent.chips(ctx);

  const result: BotReplyResult = {
    reply: responseText,
    suggestedChips: chips.length > 0 ? chips : undefined,
  };

  if (intent.action) {
    result.action = intent.action;
  }
  if (intent.captureLead) {
    result.captureLead = true;
  }

  return result;
}

export function typingDelayMs(): number {
  return 180 + Math.floor(Math.random() * 220);
}
