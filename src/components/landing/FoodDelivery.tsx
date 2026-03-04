import Image from 'next/image';

export default function FoodDelivery() {
  return (
    <section id="delivery" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-orange-50 to-blue-50">
            <Image
              src="/hero-delivery.svg"
              alt="Goods delivery – Last-mile logistics"
              fill
              className="object-contain object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Goods on the move,
              <br />
              <span className="text-orange-400">delivered.</span>
            </h2>
            <p className="text-white/90 text-sm sm:text-base max-w-lg leading-relaxed">
              Book local goods delivery—groceries, parcels, retail inventory, and commercial materials—with transparent pricing and real-time tracking through Liftngo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
