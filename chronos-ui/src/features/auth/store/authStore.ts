import { create } from 'zustand';

const STORAGE_KEY = 'chronos.auth';

type AuthState = {
  token: string | null;
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  setSession: (payload: {
    token: string;
    userId: string;
    username: string;
  }) => void;
  clearSession: () => void;
};

const readPersistedSession = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      token: string;
      userId: string;
      username: string;
    };

    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const persisted = readPersistedSession();

export const useAuthStore = create<AuthState>((set) => ({
  token: persisted?.token ?? null,
  userId: persisted?.userId ?? null,
  username: persisted?.username ?? null,
  isAuthenticated: Boolean(persisted?.token),
  setSession: ({ token, userId, username }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, userId, username }));
    set({ token, userId, username, isAuthenticated: true });
  },
  clearSession: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, userId: null, username: null, isAuthenticated: false });
  },
}));
