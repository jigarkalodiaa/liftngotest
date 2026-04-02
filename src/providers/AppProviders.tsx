'use client';

import AuthSessionProvider from '@/providers/AuthSessionProvider';
import QueryProvider from '@/providers/QueryProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </QueryProvider>
  );
}
