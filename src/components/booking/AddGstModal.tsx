'use client';

import { useState, useEffect } from 'react';

interface AddGstModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gstNumber: string, businessName: string) => void;
  initialGstNumber?: string;
  initialBusinessName?: string;
}

export default function AddGstModal({
  isOpen,
  onClose,
  onSave,
  initialGstNumber = '',
  initialBusinessName = '',
}: AddGstModalProps) {
  const [gstNumber, setGstNumber] = useState(initialGstNumber);
  const [businessName, setBusinessName] = useState(initialBusinessName);

  useEffect(() => {
    if (isOpen) {
      setGstNumber(initialGstNumber);
      setBusinessName(initialBusinessName);
    }
  }, [isOpen, initialGstNumber, initialBusinessName]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(gstNumber.trim(), businessName.trim());
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/50" aria-hidden="true" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-[100] w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-gst-title"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="add-gst-title" className="text-[18px] font-bold text-gray-900">
            Add GST
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

        <div className="space-y-4">
          <input
            type="text"
            placeholder="GST Number"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)]"
          />
          <input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-[16px] font-semibold text-white"
        >
          Add GSTIN details
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </>
  );
}
