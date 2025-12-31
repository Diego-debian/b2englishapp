const KEY = "b2english.auth.v1";

export type StoredAuth = {
  token: string;
  user: any;
};

export const storage = {
  read(): StoredAuth | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.token || !parsed?.user) return null;
      return parsed as StoredAuth;
    } catch {
      return null;
    }
  },

  write(data: StoredAuth) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  },

  clear() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
};
