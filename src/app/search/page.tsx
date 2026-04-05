'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import '../page.css';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';

type Product = {
    _id: string;
    name: string;
    price: number;
    rating: number;
    images: string[];
};


function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [visibleCount, setVisibleCount] = useState(16);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setVisibleCount(16);
            try {
                // No query → fetch all products; with query → filter by keyword
                const url = query
                    ? `${API_BASE}/api/products?keyword=${encodeURIComponent(query)}`
                    : `${API_BASE}/api/products`;
                const res = await fetch(url);
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || 'Failed to load products');

                setProducts(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="container" style={{ margin: '2rem auto' }}>
            <h1 style={{ marginBottom: '1.5rem', fontWeight: 500 }}>
                {query ? `Search results for "${query}"` : 'All Products'}
            </h1>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Searching for products...</div>
            ) : error ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#d00' }}>{error}</div>
            ) : products.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>No products found matching your search.</p>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Try checking your spelling or using different keywords.</p>
                </div>
            ) : (
                <>
                <div className="product-grid">
                    {products.slice(0, visibleCount).map((product) => {
                        const imageUrl = product.images?.[0]?.startsWith('/')
                            ? `${API_BASE}${product.images[0]}`
                            : product.images?.[0] || 'https://via.placeholder.com/200x250/f3f3f3/333333?text=No+Image';

                        return (
                            <div key={product._id} className="product-card">
                                <Link href={`/product/${product._id}`} className="product-link">
                                    <div className="product-img-wrapper" style={{ height: '200px' }}>
                                        <img src={imageUrl} alt={product.name} />
                                    </div>
                                </Link>
                                <div className="product-info" style={{ padding: '0.5rem 1rem' }}>
                                    <Link href={`/product/${product._id}`} className="product-link">
                                        <h3 className="product-title" style={{ WebkitLineClamp: 2 }}>{product.name}</h3>
                                    </Link>
                                    <div className="product-rating">
                                        {"★".repeat(Math.floor(product.rating || 0))}
                                        {"☆".repeat(5 - Math.floor(product.rating || 0))}
                                        <span className="rating-num"> {product.rating || 0}</span>
                                    </div>
                                    <p className="product-price" style={{ marginBottom: '0.5rem' }}>${product.price}</p>
                                    <Link href={`/product/${product._id}`} className="view-product-btn">View Product</Link>
                                </div>
                            </div>
                        );
                    })}
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
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container" style={{ margin: '2rem auto', textAlign: 'center' }}>Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}
