'use client';

/** Enterprise section: "How LIFTNGO Can Help Your Enterprise Logistics" with orange highlights. */
export default function EnterpriseSection() {
  return (
    <section id="enterprise" className="py-12 lg:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          How LIFTNGO{' '}
          <span className="text-[var(--landing-orange)]">Can Help Your</span>
          <br />
          <span className="text-[var(--landing-orange)]">Enterprise Logistics</span>
        </h2>
      </div>
    </section>
  );
}
