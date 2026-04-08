'use client';

import type { SocketConnectionState } from '@/store/customerTripStore';

type SocketConnectionBannerProps = {
  connectionState: SocketConnectionState;
};

export default function SocketConnectionBanner({ connectionState }: SocketConnectionBannerProps) {
  if (connectionState === 'CONNECTED' || connectionState === 'DISCONNECTED') {
    return null;
  }

  const banner = getBannerMeta(connectionState);
  if (!banner) return null;

  return (
    <div className={`mx-4 mt-3 rounded-xl border px-3 py-2.5 ${banner.className}`} role="status" aria-live="polite">
      <p className="text-[13px] font-semibold">{banner.title}</p>
      <p className="mt-0.5 text-[12px] opacity-90">{banner.description}</p>
    </div>
  );
}

function getBannerMeta(state: SocketConnectionState): { title: string; description: string; className: string } | null {
  switch (state) {
    case 'CONNECTING':
      return {
        title: 'Connecting to live trip updates...',
        description: 'Please wait while we establish a secure real-time connection.',
        className: 'border-blue-200 bg-blue-50 text-blue-800',
      };
    case 'RECONNECTING':
      return {
        title: 'Reconnecting...',
        description: 'Network changed. We are syncing your trip automatically.',
        className: 'border-amber-200 bg-amber-50 text-amber-800',
      };
    case 'FAILED':
      return {
        title: 'Live updates unavailable',
        description: 'Please check internet or refresh. Your trip will recover after reconnect.',
        className: 'border-red-200 bg-red-50 text-red-700',
      };
    default:
      return null;
  }
}
