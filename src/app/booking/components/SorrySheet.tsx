'use client';

import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';

interface SorrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onDone: () => void;
}

export default function SorrySheet({ isOpen, onClose, userName, onDone }: SorrySheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Sorry to hear about that, ${userName}`}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1 !rounded-xl !py-3" onClick={onDone}>
            Cancel, anyway
          </Button>
          <Button className="flex-1 !rounded-xl !py-3" onClick={onDone}>
            Get another Trip
          </Button>
        </div>
      }
    >
      <div className="px-5 py-4">
        <p className="text-[14px] text-gray-600">
          We always strive for top-notch service, but sometimes things are beyond our control
        </p>
      </div>
    </BottomSheet>
  );
}
