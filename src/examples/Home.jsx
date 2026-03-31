/**
 * Example page wiring for `FAQSection`.
 * In Next.js App Router, import the section into `app/page.tsx` (or a route `page.jsx`) instead of routing to this file directly.
 */

import FAQSection from '@/components/FAQSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <FAQSection />
    </main>
  );
}
