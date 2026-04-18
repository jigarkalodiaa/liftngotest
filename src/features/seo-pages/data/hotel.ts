import { SeoPageData } from '../types';

export const hotelLogisticsData: SeoPageData = {
  slug: 'hotel-logistics-partner',
  keyword: 'hotel logistics partner',
  city: 'India',
  intent: 'transactional',

  seo: {
    title: 'Hotel Logistics Partner India — Liftngo',
    description:
      'Logistics partner for hotels, dharamshalas & resorts. Linen pickup, supply delivery, guest luggage service. Starting ₹50. Serving Khatu, Jaipur & NCR.',
    keywords: [
      'hotel logistics partner',
      'hotel supply delivery',
      'dharamshala logistics',
      'hotel linen pickup',
      'resort logistics service',
      'hotel delivery partner',
      'hospitality logistics India',
      'hotel supply chain',
      'guest luggage delivery',
      'hotel vendor delivery',
    ],
    path: '/hotel-logistics-partner',
  },

  hero: {
    badge: 'HOTEL LOGISTICS',
    badgeIcon: 'Hotel',
    title: 'Hotel Logistics Partner',
    subtitle: 'India',
    description:
      'Complete logistics for hotels, dharamshalas, and resorts. From linen pickup to guest services — we handle your supply chain so you can focus on hospitality.',
    highlightText: 'Starting at ₹50',
    gradient: 'from-blue-600 to-cyan-600',
  },

  stats: [
    { value: '50+', label: 'Hotel Partners' },
    { value: '24/7', label: 'Service' },
    { value: '₹50', label: 'Starting Price' },
    { value: '99%', label: 'On-Time' },
  ],

  benefits: [
    {
      icon: 'Clock',
      title: '24/7 Availability',
      description: 'Hotels never sleep, neither do we. Round-the-clock logistics support.',
    },
    {
      icon: 'Package',
      title: 'Linen & Laundry',
      description: 'Daily pickup and delivery of linen to/from laundry facilities.',
    },
    {
      icon: 'Truck',
      title: 'Supply Delivery',
      description: 'Toiletries, F&B supplies, housekeeping items delivered on schedule.',
    },
    {
      icon: 'Users',
      title: 'Guest Services',
      description: 'Luggage transfer, airport pickup coordination, guest errands.',
    },
    {
      icon: 'Calendar',
      title: 'Scheduled Runs',
      description: 'Set up recurring pickups and deliveries. Never miss a schedule.',
    },
    {
      icon: 'Shield',
      title: 'Trusted Drivers',
      description: 'Verified drivers trained for hospitality environment.',
    },
  ],

  useCases: [
    {
      icon: 'Hotel',
      title: 'Hotels & Resorts',
      description: 'Full-service hotels needing reliable supply chain.',
    },
    {
      icon: 'Building2',
      title: 'Dharamshalas',
      description: 'Pilgrimage accommodations with high-volume needs.',
    },
    {
      icon: 'Store',
      title: 'Guest Houses',
      description: 'Smaller properties without dedicated logistics.',
    },
    {
      icon: 'Star',
      title: 'Boutique Hotels',
      description: 'Premium properties requiring white-glove service.',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Setup Schedule',
      description: 'Define your recurring pickup/delivery needs and timings.',
    },
    {
      step: 2,
      title: 'Daily Operations',
      description: 'Drivers arrive on schedule. Ad-hoc requests via WhatsApp.',
    },
    {
      step: 3,
      title: 'Track & Report',
      description: 'Real-time tracking. Monthly reports for your records.',
    },
  ],

  faqs: [
    {
      question: 'What hotel logistics services do you provide?',
      answer:
        'We handle linen pickup/delivery, supply chain logistics (toiletries, F&B, housekeeping), guest luggage services, vendor coordination, and emergency supply runs.',
    },
    {
      question: 'Do you offer scheduled recurring pickups?',
      answer:
        'Yes, we set up daily, weekly, or custom schedules for recurring needs like linen laundry runs. You can also request ad-hoc pickups anytime via WhatsApp.',
    },
    {
      question: 'What areas do you serve for hotel logistics?',
      answer:
        'We serve hotels in Khatu Shyam Ji (high volume during melas), Sikar, Jaipur, and Delhi NCR. Expanding to more pilgrimage and tourist destinations.',
    },
    {
      question: 'How do you handle guest luggage?',
      answer:
        'We provide secure luggage transfer between properties, airport/station pickup coordination, and same-day luggage delivery for early check-in/late checkout guests.',
    },
    {
      question: 'What is the pricing for hotel logistics?',
      answer:
        'Pricing starts at ₹50 per trip for local runs. We offer monthly contracts with volume discounts for hotels with 50+ trips/month. Custom pricing for large properties.',
    },
  ],

  internalLinks: [
    { href: '/restaurant-delivery-partner', label: 'Restaurant Delivery', icon: 'Utensils' },
    { href: '/hyperlocal-delivery-service', label: 'Hyperlocal Delivery', icon: 'Zap' },
    { href: '/same-day-delivery-khatu', label: 'Same Day Delivery', icon: 'Clock' },
    { href: '/fare-calculator', label: 'Calculate Fare', icon: 'IndianRupee' },
  ],

  cta: {
    title: 'Partner with Liftngo for Hotel Logistics',
    description: 'Join 50+ hotels already streamlining their supply chain with us.',
    whatsappText: 'Hi Liftngo, I want to partner for hotel logistics',
    footerText: '+91 85805 84898 • Hotel partnerships',
    bgColor: 'bg-blue-600',
  },

  schema: {
    service: {},
    breadcrumb: {},
    faq: {},
  },

  theme: {
    primary: 'blue',
    accent: 'blue-600',
    gradient: 'from-blue-600 to-cyan-600',
  },
};
