'use client';

import './page.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';
import { API_BASE } from '@/lib/api';

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  averageRating: number;
  numReviews: number;
  category?: string;
  subCategory?: string;
};

/* ─── Toast ─────────────────────────────────────────────────── */
type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? '#1a7f37' : t.type === 'error' ? '#cf222e' : '#0969da',
          color: '#fff', padding: '12px 20px', borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)', fontWeight: 600, fontSize: 14,
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideInRight 0.3s ease', minWidth: 220,
        }}>
          <span style={{ fontSize: 18 }}>
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ─── Star Rating ─────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#FF9900' : '#ddd'} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );
}

/* ─── Product Card ────────────────────────────────────────────── */
function ProductCard({ product, showToast }: { product: Product; showToast: (msg: string, type: Toast['type']) => void }) {
  const imageUrl = product.images?.[0]?.startsWith('/')
    ? `${API_BASE}${product.images[0]}`
    : product.images?.[0] || 'https://placehold.co/400x480/f3f4f6/9ca3af?text=No+Image';

  return (
    <div className="product-card">
      <div className="product-card-top">
        <Link href={`/product/${product._id}`} className="product-link" tabIndex={-1}>
          <div className="product-img-wrapper">
            <img src={imageUrl} alt={product.name} loading="lazy" />
          </div>
        </Link>
        <div className="product-wishlist-btn">
          <WishlistButton productId={product._id} size="sm" productName={product.name} onToast={showToast} />
        </div>
      </div>
      <div className="product-info">
        <Link href={`/product/${product._id}`} className="product-link">
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="product-rating">
          <Stars rating={product.averageRating || 0} />
          <span className="rating-num">({product.numReviews || 0})</span>
        </div>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <Link href={`/product/${product._id}`} className="view-product-btn">
          View Product
        </Link>
      </div>
    </div>
  );
}

/* ─── Product Section ─────────────────────────────────────────── */
function ProductSection({
  title, products, viewHref, loading, showToast
}: {
  title: string;
  products: Product[];
  viewHref: string;
  loading: boolean;
  showToast: (msg: string, type: Toast['type']) => void;
}) {
  return (
    <section className="category-section container">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <Link href={viewHref} className="view-all-btn">
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      {loading ? (
        <div className="products-loading">
          {[1, 2, 3, 4].map(i => <div key={i} className="product-skeleton" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="products-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <p>No products available yet.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} showToast={showToast} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Hero Slider ─────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80',
    title: 'New Arrivals in Fashion',
    sub: 'Discover the latest trends in clothing for men, women & kids.',
  },
  {
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
    title: "Women's Collection",
    sub: 'Elegant styles for every occasion. Explore now.',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80',
    title: "Men's Essentials",
    sub: 'Premium quality basics & statement pieces.',
  },
  {
    url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1600&q=80',
    title: "Kids' Styles",
    sub: 'Fun, comfortable clothing kids love to wear.',
  },
  {
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    title: 'Summer Sale',
    sub: 'Up to 50% off on selected summer styles.',
  },
  {
    url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
    title: 'Activewear',
    sub: 'Performance-ready gear for your active lifestyle.',
  },
  {
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80',
    title: 'Footwear Collection',
    sub: 'Step up your style with our exclusive shoe range.',
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const total = HERO_SLIDES.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const goTo = (i: number) => setCurrent(i);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = (touchStartX.current ?? 0) - (touchEndX.current ?? 0);
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  const slide = HERO_SLIDES[current];

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured fashion slideshow"
    >
      {HERO_SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hero-slide ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${s.url})` }}
          aria-hidden={i !== current}
        />
      ))}

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <span className="hero-badge">New Season</span>
        <h1 className="hero-title" key={current}>{slide.title}</h1>
        <p className="hero-sub" key={`s-${current}`}>{slide.sub}</p>
        <Link href="#sections" className="btn-primary hero-cta">
          Shop Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      {/* Prev / Next */}
      <button className="hero-arrow hero-prev" onClick={prev} aria-label="Previous slide">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button className="hero-arrow hero-next" onClick={next} aria-label="Next slide">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className="hero-dots" role="tablist" aria-label="Slide indicators">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === current}
            role="tab"
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && <div className="hero-progress" key={current} />}
    </div>
  );
}

/* ─── Category Feature Cards ──────────────────────────────────── */
const CATEGORY_FEATURES = [
  { label: "Men's Fashion", href: '/category/men', icon: '👔', color: '#e8f0fe' },
  { label: "Women's Fashion", href: '/category/women', icon: '👗', color: '#fce8f3' },
  { label: "Kids' Fashion", href: '/category/kids', icon: '🧒', color: '#e8fce8' },
  { label: 'Best Sellers', href: '/best-sellers', icon: '🔥', color: '#fff3e0' },
  { label: 'New Arrivals', href: '/search', icon: '✨', color: '#f3e8ff' },
  { label: 'Sale & Deals', href: '/search', icon: '🏷️', color: '#e8fff3' },
];

/* ─── Section definitions ─────────────────────────────────────── */
const SECTIONS = [
  { title: "Men's Tops & Tees", cat: 'men', sub: 'tops', href: '/category/men?sub=tops' },
  { title: "Men's Bottoms", cat: 'men', sub: 'bottoms', href: '/category/men?sub=bottoms' },
  { title: "Men's Activewear", cat: 'men', sub: 'activewear', href: '/category/men?sub=activewear' },
  { title: "Men's Shoes", cat: 'men', sub: 'shoes', href: '/category/men?sub=shoes' },
  { title: "Women's Tops & Tees", cat: 'women', sub: 'tops', href: '/category/women?sub=tops' },
  { title: "Women's Bottoms", cat: 'women', sub: 'bottoms', href: '/category/women?sub=bottoms' },
  { title: "Women's Activewear", cat: 'women', sub: 'activewear', href: '/category/women?sub=activewear' },
  { title: "Women's Shoes", cat: 'women', sub: 'shoes', href: '/category/women?sub=shoes' },
  { title: "Kids' Tops & Tees", cat: 'kids', sub: 'tops', href: '/category/kids?sub=tops' },
  { title: "Kids' Bottoms", cat: 'kids', sub: 'bottoms', href: '/category/kids?sub=bottoms' },
  { title: "Kids' Activewear", cat: 'kids', sub: 'activewear', href: '/category/kids?sub=activewear' },
  { title: "Kids' Shoes", cat: 'kids', sub: 'shoes', href: '/category/kids?sub=shoes' },
];

const CAT_GROUPS = [
  { label: 'Men', cat: 'men', href: '/category/men', color: '#131921' },
  { label: 'Women', cat: 'women', href: '/category/women', color: '#6b21a8' },
  { label: 'Kids', cat: 'kids', href: '/category/kids', color: '#166534' },
];

/* ─── Home Page ───────────────────────────────────────────────── */
export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        if (res.ok) {
          setAllProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Helper: get products by category and optional subcategory, max 8
  const getProducts = (cat: string, sub?: string) => {
    let filtered = allProducts.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
    if (sub) filtered = filtered.filter(p => p.subCategory?.toLowerCase().includes(sub.toLowerCase()));
    // If filtered is empty, return first 8 of the category (fallback)
    return (filtered.length > 0 ? filtered : allProducts.filter(p => p.category?.toLowerCase() === cat.toLowerCase())).slice(0, 8);
  };

  // Top trending (all categories)
  const trending = allProducts.slice(0, 8);

  return (
    <div className="home-container">
      <ToastContainer toasts={toasts} />

      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Category Quick Links ── */}
      <section className="category-features-section container">
        <div className="category-features-grid">
          {CATEGORY_FEATURES.map(item => (
            <Link key={item.label} href={item.href} className="cat-feature-card" style={{ '--card-color': item.color } as React.CSSProperties}>
              <span className="cat-feature-icon">{item.icon}</span>
              <span className="cat-feature-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Top Trending ── */}
      <div id="sections">
        <ProductSection
          title="🔥 Top Trending"
          products={trending}
          viewHref="/search"
          loading={loading}
          showToast={showToast}
        />
      </div>

      {/* ── Category Group Sections ── */}
      {CAT_GROUPS.map(group => (
        <div key={group.cat} className="cat-group-wrapper">
          {/* Category Banner */}
          <div className="cat-group-banner container">
            <div className="cat-group-banner-inner" style={{ borderLeft: `4px solid ${group.color}` }}>
              <h2 className="cat-group-title" style={{ color: group.color }}>{group.label}'s Collection</h2>
              <Link href={group.href} className="cat-group-view-all">
                Shop All {group.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Sub-sections */}
          {SECTIONS.filter(s => s.cat === group.cat).map(sec => (
            <ProductSection
              key={sec.title}
              title={sec.title}
              products={getProducts(sec.cat, sec.sub)}
              viewHref={sec.href}
              loading={loading}
              showToast={showToast}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
