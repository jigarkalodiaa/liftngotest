'use client';

import { useState, useEffect } from 'react';
import { GOOD_TYPES } from '@/data/goodTypes';
import type { GoodTypeOption } from '@/data/goodTypes';
import { theme } from '@/config/theme';

interface SelectGoodTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (selected: GoodTypeOption) => void;
  initialSelectedId?: string | null;
}

export default function SelectGoodTypesModal({
  isOpen,
  onClose,
  onProceed,
  initialSelectedId = null,
}: SelectGoodTypesModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null);
  const [showHazardList, setShowHazardList] = useState(false);

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

  // Sync selection when modal opens or initial selection changes
  useEffect(() => {
    if (isOpen) {
      setSelectedId(initialSelectedId ?? null);
    }
  }, [isOpen, initialSelectedId]);

  if (!isOpen) return null;

  const handleProceed = () => {
    const selected = GOOD_TYPES.find((t) => t.id === selectedId);
    if (selected) {
      onProceed(selected);
      onClose();
    }
  };

  const selected = GOOD_TYPES.find((t) => t.id === selectedId);

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/50 animate-[fade-in_0.2s_ease-out]" aria-hidden="true" onClick={onClose} />
      <div
        className="fixed inset-x-0 bottom-0 z-[100] flex max-h-[90vh] flex-col rounded-t-3xl bg-white shadow-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="select-good-types-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4">
          <h2 id="select-good-types-title" className="font-bold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>
            Select Good Types
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-10 w-10 rounded-full bg-gray-200 grid place-items-center text-gray-600 hover:bg-gray-300"
          >
            <span className="text-lg font-medium">×</span>
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
          {GOOD_TYPES.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`mb-3 w-full rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                  isSelected
                    ? 'border-[var(--color-primary)]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: isSelected ? theme.colors.primaryTint : theme.colors.surfaceMuted }}
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>{item.title}</p>
                    <p className="mt-1 leading-snug" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray500 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Hazardous goods warning */}
          <div className="mt-2 flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 border border-amber-100">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 flex-shrink-0 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="font-medium" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray800 }}>All Hazardous good</span>
            </div>
            <button
              type="button"
              onClick={() => setShowHazardList(true)}
              className="font-medium"
              style={{ fontSize: theme.fontSizes.base, color: theme.colors.primary }}
            >
              View List
            </button>
          </div>
        </div>

        {/* Proceed button */}
        <div className="border-t border-gray-100 bg-white px-4 py-4">
          <button
            type="button"
            onClick={handleProceed}
            disabled={!selectedId}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-3.5 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontSize: theme.fontSizes.lg }}
          >
            Proceed
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hazardous list – bottom sheet */}
      {showHazardList && (
        <>
          <div className="fixed inset-0 z-[110] bg-black/50 animate-[fade-in_0.2s_ease-out]" aria-hidden="true" onClick={() => setShowHazardList(false)} />
          <div
            className="fixed inset-x-0 bottom-0 z-[110] flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hazardous-title"
          >
            <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 id="hazardous-title" className="font-bold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>
                Hazardous goods
              </h3>
              <button
                type="button"
                onClick={() => setShowHazardList(false)}
                aria-label="Close"
                className="h-9 w-9 rounded-full bg-gray-100 grid place-items-center text-gray-600 hover:bg-gray-200"
              >
                <span className="text-lg font-medium leading-none">×</span>
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
              <p style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray600 }}>
                Do not send explosives, flammables, corrosive materials, toxic substances, or other hazardous items. Contact support for the full restricted list.
              </p>
            </div>
            <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowHazardList(false)}
                className="w-full rounded-xl py-2.5 font-semibold text-white"
                style={{ backgroundColor: theme.colors.primary, fontSize: theme.fontSizes.md }}
              >
                Got it
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
