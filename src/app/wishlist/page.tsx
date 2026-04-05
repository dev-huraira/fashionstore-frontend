'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';
import { API_BASE } from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import './wishlist.css';

export default function WishlistPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/wishlist`, {
                credentials: 'include',
            });
            if (res.status === 401) { window.location.href = '/login'; return; }
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setProducts(Array.isArray(data) ? data : []);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWishlist(); }, []);



    return (
        <div className="wishlist-container container">
            <h1 className="wishlist-title">❤️ My Wishlist</h1>

            {error && <div className="wishlist-error">⚠️ {error}</div>}

            {loading ? (
                <div className="wishlist-loading">Loading your wishlist...</div>
            ) : products.length === 0 ? (
                <div className="wishlist-empty">
                    <p>Your wishlist is empty.</p>
                    <Link href="/" className="btn-primary" style={{ padding: '0.7rem 2rem', borderRadius: 4, display: 'inline-block', marginTop: '1rem' }}>
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {products.map(product => {
                        const imageUrl = getImageUrl(product.images?.[0], '200x250');
                        const discountedPrice = product.discount
                            ? product.price * (1 - product.discount / 100)
                            : product.price;

                        return (
                            <div key={product._id} className="wishlist-card">
                                <div className="wishlist-card-img">
                                    <Link href={`/product/${product._id}`}>
                                        <img src={imageUrl} alt={product.name} />
                                    </Link>
                                    <div className="wishlist-heart">
                                        <WishlistButton productId={product._id} size="sm" />
                                    </div>
                                </div>
                                <div className="wishlist-card-info">
                                    <Link href={`/product/${product._id}`}>
                                        <h3>{product.name}</h3>
                                    </Link>
                                    <div className="wishlist-stars">
                                        {[1,2,3,4,5].map(s => (
                                            <span key={s} style={{ color: s <= Math.round(product.averageRating || 0) ? '#f90' : '#ccc' }}>★</span>
                                        ))}
                                        <span style={{ fontSize: '0.82rem', color: '#888' }}>({product.numReviews || 0})</span>
                                    </div>
                                    <div className="wishlist-price">
                                        {product.discount > 0 ? (
                                            <>
                                                <span className="price-original">${product.price.toFixed(2)}</span>
                                                <span className="price-discounted">${discountedPrice.toFixed(2)}</span>
                                                <span className="discount-badge">{product.discount}% OFF</span>
                                            </>
                                        ) : (
                                            <span className="price-discounted">${product.price.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/product/${product._id}`}
                                        className="add-to-cart-btn"
                                        style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginTop: '0.5rem' }}
                                    >
                                        View Product
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
