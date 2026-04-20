import { Metadata } from 'next';
import Link from 'next/link';
import {
  Package,
  CheckCircle,
  Calendar,
  Box,
  Truck,
  Shield,
  ArrowRight,
  MessageCircle,
  ClipboardList,
  Home,
  AlertTriangle,
} from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { SUPPORT_PHONE } from '@/config/env';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'Home Shifting Checklist: Packers and Movers Guide — Liftngo',
  description:
    'Complete home shifting checklist and packers and movers guide. Tips for packing, moving boxes, house shifting services, and stress-free relocation in India.',
  path: '/blog/home-shifting-tips',
  keywords: [
    'home shifting',
    'home shifting services',
    'house shifting',
    'house shifting services',
    'packers and movers',
    'packers and movers near me',
    'packing and moving services',
    'moving boxes',
    'relocation tips',
    'home shifting checklist',
    'furniture shifting',
    'office shifting',
  ],
});

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Home Shifting Checklist: Complete Packers and Movers Guide',
  description:
    'Comprehensive guide for home shifting including packing tips, moving checklist, and how to choose packers and movers.',
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
    },
  },
  datePublished: '2024-02-01',
  dateModified: '2024-12-01',
  mainEntityOfPage: `${SITE_URL}/blog/home-shifting-tips`,
};

const CHECKLIST_ITEMS = [
  {
    week: '4 Weeks Before',
    tasks: [
      'Create inventory of all items',
      'Get quotes from packers and movers',
      'Decide what to keep, sell, or donate',
      'Notify landlord (if renting)',
      'Start collecting packing supplies',
    ],
  },
  {
    week: '2 Weeks Before',
    tasks: [
      'Confirm booking with movers',
      'Start packing non-essential items',
      'Update address with banks, subscriptions',
      'Arrange utility disconnection/connection',
      'Pack seasonal items and rarely used goods',
    ],
  },
  {
    week: '1 Week Before',
    tasks: [
      'Pack room by room systematically',
      'Label all boxes clearly',
      'Prepare essentials box for moving day',
      'Confirm moving day details',
      'Take photos of electronics setup',
    ],
  },
  {
    week: 'Moving Day',
    tasks: [
      'Do final walkthrough of old home',
      'Supervise loading carefully',
      'Keep valuables with you',
      'Check all rooms before leaving',
      'Hand over keys to landlord',
    ],
  },
];

export default function HomeShiftingTipsPage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Liftngo, I need home shifting service. Please share quote.')}`;

  return (
    <ContentLayout
      breadcrumbs={[
        { name: 'Blog', path: '/blog' },
        { name: 'Home Shifting Tips', path: '/blog/home-shifting-tips' },
      ]}
    >
      <JsonLd data={articleSchema} />

      <article className="bg-white">
        {/* Hero */}
        <header className="bg-gradient-to-br from-blue-600 to-cyan-600 py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
              GUIDE
            </span>
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Home Shifting Checklist: Packers and Movers Guide
            </h1>
            <p className="mt-6 text-lg text-white/90">
              Your complete guide to stress-free home shifting. From packing tips to choosing 
              the right packers and movers — everything you need for a smooth move.
            </p>
            <div className="mt-6 text-sm text-white/70">
              Updated: December 2024 • 12 min read
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <section className="prose prose-lg max-w-none">
            <h2>Planning Your Home Shifting</h2>
            <p>
              Home shifting can be overwhelming, but with proper planning, it becomes manageable. 
              Whether you&apos;re moving within the same city or relocating to a new one, this guide 
              covers everything from packing strategies to choosing reliable packers and movers.
            </p>
            <p>
              The key to successful house shifting is starting early and staying organized. 
              Most experts recommend beginning preparations at least 4 weeks before your moving date.
            </p>
          </section>

          {/* Checklist */}
          <div className="my-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Complete Home Shifting Checklist
            </h2>
            <div className="space-y-6">
              {CHECKLIST_ITEMS.map((section) => (
                <div
                  key={section.week}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-6"
                >
                  <h3 className="flex items-center gap-2 text-lg font-bold text-blue-600">
                    <Calendar className="h-5 w-5" />
                    {section.week}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {section.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <section className="prose prose-lg max-w-none">
            <h2>How to Choose Packers and Movers</h2>
            <p>
              Selecting the right packers and movers is crucial for a safe and hassle-free move. 
              Here&apos;s what to look for:
            </p>
            
            <h3>1. Check Reviews and Reputation</h3>
            <p>
              Look for packers and movers with positive reviews on Google, social media, and 
              word-of-mouth recommendations. A company with consistent good feedback is more reliable.
            </p>

            <h3>2. Get Multiple Quotes</h3>
            <p>
              Always get quotes from at least 3 different companies. Compare not just prices, 
              but also what&apos;s included — packing materials, insurance, loading/unloading help.
            </p>

            <h3>3. Verify Credentials</h3>
            <p>
              Ensure the company has proper registration, GST number, and insurance coverage. 
              Ask for their office address and verify it&apos;s legitimate.
            </p>

            <h3>4. Understand the Quote</h3>
            <p>
              A good quote should break down all costs: packing charges, transport, labor, 
              insurance, and any additional fees. Beware of quotes that seem too low.
            </p>

            <h3>5. Check Insurance Coverage</h3>
            <p>
              Ensure your goods are insured during transit. Ask about coverage limits and 
              the claim process in case of damage.
            </p>

            <h2>Packing Tips for Home Shifting</h2>
            
            <h3>Essential Packing Materials</h3>
            <ul>
              <li><strong>Moving boxes:</strong> Various sizes for different items</li>
              <li><strong>Bubble wrap:</strong> For fragile items like glassware</li>
              <li><strong>Packing tape:</strong> Heavy-duty tape for sealing boxes</li>
              <li><strong>Markers:</strong> For labeling boxes clearly</li>
              <li><strong>Furniture covers:</strong> To protect sofas and mattresses</li>
              <li><strong>Stretch wrap:</strong> For securing drawers and doors</li>
            </ul>

            <h3>Room-by-Room Packing Strategy</h3>
            
            <h4>Kitchen</h4>
            <p>
              Pack dishes vertically (like records) with paper between each. Wrap glasses 
              individually. Use original boxes for appliances if available.
            </p>

            <h4>Bedroom</h4>
            <p>
              Use wardrobe boxes for hanging clothes. Roll clothes to save space. 
              Pack shoes in their original boxes or wrap in paper.
            </p>

            <h4>Living Room</h4>
            <p>
              Disassemble furniture if possible. Wrap TV and electronics in blankets. 
              Pack books in small boxes to avoid making them too heavy.
            </p>

            <h4>Bathroom</h4>
            <p>
              Seal all liquids in plastic bags. Dispose of expired medicines. 
              Pack toiletries in waterproof containers.
            </p>

            <h2>Moving Day Tips</h2>
            <ul>
              <li>
                <strong>Start early:</strong> Begin loading in the morning to have buffer time
              </li>
              <li>
                <strong>Keep essentials separate:</strong> Pack a bag with items you&apos;ll need 
                immediately — toiletries, change of clothes, phone charger, snacks
              </li>
              <li>
                <strong>Supervise loading:</strong> Watch how items are being loaded and 
                speak up if you see rough handling
              </li>
              <li>
                <strong>Take inventory:</strong> Check off items as they&apos;re loaded and 
                again when unloaded
              </li>
              <li>
                <strong>Keep valuables with you:</strong> Jewelry, important documents, 
                and cash should travel with you, not in the truck
              </li>
            </ul>

            <h2>Common Home Shifting Mistakes to Avoid</h2>
            <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                <div>
                  <ul className="space-y-2 text-yellow-800">
                    <li>Not getting a written quote and contract</li>
                    <li>Packing at the last minute</li>
                    <li>Forgetting to label boxes</li>
                    <li>Not decluttering before packing</li>
                    <li>Ignoring insurance for valuable items</li>
                    <li>Not confirming details with movers</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>Home Shifting Costs in India</h2>
            <p>
              Home shifting costs vary based on several factors:
            </p>
            <ul>
              <li><strong>Distance:</strong> Local moves cost less than inter-city</li>
              <li><strong>Volume:</strong> More items = higher cost</li>
              <li><strong>Floor level:</strong> Higher floors may incur additional charges</li>
              <li><strong>Packing service:</strong> Full packing costs more than self-packing</li>
              <li><strong>Time of month:</strong> Month-end is busier and may cost more</li>
            </ul>
            <p>
              For a 2BHK local move in Noida, expect to pay ₹5,000-15,000. Inter-city moves 
              can range from ₹15,000-50,000 depending on distance and volume.
            </p>
          </section>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-blue-600 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Need Home Shifting Service?</h2>
            <p className="mt-2 text-blue-100">
              Get free quotes from verified packers and movers
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-green-500 px-6 font-bold text-white hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                Get Free Quote
              </Link>
              <Link
                href="/services/home-shifting"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-blue-600 hover:bg-gray-100"
              >
                View Service Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-12">
            <h3 className="text-lg font-bold text-gray-900">Related Articles</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/blog/goods-transport-guide"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Goods Transport Guide
              </Link>
              <Link
                href="/services/home-shifting"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Home Shifting Service
              </Link>
              <Link
                href="/fare-calculator"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Fare Calculator
              </Link>
            </div>
          </div>
        </div>
      </article>
    </ContentLayout>
  );
}
