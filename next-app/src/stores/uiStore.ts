// ============================================
// UI Store — Zustand
// ============================================

import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeMegaMenu: string | null;
  isPageLoading: boolean;
  toasts: Toast[];

  // Actions
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  setActiveMegaMenu: (menu: string | null) => void;
  setPageLoading: (loading: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeMegaMenu: null,
  isPageLoading: false,
  toasts: [],

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  setSearchOpen: (open) => set({ isSearchOpen: open }),

  setActiveMegaMenu: (menu) => set({ activeMegaMenu: menu }),

  setPageLoading: (loading) => set({ isPageLoading: loading }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Date.now().toString() }],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
