// ============================================
// Cart Store — Zustand
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getDeliveryCharge: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + item.quantity,
            };
            return { items: updatedItems };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      setCartOpen: (open) => set({ isCartOpen: open }),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 999 ? 0 : 49;
      },

      getTotal: () => get().getSubtotal() + get().getDeliveryCharge(),
    }),
    {
      name: 'cake-connection-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
