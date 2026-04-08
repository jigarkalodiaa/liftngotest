'use client';

import { useEffect, useState } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Query Error]', error);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Mutation Error]', error);
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: false,
        retryOnMount: true,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        gcTime: Infinity,
        staleTime: STALE_TIME,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  useEffect(() => {
    const mutationCache = queryClient.getMutationCache();

    const unsubscribe = mutationCache.subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') {
        const error: any = event.action.error;
        const res = error?.response?.data ?? error?.body;
        let errorMessage: string | undefined;

        if (res?.errors && typeof res.errors === 'object') {
          const stack: any[] = [res.errors];
          while (stack.length && !errorMessage) {
            const current = stack.pop();
            if (!current || typeof current !== 'object') continue;
            for (const value of Object.values(current)) {
              if (Array.isArray(value) && typeof value[0] === 'string') {
                errorMessage = value[0];
                break;
              }
              if (typeof value === 'object') {
                stack.push(value);
              }
            }
          }
        }

        const msg = errorMessage ?? res?.message ?? error?.message ?? 'Something went wrong';

        if (typeof window !== 'undefined' && msg) {
          console.error('[Mutation Error]', msg);
          // TODO: Replace with your toast library (e.g. react-hot-toast, sonner)
          // toast.error(msg);
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
