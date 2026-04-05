'use client';

import './page.css';
import '../../page.css';
import { useState, use, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';

type Product = {
    _id: string;
    name: string;
    price: number;
    rating: number;
    images: string[];
    subCategory?: string;
    averageRating?: number;
    numReviews?: number;
};

const DEPARTMENTS = ["Tops & Tees", "Bottoms", "Activewear", "Shoes"];
const SORT_OPTIONS = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Top Rated', value: 'rating' },
];

function CategoryListingInner({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // Seed from URL ?sub= param so hamburger links work immediately
    const [activeSubCategory, setActiveSubCategory] = useState(
        () => searchParams.get('sub') || ''
    );
    const [sortBy, setSortBy] = useState('featured');
    const [visibleCount, setVisibleCount] = useState(16);

    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    // Sync filter when URL ?sub param changes (e.g. back/forward navigation)
    useEffect(() => {
        const sub = searchParams.get('sub') || '';
        setActiveSubCategory(sub);
        setVisibleCount(16);
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `${API_BASE}/api/products?category=${categoryName}`;
                if (activeSubCategory) {
                    url += `&subCategory=${encodeURIComponent(activeSubCategory)}`;
                }
                const res = await fetch(url);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
                setProducts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryName, activeSubCategory]);

    const getSortedProducts = () => {
        const list = [...products];
        if (sortBy === 'price_asc') return list.sort((a, b) => a.price - b.price);
        if (sortBy === 'price_desc') return list.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') return list.sort((a, b) => (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0));
        return list;
    };

    const sorted = getSortedProducts();
    const visible = sorted.slice(0, visibleCount);
    const hasMore = visibleCount < sorted.length;

    const getImageUrl = (product: Product) => {
        const img = product.images?.[0];
        if (!img) return 'https://via.placeholder.com/300x350/f8f9fa/666?text=No+Image';
        return img.startsWith('/') ? `${API_BASE}${img}` : img;
    };

    return (
        <div className="container">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link href="/">Home</Link>
                <span className="breadcrumb-sep">›</span>
                <Link href={`/category/${slug}`}>{categoryName}</Link>
                {activeSubCategory && (
                    <>
                        <span className="breadcrumb-sep">›</span>
                        <span className="breadcrumb-current">{activeSubCategory}</span>
                    </>
                )}
            </nav>

            {/* Page header */}
            <div className="category-page-header">
                <h1 className="category-page-title">
                    {categoryName}{activeSubCategory ? ` — ${activeSubCategory}` : "'s Fashion & Accessories"}
                </h1>
                {!loading && <p className="category-page-count">{sorted.length} products</p>}
            </div>

            {/* Layout */}
            <div className="category-layout">
                {/* Sidebar */}
                <aside className="category-sidebar">
                    <div className="sidebar-section">
                        <p className="sidebar-section-title">Department</p>
                        <button
                            className={`sidebar-filter-btn${activeSubCategory === '' ? ' active' : ''}`}
                            onClick={() => setActiveSubCategory('')}
                        >
                            All {categoryName}
                        </button>
                        {DEPARTMENTS.map(dept => (
                            <button
                                key={dept}
                                className={`sidebar-filter-btn${activeSubCategory === dept ? ' active' : ''}`}
                                onClick={() => setActiveSubCategory(dept)}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Content */}
                <div className="category-content">
                    {/* Sort bar */}
                    <div className="category-sort-bar">
                        <div className="filter-chips">
                            {activeSubCategory && (
                                <span className="filter-chip">
                                    {activeSubCategory}
                                    <button onClick={() => setActiveSubCategory('')}>✕</button>
                                </span>
                            )}
                        </div>
                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="product-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="product-card skeleton-card">
                                    <div className="skeleton skeleton-img"></div>
                                    <div className="product-info">
                                        <div className="skeleton skeleton-text" style={{width:'80%'}}></div>
                                        <div className="skeleton skeleton-text" style={{width:'50%'}}></div>
                                        <div className="skeleton skeleton-text" style={{width:'35%'}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="category-error">⚠️ {error}</div>
                    ) : sorted.length === 0 ? (
                        <div className="category-empty">
                            <div style={{fontSize:'3rem',marginBottom:'0.75rem'}}>👗</div>
                            <p>No products found{activeSubCategory ? ` in "${activeSubCategory}"` : ' in this category'}.</p>
                            {activeSubCategory && (
                                <button
                                    className="sidebar-filter-btn active"
                                    style={{margin:'1rem auto 0',display:'block'}}
                                    onClick={() => setActiveSubCategory('')}
                                >
                                    View all {categoryName}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="product-grid">
                            {visible.map(product => (
                                <div key={product._id} className="product-card">
                                    <div className="product-card-top">
                                        <Link href={`/product/${product._id}`} className="product-link">
                                            <div className="product-img-wrapper">
                                                <img src={getImageUrl(product)} alt={product.name} loading="lazy" />
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="product-info">
                                        <Link href={`/product/${product._id}`} className="product-link">
                                            <h3 className="product-title">{product.name}</h3>
                                        </Link>
                                        <div className="product-rating">
                                            {[1,2,3,4,5].map(s => (
                                                <svg key={s} style={{width:'14px',height:'14px',fill: s <= Math.round(product.averageRating || product.rating || 0) ? '#f90' : '#ddd'}} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                            ))}
                                            <span className="rating-num">({product.numReviews || 0})</span>
                                        </div>
                                        <p className="product-price">${(product.price || 0).toFixed(2)}</p>
                                        <Link href={`/product/${product._id}`} className="view-product-btn">
                                            View Product
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Load More */}
                    {!loading && !error && hasMore && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                            <button
                                onClick={() => setVisibleCount(c => c + 16)}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                                    background: 'none', border: '2px solid #d1d5db', borderRadius: '50%',
                                    width: 56, height: 56, cursor: 'pointer',
                                    color: '#374151', transition: 'border-color 0.2s, transform 0.2s',
                                    justifyContent: 'center'
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
                </div>
            </div>
        </div>
    );
}

export default function CategoryListing({ params }: { params: Promise<{ slug: string }> }) {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>}>
            <CategoryListingInner params={params} />
        </Suspense>
    );
}
