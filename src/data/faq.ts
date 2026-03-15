/**
 * Single source of truth for FAQ content. Used by FaqSection and FAQ JSON-LD.
 */

export const FAQ_ITEMS = [
  {
    id: '1',
    question: 'What is LiftnGo?',
    answer:
      'LiftnGo is a ride and delivery platform that connects you with verified drivers for quick, affordable trips and deliveries.',
  },
  {
    id: '2',
    question: 'How do I book a delivery?',
    answer:
      'Enter your pickup location on the homepage or in the app, choose your service (Walk, 2 Wheeler, or 3 Wheeler), and confirm. A driver will be assigned to you.',
  },
  {
    id: '3',
    question: 'What is on the road to reach LiftnGo?',
    answer:
      'We work with trained drivers and partners to ensure safe, reliable service. You can track your ride or delivery in real time in the app.',
  },
  {
    id: '4',
    question: 'What is our app all about for delivery?',
    answer:
      'The LiftnGo app lets you book rides and deliveries, track in real time, pay securely, and access offers. Available for both customers and drivers.',
  },
] as const;

export const VISIBLE_FAQ_COUNT = 4;
