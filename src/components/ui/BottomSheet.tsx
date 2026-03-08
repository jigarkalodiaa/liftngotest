'use client';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleId?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  titleId = 'bottom-sheet-title',
  children,
  footer,
  maxHeight = 'max-h-[90vh]',
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-[fade-in_0.2s_ease-out]"
        aria-hidden
        onClick={onClose}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-white shadow-2xl overflow-hidden animate-[slide-up_0.3s_ease-out] ${maxHeight}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 id={titleId} className="text-[18px] font-bold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 rounded-full bg-gray-100 grid place-items-center text-gray-600 hover:bg-gray-200"
          >
            <span className="text-lg font-medium leading-none">×</span>
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
        {footer != null && (
          <div className="flex-shrink-0 border-t border-gray-200 px-5 py-4">{footer}</div>
        )}
      </div>
    </>
  );
}
