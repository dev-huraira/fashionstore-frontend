'use client';

import './page.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

function getImageUrl(img: string | undefined): string {
    if (!img) return 'https://via.placeholder.com/80x80/f3f3f3/333?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
}

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const { user, loading } = useAuth();
    const router = useRouter();

    // While auth is loading, show nothing to avoid flash
    if (loading) return null;

    // Guest view — professional login prompt
    if (!user) {
        return (
            <div className="cart-container container" style={{ paddingTop: '3rem' }}>
                <div style={{
                    maxWidth: '520px',
                    margin: '0 auto',
                    background: '#fff',
                    border: '1px solid #e7e7e7',
                    borderRadius: '10px',
                    padding: '2.5rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛒</div>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is waiting</h1>
                    <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                        Sign in to view your saved items and continue shopping where you left off.
                    </p>
                    <button
                        onClick={() => router.push('/login?message=Sign in to view your shopping cart&redirect=/cart')}
                        style={{
                            background: '#ffd814',
                            border: '1px solid #fcd200',
                            borderRadius: '8px',
                            padding: '0.65rem 2rem',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginBottom: '0.75rem',
                            width: '100%',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        Sign In
                    </button>
                    <a href="/" style={{ display: 'block', color: '#0066c0', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Continue shopping →
                    </a>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-container container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '1rem' }}>Your FashionStore Cart is empty</h1>
                <p style={{ color: '#555', marginBottom: '1.5rem' }}>You have no items in your cart.</p>
                <a href="/" style={{ color: '#007185', fontWeight: 500 }}>Continue Shopping →</a>
            </div>
        );
    }

    return (
        <div className="cart-container container">
            <div className="cart-left">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p className="price-label">Price</p>
                </div>

                <div className="cart-items">
                    {cartItems.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="cart-item">
                            <div className="item-image">
                                <img src={getImageUrl(item.image)} alt={item.name} />
                            </div>
                            <div className="item-details">
                                <h3 className="item-title">{item.name}</h3>
                                {(item.size || item.color) && (
                                    <p style={{ fontSize: '0.82rem', color: '#565959', margin: '2px 0 4px' }}>
                                        {item.size && <span>Size: <strong>{item.size}</strong></span>}
                                        {item.size && item.color && <span style={{ margin: '0 6px' }}>|</span>}
                                        {item.color && <span>Color: <strong>{item.color}</strong></span>}
                                    </p>
                                )}
                                <p className="item-stock" style={{ color: '#007600' }}>In Stock</p>
                                <div className="item-actions">
                                    <select
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item._itemId ?? item.id, Number(e.target.value))}
                                        className="qty-select"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <option key={n} value={n}>Qty: {n}</option>
                                        ))}
                                    </select>
                                    <span className="separator">|</span>
                                    <button className="btn-link" onClick={() => removeFromCart(item._itemId ?? item.id)}>Delete</button>
                                </div>
                            </div>
                            <div className="item-price">
                                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-subtotal">
                    <p>Subtotal ({cartCount} items): <strong>${cartTotal.toFixed(2)}</strong></p>
                </div>
            </div>

            <div className="cart-right">
                <div className="checkout-card">
                    <p className="checkout-subtotal">
                        Subtotal ({cartCount} items): <strong>${cartTotal.toFixed(2)}</strong>
                    </p>
                    <a href="/checkout">
                        <button className="btn-checkout">Proceed to Checkout</button>
                    </a>
                </div>
            </div>
        </div>
    );
}
