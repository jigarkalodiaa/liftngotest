export type LeasePlan = {
  vehicle: string;
  term6: number;
  term12: number;
  earning: number;
  responsibilities: string[];
};

export const LEASE_PLANS: readonly LeasePlan[] = [
  {
    vehicle: '2-Wheeler (EV)',
    term6: 18000,
    term12: 15000,
    earning: 35000,
    responsibilities: ['Charging at your end', 'Minor maintenance included', 'Insurance covered by Liftngo'],
  },
  {
    vehicle: '3-Wheeler Cargo',
    term6: 28000,
    term12: 24000,
    earning: 55000,
    responsibilities: [
      'Fuel/charging at your end',
      'Routine maintenance included',
      'Insurance covered by Liftngo',
      'Major repairs covered',
    ],
  },
  {
    vehicle: '4-Wheeler (Mini Truck)',
    term6: 45000,
    term12: 38000,
    earning: 85000,
    responsibilities: ['Fuel at your end', 'Routine maintenance included', 'Insurance covered', 'Roadside assistance included'],
  },
];

export function leasePlanByVehicle(vehicle: string): LeasePlan | undefined {
  const v = decodeURIComponent(vehicle).trim();
  return LEASE_PLANS.find((p) => p.vehicle === v || p.vehicle.toLowerCase() === v.toLowerCase());
}
