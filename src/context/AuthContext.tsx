import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore session from HTTP-only cookie via /auth/me
    authApi
      .getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem('studynote_user', JSON.stringify(profile));
      })
      .catch(() => {
        setUser(null);
        authApi.clearStoredUser();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    localStorage.setItem('studynote_user', JSON.stringify(res.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    setUser(res.user);
    localStorage.setItem('studynote_user', JSON.stringify(res.user));
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
    authApi.clearStoredUser();
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('studynote_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
