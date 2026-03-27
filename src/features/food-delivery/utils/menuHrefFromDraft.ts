import { ROUTES } from '@/lib/constants';

export function getMenuHrefFromDraft(restaurantId: string | undefined): string {
  return restaurantId ? `/find-restaurant/${restaurantId}` : `${ROUTES.FIND_RESTAURANT}#restaurants`;
}
