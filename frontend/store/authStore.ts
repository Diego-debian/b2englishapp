"use client";

import { create } from "zustand";
import type { UserOut } from "@/lib/types";
import { storage } from "@/lib/storage";

type AuthState = {
  token: string | null;
  user: UserOut | null;
  hydrated: boolean;

  hydrate: () => void;
  login: (token: string, user: UserOut) => void;
  setUser: (user: UserOut) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  hydrate: () => {
    const st = storage.read();
    if (st?.token && st.user) {
      set({ token: st.token, user: st.user as UserOut, hydrated: true });
      return;
    }
    set({ token: null, user: null, hydrated: true });
  },

  login: (token, user) => {
    storage.write({ token, user });
    set({ token, user, hydrated: true });
  },

  setUser: (user: UserOut) => {
    const st = storage.read();
    if (st) {
      storage.write({ ...st, user });
    }
    set({ user });
  },

  logout: () => {
    storage.clear();
    set({ token: null, user: null, hydrated: true });
    // Redirect lo manejan Protected + UI
  }
}));

