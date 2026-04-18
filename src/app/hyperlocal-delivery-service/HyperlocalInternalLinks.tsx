import Link from 'next/link';
import { Clock, MessageCircle, MapPin, IndianRupee } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function HyperlocalInternalLinks() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
          Explore More Services
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/same-day-delivery-khatu"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
          >
            <Clock className="h-4 w-4" />
            Same Day Delivery Khatu
          </Link>
          <Link
            href="/whatsapp-delivery-service"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Delivery
          </Link>
          <Link
            href={ROUTES.KHATU_SHYAM_LOGISTICS}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
          >
            <MapPin className="h-4 w-4" />
            Khatu Shyam Logistics
          </Link>
          <Link
            href={ROUTES.FARE_CALCULATOR}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
          >
            <IndianRupee className="h-4 w-4" />
            Calculate Fare
          </Link>
        </div>
      </div>
    </section>
  );
}
