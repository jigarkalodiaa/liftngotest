'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import type { SavedLocation, PersonDetails } from '@/types/booking';
import { CloseIcon } from '@/components/ui/IconButton';
import Button from '@/components/ui/Button';
import { theme } from '@/config/theme';

interface AddressDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPickup?: () => void;
  onEditDrop?: () => void;
  /** Called when user taps Swap locations; parent should swap pickup/drop (and sender/receiver) in storage and state */
  onSwapLocations?: () => void;
  pickup: SavedLocation | null;
  drop: SavedLocation | null;
  sender: PersonDetails | null;
  receiver: PersonDetails | null;
  vehicleName: string;
  vehicleSubtitle: string;
  vehicleImage: string;
}

export default function AddressDetailsModal({
  isOpen,
  onClose,
  onEditPickup,
  onEditDrop,
  onSwapLocations,
  pickup,
  drop,
  sender,
  receiver,
  vehicleName,
  vehicleSubtitle,
  vehicleImage,
}: AddressDetailsModalProps) {
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

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 animate-[fade-in_0.2s_ease-out]" aria-hidden="true" onClick={onClose} />
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-3xl bg-white shadow-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-details-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <h2 id="address-details-title" className="text-[18px] font-bold text-gray-900">
            Address Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-10 w-10 rounded-full bg-gray-100 grid place-items-center text-gray-600 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
          {/* Vehicle row */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
            <div>
              <p className="text-[16px] font-bold text-gray-900">{vehicleName}</p>
              <p className="mt-0.5 text-[14px] text-gray-500">{vehicleSubtitle}</p>
            </div>
            <div className="relative h-16 w-20 flex-shrink-0">
              <Image
                src={vehicleImage}
                alt={vehicleName}
                fill
                className="object-contain object-right"
              />
            </div>
          </div>

          {/* Pickup + Drop card */}
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-0.5">
                <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-white" />
                <div className="my-1.5 w-px flex-1 min-h-[24px] bg-gray-300" />
                <svg className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </div>
              <div className="flex-1 space-y-4 min-w-0">
                {/* Pickup */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-gray-900">
                      {pickup?.name ?? 'Pickup'}
                    </p>
                    {pickup?.address && (
                      <p className="mt-1 text-[13px] text-gray-500 truncate" title={pickup.address}>
                        {pickup.address}
                      </p>
                    )}
                    {(sender?.name || sender?.mobile) && (
                      <p className="mt-1.5 text-[13px] text-gray-600">
                        {sender.name}{sender.name && sender.mobile ? ' | ' : ''}{sender.mobile}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onEditPickup}
                    aria-label="Edit pickup location"
                    className="flex-shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[var(--color-primary)]"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                    </svg>
                  </button>
                </div>

                {/* Swap locations */}
                {pickup && drop && onSwapLocations && (
                  <div className="flex justify-end py-0.5">
                    <button
                      type="button"
                      aria-label="Swap locations"
                      onClick={onSwapLocations}
                      className="h-9 w-9 rounded-full grid place-items-center text-white flex-shrink-0"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Drop */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-gray-900">
                      {drop?.name ?? 'Drop'}
                    </p>
                    {drop?.address && (
                      <p className="mt-1 text-[13px] text-gray-500 truncate" title={drop.address}>
                        {drop.address}
                      </p>
                    )}
                    {(receiver?.name || receiver?.mobile) && (
                      <p className="mt-1.5 text-[13px] text-gray-600">
                        {receiver.name}{receiver.name && receiver.mobile ? ' | ' : ''}{receiver.mobile}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onEditDrop}
                    aria-label="Edit drop location"
                    className="flex-shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[var(--color-primary)]"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white px-4 py-4">
          <Button fullWidth onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
