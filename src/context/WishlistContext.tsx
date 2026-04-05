'use client';

import {
    createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { API_BASE } from '@/lib/api';

type ToastFn = (msg: string, type: 'success' | 'error' | 'info') => void;

type WishlistContextType = {
    wishlistIds: Set<string>;
    isWishlisted: (productId: string) => boolean;
    toggle: (productId: string, productName?: string, onToast?: ToastFn) => Promise<void>;
    refetch: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

    const fetchWishlist = useCallback(async () => {
        if (!user) { setWishlistIds(new Set()); return; }
        try {
            const res = await fetch(`${API_BASE}/api/wishlist`, { credentials: 'include' });
            if (res.ok) {
                const items: any[] = await res.json();
                setWishlistIds(new Set(Array.isArray(items) ? items.map((p: any) => p._id) : []));
            } else {
                setWishlistIds(new Set());
            }
        } catch {
            setWishlistIds(new Set());
        }
    }, [user]);

    // Re-fetch whenever user logs in/out
    useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

    const isWishlisted = useCallback(
        (productId: string) => wishlistIds.has(productId),
        [wishlistIds],
    );

    const toggle = useCallback(async (
        productId: string,
        productName?: string,
        onToast?: ToastFn,
    ) => {
        if (!user) {
            if (onToast) {
                onToast('Please sign in to use your wishlist', 'info');
                setTimeout(() => { window.location.href = '/login'; }, 1200);
            } else {
                window.location.href = '/login';
            }
            return;
        }

        const wasWishlisted = wishlistIds.has(productId);

        // Optimistic update
        setWishlistIds(prev => {
            const next = new Set(prev);
            wasWishlisted ? next.delete(productId) : next.add(productId);
            return next;
        });

        try {
            const res = await fetch(`${API_BASE}/api/wishlist/${productId}`, {
                method: wasWishlisted ? 'DELETE' : 'POST',
                credentials: 'include',
            });

            if (!res.ok) {
                // Revert optimistic update on failure
                setWishlistIds(prev => {
                    const next = new Set(prev);
                    wasWishlisted ? next.add(productId) : next.delete(productId);
                    return next;
                });
                if (res.status === 401) {
                    if (onToast) {
                        onToast('Please sign in to use your wishlist', 'info');
                        setTimeout(() => { window.location.href = '/login'; }, 1200);
                    } else {
                        window.location.href = '/login';
                    }
                } else if (onToast) {
                    onToast('Something went wrong. Please try again.', 'error');
                }
                return;
            }

            if (onToast) {
                const label = productName ? `"${productName}"` : 'Item';
                const nowIn = !wasWishlisted;
                onToast(
                    nowIn ? `${label} added to wishlist! ❤️` : `${label} removed from wishlist`,
                    nowIn ? 'success' : 'info',
                );
            }
        } catch {
            // Revert on network error
            setWishlistIds(prev => {
                const next = new Set(prev);
                wasWishlisted ? next.add(productId) : next.delete(productId);
                return next;
            });
            if (onToast) onToast('Network error. Please try again.', 'error');
        }
    }, [user, wishlistIds]);

    return (
        <WishlistContext.Provider value={{ wishlistIds, isWishlisted, toggle, refetch: fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
    return ctx;
}
