'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace('/admin/login');
        } else if (user.role !== 'admin') {
            router.replace('/');
        }
    }, [user, loading, router]);

    // Show spinner while auth is loading OR while redirecting
    if (loading || !user || user.role !== 'admin') {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: '#f5f6fa',
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: '4px solid #e0e0e0',
                    borderTopColor: '#4a90e2',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return <>{children}</>;
}
