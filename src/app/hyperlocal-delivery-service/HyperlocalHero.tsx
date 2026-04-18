import Link from 'next/link';
import { Zap, MessageCircle, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

interface HyperlocalHeroProps {
  whatsappLink: string;
}

export default function HyperlocalHero({ whatsappLink }: HyperlocalHeroProps) {
  return (
    <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
            <Zap className="h-4 w-4" />
            HYPERLOCAL DELIVERY
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Hyperlocal Delivery in 15 Minutes
            <span className="block text-white/90">Liftngo Khatu</span>
          </h1>
          <p className="mt-6 text-lg text-white/90 sm:text-xl">
            Ultra-fast delivery within 5km of Khatu Shyam Ji. From shop restocking to 
            hotel supplies — delivered before you can say &quot;Jai Shyam&quot;. 
            Starting at <strong className="text-yellow-300">₹50</strong>.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              Book Now on WhatsApp
            </Link>
            <Link
              href={ROUTES.FARE_CALCULATOR}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-purple-700 shadow-lg transition-all hover:bg-purple-50"
            >
              Check Fare
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
