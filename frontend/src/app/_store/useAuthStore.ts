import { create } from "zustand";

interface AuthState {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
  name: string | null;
  role: "user" | "admin" | null;
  tokenExpiresAt: string | null;
  logout: () => Promise<void>;
  setAuth: (authData: Partial<AuthState>) => void;
  checkStatus: () => Promise<void>; // ✅ New function inside the store
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  userId: null,
  email: null,
  name: null,
  role: null,
  tokenExpiresAt: null,

  logout: async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    set({
      authenticated: false,
      userId: null,
      email: null,
      name: null,
      role: null,
      tokenExpiresAt: null,
    });
  },

  setAuth: (authData) => set(authData),

  checkStatus: async () => {
    try {
      const res = await fetch("/api/auth/current-user");
      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();

      set({
        authenticated: data.authenticated,
        userId: data.userId || null,
        email: data.email || null,
        name: data.name || null,
        role: data.role || null,
        tokenExpiresAt: data.tokenExpiresAt || null,
      });
    } catch {
      useAuthStore.getState().logout();
    }
  },
}));
