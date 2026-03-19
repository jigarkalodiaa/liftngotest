'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addGstSchema, normalizeGstInput, type AddGstForm } from '@/lib/validations';

/** Visible borders: globals.css sets `input { border: none }` — override explicitly. */
const inputClass =
  'w-full h-14 rounded-xl box-border !border !border-solid bg-white px-4 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:!border-[var(--color-primary)]';

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
    mode: 'onTouched',
    defaultValues: { gstNumber: initialGstNumber, businessName: initialBusinessName },
  });

  const gstField = register('gstNumber');

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
      <div className="fixed inset-0 z-[100] bg-black/50 animate-[fade-in_0.2s_ease-out]" aria-hidden="true" onClick={onClose} />
      <div
        className="fixed inset-x-0 bottom-0 z-[100] flex max-h-[90vh] flex-col rounded-t-3xl bg-white shadow-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-gst-title"
      >
        <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 px-5 py-4">
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

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="add-gst-form">
            <div>
              <label htmlFor="add-gst-number" className="mb-1.5 block text-[13px] font-medium text-gray-700">
                GST number
              </label>
              <input
                id="add-gst-number"
                type="text"
                inputMode="text"
                autoComplete="off"
                maxLength={15}
                placeholder="15-character GSTIN"
                {...gstField}
                onChange={(e) => {
                  const v = normalizeGstInput(e.target.value);
                  e.target.value = v;
                  gstField.onChange(e);
                }}
                onKeyDown={(e) => e.key === ' ' && e.preventDefault()}
                className={`${inputClass} ${errors.gstNumber ? '!border-red-500' : '!border-gray-300'}`}
                aria-invalid={errors.gstNumber ? true : undefined}
                aria-describedby={errors.gstNumber ? 'add-gst-number-error' : undefined}
              />
              {errors.gstNumber && (
                <p id="add-gst-number-error" className="mt-1 text-[12px] text-red-500" role="alert">
                  {errors.gstNumber.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="add-gst-business" className="mb-1.5 block text-[13px] font-medium text-gray-700">
                Business name
              </label>
              <input
                id="add-gst-business"
                type="text"
                placeholder="As per GST registration"
                {...register('businessName')}
                className={`${inputClass} ${errors.businessName ? '!border-red-500' : '!border-gray-300'}`}
                aria-invalid={errors.businessName ? true : undefined}
                aria-describedby={errors.businessName ? 'add-gst-business-error' : undefined}
              />
              {errors.businessName && (
                <p id="add-gst-business-error" className="mt-1 text-[12px] text-red-500" role="alert">
                  {errors.businessName.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4">
          <button
            type="submit"
            form="add-gst-form"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-[16px] font-semibold text-white"
          >
            Add GSTIN details
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
