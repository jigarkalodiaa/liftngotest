'use client';

import { Info, X } from 'lucide-react';
import { useId, useRef } from 'react';
import type { ReactNode } from 'react';

type Props = {
  /** Shown in dialog title */
  title: string;
  children: ReactNode;
  /** Accessible name for the info trigger */
  triggerLabel?: string;
  className?: string;
};

/**
 * Progressive disclosure: (i) opens a lightweight modal instead of inline walls of text.
 */
export default function InfoTooltip({ title, children, triggerLabel = 'More information', className = '' }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <span className={`inline-flex align-baseline ${className}`}>
      <button
        type="button"
        className="ml-1 inline-flex h-7 w-7 shrink-0 items-center justify-center text-gray-500 transition-colors hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
        aria-label={triggerLabel}
        aria-hasdialog="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Info className="h-4 w-4" aria-hidden />
      </button>
      <dialog
        ref={dialogRef}
        className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/40 open:flex open:flex-col"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h3 id={titleId} className="text-base font-bold leading-snug">
            {title}
          </h3>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="max-h-[min(70vh,28rem)] overflow-y-auto px-5 py-4 text-sm leading-relaxed text-gray-600 sm:text-base">
          {children}
        </div>
      </dialog>
    </span>
  );
}
