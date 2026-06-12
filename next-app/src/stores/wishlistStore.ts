// ============================================
// Wishlist Store — Zustand
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WishlistItem } from '@/types';

interface WishlistState {
  items: WishlistItem[];

  // Actions
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;

  // Computed
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) {
            return state;
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      toggleItem: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),

      getItemCount: () => get().items.length,
    }),
    {
      name: 'cake-connection-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
