'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE } from '@/lib/api';

export type CartItem = {
    id: string;       // product._id
    _itemId?: string; // cart item sub-document _id (for backend deletion)
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity' | '_itemId'>, redirectPath?: string, size?: string, color?: string) => Promise<boolean>;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    cartCount: number;
    cartTotal: number;
    clearCart: () => Promise<void>;
    isLoaded: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/** Maps raw backend cart items → CartItem[]. Filters out any with a null product ref. */
function mapBackendItems(items: any[]): CartItem[] {
    return (items || [])
        .filter((i: any) => i.product != null)
        .map((i: any) => ({
            id: i.product._id,
            _itemId: i._id,
            name: i.product.name,
            price: i.price,
            image: i.product.images?.[0] || '',
            quantity: i.quantity,
            size: i.size || '',
            color: i.color || '',
        }));
}

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Sync cart from backend on mount / auth change
    useEffect(() => {
        const syncCart = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/cart`, { credentials: 'include' });
                setCartItems(res.ok ? mapBackendItems((await res.json()).items || []) : []);
            } catch {
                // Network error — keep existing cart state
            } finally {
                setIsLoaded(true);
            }
        };

        syncCart();

        const handleAuthChange = () => syncCart();
        // Listen for cross-tab auth changes (key matches what AuthContext dispatches)
        const handleStorage = (e: StorageEvent) => { if (e.key === 'authChange') syncCart(); };

        window.addEventListener('authChange', handleAuthChange);
        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    // Persist cart locally (for faster hydration on next load)
    useEffect(() => {
        if (isLoaded) localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems, isLoaded]);

    const addToCart = async (
        item: Omit<CartItem, 'quantity' | '_itemId'>,
        redirectPath?: string,
        size?: string,
        color?: string,
    ) => {
        const redirect = redirectPath || (typeof window !== 'undefined' ? window.location.pathname : '/');

        // Auth guard — redirect immediately if not logged in (no optimistic update)
        if (!user) {
            window.location.href = `/login?message=Please sign in to add items to your cart&redirect=${encodeURIComponent(redirect)}`;
            return false;
        }

        const chosenSize = size || item.size || '';
        const chosenColor = color || item.color || '';

        // Optimistic UI update (only after auth check passes)
        setCartItems((prev) => {
            const existing = prev.find((i) => i.id === item.id && i.size === chosenSize && i.color === chosenColor);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id && i.size === chosenSize && i.color === chosenColor
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1, size: chosenSize, color: chosenColor }];
        });

        // Sync with backend
        try {
            const res = await fetch(`${API_BASE}/api/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ productId: item.id, quantity: 1, price: item.price, size: chosenSize, color: chosenColor }),
            });
            if (res.status === 401) {
                // Not logged in — undo optimistic update and redirect
                setCartItems((prev) => prev.filter((i) => !(i.id === item.id && i.size === chosenSize && i.color === chosenColor)));
                window.location.href = `/login?message=Please sign in to add items to your cart&redirect=${encodeURIComponent(redirect)}`;
                return false;
            }
            if (res.ok) {
                const data = await res.json();
                setCartItems(mapBackendItems(data.items || []));
            }
        } catch {
            // Keep optimistic state on network error
        }
        return true;
    };

    const removeFromCart = async (itemId: string) => {
        const item = cartItems.find((i) => i._itemId === itemId);
        setCartItems((prev) => prev.filter((i) => i._itemId !== itemId));
        if (item?._itemId) {
            try {
                await fetch(`${API_BASE}/api/cart/${item._itemId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
            } catch {
                // Optimistic delete stands even on network error
            }
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        // Optimistic UI update immediately
        setCartItems((prev) => prev.map((i) => (i._itemId === itemId ? { ...i, quantity } : i)));
        try {
            const res = await fetch(`${API_BASE}/api/cart/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ quantity }),
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(mapBackendItems(data.items || []));
            }
        } catch {
            // Keep optimistic update on network error
        }
    };

    const clearCart = async () => {
        setCartItems([]);
        try {
            await fetch(`${API_BASE}/api/cart`, { method: 'DELETE', credentials: 'include' });
        } catch {
            // Cart is already cleared optimistically
        }
    };

    const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
    const cartTotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart, isLoaded }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
