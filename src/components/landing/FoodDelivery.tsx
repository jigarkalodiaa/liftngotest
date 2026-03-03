import Image from 'next/image';

export default function FoodDelivery() {
  return (
    <section id="delivery" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="relative h-64 sm:h-80 lg:h-96">
            <Image
              src="/food-delivery.jpg"
              alt="Food delivery - Everything you crave, delivered"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Everything you crave,
              <br />
              <span className="text-orange-400">delivered.</span>
            </h2>
            <p className="text-white/90 text-sm sm:text-base max-w-lg leading-relaxed">
              From your favorite local restaurants to popular city hotspots, order fresh meals, snacks, and beverages delivered quickly to your doorstep with Liftngo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
