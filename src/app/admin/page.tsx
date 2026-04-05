'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * /admin — Role-based redirect only. Never shows content.
 *   - Not logged in  → /
 *   - Logged in user → /
 *   - Logged in admin → /admin/dashboard
 */
export default function AdminRedirect() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (user?.role === 'admin') {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/');
        }
    }, [user, loading, router]);

    return null; // render nothing — this page is pure redirect logic
}
