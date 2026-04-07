import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORAGE_KEY = 'liftngo_noida_coconut_cart';

export type CoconutCartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CoconutCartLine[];
  addOrIncrement: (line: Omit<CoconutCartLine, 'quantity'>) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
};

export const useCoconutCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addOrIncrement: (line) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.productId === line.productId);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
        } else {
          items.push({ ...line, quantity: 1 });
        }
        set({ items });
      },

      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeLine(productId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }));
      },

      removeLine: (productId) => {
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) }));
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export function coconutCartSubtotal(items: CoconutCartLine[]): number {
  return items.reduce((t, i) => t + i.price * i.quantity, 0);
}
