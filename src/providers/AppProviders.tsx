'use client';

import QueryProvider from '@/providers/QueryProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
