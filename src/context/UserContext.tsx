import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

type RegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

type UserContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (input: RegistrationInput) => Promise<boolean>;
  logout: () => void;
  accessStats: Record<string, number>;
  incrementServiceAccess: (serviceId: string) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageGet<User | null>("sf_user", null));
  const [accessStats, setAccessStats] = useState<Record<string, number>>(() =>
    storageGet<Record<string, number>>("sf_access_stats", {})
  );

  useEffect(() => {
    storageSet("sf_user", user);
  }, [user]);

  useEffect(() => {
    storageSet("sf_access_stats", accessStats);
  }, [accessStats]);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    // Demo auth: accept any non-empty credentials. In a real app, call an API.
    if (!identifier || !password) return false;

    // If identifier looks like an email, synthesize a username, else treat as username
    const isEmail = /@/.test(identifier);
    const username = isEmail ? identifier.split("@")[0] : identifier;

    // Reset access stats when user logs in to start with empty pie chart
    setAccessStats({});

    setUser({
      firstName: username,
      lastName: "",
      email: isEmail ? identifier : `${username}@example.com`,
      username,
    });
    return true;
  };

  const register = async (input: RegistrationInput): Promise<boolean> => {
    const { firstName, lastName, email, username, password } = input;
    if (!firstName || !lastName || !email || !username || !password) return false;
    
    // Reset access stats when user registers to start with empty pie chart
    setAccessStats({});
    
    setUser({ firstName, lastName, email, username });
    return true;
  };

  const logout = (): void => {
    setUser(null);
  };

  const incrementServiceAccess = (serviceId: string): void => {
    setAccessStats((prev) => ({ ...prev, [serviceId]: (prev[serviceId] ?? 0) + 1 }));
  };

  const value: UserContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      accessStats,
      incrementServiceAccess,
    }),
    [user, accessStats]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}


