'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addGstSchema, type AddGstForm } from '@/lib/validations';

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddGstForm>({
    resolver: zodResolver(addGstSchema),
    defaultValues: { gstNumber: initialGstNumber, businessName: initialBusinessName },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ gstNumber: initialGstNumber, businessName: initialBusinessName });
    }
  }, [isOpen, initialGstNumber, initialBusinessName, reset]);

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

  const onSubmit = (data: AddGstForm) => {
    onSave((data.gstNumber ?? '').trim(), (data.businessName ?? '').trim());
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="GST Number (15 characters)"
              {...register('gstNumber')}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] ${
                errors.gstNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.gstNumber && (
              <p className="mt-1 text-[12px] text-red-500">{errors.gstNumber.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Business Name"
              {...register('businessName')}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] ${
                errors.businessName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.businessName && (
              <p className="mt-1 text-[12px] text-red-500">{errors.businessName.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-[16px] font-semibold text-white"
          >
            Add GSTIN details
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
