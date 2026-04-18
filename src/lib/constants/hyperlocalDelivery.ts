import {
  Timer,
  Target,
  IndianRupee,
  Clock,
  Bike,
  Shield,
  Package,
  Truck,
  MapPin,
  Zap,
} from 'lucide-react';
import { SITE_URL, SITE_NAME } from '@/lib/site';

const PATH = '/hyperlocal-delivery-service';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const HYPERLOCAL_SEO = {
  path: PATH,
  pageUrl: PAGE_URL,
  title: 'Hyperlocal Delivery in 15 Minutes — Liftngo Khatu',
  description:
    'Hyperlocal delivery service in Khatu Shyam Ji. Get goods delivered in 15 minutes within 5km radius. Starting ₹50. 24/7 service for shops, hotels & temples.',
  keywords: [
    'hyperlocal delivery service',
    'hyperlocal delivery Khatu',
    '15 minute delivery',
    'instant delivery service',
    'local delivery Khatu',
    'quick delivery service',
    'neighborhood delivery',
    'micro delivery service',
    'on-demand local delivery',
    'fast delivery Khatu Shyam',
  ],
};

export const HYPERLOCAL_SERVICE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${PAGE_URL}/#service`,
  name: 'Hyperlocal Delivery Service — Liftngo',
  url: PAGE_URL,
  description:
    'Ultra-fast hyperlocal delivery within 5km radius. Get goods delivered in 15 minutes in Khatu Shyam Ji and surrounding areas.',
  serviceType: 'Hyperlocal Delivery',
  areaServed: {
    '@type': 'Place',
    name: 'Khatu Shyam Ji, Rajasthan',
    geo: { '@type': 'GeoCoordinates', latitude: 27.7486, longitude: 75.3932 },
  },
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    price: '50',
    availability: 'https://schema.org/InStock',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 2,
      maxValue: 5,
      unitCode: 'MIN',
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 8,
      maxValue: 15,
      unitCode: 'MIN',
    },
  },
};

export const HYPERLOCAL_BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Hyperlocal Delivery Service', item: PAGE_URL },
  ],
};

export const HYPERLOCAL_FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is hyperlocal delivery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hyperlocal delivery is ultra-fast delivery within a small geographic area, typically 5km radius. Liftngo provides 15-minute hyperlocal delivery in Khatu Shyam Ji and surrounding localities.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast is hyperlocal delivery in Khatu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our hyperlocal delivery in Khatu takes 10-15 minutes for distances up to 3km, and 15-25 minutes for 3-5km. Driver assignment happens within 2-5 minutes of booking.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the delivery radius for hyperlocal service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our hyperlocal delivery covers a 5km radius from Khatu Shyam Ji temple. This includes the main market, bus stand, surrounding hotels, dharamshalas, and nearby villages.',
      },
    },
    {
      '@type': 'Question',
      name: 'What items can be delivered via hyperlocal service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can send documents, food, groceries, medicines, parcels, shop inventory, temple supplies, and most non-hazardous items. Weight limit is 20kg for 2-wheeler and 200kg for 3-wheeler.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is hyperlocal delivery available 24/7?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, our hyperlocal delivery service operates 24/7 in Khatu. This is especially useful for hotels and shops that need supplies at odd hours.',
      },
    },
  ],
};

export const HYPERLOCAL_COVERAGE_AREAS = [
  { area: 'Khatu Temple Area', time: '5-10 min' },
  { area: 'Khatu Main Market', time: '8-12 min' },
  { area: 'Khatu Bus Stand', time: '10-15 min' },
  { area: 'Nearby Dharamshalas', time: '10-15 min' },
  { area: 'Surrounding Villages (5km)', time: '15-25 min' },
];

export const HYPERLOCAL_STATS = [
  { value: '15', label: 'Minutes Avg.' },
  { value: '5km', label: 'Coverage Radius' },
  { value: '₹50', label: 'Starting Price' },
  { value: '24/7', label: 'Available' },
];

export const HYPERLOCAL_BENEFITS = [
  {
    icon: Timer,
    title: '15-Minute Delivery',
    description: 'Average delivery time within Khatu. Faster than walking to pick it up yourself.',
  },
  {
    icon: Target,
    title: '5km Radius Coverage',
    description: 'Complete coverage of Khatu Shyam Ji and surrounding areas.',
  },
  {
    icon: IndianRupee,
    title: 'Starting ₹50',
    description: 'Affordable pricing for local deliveries. No surge pricing.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock service for early morning and late night needs.',
  },
  {
    icon: Bike,
    title: 'Multi-Vehicle Fleet',
    description: '2W for small parcels, 3W for bulk. Right vehicle for every need.',
  },
  {
    icon: Shield,
    title: 'Local Drivers',
    description: 'Drivers who know every lane and shortcut in Khatu.',
  },
];

export const HYPERLOCAL_USE_CASES = [
  {
    icon: Package,
    title: 'Shop Inventory',
    description: 'Quick restocking from nearby wholesalers or inter-shop transfers.',
  },
  {
    icon: Truck,
    title: 'Hotel Supplies',
    description: 'Urgent supplies for hotels and dharamshalas — linen, toiletries, food.',
  },
  {
    icon: MapPin,
    title: 'Temple Supplies',
    description: 'Prasad, flowers, pooja items delivered to shops near temple.',
  },
  {
    icon: Zap,
    title: 'Food Delivery',
    description: 'Restaurant orders delivered hot and fresh in minutes.',
  },
];

export const HYPERLOCAL_HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Book Instantly',
    description: 'WhatsApp us or use the app. Share pickup and drop location.',
  },
  {
    step: 2,
    title: 'Driver in Minutes',
    description: 'Nearest driver assigned within 2-5 minutes. Track their arrival.',
  },
  {
    step: 3,
    title: 'Delivered Fast',
    description: 'Goods picked up and delivered in 15 minutes or less.',
  },
];

export const HYPERLOCAL_FAQS = [
  {
    question: 'What is hyperlocal delivery?',
    answer: 'Hyperlocal delivery is ultra-fast delivery within a small geographic area, typically 5km radius. Unlike regular delivery that may take hours, hyperlocal focuses on speed — getting your goods delivered in 15-30 minutes. Liftngo provides hyperlocal delivery in Khatu Shyam Ji and surrounding areas.',
  },
  {
    question: 'How fast is hyperlocal delivery in Khatu?',
    answer: 'Our hyperlocal delivery in Khatu takes 10-15 minutes for distances up to 3km, and 15-25 minutes for 3-5km. Driver assignment happens within 2-5 minutes of booking. During peak hours or festivals, times may be slightly longer.',
  },
  {
    question: 'What is the delivery radius for hyperlocal service?',
    answer: 'Our hyperlocal delivery covers a 5km radius from Khatu Shyam Ji temple. This includes the main market, bus stand, all hotels and dharamshalas, and nearby villages like those on the Reengus road.',
  },
  {
    question: 'What items can be delivered via hyperlocal service?',
    answer: 'You can send documents, food, groceries, medicines, parcels, shop inventory, temple supplies, and most non-hazardous items. Weight limit is 20kg for 2-wheeler and 200kg for 3-wheeler. We do not transport alcohol, weapons, or illegal items.',
  },
  {
    question: 'Is hyperlocal delivery available 24/7?',
    answer: 'Yes, our hyperlocal delivery service operates 24/7 in Khatu. This is especially useful for hotels needing early morning supplies, shops requiring urgent restocking, or late-night emergencies.',
  },
];
