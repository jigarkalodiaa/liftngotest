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

export type MarketplaceCartShopMeta = {
  merchantWhatsApp: string | null;
  pickupAddressLine: string | null;
};

type CartState = {
  shopId: string | null;
  shopName: string | null;
  merchantWhatsApp: string | null;
  pickupAddressLine: string | null;
  /** Unlocks Book delivery boy after user opens WhatsApp (same session, persisted). */
  whatsappOpened: boolean;
  items: MarketplaceCartLine[];
  addOrIncrement: (
    shopId: string,
    shopName: string,
    line: Omit<MarketplaceCartLine, 'quantity'> & { quantity?: number },
    meta?: MarketplaceCartShopMeta,
  ) => 'ok' | 'different_shop';
  /** Replace current cart and add first unit (after user confirms switching shop). */
  replaceShopAndAdd: (
    shopId: string,
    shopName: string,
    line: Omit<MarketplaceCartLine, 'quantity'> & { quantity?: number },
    meta?: MarketplaceCartShopMeta,
  ) => void;
  setWhatsappOpened: (opened: boolean) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
};

const empty = (): Pick<
  CartState,
  'shopId' | 'shopName' | 'items' | 'merchantWhatsApp' | 'pickupAddressLine' | 'whatsappOpened'
> => ({
  shopId: null,
  shopName: null,
  items: [],
  merchantWhatsApp: null,
  pickupAddressLine: null,
  whatsappOpened: false,
});

export const useMarketplaceCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...empty(),

      addOrIncrement: (shopId, shopName, line, meta) => {
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
        const wa = meta?.merchantWhatsApp ?? state.merchantWhatsApp;
        const pickup = meta?.pickupAddressLine ?? state.pickupAddressLine;
        set({
          shopId,
          shopName,
          merchantWhatsApp: wa ?? null,
          pickupAddressLine: pickup ?? null,
          items: nextItems,
        });
        return 'ok';
      },

      replaceShopAndAdd: (shopId, shopName, line, meta) => {
        const q = line.quantity ?? 1;
        set({
          shopId,
          shopName,
          merchantWhatsApp: meta?.merchantWhatsApp ?? null,
          pickupAddressLine: meta?.pickupAddressLine ?? null,
          whatsappOpened: false,
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

      setWhatsappOpened: (opened) => set({ whatsappOpened: opened }),

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
        merchantWhatsApp: s.merchantWhatsApp,
        pickupAddressLine: s.pickupAddressLine,
        whatsappOpened: s.whatsappOpened,
      }),
    },
  ),
);

/** Reset in-memory cart and drop persisted snapshot (call on global logout after storage wipe, or before it). */
export function clearMarketplaceCartOnLogout(): void {
  useMarketplaceCartStore.getState().clear();
  try {
    void useMarketplaceCartStore.persist.clearStorage();
  } catch {
    /* ignore */
  }
}

export function marketplaceCartSubtotal(items: MarketplaceCartLine[]): number {
  return items.reduce((t, i) => t + i.price * i.quantity, 0);
}

export const MARKETPLACE_DELIVERY_FLAT_INR = 49;
