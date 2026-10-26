import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.login({ email, password });
          const { token, ...user } = data.data;
          localStorage.setItem('cyberflix_token', token);
          localStorage.setItem('cyberflix_user', JSON.stringify(user));
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (err) {
          const error = err.response?.data?.message || 'Login failed';
          set({ isLoading: false, error });
          return { success: false, error };
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.register({ name, email, password });
          const { token, ...user } = data.data;
          localStorage.setItem('cyberflix_token', token);
          localStorage.setItem('cyberflix_user', JSON.stringify(user));
          set({ user, token, isLoading: false });
          return { success: true };
        } catch (err) {
          const error = err.response?.data?.message || 'Registration failed';
          set({ isLoading: false, error });
          return { success: false, error };
        }
      },

      logout: () => {
        localStorage.removeItem('cyberflix_token');
        localStorage.removeItem('cyberflix_user');
        set({ user: null, token: null, error: null });
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const { data: res } = await authAPI.updateProfile(data);
          const { token, ...user } = res.data;
          if (token) localStorage.setItem('cyberflix_token', token);
          localStorage.setItem('cyberflix_user', JSON.stringify(user));
          set({ user, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, error: err.response?.data?.message };
        }
      },

      toggleWishlist: async (productId) => {
        try {
          const { data } = await authAPI.toggleWishlist(productId);
          set((state) => ({ user: { ...state.user, wishlist: data.data } }));
        } catch (err) {
          console.error('Wishlist toggle failed', err);
        }
      },

      isInWishlist: (productId) => {
        return get().user?.wishlist?.includes(productId) || false;
      },

      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'cyberflix-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
