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
    id: 'service-meaning',
    question: 'What is goods transport service?',
    answer:
      'Goods transport service refers to the movement of cargo, parcels, and commercial items from one location to another using appropriate vehicles. Liftngo provides instant goods transport services in Noida and Delhi NCR using bikes, autos, mini trucks, and tempos. Our service includes pickup, safe transport, and doorstep delivery with real-time tracking.',
  },
  {
    id: 'airport-service',
    question: 'What is luggage delivery service at airports?',
    answer:
      'Luggage delivery service at airports helps travelers transport their baggage separately from their journey. While Liftngo primarily focuses on goods transport, we can arrange pickup and delivery of luggage and parcels to/from airport areas in Delhi NCR. Contact our support for airport area deliveries.',
  },
  {
    id: 'hotel-service',
    question: 'What is goods delivery service for hotels?',
    answer:
      'Hotels often need regular supply deliveries including linens, toiletries, food supplies, and guest packages. Liftngo provides scheduled and on-demand delivery services for hotels in Noida, Delhi, and Khatu Shyam Ji. We handle everything from daily supplies to urgent guest package deliveries.',
  },
  {
    id: 'meaning-hindi',
    question: 'Goods transport ka matlab kya hai? (What does goods transport mean in Hindi?)',
    answer:
      'Goods transport ka matlab hai saman ko ek jagah se doosri jagah pahunchana. Liftngo ek digital platform hai jo Noida aur Delhi NCR mein instant goods delivery provide karta hai. Aap bike, auto, ya mini truck book kar sakte hain apne saman ko safely deliver karne ke liye. Hindi mein ise "maal dhulai" ya "saman transport" bhi kehte hain.',
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
      'Liftngo currently serves Khatu Shyam Ji and the Delhi NCR region (Noida, Gurugram, Ghaziabad, Faridabad, and Delhi). We focus on deep coverage in these areas to ensure reliable service. For B2B clients with consistent volume in other cities, we can design dedicated trunk lanes — reach out via the Contact page.',
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
  {
    id: '15',
    question: 'Do you run B2B logistics in Noida and Delhi NCR?',
    answer:
      'Yes—Noida and wider Delhi NCR are focus corridors for commercial goods: supplier shuttles, retail runs, and documents. Pilot one repeatable lane, then expand when punctuality and proof-of-delivery meet your SLA.',
  },
  {
    id: '16',
    question: 'Is Khatu Shyam Ji covered for same-day goods delivery?',
    answer:
      'Hyperlocal delivery around Khatu Shyam Ji depends on demand and lane congestion—especially festival peaks. Start a booking with pickup and drop pins to see live vehicle options; WhatsApp helps coordinate recurring vendor patterns.',
  },
  {
    id: 'charges-per-km',
    question: 'What are the delivery charges per km?',
    answer:
      'Liftngo delivery charges depend on vehicle type and distance. For bikes (2W), charges start at ₹10-15 per km. For autos (3W), it is ₹15-20 per km. Mini trucks start at ₹18-25 per km. You always see the total fare upfront before booking. Use our fare calculator for accurate estimates.',
  },
  {
    id: 'how-to-book',
    question: 'How to book delivery service near me?',
    answer:
      'Booking on Liftngo is simple: 1) Visit goliftngo.comor open the app, 2) Enter pickup and drop location, 3) Select vehicle type (bike, auto, mini truck), 4) See upfront fare and confirm booking, 5) Track your delivery in real-time. You can also book via WhatsApp for quick orders.',
  },
  {
    id: 'vehicles-available',
    question: 'What vehicles does Liftngo provide?',
    answer:
      'Liftngo offers multiple vehicle options: 2-Wheeler (bikes) for documents and small parcels up to 20kg, 3-Wheeler (autos) for medium loads up to 300kg, Mini Trucks (Tata Ace, Mahindra Bolero) for large shipments up to 1000kg. Choose based on your cargo size and weight.',
  },
  {
    id: 'home-shifting',
    question: 'How does home shifting service work?',
    answer:
      'Liftngo home shifting includes: free survey and quote, professional packing with quality materials, careful loading by trained staff, GPS-tracked transport, unloading and basic arrangement at destination. Prices start from ₹2,999 for local moves. Book via WhatsApp or app.',
  },
  {
    id: 'customer-care',
    question: 'How to contact Liftngo customer support?',
    answer:
      'You can reach Liftngo support through: WhatsApp at +91 85805 84898 (fastest response), Phone call to the same number, Email at support@goliftngo.in, or through the in-app chat. Our support team is available 7 days a week from 8 AM to 10 PM.',
  },
  {
    id: 'packers-movers',
    question: 'Does Liftngo provide packers and movers service?',
    answer:
      'Yes, Liftngo offers complete packers and movers service in Noida and Delhi NCR. This includes professional packing, loading, transport, unloading, and unpacking. We provide all packing materials like boxes, bubble wrap, and furniture covers. Get instant quotes via WhatsApp.',
  },
  {
    id: 'same-day-delivery',
    question: 'Is same day delivery available?',
    answer:
      'Yes, Liftngo specializes in same day delivery across Noida, Delhi, Gurgaon, and NCR. For most intra-city routes, we can deliver within 2-4 hours. Express delivery options are available for urgent shipments. Check availability by starting a booking.',
  },
  {
    id: 'delivery-partner',
    question: 'How can I become a delivery partner?',
    answer:
      'Join Liftngo as a delivery partner: 1) WhatsApp us at +91 85805 84898, 2) Submit documents (DL, RC, Aadhaar, PAN), 3) Complete verification (24-48 hours), 4) Download driver app and start earning. No joining fee. Earn ₹15,000-50,000 monthly based on vehicle type.',
  },
  {
    id: 'tracking',
    question: 'How do I track my delivery?',
    answer:
      'Once your booking is confirmed, you get a tracking link via SMS and WhatsApp. Open the link to see real-time driver location on map. You also receive notifications for pickup, in-transit, and delivery completion. For any issues, contact support with your booking ID.',
  },
  {
    id: 'insurance',
    question: 'Is my shipment insured during delivery?',
    answer:
      'All Liftngo deliveries include basic transit insurance covering damage during transport. For high-value items, declare the value during booking for additional coverage. Home shifting services include comprehensive insurance. Check booking terms for coverage limits.',
  },
  {
    id: 'payment-options',
    question: 'What payment options are available?',
    answer:
      'Liftngo accepts multiple payment methods: UPI (GPay, PhonePe, Paytm), Debit/Credit cards, Net banking, Cash on delivery (for select services), and Corporate billing for B2B accounts. GST invoices are available for business customers.',
  },
];

/** Shown on the homepage FAQ section; full list lives at `/faq`. */
export const VISIBLE_FAQ_COUNT = 8;

export const HOMEPAGE_FAQ_PREVIEW = FAQ_ITEMS.slice(0, VISIBLE_FAQ_COUNT);
