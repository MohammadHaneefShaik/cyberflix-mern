import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI } from '../services/api';
import useAuthStore from './useAuthStore';

// Format price in INR
export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],          // { product: {_id, name, brand, price, emoji}, qty, price }
      isOpen: false,
      isSyncing: false,

      // Local cart helpers (used when not logged in)
      _localAdd: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find(i => i.product._id === product._id || i.product === product._id);
          if (existing) {
            return { items: state.items.map(i =>
              (i.product._id || i.product) === (product._id) ? { ...i, qty: i.qty + qty } : i
            )};
          }
          return { items: [...state.items, { product, qty, price: product.price }] };
        });
      },

      addToCart: async (product, qty = 1) => {
        const { user } = useAuthStore.getState();
        if (user) {
          try {
            const { data } = await cartAPI.add(product._id, qty);
            set({ items: data.data.items || [] });
          } catch (e) {
            // Fallback to local
            get()._localAdd(product, qty);
          }
        } else {
          get()._localAdd(product, qty);
        }
        set({ isOpen: true });
      },

      removeFromCart: async (productId) => {
        const { user } = useAuthStore.getState();
        if (user) {
          try {
            const { data } = await cartAPI.remove(productId);
            set({ items: data.data.items || [] });
            return;
          } catch (e) {}
        }
        set((state) => ({ items: state.items.filter(i => (i.product._id || i.product) !== productId) }));
      },

      updateQty: (productId, newQty) => {
        if (newQty < 1) { get().removeFromCart(productId); return; }
        set((state) => ({
          items: state.items.map(i =>
            (i.product._id || i.product) === productId ? { ...i, qty: newQty } : i
          )
        }));
      },

      clearCart: async () => {
        const { user } = useAuthStore.getState();
        if (user) {
          try { await cartAPI.clear(); } catch (e) {}
        }
        set({ items: [] });
      },

      syncCart: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;
        try {
          set({ isSyncing: true });
          const { data } = await cartAPI.get();
          set({ items: data.data.items || [], isSyncing: false });
        } catch (e) {
          set({ isSyncing: false });
        }
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Computed
      get totalItems() { return get().items.reduce((s, i) => s + i.qty, 0); },
      get subtotal() { return get().items.reduce((s, i) => s + (i.price || i.product?.price || 0) * i.qty, 0); },
    }),
    {
      name: 'cyberflix-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
