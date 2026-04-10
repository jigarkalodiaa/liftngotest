'use client';

import { memo } from 'react';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessageComponent({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        !
      </span>
      <span>{message}</span>
    </div>
  );
}

export const ErrorMessage = memo(ErrorMessageComponent);
