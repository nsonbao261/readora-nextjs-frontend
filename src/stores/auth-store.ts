import { create } from "zustand";

// AuthStore tracks a simulated logged-in state (UI-only, no persistence).
type AuthState = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  toggle: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  toggle: () => set((state) => ({ isAuthenticated: !state.isAuthenticated })),
}));
