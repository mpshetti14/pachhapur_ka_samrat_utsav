import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../lib/api';

export type User = { id: string; name: string; email: string; mobile?: string; role: 'USER' | 'COMMITTEE' | 'ADMIN' };
type AuthValue = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (data: Record<string, string>) => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem('samrat_token')) return setLoading(false);
    api.get<User>('/auth/me').then(({ data }) => setUser(data)).catch(() => localStorage.removeItem('samrat_token')).finally(() => setLoading(false));
  }, []);
  async function authenticate(path: string, data: unknown) {
    const response = await api.post<{ token: string; user: User }>(path, data);
    localStorage.setItem('samrat_token', response.data.token);
    setUser(response.data.user);
  }
  return <AuthContext.Provider value={{ user, loading, login: (email, password) => authenticate('/auth/login', { email, password }), register: (data) => authenticate('/auth/register', data), logout: () => { localStorage.removeItem('samrat_token'); setUser(null); } }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}