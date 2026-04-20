/**
 * City-based SEO landing pages (TRD §9).
 * Slugs and metadata for organic search: e.g. /noida, /delhi, /bangalore.
 */

export interface SeoCity {
  slug: string;
  name: string;
  region: string;
  state: string;
  title: string;
  description: string;
  keywords: string[];
  areas: string[];
  services: string[];
}

export const SEO_CITIES: SeoCity[] = [
  {
    slug: 'noida',
    name: 'Noida',
    region: 'NCR',
    state: 'Uttar Pradesh',
    title: 'Goods Transport in Noida | Delivery Service & Mini Truck Booking',
    description: 'Instant goods transport and delivery service in Noida. Book mini truck, tempo, auto, or bike for same day delivery. Packers and movers, courier service available.',
    keywords: ['goods transport noida', 'delivery service noida', 'mini truck noida', 'tempo booking noida', 'packers and movers noida', 'courier service noida', 'same day delivery noida'],
    areas: ['Sector 18', 'Sector 62', 'Sector 63', 'Sector 15', 'Sector 16', 'Sector 50', 'Sector 76', 'Sector 137', 'Sector 142', 'Sector 143'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting', 'Courier Service'],
  },
  {
    slug: 'delhi',
    name: 'Delhi',
    region: 'NCR',
    state: 'Delhi',
    title: 'Goods Transport in Delhi | Delivery Service & Logistics',
    description: 'Fast goods transport and delivery service in Delhi. Mini truck, tempo, auto booking for commercial and residential deliveries. Same day delivery available.',
    keywords: ['goods transport delhi', 'delivery service delhi', 'mini truck delhi', 'tempo booking delhi', 'logistics delhi', 'courier service delhi', 'same day delivery delhi'],
    areas: ['Dwarka', 'Rohini', 'Saket', 'Nehru Place', 'Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Okhla', 'Narela', 'Pitampura'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting', 'Courier Service'],
  },
  {
    slug: 'gurgaon',
    name: 'Gurgaon',
    region: 'NCR',
    state: 'Haryana',
    title: 'Goods Transport in Gurgaon | Delivery Service & Mini Truck',
    description: 'Reliable goods transport and delivery service in Gurgaon. Book mini truck, tempo for corporate and residential deliveries. Express delivery available.',
    keywords: ['goods transport gurgaon', 'delivery service gurgaon', 'mini truck gurgaon', 'tempo booking gurgaon', 'logistics gurgaon', 'courier service gurgaon'],
    areas: ['Cyber City', 'DLF Phase 1-5', 'Sohna Road', 'Golf Course Road', 'MG Road', 'Sector 14', 'Sector 29', 'Udyog Vihar', 'Manesar', 'Palam Vihar'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting', 'Courier Service'],
  },
  {
    slug: 'bangalore',
    name: 'Bangalore',
    region: 'Karnataka',
    state: 'Karnataka',
    title: 'Goods Transport in Bangalore | Delivery Service & Logistics',
    description: 'Professional goods transport and delivery service in Bangalore. Mini truck, tempo, bike delivery for businesses and homes. Same day delivery across the city.',
    keywords: ['goods transport bangalore', 'delivery service bangalore', 'mini truck bangalore', 'tempo booking bangalore', 'logistics bangalore', 'courier service bangalore'],
    areas: ['Whitefield', 'Electronic City', 'Koramangala', 'Indiranagar', 'HSR Layout', 'BTM Layout', 'Marathahalli', 'Jayanagar', 'JP Nagar', 'Hebbal'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting', 'Courier Service'],
  },
  {
    slug: 'mumbai',
    name: 'Mumbai',
    region: 'Maharashtra',
    state: 'Maharashtra',
    title: 'Goods Transport in Mumbai | Delivery Service & Logistics',
    description: 'Fast goods transport and delivery service in Mumbai. Mini truck, tempo, bike delivery for commercial shipments. Logistics services across Mumbai.',
    keywords: ['goods transport mumbai', 'delivery service mumbai', 'logistics services mumbai', 'mini truck mumbai', 'tempo booking mumbai', 'courier service mumbai'],
    areas: ['Andheri', 'Bandra', 'Powai', 'Lower Parel', 'BKC', 'Goregaon', 'Malad', 'Thane', 'Navi Mumbai', 'Vashi'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting', 'Courier Service'],
  },
  {
    slug: 'pune',
    name: 'Pune',
    region: 'Maharashtra',
    state: 'Maharashtra',
    title: 'Goods Transport in Pune | Delivery Service & Mini Truck',
    description: 'Reliable goods transport and delivery service in Pune. Book mini truck, tempo for business and residential deliveries. Same day delivery available.',
    keywords: ['goods transport pune', 'delivery service pune', 'mini truck pune', 'tempo booking pune', 'logistics pune', 'courier service pune'],
    areas: ['Hinjewadi', 'Kharadi', 'Wakad', 'Baner', 'Viman Nagar', 'Koregaon Park', 'Hadapsar', 'Pimpri-Chinchwad', 'Magarpatta', 'Aundh'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting', 'Courier Service'],
  },
  {
    slug: 'chennai',
    name: 'Chennai',
    region: 'Tamil Nadu',
    state: 'Tamil Nadu',
    title: 'Goods Transport in Chennai | Delivery Service & Logistics',
    description: 'Professional goods transport and delivery service in Chennai. Mini truck, tempo, bike delivery for all your logistics needs.',
    keywords: ['goods transport chennai', 'delivery service chennai', 'mini truck chennai', 'tempo booking chennai', 'logistics chennai', 'courier service chennai'],
    areas: ['T Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'OMR', 'Porur', 'Tambaram', 'Guindy', 'Nungambakkam', 'Mylapore'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting', 'Courier Service'],
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    region: 'Telangana',
    state: 'Telangana',
    title: 'Goods Transport in Hyderabad | Delivery Service & Mini Truck',
    description: 'Fast goods transport and delivery service in Hyderabad. Book mini truck, tempo, auto for commercial and residential deliveries.',
    keywords: ['goods transport hyderabad', 'delivery service hyderabad', 'mini truck hyderabad', 'tempo booking hyderabad', 'logistics hyderabad', 'courier service hyderabad'],
    areas: ['HITEC City', 'Gachibowli', 'Madhapur', 'Banjara Hills', 'Jubilee Hills', 'Kondapur', 'Kukatpally', 'Secunderabad', 'Ameerpet', 'Begumpet'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting', 'Courier Service'],
  },
  {
    slug: 'kolkata',
    name: 'Kolkata',
    region: 'West Bengal',
    state: 'West Bengal',
    title: 'Goods Transport in Kolkata | Delivery Service & Logistics',
    description: 'Reliable goods transport and delivery service in Kolkata. Mini truck, tempo, bike delivery for businesses and homes.',
    keywords: ['goods transport kolkata', 'delivery service kolkata', 'mini truck kolkata', 'tempo booking kolkata', 'logistics kolkata', 'courier service kolkata'],
    areas: ['Salt Lake', 'Park Street', 'Howrah', 'New Town', 'Ballygunge', 'Alipore', 'Behala', 'Dum Dum', 'Rajarhat', 'Gariahat'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting', 'Courier Service'],
  },
  {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    region: 'Gujarat',
    state: 'Gujarat',
    title: 'Goods Transport in Ahmedabad | Delivery Service & Mini Truck',
    description: 'Professional goods transport and delivery service in Ahmedabad. Book mini truck, tempo for commercial deliveries.',
    keywords: ['goods transport ahmedabad', 'delivery service ahmedabad', 'mini truck ahmedabad', 'tempo booking ahmedabad', 'logistics ahmedabad'],
    areas: ['SG Highway', 'Prahlad Nagar', 'Satellite', 'Vastrapur', 'Navrangpura', 'CG Road', 'Bodakdev', 'Thaltej', 'Maninagar', 'Chandkheda'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting'],
  },
  {
    slug: 'indore',
    name: 'Indore',
    region: 'Madhya Pradesh',
    state: 'Madhya Pradesh',
    title: 'Goods Transport in Indore | Delivery Service & Logistics',
    description: 'Fast goods transport and delivery service in Indore. Mini truck, tempo booking for business deliveries.',
    keywords: ['goods transport indore', 'delivery service indore', 'mini truck indore', 'tempo booking indore', 'logistics indore'],
    areas: ['Vijay Nagar', 'Palasia', 'MG Road', 'Sapna Sangeeta', 'AB Road', 'Ring Road', 'Bhawarkuan', 'Rajwada', 'Scheme 78', 'Scheme 54'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting'],
  },
  {
    slug: 'coimbatore',
    name: 'Coimbatore',
    region: 'Tamil Nadu',
    state: 'Tamil Nadu',
    title: 'Goods Transport in Coimbatore | Delivery Service & Mini Truck',
    description: 'Reliable goods transport and delivery service in Coimbatore. Book mini truck, tempo for commercial deliveries.',
    keywords: ['goods transport coimbatore', 'delivery service coimbatore', 'mini truck coimbatore', 'tempo booking coimbatore', 'logistics coimbatore'],
    areas: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Race Course', 'Singanallur', 'Ganapathy', 'Vadavalli', 'Ukkadam', 'Town Hall'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting'],
  },
  {
    slug: 'thane',
    name: 'Thane',
    region: 'Maharashtra',
    state: 'Maharashtra',
    title: 'Goods Transport in Thane | Delivery Service & Logistics',
    description: 'Fast goods transport and delivery service in Thane. Mini truck, tempo, bike delivery for all logistics needs.',
    keywords: ['goods transport thane', 'delivery service thane', 'mini truck thane', 'tempo booking thane', 'logistics thane'],
    areas: ['Ghodbunder Road', 'Majiwada', 'Kasarvadavali', 'Wagle Estate', 'Hiranandani Estate', 'Pokhran Road', 'Vartak Nagar', 'Naupada', 'Kopri', 'Kalwa'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Home Shifting', 'Office Shifting'],
  },
  {
    slug: 'khatu',
    name: 'Khatu Shyam Ji',
    region: 'Rajasthan',
    state: 'Rajasthan',
    title: 'Goods Transport in Khatu Shyam Ji | Delivery Service & Logistics',
    description: 'Reliable goods transport and delivery service in Khatu Shyam Ji. Mini truck, tempo, bike delivery for shops, hotels, and temples.',
    keywords: ['goods transport khatu', 'delivery service khatu', 'logistics khatu shyam ji', 'mini truck khatu', 'temple logistics khatu'],
    areas: ['Temple Area', 'Main Market', 'Bus Stand', 'Dharamshala Area', 'Reengus Road', 'Sikar Road'],
    services: ['Mini Truck Booking', 'Tempo Booking', 'Bike Delivery', 'Shop Delivery', 'Hotel Supplies'],
  },
];

export type CitySlug = (typeof SEO_CITIES)[number]['slug'];

export function getCityBySlug(slug: string): SeoCity | null {
  return SEO_CITIES.find((c) => c.slug === slug) ?? null;
}

export function getCityDescription(name: string, region: string): string {
  return `Book goods transport and last-mile delivery in ${name}, ${region}. Liftngo connects you with verified drivers for mini truck booking, parcel delivery, and reliable logistics.`;
}

export function getAllCitySlugs(): string[] {
  return SEO_CITIES.map((c) => c.slug);
}
