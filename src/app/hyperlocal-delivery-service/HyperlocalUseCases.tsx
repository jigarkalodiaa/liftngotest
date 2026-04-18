import { Package, Truck, MapPin, Zap } from 'lucide-react';

const USE_CASES = [
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

export default function HyperlocalUseCases() {
  return (
    <section className="bg-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Hyperlocal Delivery Use Cases
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <useCase.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{useCase.title}</h3>
              <p className="mt-2 text-gray-600">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
