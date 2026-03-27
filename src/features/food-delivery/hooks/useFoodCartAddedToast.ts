import { useEffect, useState } from 'react';
import { FOOD_CART_ITEM_ADDED } from '@/lib/foodCartEvents';

const TOAST_MS = 2800;

/** Toast visibility when cart quantity increases (listing page). */
export function useFoodCartAddedToast(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onAdded = () => setVisible(true);
    window.addEventListener(FOOD_CART_ITEM_ADDED, onAdded);
    return () => window.removeEventListener(FOOD_CART_ITEM_ADDED, onAdded);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => setVisible(false), TOAST_MS);
    return () => window.clearTimeout(t);
  }, [visible]);

  return visible;
}
