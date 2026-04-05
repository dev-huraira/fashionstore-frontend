'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import './page.css';
import WishlistButton from '@/components/WishlistButton';
import { API_BASE } from '@/lib/api';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [qty, setQty] = useState(1);
    const [variantError, setVariantError] = useState('');

    // Reviews state
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [cartToast, setCartToast] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/products/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setProduct(data);
                    setMainImage(data.images?.[0] || '');
                } else {
                    setError(data.message || 'Product not found');
                }
            } catch (err) {
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/products/${id}/reviews`);
            const data = await res.json();
            if (res.ok) setReviews(data);
        } catch {}
    };

    useEffect(() => { fetchReviews(); }, [id]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');
        setSubmittingReview(true);
        try {
            const res = await fetch(`${API_BASE}/api/products/${id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(reviewForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setReviewSuccess('Your review was submitted!');
            setReviewForm({ rating: 5, comment: '' });
            fetchReviews();
        } catch (e: any) {
            setReviewError(e.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading product details...</div>;
    if (error) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#d00' }}>{error}</div>;
    if (!product) return null;

    const imageUrl = (path: string) => path?.startsWith('/') ? `${API_BASE}${path}` : (path || '');
    const currentPrice = product.price || 0;
    const discountPct = product.discount || 0;
    const listPrice = discountPct > 0 ? currentPrice / (1 - discountPct / 100) : currentPrice * 1.25;

    const sizes: string[] = product.sizes?.length ? product.sizes : [];
    const colors: string[] = product.colors?.length ? product.colors : [];
    const features: string[] = product.features?.length ? product.features : [];

    return (
        <>
        <div className="product-container container">
            <div className="product-left">
                <div className="thumbnail-list">
                    {product.images?.map((img: string, idx: number) => (
                        <img
                            key={idx}
                            src={imageUrl(img)}
                            alt={`Thumb ${idx}`}
                            className={`thumb ${mainImage === img ? 'active' : ''}`}
                            onMouseEnter={() => setMainImage(img)}
                        />
                    ))}
                </div>
                <div className="main-image">
                    <img src={imageUrl(mainImage)} alt={product.name} />
                </div>
            </div>

            <div className="product-middle">
                <h1 className="product-title">{product.name}</h1>
                <a href="/" className="brand-link">Visit the FashionStore</a>

                <div className="rating-row">
                    <span className="stars">
                        {"★".repeat(Math.floor(product.rating || 4))}
                        {"☆".repeat(5 - Math.floor(product.rating || 4))}
                    </span>
                    <a href="#reviews" className="review-count">{product.numReviews || 0} ratings</a>
                </div>

                <hr className="divider" />

                <div className="price-section">
                    <div className="price-top">
                        {discountPct > 0 && <span className="discount-badge">-{discountPct}%</span>}
                        <span className="current-price">
                            <span className="currency">$</span>{Math.floor(currentPrice)}
                            <span className="cents">{(currentPrice % 1).toFixed(2).substring(2)}</span>
                        </span>
                    </div>
                    {discountPct > 0 && (
                        <p className="list-price">List Price: <span>${listPrice.toFixed(2)}</span></p>
                    )}
                </div>

                {/* Sizes */}
                {sizes.length > 0 && (
                    <div className="product-variants">
                        <div className="variant-group">
                            <label><strong>Size:</strong> {selectedSize && <span style={{ fontWeight: 400 }}>{selectedSize}</span>}</label>
                            <div className="btn-group">
                                {sizes.map(s => (
                                    <button
                                        key={s}
                                        className={`variant-btn size-btn${selectedSize === s ? ' selected' : ''}`}
                                        onClick={() => { setSelectedSize(s); setVariantError(''); }}
                                        type="button"
                                    >{s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Colors */}
                {colors.length > 0 && (
                    <div className="product-variants">
                        <div className="variant-group">
                            <label><strong>Color:</strong> {selectedColor && <span style={{ fontWeight: 400 }}>{selectedColor}</span>}</label>
                            <div className="btn-group">
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        className={`variant-btn color-btn${selectedColor === c ? ' selected' : ''}`}
                                        onClick={() => { setSelectedColor(c); setVariantError(''); }}
                                        type="button"
                                    >{c}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {variantError && (
                    <p style={{ color: '#c40000', fontWeight: 600, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem' }}>
                        ⚠️ {variantError}
                    </p>
                )}

                <div className="product-description">
                    <h3>About this item</h3>
                    {features.length > 0 && (
                        <ul>
                            {features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                    )}
                    <p>{product.description}</p>
                </div>
            </div>

            <div className="product-right">
                <div className="buy-box">
                    <h2 className="buy-price">${currentPrice.toFixed(2)}</h2>
                    <p className="delivery-info">FREE delivery <strong>Tomorrow</strong>. Order within 5 hrs.</p>
                    <p className="stock-status">In Stock.</p>

                    <div className="qty-selector">
                        <label>Qty:</label>
                        <select value={qty} onChange={e => setQty(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>

                    <button
                        className="btn-buy-action btn-add-cart"
                        onClick={async () => {
                            if (sizes.length > 0 && !selectedSize) { setVariantError('Please select a size'); return; }
                            if (colors.length > 0 && !selectedColor) { setVariantError('Please select a color'); return; }
                            setVariantError('');
                            const added = await addToCart({
                                id: product._id,
                                name: product.name,
                                price: product.price,
                                image: imageUrl(product.images?.[0])
                            }, undefined, selectedSize, selectedColor);
                            if (added) {
                                setCartToast(true);
                                setTimeout(() => setCartToast(false), 2500);
                            }
                        }}
                    >
                        Add to Cart
                    </button>
                    <button
                        className="btn-buy-action btn-buy-now"
                        onClick={async () => {
                            if (sizes.length > 0 && !selectedSize) { setVariantError('Please select a size'); return; }
                            if (colors.length > 0 && !selectedColor) { setVariantError('Please select a color'); return; }
                            setVariantError('');
                            const added = await addToCart({
                                id: product._id,
                                name: product.name,
                                price: product.price,
                                image: imageUrl(product.images?.[0])
                            }, undefined, selectedSize, selectedColor);
                            if (added) {
                                router.push('/checkout');
                            }
                        }}
                    >
                        Buy Now
                    </button>

                    <div className="secure-trx">
                        <span className="lock-icon">🔒</span> Secure transaction
                    </div>
                    <div className="buy-meta">
                        <p><span>Ships from</span> FashionStore</p>
                        <p><span>Sold by</span> FashionStore</p>
                        <p><span>Returns</span> 30-day refund</p>
                    </div>

                    {/* Wishlist — shown in buy box for easy access */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #eee' }}>
                        <WishlistButton productId={product._id} />
                        <span style={{ fontSize: '0.88rem', color: '#555' }}>Add to Wishlist</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="reviews-section container">
            <h2 className="reviews-title">
                Customer Reviews
                {product.numReviews > 0 && (
                    <span style={{ fontSize: '1rem', fontWeight: 400, color: '#666', marginLeft: '0.75rem' }}>
                        ★ {product.averageRating?.toFixed(1)} ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})
                    </span>
                )}
            </h2>

            {/* Write a review */}
            {user ? (
                <div className="review-form-box">
                    <h3>Write a Review</h3>
                    {reviewSuccess && <p style={{ color: '#1e8c45', marginBottom: '0.5rem' }}>✅ {reviewSuccess}</p>}
                    {reviewError && <p style={{ color: '#d00', marginBottom: '0.5rem' }}>⚠️ {reviewError}</p>}
                    <form onSubmit={handleReviewSubmit}>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <label style={{ fontWeight: 600 }}>Your Rating</label>
                            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem' }}>
                                {[1,2,3,4,5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.8rem', color: star <= reviewForm.rating ? '#f90' : '#ccc', padding: 0 }}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Your Review</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Share your experience with this product..."
                                value={reviewForm.comment}
                                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: 6, resize: 'vertical', fontSize: '0.95rem', boxSizing: 'border-box' }}
                            />
                        </div>
                        <button type="submit" className="btn-buy-action btn-buy-now" disabled={submittingReview}>
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            ) : (
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                    <a href="/login" style={{ color: '#febd69', fontWeight: 600 }}>Sign in</a> to write a review.
                </p>
            )}

            {/* Reviews list */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p style={{ color: '#888' }}>No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review._id} className="review-item">
                            <div className="review-header">
                                <div className="review-avatar">{review.name?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <strong>{review.name}</strong>
                                    <div>
                                        {[1,2,3,4,5].map(s => (
                                            <span key={s} style={{ color: s <= review.rating ? '#f90' : '#ccc', fontSize: '0.95rem' }}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Cart Toast Notification */}
        {cartToast && (
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                background: 'linear-gradient(135deg, #1e8c45 0%, #25a855 100%)',
                color: '#fff',
                padding: '0.85rem 1.4rem',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                zIndex: 9999,
                animation: 'slideInToast 0.35s ease',
            }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                Item added to your cart!
            </div>
        )}

        <style>{`
            @keyframes slideInToast {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to   { opacity: 1; transform: translateY(0)  scale(1); }
            }
        `}</style>
        </>
    );
}
