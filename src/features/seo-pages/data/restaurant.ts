import { SeoPageData } from '../types';

export const restaurantDeliveryData: SeoPageData = {
  slug: 'restaurant-delivery-partner',
  keyword: 'restaurant delivery partner',
  city: 'Rajasthan',
  intent: 'transactional',

  seo: {
    title: 'Restaurant Delivery Partner Rajasthan — Liftngo',
    description:
      'Partner with Liftngo for restaurant delivery in Rajasthan. Reliable food delivery for restaurants, cloud kitchens & cafes. Starting ₹30 per delivery. Join 100+ restaurants.',
    keywords: [
      'restaurant delivery partner',
      'food delivery service Rajasthan',
      'restaurant logistics partner',
      'cloud kitchen delivery',
      'cafe delivery partner',
      'food delivery Khatu',
      'restaurant delivery Noida',
      'third party food delivery',
      'delivery partner for restaurants',
      'food logistics Rajasthan',
    ],
    path: '/restaurant-delivery-partner',
  },

  hero: {
    badge: 'RESTAURANT PARTNER',
    badgeIcon: 'Utensils',
    title: 'Restaurant Delivery Partner',
    subtitle: 'Rajasthan & NCR',
    description:
      'Reliable delivery for restaurants, cloud kitchens, and cafes. Your food, delivered hot and on time. No commission on orders — just per-delivery pricing.',
    highlightText: 'Starting at ₹30/delivery',
    gradient: 'from-orange-500 to-red-600',
  },

  stats: [
    { value: '100+', label: 'Restaurant Partners' },
    { value: '30min', label: 'Avg. Delivery' },
    { value: '₹30', label: 'Per Delivery' },
    { value: '0%', label: 'Commission' },
  ],

  benefits: [
    {
      icon: 'IndianRupee',
      title: 'Zero Commission',
      description: 'Pay only per delivery. No percentage cut from your orders.',
    },
    {
      icon: 'Clock',
      title: 'Fast Delivery',
      description: 'Average 30-minute delivery keeps food hot and customers happy.',
    },
    {
      icon: 'Shield',
      title: 'Trained Riders',
      description: 'Riders trained in food handling and customer service.',
    },
    {
      icon: 'Package',
      title: 'Insulated Bags',
      description: 'All riders carry insulated bags for temperature control.',
    },
    {
      icon: 'MessageCircle',
      title: 'WhatsApp Orders',
      description: 'Simple WhatsApp-based order dispatch. No app needed.',
    },
    {
      icon: 'Target',
      title: 'Wide Coverage',
      description: 'Serving Khatu, Sikar, Jaipur corridor and Delhi NCR.',
    },
  ],

  useCases: [
    {
      icon: 'Utensils',
      title: 'Restaurants',
      description: 'Full-service restaurants needing reliable delivery fleet.',
    },
    {
      icon: 'Store',
      title: 'Cloud Kitchens',
      description: 'Delivery-only kitchens requiring consistent logistics.',
    },
    {
      icon: 'Building2',
      title: 'Cafes & Bakeries',
      description: 'Cafes expanding into delivery without own fleet.',
    },
    {
      icon: 'Hotel',
      title: 'Hotel Restaurants',
      description: 'Hotel F&B outlets serving nearby areas.',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Partner Signup',
      description: 'Quick onboarding via WhatsApp. Share menu and delivery zones.',
    },
    {
      step: 2,
      title: 'Dispatch Orders',
      description: 'Send order details via WhatsApp. Rider assigned in minutes.',
    },
    {
      step: 3,
      title: 'Track & Deliver',
      description: 'Real-time tracking. Food delivered hot to customer.',
    },
  ],

  faqs: [
    {
      question: 'How does restaurant delivery partnership work?',
      answer:
        'You dispatch orders via WhatsApp with pickup and delivery details. We assign a rider within minutes who picks up and delivers. You pay per delivery, no commission on order value.',
    },
    {
      question: 'What is the delivery charge for restaurants?',
      answer:
        'Delivery starts at ₹30 for distances up to 3km. Pricing is distance-based with no surge. Volume discounts available for 50+ deliveries/month.',
    },
    {
      question: 'Do riders have food delivery training?',
      answer:
        'Yes, all riders are trained in food handling, use insulated bags, and understand the importance of timely delivery for food quality.',
    },
    {
      question: 'What areas do you cover for restaurant delivery?',
      answer:
        'We cover Khatu Shyam Ji, Sikar district, Jaipur, and Delhi NCR (Noida, Gurgaon, Delhi). Expanding to more cities soon.',
    },
    {
      question: 'Can I track my restaurant deliveries?',
      answer:
        'Yes, you get real-time updates via WhatsApp including rider assignment, pickup confirmation, and delivery completion with customer signature.',
    },
  ],

  internalLinks: [
    { href: '/hotel-logistics-partner', label: 'Hotel Logistics', icon: 'Hotel' },
    { href: '/hyperlocal-delivery-service', label: 'Hyperlocal Delivery', icon: 'Zap' },
    { href: '/whatsapp-delivery-service', label: 'WhatsApp Delivery', icon: 'MessageCircle' },
    { href: '/fare-calculator', label: 'Calculate Fare', icon: 'IndianRupee' },
  ],

  cta: {
    title: 'Ready to Partner with Liftngo?',
    description: 'Join 100+ restaurants already using Liftngo for reliable delivery.',
    whatsappText: 'Hi Liftngo, I want to partner for restaurant delivery',
    footerText: '+91 85805 84898 • Restaurant partnerships',
    bgColor: 'bg-orange-600',
  },

  schema: {
    service: {},
    breadcrumb: {},
    faq: {},
  },

  theme: {
    primary: 'orange',
    accent: 'orange-600',
    gradient: 'from-orange-500 to-red-600',
  },
};
