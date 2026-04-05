'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

type User = {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    phone?: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    refetch: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/me`, {
                credentials: 'include', // send cookies automatically
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
        // Re-fetch when other tabs log in/out
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'authChange') fetchUser();
        };
        window.addEventListener('storage', onStorage);
        // Re-fetch on same-tab auth events
        const onAuthChange = () => fetchUser();
        window.addEventListener('authChange', onAuthChange);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('authChange', onAuthChange);
        };
    }, [fetchUser]);

    const logout = useCallback(async () => {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch {
            // Even if the request fails, clear local state
        }
        setUser(null);
        // Clear admin cookie (belt-and-suspenders, server already clears it via Set-Cookie)
        document.cookie = 'admin_session=; path=/; max-age=0; SameSite=Strict';
        window.dispatchEvent(new Event('authChange'));
        router.push('/');
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, loading, refetch: fetchUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
