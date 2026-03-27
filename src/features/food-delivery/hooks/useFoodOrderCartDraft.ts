import { useCallback, useEffect, useState } from 'react';
import type { FoodOrderCartDraft } from '@/lib/storage';
import { getFoodOrderCartDraft } from '@/lib/storage';
import { FOOD_CART_UPDATED } from '@/lib/foodCartEvents';

export function useFoodOrderCartDraft(): {
  draft: FoodOrderCartDraft | null;
  refreshDraft: () => void;
} {
  const [draft, setDraft] = useState<FoodOrderCartDraft | null>(null);

  const refreshDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    setDraft(getFoodOrderCartDraft());
  }, []);

  useEffect(() => {
    refreshDraft();
  }, [refreshDraft]);

  useEffect(() => {
    const sync = () => refreshDraft();
    window.addEventListener(FOOD_CART_UPDATED, sync);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener(FOOD_CART_UPDATED, sync);
      window.removeEventListener('focus', sync);
    };
  }, [refreshDraft]);

  return { draft, refreshDraft };
}
