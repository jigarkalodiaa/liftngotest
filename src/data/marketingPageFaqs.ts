import type { FaqItem } from '@/data/faq';

/** B2B transport landing — visible UI + FAQPage JSON-LD (see `b2b-transport/page.tsx`). */
export const B2B_TRANSPORT_PAGE_FAQS: FaqItem[] = [
  {
    id: 'b2b-1',
    question: 'What does Liftngo mean by B2B logistics in India?',
    answer:
      'We coordinate goods transport for businesses: wholesalers, distributors, retail chains, and ops teams that need repeat or urgent legs—not passenger rides. The focus is upfront estimates, cargo-appropriate vehicles (2W through mini truck), and handoffs your finance team can audit. Dense work exists in Noida and wider Delhi NCR, alongside hyperlocal depth around Khatu Shyam Ji.',
  },
  {
    id: 'b2b-2',
    question: 'Do you provide delivery and goods transport for companies in Noida and Delhi NCR?',
    answer:
      'Yes. Noida B2B logistics is a deliberate corridor for us: supplier parks, retail backhaul, documents, and cartons that need predictable windows. Start with a single lane, measure punctuality and proof of delivery, then scale recurring routes. Use the Noida & Delhi NCR landing page for positioning details.',
  },
  {
    id: 'b2b-3',
    question: 'How are charges calculated for commercial goods transport?',
    answer:
      'Estimates typically reflect distance, vehicle class, and live demand on the lane. You should see a quote before confirming—critical for wholesale and retail ops that cannot absorb surprise surcharges. Waiting, tolls, or exceptional handling may adjust the final amount; those cases should be rare and documented.',
  },
  {
    id: 'b2b-4',
    question: 'Can we book mini trucks or 3W cargo for recurring wholesale lanes?',
    answer:
      'Yes, when inventory and gate timings fit. Three-wheeler cargo suits many intra-city cartons; four-wheeler mini trucks help when cubic volume or strap-down needs exceed a 3W deck. Align vehicle class to payload rather than cheapest headline fare.',
  },
  {
    id: 'b2b-5',
    question: 'Is electric or EV cargo part of B2B programmes?',
    answer:
      'Where charging, turnaround, and payload fit the lane, EV cargo slots appear in the same booking flow as conventional fuel options. We do not force EV where physics or depot access disagrees—the goal is reliable completion, not greenwashing.',
  },
  {
    id: 'b2b-6',
    question: 'How does Khatu Shyam Ji relate to Liftngo B2B?',
    answer:
      'Khatu is a high-density hyperlocal corridor: vendors, kitchens, and shops moving stock near the temple zone. It complements—not replaces—NCR B2B: same cargo-first product principles, different traffic and handoff realities.',
  },
];

/** Contact page — support & corridor context. */
export const CONTACT_PAGE_FAQS: FaqItem[] = [
  {
    id: 'contact-1',
    question: 'What is the fastest way to get help with an active booking?',
    answer:
      'Use in-app or web support paths tied to your trip reference when logged in. For general enquiries before you book, read the FAQ hub, then contact us via phone or email when those channels are published for your environment.',
  },
  {
    id: 'contact-2',
    question: 'Should I message support differently for Khatu Shyam Ji versus Noida?',
    answer:
      'Yes—include your corridor (Khatu hyperlocal vs Noida / Delhi NCR B2B), pin-ready addresses, and vehicle class if known. Peak festival days around Khatu and gate congestion in NCR industrial pockets need different context; specifics reduce back-and-forth.',
  },
  {
    id: 'contact-3',
    question: 'Can businesses request GST-compliant documentation through contact?',
    answer:
      'Where billing is enabled for your account or lane, finance can align invoices with your GST profile. Share legal entity name, GSTIN, and billing address in the channel your ops contact specifies—generic DMs without booking references slow resolution.',
  },
  {
    id: 'contact-4',
    question: 'What details should I include in an email to Liftngo?',
    answer:
      'Include booking ID if applicable, pickup and drop areas (not vague landmarks), time window, cargo summary, and photos if disputing damage. For partnerships, state corridor, estimated monthly trips, and whether you need proof-of-delivery discipline.',
  },
  {
    id: 'contact-5',
    question: 'Where can I follow official Liftngo updates?',
    answer:
      'Use the social links on this contact page—LinkedIn, Instagram, X, and YouTube—for product and corridor announcements. Do not rely on unofficial groups for tariff or policy truth.',
  },
  {
    id: 'contact-6',
    question: 'Does Liftngo offer phone support for urgent cargo issues?',
    answer:
      'When a public support number is configured, it appears on this page. If none is shown, your booking confirmation or partner WhatsApp may be the right escalation—carrier policy depends on corridor.',
  },
];

/** Become a driver — onboarding & corridors. */
export const BECOME_DRIVER_PAGE_FAQS: FaqItem[] = [
  {
    id: 'drv-1',
    question: 'How do I apply to become a Liftngo driver partner?',
    answer:
      'Start on our Careers page for open roles and driver-success programmes. The Become a driver page summarises cargo expectations; final onboarding steps, document checks, and incentives are communicated by the driver team.',
  },
  {
    id: 'drv-2',
    question: 'Which vehicles can I operate in Noida or Khatu corridors?',
    answer:
      'Match your registered vehicle class to what the platform books: walk, two-wheeler goods, three-wheeler cargo, or four-wheeler mini truck. Passenger framing does not map to Liftngo—you move consignments with proof-oriented completion.',
  },
  {
    id: 'drv-3',
    question: 'How do earnings and incentives usually work?',
    answer:
      'Liftngo emphasises salary-plus-duty-based incentives tied to completed, punctual deliveries—not opaque surge games. Exact structures depend on city programme and utilisation targets your onboarding packet explains.',
  },
  {
    id: 'drv-4',
    question: 'What documents are typically required?',
    answer:
      'Expect identity verification, driving credentials, vehicle registration and fitness aligned to commercial goods use, and insurance context appropriate for cargo. Requirements may tighten by municipal or state rules.',
  },
  {
    id: 'drv-5',
    question: 'Is there training for loading and customer handoff?',
    answer:
      'Yes where the programme offers orientation: securing loads, orientation marks, and polite gate behaviour matter as much as GPS. Dense lanes near Khatu Shyam Ji and tight Noida docks reward drivers who treat handoffs as part of the job.',
  },
  {
    id: 'drv-6',
    question: 'Can I drive in both Khatu and Delhi NCR?',
    answer:
      'Corridor assignment depends on compliance, demand, and dispatch rules. Apply with your home base; operations will place you where utilisation and legal clearance align—do not assume nationwide roaming.',
  },
];
