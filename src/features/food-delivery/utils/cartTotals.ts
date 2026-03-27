import type { FoodOrderCartDraft } from '@/lib/storage';
import { parsePrice } from '@/data/restaurantsKhatushyam';

export function countCartItems(draft: FoodOrderCartDraft | null): number {
  return draft?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
}

export function sumCartRupee(draft: FoodOrderCartDraft | null): number {
  if (!draft?.items.length) return 0;
  return draft.items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0);
}
