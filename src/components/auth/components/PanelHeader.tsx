'use client';

import { memo } from 'react';

interface PanelHeaderProps {
  title: string;
  onDismiss?: () => void;
}

function PanelHeaderComponent({ title, onDismiss }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <span className="w-9" aria-hidden />
      )}
    </div>
  );
}

export const PanelHeader = memo(PanelHeaderComponent);
