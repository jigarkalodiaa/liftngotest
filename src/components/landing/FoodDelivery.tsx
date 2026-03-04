import Image from 'next/image';

/** Food delivery section: image on top, "Everything you crave, delivered.", description. */
export default function FoodDelivery() {
  return (
    <section id="delivery" className="py-12 lg:py-16 bg-[var(--landing-bg)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="relative h-56 sm:h-64 lg:h-72 w-full">
            <Image
              src="/hero-delivery.svg"
              alt="Food delivery – Everything you crave, delivered"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you crave, delivered.
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Book local goods delivery—groceries, parcels, retail inventory, and more—with transparent pricing and real-time tracking through LiftnGo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
