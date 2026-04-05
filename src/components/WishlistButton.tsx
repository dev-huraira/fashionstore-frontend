'use client';

import { useWishlist } from '@/context/WishlistContext';

interface WishlistButtonProps {
    productId: string;
    size?: 'sm' | 'md';
    productName?: string;
    onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function WishlistButton({ productId, size = 'md', productName, onToast }: WishlistButtonProps) {
    const { isWishlisted, toggle } = useWishlist();
    const wishlisted = isWishlisted(productId);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await toggle(productId, productName, onToast);
    };

    const s = size === 'sm' ? 20 : 26;

    return (
        <button
            onClick={handleClick}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <svg
                width={s} height={s}
                viewBox="0 0 24 24"
                fill={wishlisted ? '#e53e3e' : 'none'}
                stroke={wishlisted ? '#e53e3e' : '#666'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
}
