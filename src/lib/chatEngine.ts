/**
 * Liftngo Assistant — pure frontend chat logic.
 * Replace `getBotReply` body later with an API call; keep this module’s types stable for the UI.
 */

export type ChatRole = 'user' | 'assistant';

export type Message = {
  role: ChatRole;
  content: string;
  /** Shown under this assistant bubble as quick-reply chips (e.g. after fallback). */
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
  /** After this turn, update local lead step (when in lead flow). */
  nextLeadStep?: 'ask_name' | 'ask_phone' | null;
  /** Merge into `leadData` in the UI. */
  leadDataPatch?: Partial<{ name: string; phone: string }>;
  /** Quick prompts rendered under the assistant message (fallback / unmatched queries). */
  suggestedChips?: string[];
};

export const LEAD_ASK_NAME = 'Can I have your name?';
export const LEAD_ASK_PHONE = 'Please share your phone number.';
export const LEAD_THANK_YOU =
  'Thank you. Our team will reach out shortly. If it is urgent, use the Contact page on the site, or keep chatting — Continue on WhatsApp appears after 10 of your messages here when enabled.';

/** Prefilled text for the Continue on WhatsApp handoff (no PII). */
export const CHAT_WHATSAPP_PREFILL =
  'Hi Liftngo team — I used the website assistant and need help with:\n\n';

/** Short prompts shown as tappable chips when no intent matches (wording should match intent keywords). */
export const FALLBACK_SUGGESTION_CHIPS = [
  'How do I book a delivery?',
  'What areas do you serve?',
  'I need a price quote',
  'B2B logistics for my business',
  'Track my booking status',
] as const;

const FALLBACK_REPLY =
  "I don't have a specific answer for that. Choose a topic below, or ask again in a short sentence (for example pickup area and drop area).";

type IntentDefinition = {
  name: string;
  keywords: string[];
  response: string;
  captureLead?: true;
  action?: { type: 'redirect'; url: string };
};

/**
 * First matching intent wins. Put narrow / transactional intents before broad ones.
 * (Do not use the substring `deliver` alone on booking — it matches every “delivery” question.)
 */
const intents: IntentDefinition[] = [
  {
    name: 'pricing',
    keywords: [
      'price',
      'cost',
      'fare',
      'rate',
      'quote',
      'charges',
      'how much',
      'estimate',
      'affordable',
      'cheap',
      'tariff',
      'discount',
      'promo',
      'promotion',
      'coupon',
      'offer',
      'deal',
      'hidden charges',
      'transparent pricing',
      'upfront fare',
    ],
    response:
      'Liftngo shows upfront, route-based pricing when you enter real pickup and drop — vehicle class and demand can move the fare slightly. For a ballpark, tell me both ends of the lane plus what you are moving (weight or short description). For the exact number, start a booking: you will see 2W / 3W / 4W options and totals before you confirm. Promotions, if any, apply at checkout or account level.',
    captureLead: true,
  },
  {
    name: 'escalate',
    keywords: [
      'not satisfied',
      'not happy',
      'doesnt help',
      "doesn't help",
      'not helpful',
      'useless bot',
      'useless',
      'waste of time',
      'real person',
      'real human',
      'talk to agent',
      'speak to agent',
      'human agent',
      'live agent',
      'connect me to',
      'transfer me',
      'still confused',
      'did not understand',
      'do not understand',
      'wrong answer',
      'bad answer',
      'need someone real',
      'speak to someone',
      'want a human',
      'no one helps',
      'this is stupid',
    ],
    response:
      'Sorry this chat did not sort it out. Use the Contact page for phone and email, or send 10 messages here then use Continue on WhatsApp when it appears — include pickup, drop, and what went wrong.',
  },
  {
    name: 'cancel_reschedule',
    keywords: [
      'cancel',
      'cancellation',
      'cancel booking',
      'reschedule',
      'change time',
      'change pickup time',
      'change slot',
      'postpone',
      'modify booking',
      'edit trip',
      'wrong address',
      'update address',
    ],
    response:
      'Open your trip in the Liftngo web or app booking flow and look for modify or cancel where the product allows it. Rules depend on whether a partner is already assigned and how close you are to pickup. If the screen will not let you change it, use the Contact page with your booking ID — operations can handle allowed exceptions manually.',
  },
  {
    name: 'booking',
    keywords: [
      'book',
      'booking',
      'hire',
      'transport',
      'dispatch',
      'order pickup',
      'book delivery',
      'book a delivery',
      'schedule pickup',
      'schedule delivery',
      'need pickup',
      'need a truck',
      'place order',
      'reserve',
      'how to book',
      'how do i book',
      'first booking',
      'new booking',
      'start trip',
      'create booking',
      'get a vehicle',
    ],
    response:
      'On Liftngo you usually: set pickup and drop on the map, describe goods and pick 2W / 3W / 4W if offered, choose timing, then confirm and pay as prompted. Start from Book on the site. If you want, I can open the booking screen — confirm below when you are ready.',
    action: { type: 'redirect', url: '/book' },
  },
  {
    name: 'how_it_works',
    keywords: [
      'how does liftngo',
      'how does it work',
      'how do you work',
      'how liftngo works',
      'what is the process',
      'booking process',
      'steps to book',
      'workflow',
    ],
    response:
      'Liftngo connects you with verified goods-transport capacity: pin pickup and drop, choose a vehicle class where the lane supports it, pay as per the product, then track the job. We focus on commercial goods and clear handoffs — not passenger taxis. Density is strongest in Delhi NCR and around the Khatu Shyam Ji corridor; B2B shippers often get recurring lanes and POD-style support.',
  },
  {
    name: 'account_login',
    keywords: [
      'login',
      'log in',
      'sign in',
      'signin',
      'sign up',
      'signup',
      'register',
      'otp',
      'otp not',
      'verification code',
      'cannot log',
      "can't log",
      'password',
      'locked out',
      'session',
      'my account',
    ],
    response:
      'Login and OTP depend on web vs app and SMS delivery. Wait a minute between retries, turn off airplane mode, and use the same mobile you verified. If codes never arrive or you are locked out, use Contact with your number and time of attempt — support can trace auth issues.',
  },
  {
    name: 'restrictions_items',
    keywords: [
      'can i send',
      'can i ship',
      'prohibited',
      'not allowed',
      'restricted',
      'illegal',
      'dangerous',
      'hazardous',
      'explosive',
      'alcohol',
      'liquor',
      'cigarette',
      'weapon',
      'drug',
      'cash bundle',
      'gold jewellery',
      'live animal',
      'pet transport',
    ],
    response:
      'Liftngo is for legal commercial goods with safe handoffs. We do not support contraband, undeclared hazardous goods, cash bundles, or live animals unless a specific product allows it. Alcohol, tobacco, and high-value jewellery often need pre-approval — describe the item on Contact before you book so compliance can confirm.',
  },
  {
    name: 'b2b',
    keywords: [
      'business',
      'bulk',
      'b2b',
      'logistics',
      'warehouse',
      'enterprise',
      'fleet',
      'corporate',
      'freight',
      'industrial',
      'supplier',
      'msme',
      'startup logistics',
      'distributor',
      'vendor delivery',
      'stock transfer',
      'plant to warehouse',
      'daily route',
      'line haul',
      'indent',
    ],
    response:
      'B2B on Liftngo targets recurring lanes, steady capacity, and clean handoffs — stock transfers, retail distribution, and multi-drop patterns across NCR plus programs tied to the Khatu corridor. Share lane A→B, frequency, pallets or tonnage, GST and POD needs, and any SLAs; we respond with a commercial proposal instead of only a retail fare.',
  },
  {
    name: 'food_restaurant',
    keywords: [
      'find restaurant',
      'restaurant menu',
      'food order',
      'order food',
      'kitchen delivery',
      'hotel food',
      'devotee food',
    ],
    response:
      'Where enabled, Liftngo links restaurant discovery with structured delivery handoffs: use Find restaurant, build your cart, then follow prompts (often WhatsApp confirmation with the kitchen before a rider trip). That path is separate from generic goods booking — pick the flow that matches food vs parcels.',
  },
  {
    name: 'khatu_corridor',
    keywords: [
      'khatu shyam',
      'shyam ji',
      'temple delivery',
      'ringas',
      'reengus',
      'salasar corridor',
      'temple corridor',
      'darshan',
      'khatu vendor',
      'khatu shop',
      'khatu hotel',
      'khatu marketplace',
    ],
    response:
      'Around Khatu Shyam Ji we focus on vendor, hotel, marketplace, and corridor logistics — festival peaks need early pins and realistic ready times. Use the Khatu-specific pages (hotels, marketplace, travel) when your trip matches those products; otherwise use standard goods booking for point-to-point cargo.',
  },
  {
    name: 'express',
    keywords: [
      'same day',
      'same-day',
      'express',
      'urgent',
      'fast delivery',
      'quick delivery',
      'immediate',
      'asap',
      'rush',
      'today delivery',
      'within hour',
      'few hours',
      'tonight',
      'tomorrow morning',
      'early slot',
      'late night',
      'weekend delivery',
      'sunday delivery',
    ],
    response:
      'Express slots ride on live fleet slack and lane congestion — festival days in Khatu and peak NCR hours fill fast. Enter real ready time and pins in booking; if nothing is bookable, use Contact or Continue on WhatsApp after 10 messages with “urgent + pickup + drop + deadline” so ops can confirm manually.',
  },
  {
    name: 'vehicle_three_wheeler',
    keywords: [
      '3 wheeler',
      '3-wheeler',
      'three wheeler',
      'three-wheeler',
      'three wheel',
      'tempo',
      'goods auto',
      'cargo auto',
      'auto rickshaw',
      'e rickshaw',
      'e-loader',
      'electric three',
      'ev cargo',
    ],
    response:
      'Three-wheeler cargo (including many e‑loader variants) is the workhorse for tight NCR lanes and mid‑weight sacks where a mini truck cannot turn easily. Pick the 3W class in booking when offered; if dimensions or stairs suggest otherwise, trip options may upsell you to 4W for safety and insurance-readiness.',
  },
  {
    name: 'vehicle_two_wheeler',
    keywords: [
      '2 wheeler',
      '2-wheeler',
      'two wheeler',
      'two-wheeler',
      'bike delivery',
      'scooter delivery',
      'motorcycle courier',
      'cycle courier',
      'documents only',
    ],
    response:
      'Two-wheeler slots are for compact parcels, pouches, and temperature‑light documents — built for fast city hops when the lane allows 2W. Start a booking; if policy blocks 2W on your pin pair you will only see 3W / 4W, which usually means access or risk rules required the larger class.',
  },
  {
    name: 'vehicle_four_wheeler',
    keywords: [
      '4 wheeler',
      '4-wheeler',
      'four wheeler',
      'four-wheeler',
      'mini truck',
      'pickup truck',
      'tata ace',
      'light truck',
      'lcv',
      'canter',
      'open body truck',
      'chhota hathi',
      'chota hathi',
      'mahindra pickup',
      'bolero pickup',
    ],
    response:
      'Mini trucks and LCVs carry palletised retail, appliances, drum lots, and multi‑bag transfers where 3W cannot absorb the cubic volume. List each stop, mention stairs or lift constraints, and approximate weight — the stack suggests valid LCV classes and blocks obviously under‑spec bookings.',
  },
  {
    name: 'ev_green',
    keywords: [
      'electric vehicle',
      'ev fleet',
      'green logistics',
      'zero emission',
      'sustainability',
      'cng vehicle',
      'less pollution',
    ],
    response:
      'Liftngo uses electric three‑wheeler cargo and efficient routing where lanes and charging support it — especially on repetitive B2B shuttles in NCR. Not every pin pair guarantees an EV yet; choose the offered class at booking time or ask B2B sales if you need a dedicated low‑emission program.',
  },
  {
    name: 'outside_core_zones',
    keywords: [
      'mumbai',
      'bengaluru',
      'bangalore',
      'chennai',
      'hyderabad',
      'kolkata',
      'pune',
      'ahmedabad',
      'lucknow',
      'indore',
      'jaipur',
      'pan india',
      'all india',
      'pan-india',
      'international ship',
      'ship abroad',
      'export cargo',
      'import cargo',
    ],
    response:
      'Liftngo is deliberately dense in Delhi NCR and the Khatu Shyam Ji corridor rather than a generic pan‑India parcel network. For Mumbai, Bengaluru, or other metros we may still design select trunk lanes with B2B clients — send lane, volume, and cadence via Contact. Pure international or air freight is outside usual retail booking.',
  },
  {
    name: 'delivery_general',
    keywords: [
      'delivery',
      'parcel',
      'package',
      'courier',
      'consignment',
      'door to door',
      'door-to-door',
      'last mile',
      'last-mile',
      'pickup and drop',
      'pick up and drop',
      'ship goods',
      'send goods',
      'send package',
      'move goods',
      'goods movement',
      'reverse pickup',
      'reverse pick',
      'handover',
      'hand over',
      'office transfer',
      'interoffice',
      'branch to branch',
      'samples',
      'gift hamper',
      'return pickup',
      'amazon return',
      'flipkart return',
    ],
    response:
      'Liftngo handles repeatable pickup‑and‑drop patterns: branch transfers, return pickups, e‑commerce bags, shop restocks, and documents in published zones. Accuracy matters — pin both buildings, add gate or tower notes, and mention if security passes are needed. Booking is the fastest way to see live vehicles and fares for that lane.',
  },
  {
    name: 'load_weight',
    keywords: [
      'kilogram',
      'kilo',
      'kg',
      'kgs',
      'ton',
      'tonne',
      'weight',
      'heavy',
      'bulky',
      'oversized',
      'pallet',
      'dimensions',
      'cbm',
      'volume',
      'fragile',
      'stackable',
      'non stackable',
      'loading bay',
      'lift gate',
    ],
    response:
      'Declared weight, cubic volume, stackability, and fragility drive vehicle class and handling (straps, blankets, no‑tilt). Note lifts, basements, or narrow lanes — they affect what can legally reach the door. Put this in the booking goods field so dispatch assigns the right partner.',
    captureLead: true,
  },
  {
    name: 'tracking',
    keywords: [
      'track',
      'tracking',
      'where is my',
      'where is my order',
      'order status',
      'shipment status',
      'live status',
      'eta',
      'where is driver',
      'call driver',
      'driver location',
      'not moving',
      'stuck at',
    ],
    response:
      'Live status, partner name, and vehicle metadata display inside the active trip screen on web or app. If GPS stalls or the driver is unresponsive, retry after network refresh; persistent issues need the booking ID on Contact or Continue on WhatsApp after 10 messages so ops can ping the field team.',
  },
  {
    name: 'documents_pod',
    keywords: [
      'proof of delivery',
      'pod',
      'delivery receipt',
      'signed copy',
      'lr copy',
      'eway',
      'e-way',
      'gst invoice copy',
      'misplaced invoice',
      'digital pod',
    ],
    response:
      'POD photos, signed challans, and GST documents are usually attached to completed trips or emailed for B2B accounts. Ask finance or ops through Contact with your booking / LR number if something is missing — do not share Aadhaar or unrelated ID over public WhatsApp.',
  },
  {
    name: 'payment',
    keywords: [
      'payment',
      'pay online',
      'upi',
      'card',
      'cod',
      'cash on delivery',
      'invoice',
      'gst',
      'refund',
      'billing',
      'netbanking',
      'net banking',
      'payment failed',
      'double charge',
      'reconcile',
      'tds',
      'credit note',
    ],
    response:
      'Retail trips generally settle with UPI, cards, or COD depending on corridor rules; B2B may run on GST invoices + agreed credit days. Always screenshot failed payment IDs. Refunds and double-settlement investigations start from Contact / finance with booking references — we cannot reverse cash handed to a partner at the gate without verification.',
  },
  {
    name: 'service_reliability',
    keywords: [
      'safe',
      'safety',
      'insured',
      'insurance',
      'damage',
      'lost',
      'missing',
      'complaint',
      'delay',
      'late delivery',
      'rude driver',
      'misbehaviour',
      'misbehavior',
      'wrong item',
    ],
    response:
      'Service issues get a ticket with your booking ID, timestamps, and optional photos. We separate mechanical delays from behaviour complaints — both route to ops, but harassment allegations are escalated faster. Use Contact or Continue on WhatsApp after 10 messages; avoid sharing unrelated personal data.',
  },
  {
    name: 'driver',
    keywords: [
      'driver',
      'join liftngo',
      'drive for',
      'earn',
      'partner driver',
      'documents for driver',
      'become driver',
      'driver onboarding',
      'driver payout',
      'driver commission',
      'daily payout',
      'driving license',
      'rc book',
      'vehicle papers',
      'incentives',
      'kyc driver',
    ],
    response:
      'Field partners need cleared KYC, a commercially insured vehicle where policy demands it, and category‑matched commercial licenses. Incentive structures vary by city program — read Become driver and the latest partner FAQ. For onboarding queues or document checks, message through Contact with your mobile and vehicle class.',
  },
  {
    name: 'careers_office',
    keywords: [
      'career',
      'job opening',
      'vacancy',
      'hiring',
      'hr contact',
      'apply for job',
      'office job',
      'internship',
    ],
    response:
      'Corporate, tech, and field‑ops hiring is listed on the Careers page when roles are open. Send CVs only through the official channel noted there — we do not collect hiring fees. Driver partner signup stays under Become driver, which is different from salaried office roles.',
  },
  {
    name: 'coverage',
    keywords: [
      'noida',
      'noids',
      'sector',
      'delhi',
      'gurgaon',
      'gurugram',
      'ghaziabad',
      'faridabad',
      'ncr',
      'greater noida',
      'noida extension',
      'khatu',
      'salasar',
      'available in',
      'available at',
      'service area',
      'which cit',
      'where do you',
      'do you serve',
      'do you operate',
      'coverage',
      'operate in',
      'local area',
      'hyperlocal',
      'okhla',
      'nehru place',
      'connaught',
      'dwarka',
      'dwarka mor',
      'manesar',
      'bawal',
      'dlf',
      'cyber city',
      'udyog vihar',
      'sector 62',
      'sector 18',
      'shipra',
      'vaishali',
      'kaushambi',
      'botanical garden',
    ],
    response:
      'Published density covers the full Delhi NCR mass — Noida (including expressway sectors), Greater Noida, Ghaziabad, Gurugram / Manesar industrial belts, Faridabad, and key Delhi clusters — plus purpose-built programs around Khatu Shyam Ji. Micro-lanes still need pin validation: drop both Google pins when possible so routing engines accept the trip.',
  },
  {
    name: 'about',
    keywords: [
      'liftngo',
      'what is',
      'who are you',
      'tell me about',
      'know more',
      'your company',
      'about you',
      'how liftngo',
      'lift ngo',
      'is liftngo legit',
      'trust liftngo',
      'reliable',
      'reviews',
      'scam',
      'fraud',
    ],
    response:
      'Liftngo is an operations-heavy goods platform — not a gig-rider experiment. We combine transparent street pricing for retail moves with deeper SLAs for B2B accounts, EV-heavy 3W capacity where lanes allow, and corridor expertise around Khatu. Always book inside the official app / web; never pay random UPI IDs sent over chat.',
  },
  {
    name: 'compare_players',
    keywords: [
      'porter alternative',
      'porter vs',
      'dunzo for business',
      'shadowfax',
      'delhivery',
      'elastic run',
      'compare with porter',
      'difference from',
    ],
    response:
      'Marketplaces optimise different slices: some chase food-only riders, others chase long-haul line-haul. Liftngo intentionally concentrates on Delhi NCR + Khatu-style corridors with multi-vehicle goods, POD discipline, and B2B tooling. If you already use another vendor, tell us the lane and SLA gap — we either prove parity or politely decline.',
  },
  {
    name: 'privacy_data',
    keywords: [
      'privacy policy',
      'data delete',
      'delete my data',
      'gdpr',
      'personal data',
      'how you use data',
      'cookies',
    ],
    response:
      'Privacy practices are summarised on the site’s legal pages (Privacy / Terms). For account erasure or export requests, email the address on Contact with your registered mobile — legal verifies identity before purging ledgers tied to finance or disputes.',
  },
  {
    name: 'help',
    keywords: ['help', 'support', 'human', 'someone', 'talk to team', 'issue'],
    response:
      'Happy to point you in the right direction. For account, billing, or urgent issues, use the Contact page — or Continue on WhatsApp after 10 messages in this chat when it is enabled.',
  },
  {
    name: 'contact_channel',
    keywords: ['contact', 'call', 'email', 'whatsapp', 'phone number'],
    response:
      'Phone, email, and office details are on the Contact page. For WhatsApp, keep chatting until Continue on WhatsApp appears (after 10 of your messages) — say if it is booking, B2B, or a complaint.',
  },
  {
    name: 'thanks',
    keywords: ['thanks', 'thank you', 'thx', 'appreciate'],
    response:
      'Glad that helped. Ask anytime about lanes, vehicles, B2B, or Khatu — or use Contact / Continue on WhatsApp after 10 messages here.',
  },
  {
    name: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'hola'],
    response:
      'Hi — Liftngo assistant here. Ask about booking, fares, 2W / 3W / 4W choice, NCR or Khatu coverage, B2B, food flows, cancellations, payments, tracking, restricted goods, EV cargo, driver partnering, careers, or privacy. What do you need?',
  },
];

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

/** Avoid false positives (e.g. `hi` inside `this`). Multi-word phrases use substring match. */
function keywordMatches(haystack: string, keyword: string): boolean {
  const k = keyword.toLowerCase();
  if (k.includes(' ')) return haystack.includes(k);
  if (k === 'kg' || k === 'kgs') {
    return /\d\s*kgs?\b|\bkgs?\b/i.test(haystack);
  }
  if (k.length <= 3) {
    const re = new RegExp(`\\b${escapeRegex(k)}\\b`, 'i');
    return re.test(haystack);
  }
  return haystack.includes(k);
}

function matchIntent(lower: string) {
  for (const intent of intents) {
    const hit = intent.keywords.some((kw) => keywordMatches(lower, kw));
    if (hit) return intent;
  }
  return null;
}

export function getBotReply(message: string, state: ChatState): BotReplyResult {
  const trimmed = message.trim();
  const step = state.leadStep ?? null;

  if (step === 'ask_name') {
    const name = trimmed.replace(/\s+/g, ' ');
    if (name.length < 2) {
      return { reply: 'Please enter your name.', nextLeadStep: 'ask_name' };
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
        reply: 'Please enter a valid 10-digit mobile number.',
        nextLeadStep: 'ask_phone',
      };
    }
    return {
      reply: LEAD_THANK_YOU,
      nextLeadStep: null,
      leadDataPatch: { phone },
    };
  }

  const lower = trimmed.toLowerCase();
  const intent = matchIntent(lower);

  if (!intent) {
    return {
      reply: FALLBACK_REPLY,
      suggestedChips: [...FALLBACK_SUGGESTION_CHIPS],
    };
  }

  const result: BotReplyResult = {
    reply: intent.response,
  };

  if ('action' in intent && intent.action) {
    result.action = intent.action;
  }

  if ('captureLead' in intent && intent.captureLead) {
    result.captureLead = true;
  }

  return result;
}

/**
 * Short random delay so the typing indicator feels natural.
 * Kept modest so local (rule-based) replies still feel snappy.
 */
export function typingDelayMs(): number {
  return 180 + Math.floor(Math.random() * 220);
}
