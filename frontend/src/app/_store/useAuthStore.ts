import { create } from "zustand";

interface AuthState {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
  name: string | null;
  role: "user" | "admin" | null;
  tokenExpiresAt: string | null;
  plan: "free" | "pro" | "premium" | "enterprise" | null;
  monthlyUploadUsage: number;
  monthlyUploadLimit: number;
  logout: (router?: any) => Promise<void>;
  setAuth: (authData: Partial<AuthState>) => void;
  checkStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  userId: null,
  email: null,
  name: null,
  role: null,
  tokenExpiresAt: null,
  plan: null,
  monthlyUploadUsage: 0,
  monthlyUploadLimit: 0,

  logout: async (router) => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      set({
        authenticated: false,
        userId: null,
        email: null,
        name: null,
        role: null,
        tokenExpiresAt: null,
        plan: null,
        monthlyUploadUsage: 0,
        monthlyUploadLimit: 0,
      });

      if (router) {
        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
        plan: data.plan || null,
        monthlyUploadUsage: data.monthlyUploadUsage || 0,
        monthlyUploadLimit: data.monthlyUploadLimit || 10,
        tokenExpiresAt: data.tokenExpiresAt || null,
      });
    } catch {
      useAuthStore.getState().logout();
    }
  },
}));
