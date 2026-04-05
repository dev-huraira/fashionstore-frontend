'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';
import '../page.css';
import { API_BASE } from '@/lib/api';

export default function BestSellers() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(16);

    useEffect(() => {
        fetch(`${API_BASE}/api/products`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Sort by average rating desc, then numReviews desc
                    const sorted = [...data].sort((a, b) =>
                        (b.averageRating || 0) - (a.averageRating || 0) ||
                        (b.numReviews || 0) - (a.numReviews || 0)
                    );
                    setProducts(sorted);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const imageUrl = (p: any) => {
        const img = p.images?.[0];
        if (!img) return 'https://via.placeholder.com/200x250/f3f3f3/333333?text=No+Image';
        return img.startsWith('/') ? `${API_BASE}${img}` : img;
    };



    return (
        <div className="home-container">
            {/* Page Header */}
            <section style={{ background: 'linear-gradient(135deg, #131921 0%, #232f3e 100%)', padding: '2.5rem 1rem', textAlign: 'center' }}>
                <h1 style={{ color: '#ffd814', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>🏆 Best Sellers</h1>
                <p style={{ color: '#ccc', fontSize: '1rem' }}>Our most popular products — loved by thousands of customers</p>
            </section>

            <section className="container section-products" style={{ paddingTop: '2rem' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>Loading best sellers...</div>
                ) : products.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>No products available yet.</div>
                ) : (
                    <>
                    <div className="product-grid">
                        {products.slice(0, visibleCount).map((product, idx) => (
                            <div key={product._id} className="product-card" style={{ position: 'relative' }}>
                                {/* Rank badge */}
                                {idx < 3 && (
                                    <div style={{
                                        position: 'absolute', top: '8px', left: '8px', zIndex: 10,
                                        background: idx === 0 ? '#ffd814' : idx === 1 ? '#c0c0c0' : '#cd7f32',
                                        color: idx === 0 ? '#111' : '#fff',
                                        borderRadius: '50%', width: '28px', height: '28px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                                    }}>#{idx + 1}</div>
                                )}
                                <div className="product-card-top">
                                    <Link href={`/product/${product._id}`} className="product-link">
                                        <div className="product-img-wrapper">
                                            <img src={imageUrl(product)} alt={product.name} />
                                        </div>
                                    </Link>
                                    <div className="product-wishlist-btn">
                                        <WishlistButton productId={product._id} size="sm" />
                                    </div>
                                </div>
                                <div className="product-info">
                                    <Link href={`/product/${product._id}`} className="product-link">
                                        <h3 className="product-title">{product.name}</h3>
                                    </Link>
                                    <div className="product-rating">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <span key={s} style={{ color: s <= Math.round(product.averageRating || 0) ? '#f90' : '#ccc', fontSize: '1rem' }}>★</span>
                                        ))}
                                        <span className="rating-num">({product.numReviews || 0})</span>
                                    </div>
                                    <p className="product-price">${product.price}</p>
                                    <Link href={`/product/${product._id}`} className="view-product-btn">View Product</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Load More */}
                    {visibleCount < products.length && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                            <button
                                onClick={() => setVisibleCount(c => c + 16)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'none', border: '2px solid #d1d5db', borderRadius: '50%',
                                    width: 56, height: 56, cursor: 'pointer', color: '#374151',
                                    transition: 'border-color 0.2s, transform 0.2s'
                                }}
                                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffa41c'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }}
                                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#d1d5db'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                                aria-label="Load more products"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                                </svg>
                            </button>
                        </div>
                    )}
                    </>
                )}
            </section>


        </div>
    );
}
