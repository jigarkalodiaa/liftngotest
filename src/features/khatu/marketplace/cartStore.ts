import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/constants';

export type MarketplaceCartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  shopId: string | null;
  shopName: string | null;
  items: MarketplaceCartLine[];
  addOrIncrement: (
    shopId: string,
    shopName: string,
    line: Omit<MarketplaceCartLine, 'quantity'> & { quantity?: number },
  ) => 'ok' | 'different_shop';
  /** Replace current cart and add first unit (after user confirms switching shop). */
  replaceShopAndAdd: (
    shopId: string,
    shopName: string,
    line: Omit<MarketplaceCartLine, 'quantity'> & { quantity?: number },
  ) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
};

const empty = (): Pick<CartState, 'shopId' | 'shopName' | 'items'> => ({
  shopId: null,
  shopName: null,
  items: [],
});

export const useMarketplaceCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...empty(),

      addOrIncrement: (shopId, shopName, line) => {
        const q = line.quantity ?? 1;
        const state = get();
        if (state.shopId && state.shopId !== shopId) return 'different_shop';

        const nextItems = [...state.items];
        const idx = nextItems.findIndex((i) => i.productId === line.productId);
        if (idx >= 0) {
          nextItems[idx] = { ...nextItems[idx], quantity: nextItems[idx].quantity + q };
        } else {
          nextItems.push({
            productId: line.productId,
            name: line.name,
            price: line.price,
            image: line.image,
            quantity: q,
          });
        }
        set({
          shopId,
          shopName,
          items: nextItems,
        });
        return 'ok';
      },

      replaceShopAndAdd: (shopId, shopName, line) => {
        const q = line.quantity ?? 1;
        set({
          shopId,
          shopName,
          items: [
            {
              productId: line.productId,
              name: line.name,
              price: line.price,
              image: line.image,
              quantity: q,
            },
          ],
        });
      },

      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeLine(productId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }));
        const left = get().items;
        if (left.length === 0) set(empty());
      },

      removeLine: (productId) => {
        set((s) => {
          const items = s.items.filter((i) => i.productId !== productId);
          if (items.length === 0) return { ...empty() };
          return { items };
        });
      },

      clear: () => set(empty()),
    }),
    {
      name: STORAGE_KEYS.KHATU_MARKETPLACE_CART,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        shopId: s.shopId,
        shopName: s.shopName,
        items: s.items,
      }),
    },
  ),
);

export function marketplaceCartSubtotal(items: MarketplaceCartLine[]): number {
  return items.reduce((t, i) => t + i.price * i.quantity, 0);
}

export const MARKETPLACE_DELIVERY_FLAT_INR = 49;
