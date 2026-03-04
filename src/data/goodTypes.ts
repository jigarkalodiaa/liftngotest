/**
 * Good type categories for the Select Good Types modal.
 */

export interface GoodTypeOption {
  id: string;
  title: string;
  description: string;
}

export const GOOD_TYPES: GoodTypeOption[] = [
  {
    id: 'building',
    title: 'Building Materials',
    description:
      'Cement bags, tiles, paint buckets, hardware tools, pipes, plywood, small construction items. etc',
  },
  {
    id: 'event',
    title: 'Event Management / Hospitality',
    description:
      'Decoration items, sound equipment, lighting, catering supplies, chairs, tables, props, event materials.',
  },
  {
    id: 'office',
    title: 'Office & Commercial Supplies',
    description:
      'Documents, printers, office equipment, retail stock, packaging materials, display items.',
  },
  {
    id: 'household',
    title: 'Personal & Household Items',
    description:
      'Luggage, cartons, groceries, small furniture, appliances, household goods.',
  },
  {
    id: 'furniture',
    title: 'Furniture & Home Furniture',
    description:
      'Sofas, tables, beds, cabinets, and other home or office furniture.',
  },
  {
    id: 'food',
    title: 'Food & Catering Delivery',
    description:
      'Packed food, bakery items, bulk meal boxes, kitchen supplies (non-liquid & properly packed).',
  },
  {
    id: 'ecommerce',
    title: 'E-commerce & Parcels',
    description:
      'Online orders, courier packages, business shipments, return orders.',
  },
  {
    id: 'other',
    title: 'Other',
    description:
      'Furniture, large items, or any goods that do not fit the categories above. Describe in notes if needed.',
  },
];
