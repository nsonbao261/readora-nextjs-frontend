import { create } from "zustand";
import type { User } from "@/types/user";
import { seedPasswords, seededUsers } from "@/data/users";
import { DEMO_GOOGLE_EMAIL } from "@/constants/auth";

// Payload accepted by `register`; `role`/`provider`/`emailVerified` are fixed
// by the store (always an unverified credentials "customer").
export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
};

// Internal credential map (email -> plaintext demo password), seeded with the
// demo accounts and extended on register. Kept out of the state so it never
// leaks into components.
const passwords = new Map<string, string>(Object.entries(seedPasswords));

// AuthStore holds the signed-in user and the in-memory list of registered
// users (seeded from mock data). Auth state is lost on reload.
type AuthState = {
  user: User | null;
  registeredUsers: User[];
  // Creates an unverified credentials customer; does NOT sign them in.
  register: (input: RegisterInput) => User;
  // Marks the user verified and signs them in.
  verifyEmail: (userId: string) => void;
  // Validates credentials against the registered list; signs in on match.
  login: (email: string, password: string) => boolean;
  // Creates/signs in the demo Google customer (always role "customer").
  googleLogin: () => void;
  // Clears the signed-in user.
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  registeredUsers: seededUsers,

  register: (input) => {
    const user: User = {
      id: `usr-${crypto.randomUUID()}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      dateOfBirth: input.dateOfBirth,
      role: "customer",
      provider: "credentials",
      emailVerified: false,
    };
    passwords.set(user.email, input.password);
    set((state) => ({ registeredUsers: [...state.registeredUsers, user] }));
    return user;
  },

  verifyEmail: (userId) =>
    set((state) => {
      const user = state.registeredUsers.find((u) => u.id === userId);
      if (!user) return state;
      const verified = { ...user, emailVerified: true };
      return {
        registeredUsers: state.registeredUsers.map((u) =>
          u.id === userId ? verified : u,
        ),
        user: verified,
      };
    }),

  login: (email, password) => {
    const normalized = email.trim().toLowerCase();
    const user = get().registeredUsers.find((u) => u.email === normalized);
    if (!user || passwords.get(user.email) !== password) return false;
    set({ user });
    return true;
  },

  googleLogin: () =>
    set((state) => {
      const existing = state.registeredUsers.find(
        (u) => u.provider === "google",
      );
      if (existing) return { user: existing };
      const user: User = {
        id: `usr-${crypto.randomUUID()}`,
        name: "Google Customer",
        email: DEMO_GOOGLE_EMAIL,
        phone: "0912345678",
        dateOfBirth: "1993-05-20",
        role: "customer",
        provider: "google",
        emailVerified: true,
      };
      return { registeredUsers: [...state.registeredUsers, user], user };
    }),

  logout: () => set({ user: null }),
}));

// Derived selector: true while a user is signed in.
export const selectIsAuthenticated = (state: AuthState) => state.user !== null;
