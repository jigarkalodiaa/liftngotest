'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { apiClient, parseApiError, type ApiError } from '@/lib/api';
import { logger } from '@/lib/logger';

interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseApiOptions {
  /** Execute immediately on mount */
  immediate?: boolean;
  /** Dependencies for re-fetching */
  deps?: unknown[];
  /** Callback on success */
  onSuccess?: (data: unknown) => void;
  /** Callback on error */
  onError?: (error: ApiError) => void;
}

/**
 * Generic hook for API calls with loading/error states
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & { execute: () => Promise<T | null>; reset: () => void } {
  const { immediate = false, deps = [], onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
    isSuccess: false,
    isError: false,
  });

  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async (): Promise<T | null> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      isError: false,
    }));

    try {
      const data = await fetcherRef.current();
      
      if (mountedRef.current) {
        setState({
          data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
        onSuccess?.(data);
      }
      
      return data;
    } catch (err) {
      const apiError = parseApiError(err);
      logger.error('API call failed', { error: apiError.message });
      
      if (mountedRef.current) {
        setState({
          data: null,
          error: apiError,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });
        onError?.(apiError);
      }
      
      return null;
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (immediate) {
      void execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...deps]);

  return { ...state, execute, reset };
}

/**
 * Hook for GET requests
 */
export function useQuery<T>(
  url: string,
  params?: Record<string, string | number | boolean | undefined>,
  options: UseApiOptions = {}
) {
  return useApi<T>(() => apiClient.get<T>(url, params), {
    immediate: true,
    ...options,
  });
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<T, D = unknown>(
  mutationFn: (data: D) => Promise<T>,
  options: Omit<UseApiOptions, 'immediate' | 'deps'> = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const mountedRef = useRef(true);

  const mutate = useCallback(
    async (data: D): Promise<T | null> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        isError: false,
      }));

      try {
        const result = await mutationFn(data);
        
        if (mountedRef.current) {
          setState({
            data: result,
            error: null,
            isLoading: false,
            isSuccess: true,
            isError: false,
          });
          options.onSuccess?.(result);
        }
        
        return result;
      } catch (err) {
        const apiError = parseApiError(err);
        logger.error('Mutation failed', { error: apiError.message });
        
        if (mountedRef.current) {
          setState({
            data: null,
            error: apiError,
            isLoading: false,
            isSuccess: false,
            isError: true,
          });
          options.onError?.(apiError);
        }
        
        return null;
      }
    },
    [mutationFn, options]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { ...state, mutate, reset };
}

export default useApi;
