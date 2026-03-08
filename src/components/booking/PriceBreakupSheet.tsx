'use client';

import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';

interface PriceBreakupSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripFare: number;
  gst: number;
  platformFee: number;
  totalAmount: number;
}

export default function PriceBreakupSheet({
  isOpen,
  onClose,
  tripFare,
  gst,
  platformFee,
  totalAmount,
}: PriceBreakupSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Price Details"
      titleId="price-details-title"
      footer={
        <Button fullWidth className="!rounded-xl" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className="px-5 py-4">
        <div className="space-y-3 text-[14px]">
          <div className="flex justify-between">
            <span className="text-gray-600">Trip fare</span>
            <span className="font-medium text-gray-900">₹{tripFare}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST</span>
            <span className="font-medium text-gray-900">₹{gst}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform fee</span>
            <span className="font-medium text-gray-900">₹{platformFee}</span>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between">
          <span className="text-[15px] font-bold text-gray-900">Total Amount</span>
          <span className="text-[15px] font-bold text-gray-900">₹{totalAmount}</span>
        </div>
      </div>
    </BottomSheet>
  );
}
