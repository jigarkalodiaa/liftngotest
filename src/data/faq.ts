/**
 * FAQ — homepage preview + full /faq page + homepage FAQ JSON-LD (preview only).
 * Copy is SEO-aligned: Khatu, B2B, EV, hyperlocal, food, payments.
 */

export type FaqItem = { id: string; question: string; answer: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: '1',
    question: 'What is Liftngo?',
    answer:
      'Liftngo is a hyperlocal logistics platform for B2B and B2C goods transport in India. We connect you with verified drivers for walk, two-wheeler, three-wheeler, and four-wheeler deliveries—with strong operational focus around Khatu (Rajasthan) and B2B corridors in Noida & Delhi NCR. We are not a passenger cab app.',
  },
  {
    id: '2',
    question: 'Do you offer B2B logistics in Khatu?',
    answer:
      'Yes. Liftngo serves shops, wholesalers, guest houses, restaurants, and dharamshalas around Khatu Shyam Ji with recurring and on-demand goods movement. Book same-day or scheduled runs for stock, provisions, and commercial cartons.',
  },
  {
    id: '3',
    question: 'How do I book goods transport near me?',
    answer:
      'Use Book delivery on liftngo.com, enter pickup and drop, then choose Walk, 2W, 3W, or 4W mini truck. You see an upfront estimate before you confirm. EV cargo and CNG/diesel/petrol options are matched to your lane.',
  },
  {
    id: '4',
    question: 'Is EV cargo delivery available?',
    answer:
      'Yes, where the lane fits—we use electric three-wheel cargo and other compact EVs for last-mile legs, alongside CNG, diesel, and petrol vehicles when that is the better operational choice for distance and payload.',
  },
  {
    id: '5',
    question: 'Do you provide same-day delivery?',
    answer:
      'Yes, for many intra-city and hyperlocal corridors. Availability depends on demand, time of day, and vehicle class. Start a booking to see live options for your route.',
  },
  {
    id: '6',
    question: 'How is Liftngo different from a ride-sharing app?',
    answer:
      'Liftngo is built for cargo: clear handoffs, goods-first pricing, and incentives tied to completed deliveries—not commuter star ratings. Ideal for businesses that need dependable goods transport and transparent fares.',
  },
  {
    id: '7',
    question: 'How does pricing and payment work?',
    answer:
      'You typically see an upfront fare estimate before the trip is confirmed based on distance, vehicle class, and corridor. Payment options may include UPI, cards, and enterprise settlement where enabled—follow the prompts in the booking flow for your lane.',
  },
  {
    id: '8',
    question: 'Can I add multiple stops or a return trip?',
    answer:
      'Multi-stop and return patterns depend on product availability in your city. Use the booking flow to add stops where supported; for complex B2B routes, prefer scheduling in advance or speak with your account contact if you have one.',
  },
  {
    id: '9',
    question: 'Do you cover all of India?',
    answer:
      'No. Liftngo is deliberately not pan-India marketing. We focus on high-trust hyperlocal and B2B lanes—especially Khatu Shyam Ji and the Noida / Delhi NCR corridor—rather than promising nationwide coverage we cannot operate consistently.',
  },
  {
    id: '10',
    question: 'How do food orders or restaurant delivery work?',
    answer:
      'You can discover restaurants on Find restaurant, build an order for partner venues, and then book a delivery boy pickup from the restaurant after you confirm with the outlet (e.g. via WhatsApp where shown). Goods description and handoff details carry into the trip.',
  },
  {
    id: '11',
    question: 'Is my shipment insured?',
    answer:
      'Standard trips may include operator-defined liability limits—check the booking terms shown at confirmation. For high-value cargo, declare value where asked and consider separate commercial coverage for critical loads.',
  },
  {
    id: '12',
    question: 'How do I get help or support?',
    answer:
      'Use in-app or web prompts where available, contact options on our site, or WhatsApp / call numbers shown on your booking or partner communications. For B2B accounts, use your designated operations channel if supplied.',
  },
  {
    id: '13',
    question: 'Can businesses get GST-compliant invoices?',
    answer:
      'Where B2B billing is enabled for your account or corridor, you can request GST invoices per your agreement. Add GST details where the product asks (e.g. My details / booking flow) so invoices are issued correctly.',
  },
  {
    id: '14',
    question: 'Which vehicle types can I book?',
    answer:
      'Walk, 2-wheeler cargo, 3-wheeler, and 4-wheeler (mini truck–style) options appear based on your route and availability. Refrigerated and long-haul are on our roadmap—see Services for the latest fleet story.',
  },
];

/** Shown on the homepage FAQ section; full list lives at `/faq`. */
export const VISIBLE_FAQ_COUNT = 6;

export const HOMEPAGE_FAQ_PREVIEW = FAQ_ITEMS.slice(0, VISIBLE_FAQ_COUNT);
