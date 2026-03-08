'use client';

import Image from 'next/image';
import BottomSheet from '@/components/ui/BottomSheet';
import { theme } from '@/config/theme';

interface HazardousGoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROHIBITED_ITEMS = [
  'Dry Ice',
  'Explosives',
  'Fire Arms',
  'Flammables',
  'Livestock',
  'Pets & Animals',
  'Stones and Gems',
  'Gambling Devices',
  'Lottery Tickets',
  'Dangerous Goods',
  'Hazardous Goods',
  'Illegal Goods',
  'Radioactive Materials',
  'Precious Jewelleries',
  'Fire Extinguishers',
  'Cigarettes & Alcohols',
];

export default function HazardousGoodsModal({ isOpen, onClose }: HazardousGoodsModalProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Hazardous good"
      titleId="restricted-title"
      maxHeight="max-h-[85vh]"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl py-3.5 font-semibold text-white bg-[var(--color-primary)] hover:opacity-95 transition-opacity"
          style={{ fontSize: theme.fontSizes.md }}
        >
          Done
        </button>
      }
    >
      <div className="px-5 py-4">
        <div className="rounded-2xl bg-amber-50/90 border border-amber-100 px-4 py-3.5 flex items-stretch gap-3">
          <div className="w-20 flex-shrink-0 relative rounded-2xl overflow-hidden">
            <Image
              src="/icons/restricted.png"
              alt="Items not allowed for delivery"
              fill
              style={{ objectFit: 'contain', padding: '8px' }}
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="font-bold text-gray-900 text-[15px]">Items Not Allowed for Delivery!</p>
            <p className="mt-0.5 text-[14px] text-gray-700">
              For safety reasons, the following items cannot be shipped using our platform.
            </p>
          </div>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[14px] text-gray-700 list-disc list-inside">
          {PROHIBITED_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </BottomSheet>
  );
}
