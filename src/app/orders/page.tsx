'use client';

import './page.css';
import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// ─── Types ────────────────────────────────────────────────────────────────────
type ModalType = 'details' | 'invoice' | 'track' | 'support' | 'feedback' | 'review' | null;

interface ActiveModal {
    type: ModalType;
    order: any;
    item?: any;
}

import { API_BASE } from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';


// ─── Tracking Timeline ────────────────────────────────────────────────────────
const TRACK_STEPS = ['Order Placed', 'Confirmed', 'Preparing', 'Shipped', 'Out for Delivery', 'Delivered'];

function trackStep(status: string) {
    const map: Record<string, number> = {
        Pending: 2,
        Confirmed: 2,
        Preparing: 2,
        Shipped: 3,
        'Out for Delivery': 4,
        Delivered: 5,
        Cancelled: -1,
    };
    return map[status] ?? 2;
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>
                {children}
            </div>
        </div>
    );
}

// ─── Order Details Modal ───────────────────────────────────────────────────────
function OrderDetailsModal({ order, onClose }: { order: any; onClose: () => void }) {
    const addr = order.shippingAddress || {};
    return (
        <Modal onClose={onClose}>
            <h2 className="modal-title">Order Details</h2>
            <p className="modal-subtitle">Order #{order._id.substring(0, 8).toUpperCase()}</p>

            <div className="modal-section">
                <h3>Shipping Address</h3>
                <p>{addr.fullName || 'N/A'}</p>
                <p>{addr.address}</p>
                <p>{addr.city}, {addr.postalCode}</p>
                <p>{addr.country}</p>
                {addr.phone && <p>📞 {addr.phone}</p>}
            </div>

            <div className="modal-section">
                <h3>Order Summary</h3>
                <table className="detail-table">
                    <thead>
                        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
                    </thead>
                    <tbody>
                        {order.items.map((item: any, i: number) => (
                            <tr key={i}>
                                <td>{item.name} <span className="item-meta">({item.size} / {item.color})</span></td>
                                <td>{item.quantity}</td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="modal-total-row">
                <span>Payment Method:</span>
                <span>{order.paymentMethod || 'Card'}</span>
            </div>
            <div className="modal-total-row grand">
                <span>Order Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="modal-total-row">
                <span>Status:</span>
                <span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span>
            </div>
        </Modal>
    );
}

// ─── Invoice Modal ─────────────────────────────────────────────────────────────
function InvoiceModal({ order, onClose }: { order: any; onClose: () => void }) {
    const addr = order.shippingAddress || {};
    const date = new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    const handlePrint = () => window.print();

    return (
        <Modal onClose={onClose}>
            <div className="invoice-header">
                <div>
                    <h2 className="invoice-brand">FashionStore</h2>
                    <p className="invoice-tagline">Your Premium Fashion Destination</p>
                </div>
                <div className="invoice-meta">
                    <p><strong>Invoice #</strong> {order._id.substring(0, 8).toUpperCase()}</p>
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Status:</strong> <span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span></p>
                </div>
            </div>

            <div className="invoice-address">
                <div>
                    <h4>Bill To:</h4>
                    <p>{addr.fullName || 'Customer'}</p>
                    <p>{addr.address}</p>
                    <p>{addr.city}, {addr.postalCode}</p>
                    <p>{addr.country}</p>
                </div>
            </div>

            <table className="detail-table">
                <thead>
                    <tr><th>Item</th><th>Size/Color</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
                </thead>
                <tbody>
                    {order.items.map((item: any, i: number) => (
                        <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.size} / {item.color}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="invoice-totals">
                <div className="modal-total-row grand">
                    <span>Grand Total:</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <button className="btn-print" onClick={handlePrint}>🖨 Print / Save as PDF</button>
        </Modal>
    );
}

// ─── Track Package Modal ───────────────────────────────────────────────────────
function TrackModal({ order, onClose }: { order: any; onClose: () => void }) {
    const step = trackStep(order.status);
    const isCancelled = order.status === 'Cancelled';

    return (
        <Modal onClose={onClose}>
            <h2 className="modal-title">Track Your Package</h2>
            <p className="modal-subtitle">Order #{order._id.substring(0, 8).toUpperCase()}</p>

            {isCancelled ? (
                <div className="track-cancelled">
                    <span>❌</span>
                    <p>This order was cancelled and will not be shipped.</p>
                </div>
            ) : (
                <div className="track-timeline">
                    {TRACK_STEPS.map((label, idx) => (
                        <div key={idx} className={`track-step ${idx <= step ? 'done' : ''} ${idx === step ? 'current' : ''}`}>
                            <div className="track-dot">
                                {idx <= step ? '✓' : idx + 1}
                            </div>
                            {idx < TRACK_STEPS.length - 1 && (
                                <div className={`track-line ${idx < step ? 'done' : ''}`} />
                            )}
                            <p className="track-label">{label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="track-info-box">
                <p>📦 <strong>Current Status:</strong> {order.status === 'Pending' ? 'Preparing to ship' : order.status}</p>
                <p>🗓 <strong>Last Updated:</strong> {new Date(order.updatedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>📍 <strong>Destination:</strong> {order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                {order.status === 'Shipped' && (
                    <p>🚚 <strong>Estimated Delivery:</strong> 3–5 business days</p>
                )}
            </div>
        </Modal>
    );
}

// ─── Product Support Modal ─────────────────────────────────────────────────────
function SupportModal({ order, onClose }: { order: any; onClose: () => void }) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) return;
        setSubmitted(true);
    };

    return (
        <Modal onClose={onClose}>
            <h2 className="modal-title">Get Product Support</h2>
            <p className="modal-subtitle">Order #{order._id.substring(0, 8).toUpperCase()}</p>

            {submitted ? (
                <div className="form-success">
                    <span>✅</span>
                    <h3>Request Submitted!</h3>
                    <p>Our support team will contact you within 24 hours. Reference: <strong>SUP-{order._id.substring(0, 6).toUpperCase()}</strong></p>
                    <button className="btn-modal-primary" onClick={onClose}>Done</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="modal-form">
                    <label>Select Issue</label>
                    <select value={subject} onChange={e => setSubject(e.target.value)} required>
                        <option value="">-- Choose an issue --</option>
                        <option value="damaged">Item arrived damaged</option>
                        <option value="wrong">Wrong item received</option>
                        <option value="missing">Missing item</option>
                        <option value="defective">Defective product</option>
                        <option value="quality">Quality not as expected</option>
                        <option value="other">Other</option>
                    </select>
                    <label>Describe Your Issue</label>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Please describe the issue in detail..."
                        rows={4}
                        required
                    />
                    <div className="form-footer">
                        <button type="button" className="btn-modal-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-modal-primary">Submit Request</button>
                    </div>
                </form>
            )}
        </Modal>
    );
}

// ─── Seller Feedback Modal ─────────────────────────────────────────────────────
function FeedbackModal({ order, onClose }: { order: any; onClose: () => void }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) return;
        setSubmitted(true);
    };

    return (
        <Modal onClose={onClose}>
            <h2 className="modal-title">Leave Seller Feedback</h2>
            <p className="modal-subtitle">Order #{order._id.substring(0, 8).toUpperCase()}</p>

            {submitted ? (
                <div className="form-success">
                    <span>🌟</span>
                    <h3>Thank you for your feedback!</h3>
                    <p>Your rating helps other customers make informed decisions.</p>
                    <button className="btn-modal-primary" onClick={onClose}>Done</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="modal-form">
                    <label>Overall Experience</label>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                className={`star ${star <= (hover || rating) ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >★</span>
                        ))}
                        {rating > 0 && (
                            <span className="star-label">
                                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                            </span>
                        )}
                    </div>
                    <label>Comments (optional)</label>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Share your experience with this seller..."
                        rows={4}
                    />
                    <div className="form-footer">
                        <button type="button" className="btn-modal-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-modal-primary" disabled={!rating}>Submit Feedback</button>
                    </div>
                </form>
            )}
        </Modal>
    );
}

// ─── Review Picker Modal ───────────────────────────────────────────────────────
function ReviewPickerModal({ order, onClose }: { order: any; onClose: () => void }) {
    return (
        <Modal onClose={onClose}>
            <h2 className="modal-title">✏️ Write a Product Review</h2>
            <p className="modal-subtitle">Choose which item from Order #{order._id.substring(0, 8).toUpperCase()} you'd like to review:</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {order.items.map((item: any, idx: number) => {
                    const href = item.product
                        ? `/product/${item.product}#review`
                        : `/search?q=${encodeURIComponent(item.name)}`;
                    return (
                        <a
                            key={idx}
                            href={href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.85rem 1rem',
                                borderRadius: 10,
                                border: '1px solid #e0e0e0',
                                textDecoration: 'none',
                                color: '#111',
                                transition: 'background 0.15s, border-color 0.15s',
                                background: '#fafafa',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = '#f0f4ff';
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#4a90e2';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = '#fafafa';
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e0e0e0';
                            }}
                        >
                            <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                                <p style={{ color: '#666', fontSize: '0.82rem', margin: '2px 0 0' }}>Size: {item.size} | Color: {item.color}</p>
                            </div>
                            <span style={{ color: '#4a90e2', fontWeight: 600, fontSize: '0.85rem', flexShrink: 0 }}>Review →</span>
                        </a>
                    );
                })}
            </div>
        </Modal>
    );
}

// ─── Ship To Popover ───────────────────────────────────────────────────────────
function ShipToPopover({ order }: { order: any }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const addr = order.shippingAddress || {};

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const displayCity = addr.city || 'N/A';
    const displayCountry = addr.country || '';

    return (
        <div className="ship-popover-wrap" ref={ref}>
            <p
                className="order-val link-style"
                onClick={() => setOpen(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', maxWidth: 160, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                title={`${displayCity}, ${displayCountry}`}
            >
                <span style={{ flexShrink: 0 }}>📍</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayCity}, {displayCountry}
                </span>
                <span style={{ fontSize: '0.7rem', flexShrink: 0 }}>▾</span>
            </p>
            {open && (
                <div className="ship-popover">
                    <div className="ship-popover-arrow" />
                    <div className="ship-popover-header">
                        <span>📦 Shipping Address</span>
                        <button className="popover-close" onClick={() => setOpen(false)}>✕</button>
                    </div>
                    <div className="ship-popover-body">
                        {addr.fullName && (
                            <div className="ship-addr-row">
                                <span className="ship-addr-icon">👤</span>
                                <span className="ship-addr-text ship-addr-name">{addr.fullName}</span>
                            </div>
                        )}
                        {addr.address && (
                            <div className="ship-addr-row">
                                <span className="ship-addr-icon">🏠</span>
                                <span className="ship-addr-text">{addr.address}</span>
                            </div>
                        )}
                        <div className="ship-addr-row">
                            <span className="ship-addr-icon">🏙</span>
                            <span className="ship-addr-text">
                                {[addr.city, addr.postalCode].filter(Boolean).join(', ')}
                            </span>
                        </div>
                        {addr.country && (
                            <div className="ship-addr-row">
                                <span className="ship-addr-icon">🌍</span>
                                <span className="ship-addr-text">{addr.country}</span>
                            </div>
                        )}
                        {addr.phone && (
                            <div className="ship-addr-row">
                                <span className="ship-addr-icon">📞</span>
                                <span className="ship-addr-text">{addr.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Content ──────────────────────────────────────────────────────────────
function OrderListContent({ activeTab, searchQuery }: { activeTab: string; searchQuery: string }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [cartToast, setCartToast] = useState(false);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
    const [cancelError, setCancelError] = useState('');
    const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const showCartToast = () => {
        setCartToast(true);
        setTimeout(() => setCartToast(false), 2500);
    };

    const openModal = (type: ModalType, order: any, item?: any) =>
        setActiveModal({ type, order, item });

    const closeModal = () => setActiveModal(null);

    // Cancel order
    const handleCancelOrder = async (orderId: string) => {
        setCancellingId(orderId);
        setCancelError('');
        try {
            const res = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to cancel order');
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled', updatedAt: new Date().toISOString() } : o));
            setConfirmCancelId(null);
        } catch (e: any) {
            setCancelError(e.message);
        } finally {
            setCancellingId(null);
        }
    };

    // Auth + success banner
    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            setShowSuccess(true);
            const t = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(t);
        }
    }, [searchParams, router]);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders/myorders`, {
                    credentials: 'include',
                });
                if (res.status === 401) { router.push('/login?redirect=/orders'); return; }
                if (!res.ok) throw new Error('Failed to fetch orders');
                const data = await res.json();
                setOrders(data.sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getFilteredOrders = () => {
        let list = orders;
        if (activeTab === 'Orders') list = orders.filter(o => o.status !== 'Cancelled');
        else if (activeTab === 'Not Yet Shipped') list = orders.filter(o => ['Pending', 'Confirmed'].includes(o.status));
        else if (activeTab === 'Cancelled Orders') list = orders.filter(o => o.status === 'Cancelled');

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(o =>
                o._id.toLowerCase().includes(q) ||
                o.items.some((item: any) => item.name?.toLowerCase().includes(q)) ||
                o.shippingAddress?.city?.toLowerCase().includes(q) ||
                o.status?.toLowerCase().includes(q)
            );
        }
        return list;
    };

    const getBuyAgainProducts = () => {
        const productsMap = new Map();
        orders.filter(o => o.status !== 'Cancelled').forEach(order => {
            order.items.forEach((item: any) => {
                const key = `${item.product || item.name}-${item.color}-${item.size}`;
                if (!productsMap.has(key)) productsMap.set(key, item);
            });
        });
        return Array.from(productsMap.values());
    };

    if (loading) return (
        <div className="orders-loading">
            <div className="spinner" />
            <p>Loading your orders...</p>
        </div>
    );

    if (error) return (
        <div className="orders-error">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Try again</button>
        </div>
    );

    // Cache computed values once before render (avoids double-computation in JSX)
    const filteredOrders = getFilteredOrders();
    const buyAgainProducts = getBuyAgainProducts();

    return (
        <div className="orders-list">
            {showSuccess && (
                <div className="success-banner">
                    <strong>✓ Order placed!</strong> Thank you for your purchase.
                </div>
            )}

            {activeTab === 'Buy Again' ? (
                <div className="buy-again-grid">
                    {buyAgainProducts.length === 0 ? (
                        <div className="empty-orders">
                            <p>No products found to buy again.</p>
                            <a href="/">Start Shopping →</a>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {buyAgainProducts.map((product: any, idx: number) => (
                                <div key={idx} className="buy-again-card">
                                    <img src={getImageUrl(product.image)} alt={product.name} />
                                    <a href={`/product/${product.product}`} className="prod-title">{product.name}</a>
                                    <p className="buy-again-price">${product.price ? product.price.toFixed(2) : '-.--'}</p>
                                    <button
                                        className="btn-secondary-outline"
                                        style={{ width: '100%', marginBottom: '0.5rem' }}
                                        onClick={async () => {
                                            const added = await addToCart({ id: product.product || product.name, name: product.name, price: product.price || 0, image: product.image || '' });
                                            if (added) showCartToast();
                                        }}
                                    >Add to Cart</button>
                                    <a href={`/product/${product.product}`} className="view-item-link">View Item</a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                filteredOrders.length === 0 ? (
                    <div className="empty-orders">
                        <p>
                            {searchQuery.trim()
                                ? `No orders match "${searchQuery}".`
                                : `You haven't placed any ${activeTab.toLowerCase()} yet.`}
                        </p>
                        <a href="/">Start Shopping →</a>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order._id} className="order-card">
                            {/* ── Order Header ── */}
                            <div className="order-header">
                                <div className="order-top-section">
                                    <div className="order-col">
                                        <p className="order-label">ORDER PLACED</p>
                                        <p className="order-val">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                    <div className="order-col">
                                        <p className="order-label">TOTAL</p>
                                        <p className="order-val">${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div className="order-col">
                                        <p className="order-label">SHIP TO</p>
                                        <ShipToPopover order={order} />
                                    </div>
                                </div>
                                <div className="order-top-right">
                                    <p className="order-label">ORDER # {order._id.substring(0, 8).toUpperCase()}</p>
                                    <div className="order-links">
                                        <a
                                            href="#"
                                            onClick={e => { e.preventDefault(); openModal('details', order); }}
                                        >View order details</a>
                                        <span className="separator">|</span>
                                        <a
                                            href="#"
                                            onClick={e => { e.preventDefault(); openModal('invoice', order); }}
                                        >Invoice</a>
                                    </div>
                                    {['Pending', 'Confirmed'].includes(order.status) && (
                                        <button
                                            className="btn-cancel-order"
                                            onClick={() => { setCancelError(''); setConfirmCancelId(order._id); }}
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* ── Order Body ── */}
                            <div className="order-body">
                                <div className="delivery-status">
                                    <h2 style={{ color: order.status === 'Delivered' ? '#007600' : (order.status === 'Cancelled' ? '#c40000' : '#444') }}>
                                        {order.status === 'Pending' ? 'Preparing to ship' : order.status}
                                    </h2>
                                    <p>Status updated on {new Date(order.updatedAt).toLocaleDateString()}</p>
                                </div>

                                <div className="order-items-grid">
                                    <div>
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="order-prod-row">
                                                <div className="prod-img">
                                                    {item.product ? (
                                                        <a href={`/product/${item.product}`}>
                                                            <img src={getImageUrl(item.image)} alt={item.name} />
                                                        </a>
                                                    ) : (
                                                        <img src={getImageUrl(item.image)} alt={item.name} />
                                                    )}
                                                </div>
                                                <div className="prod-info">
                                                    {item.product ? (
                                                        <a href={`/product/${item.product}`} className="prod-title">{item.name}</a>
                                                    ) : (
                                                        <span className="prod-title">{item.name}</span>
                                                    )}
                                                    <p className="prod-variant">Size: {item.size} | Color: {item.color}</p>
                                                    <p className="prod-variant">Qty: {item.quantity} &nbsp;|&nbsp; ${item.price?.toFixed(2)} each</p>
                                                    <div className="prod-actions">
                                                        <button
                                                            className="btn-secondary-outline"
                                                            onClick={async () => {
                                                                const added = await addToCart({ id: item.product || item.name, name: item.name, price: item.price || 0, image: getImageUrl(item.image) });
                                                                if (added) showCartToast();
                                                            }}
                                                        >
                                                            Buy it again
                                                        </button>
                                                        {item.product ? (
                                                            <a
                                                                href={`/product/${item.product}`}
                                                                className="btn-secondary-outline"
                                                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                                                            >
                                                                View item
                                                            </a>
                                                        ) : (
                                                            <a
                                                                href={`/search?q=${encodeURIComponent(item.name)}`}
                                                                className="btn-secondary-outline"
                                                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                                                            >
                                                                View item
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-action-buttons">
                                        <button
                                            className="btn-block"
                                            onClick={() => openModal('track', order)}
                                        >
                                            📦 Track package
                                        </button>
                                        <button
                                            className="btn-block"
                                            onClick={() => openModal('support', order)}
                                        >
                                            🛠 Get product support
                                        </button>
                                        <button
                                            className="btn-block"
                                            onClick={() => openModal('feedback', order)}
                                        >
                                            💬 Leave seller feedback
                                        </button>
                                        <button
                                            className="btn-block"
                                            onClick={() => openModal('review', order)}
                                        >
                                            ✏️ Write a product review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )
            )}

            {/* ── Cancel Confirmation Modal ── */}
            {confirmCancelId && (
                <div className="modal-overlay" onClick={() => setConfirmCancelId(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                        <h3 className="modal-title">Cancel this order?</h3>
                        <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            Are you sure you want to cancel order <strong>#{confirmCancelId.substring(0, 8).toUpperCase()}</strong>? This action cannot be undone.
                        </p>
                        {cancelError && <p className="cancel-error">⚠️ {cancelError}</p>}
                        <div className="form-footer">
                            <button className="btn-modal-secondary" onClick={() => setConfirmCancelId(null)}>Keep Order</button>
                            <button
                                className="btn-modal-danger"
                                onClick={() => handleCancelOrder(confirmCancelId)}
                                disabled={cancellingId === confirmCancelId}
                            >
                                {cancellingId === confirmCancelId ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Active Modal ── */}
            {activeModal?.type === 'details' && <OrderDetailsModal order={activeModal.order} onClose={closeModal} />}
            {activeModal?.type === 'invoice' && <InvoiceModal order={activeModal.order} onClose={closeModal} />}
            {activeModal?.type === 'track' && <TrackModal order={activeModal.order} onClose={closeModal} />}
            {activeModal?.type === 'support' && <SupportModal order={activeModal.order} onClose={closeModal} />}
            {activeModal?.type === 'feedback' && <FeedbackModal order={activeModal.order} onClose={closeModal} />}
            {activeModal?.type === 'review' && <ReviewPickerModal order={activeModal.order} onClose={closeModal} />}

            {/* ── Cart Toast ── */}
            {cartToast && (
                <div className="cart-toast">
                    <span>✅</span>
                    Item added to your cart!
                </div>
            )}
        </div>
    );
}

// ─── Page Root ─────────────────────────────────────────────────────────────────
export default function UserOrders() {
    const [activeTab, setActiveTab] = useState('Orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(inputValue);
    };

    return (
        <div className="container user-orders-container">
            <div className="breadcrumb">
                <a href="/">Home</a> &gt; <span>Your Orders</span>
            </div>

            <div className="orders-header">
                <h1>Your Orders</h1>
                <form className="orders-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by order ID, product, city..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <button type="submit" className="btn-search-orders">Search Orders</button>
                </form>
            </div>

            {searchQuery && (
                <div className="search-active-banner">
                    Showing results for: <strong>"{searchQuery}"</strong>
                    <button onClick={() => { setSearchQuery(''); setInputValue(''); }}>✕ Clear</button>
                </div>
            )}

            <div className="orders-tabs">
                {['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled Orders'].map(tab => (
                    <a
                        key={tab}
                        href="#"
                        className={activeTab === tab ? 'active' : ''}
                        onClick={e => { e.preventDefault(); setActiveTab(tab); }}
                    >
                        {tab}
                    </a>
                ))}
            </div>

            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
                <OrderListContent activeTab={activeTab} searchQuery={searchQuery} />
            </Suspense>
        </div>
    );
}
