import { create } from "zustand";

export type User = {
  name: string;
  email: string;
  [key: string]: unknown;
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

const userAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));

export default userAuthStore;
