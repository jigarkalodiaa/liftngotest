'use client';

import { BackIcon } from './IconButton';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
}

export default function PageHeader({
  title,
  onBack,
  right,
  titleClassName = 'text-xl font-bold text-gray-900',
  titleStyle,
}: PageHeaderProps) {
  return (
    <header className="flex items-center gap-3 pb-4">
      <button
        type="button"
        aria-label="Go back"
        onClick={onBack}
        className="h-10 w-10 rounded-full border border-gray-200 bg-white grid place-items-center hover:bg-gray-50"
      >
        <BackIcon />
      </button>
      <h1 className={`flex-1 text-center ${titleClassName}`} style={titleStyle}>{title}</h1>
      <div className="w-10">{right ?? null}</div>
    </header>
  );
}
