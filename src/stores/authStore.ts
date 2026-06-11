import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/models";
import { getUserIdFromToken } from "@/lib/utils/jwt";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => {
        const id = getUserIdFromToken(token);
        const userId =
          id ?? user._id ?? (user as AuthUser & { id?: string }).id;
        set({ token, user: { ...user, _id: userId } });
      },
      logout: () => set({ token: null, user: null }),
    }),
    { name: "albayaan-auth" }
  )
);
