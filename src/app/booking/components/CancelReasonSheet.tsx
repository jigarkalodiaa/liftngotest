'use client';

import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';

const CANCEL_REASONS = [
  'Wrong/Inappropriate Vehicle',
  'My reason is not listed',
  'Driver asked me to cancel',
  'Changed my mind',
  'Driver issue - delaying to come',
  'Unable to contact driver',
  'Expected a shorter arrival time',
  'Driver asking for extra money',
  'Driver not moving',
  'Other',
];

interface CancelReasonSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReason: string | null;
  onSelectReason: (reason: string) => void;
  onSubmit: () => void;
}

export default function CancelReasonSheet({
  isOpen,
  onClose,
  selectedReason,
  onSelectReason,
  onSubmit,
}: CancelReasonSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Please Choose reason for cancellation"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1 !rounded-xl !py-3" onClick={onClose}>
            Go back
          </Button>
          <Button className="flex-1 !rounded-xl !py-3" disabled={!selectedReason} onClick={onSubmit}>
            Submit
          </Button>
        </div>
      }
    >
      <div className="p-4 space-y-2">
        {CANCEL_REASONS.map((reason) => (
          <label key={reason} className="flex items-center gap-3 cursor-pointer py-2">
            <input
              type="radio"
              name="cancelReason"
              checked={selectedReason === reason}
              onChange={() => onSelectReason(reason)}
              className="h-5 w-5 border-gray-300 text-[var(--color-primary)]"
            />
            <span className="text-[14px] text-gray-900">{reason}</span>
          </label>
        ))}
      </div>
    </BottomSheet>
  );
}
