'use client';

import './page.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { API_BASE } from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';

const StripePayment = dynamic(() => import('@/components/StripePayment'), { ssr: false });


export default function Checkout() {
    const { cartItems, cartTotal, clearCart, cartCount, isLoaded } = useCart();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'USA',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState('');
    const [couponError, setCouponError] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const discountedTotal = cartTotal * (1 - couponDiscount / 100);

    const handleApplyCoupon = async () => {
        setCouponError('');
        if (!couponCode.trim()) return;
        setApplyingCoupon(true);
        try {
            const res = await fetch(`${API_BASE}/api/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ code: couponCode.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setCouponDiscount(data.discount);
            setCouponApplied(data.code);
        } catch (e: any) {
            setCouponDiscount(0);
            setCouponApplied('');
            setCouponError(e.message);
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setCouponDiscount(0);
        setCouponApplied('');
        setCouponError('');
    };

    // Redirect to cart if empty
    useEffect(() => {
        if (!isLoaded) return;
        if (cartCount === 0 && !loading) {
            router.push('/cart');
        }
    }, [cartCount, router, isLoaded, loading]);

    // Auth guard — redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [user, authLoading, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item.id,
                name: item.name,
                image: item.image,
                size: item.size || 'One Size',
                color: item.color || 'Default',
                quantity: item.quantity,
                price: item.price,
            })),
            shippingAddress: {
                fullName: shippingAddress.fullName,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
                phone: shippingAddress.phone,
            },
            paymentMethod: paymentMethod,
            totalAmount: discountedTotal,
            couponCode: couponApplied || undefined
        };

        try {
            const res = await fetch(`${API_BASE}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(orderData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong while placing order');
            await clearCart();
            router.push('/orders?success=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Called by Stripe after successful card payment — auto-places the order
    const handleStripeSuccess = async (paymentIntentId: string) => {
        setError('');
        setLoading(true);
        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item.id,
                name: item.name,
                image: item.image,
                size: item.size || 'One Size',
                color: item.color || 'Default',
                quantity: item.quantity,
                price: item.price,
            })),
            shippingAddress: {
                fullName: shippingAddress.fullName,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
                phone: shippingAddress.phone,
            },
            paymentMethod: 'Card',
            totalAmount: discountedTotal,
            couponCode: couponApplied || undefined,
            stripePaymentId: paymentIntentId,
        };
        try {
            const res = await fetch(`${API_BASE}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to place order after payment');
            await clearCart();
            router.push('/orders?success=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStripeError = (msg: string) => setError(msg);

    if (!isLoaded || cartCount === 0) return null;

    return (
        <div className="checkout-container container">
            <div className="checkout-main">
                <h1>Checkout</h1>

                {error && <div className="error-banner">{error}</div>}

                <form id="checkout-form" onSubmit={handleSubmit}>
                    <div className="checkout-step">
                        <div className="step-header">
                            <h2>1. Shipping address</h2>
                        </div>
                        <div className="step-body">
                            <div className="address-form">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full name (First and Last name)"
                                    value={shippingAddress.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Street address"
                                    value={shippingAddress.address}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={shippingAddress.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="form-row">
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State / Province"
                                        value={shippingAddress.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="postalCode"
                                        placeholder="ZIP / Postal Code"
                                        value={shippingAddress.postalCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone number"
                                    value={shippingAddress.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="checkout-step">
                        <div className="step-header">
                            <h2>2. Payment method</h2>
                        </div>
                        <div className="step-body">
                            <div className="payment-options">
                                <label className="payment-radio">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Cash on Delivery (COD)</span>
                                </label>
                                <label className="payment-radio">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Card"
                                        checked={paymentMethod === 'Card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>💳 Credit / Debit Card (Stripe)</span>
                                </label>
                            </div>

                            {/* Stripe card form — only visible when Card is selected */}
                            {paymentMethod === 'Card' && (
                                <div style={{
                                    marginTop: '1.25rem',
                                    borderRadius: 12,
                                    border: '1.5px solid #e0e0e0',
                                    background: '#fff',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                                }}>
                                    {/* Card header */}
                                    <div style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <span style={{ fontSize: '1.2rem' }}>💳</span>
                                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', letterSpacing: 0.3 }}>Secure Card Payment</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                            <span style={{ background: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800, color: '#1a1a6e', letterSpacing: 1 }}>VISA</span>
                                            <span style={{ background: '#eb001b', borderRadius: 4, padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800, color: '#fff' }}>MC</span>
                                            <span style={{ background: '#016fd0', borderRadius: 4, padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800, color: '#fff' }}>AMEX</span>
                                        </div>
                                    </div>
                                    {/* Card body */}
                                    <div style={{ padding: '1.25rem' }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#444', marginBottom: '0.6rem' }}>Card details</p>
                                        <StripePayment
                                            amount={discountedTotal}
                                            onSuccess={handleStripeSuccess}
                                            onError={handleStripeError}
                                            disabled={loading}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: '#888', fontSize: '0.78rem' }}>
                                            <span>🔒</span> <span>Your payment info is encrypted and secure</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="checkout-step">
                        <div className="step-header">
                            <h2>3. Review items</h2>
                        </div>
                        <div className="step-body">
                            <div className="checkout-items-preview">
                                {cartItems.map((item, idx) => (
                                    <div key={item._itemId || `${item.id}-${item.size}-${item.color}-${idx}`} className="preview-item">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            style={{
                                                width: 80, height: 80,
                                                objectFit: 'cover',
                                                borderRadius: 8,
                                                border: '1px solid #e7e7e7',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div className="preview-info" style={{ flex: 1, minWidth: 0 }}>
                                            <p className="preview-name" style={{ fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                                            {(item.size || item.color) && (
                                                <p style={{ fontSize: '0.82rem', color: '#565959', marginBottom: 4 }}>
                                                    {item.size && <span>Size: <strong>{item.size}</strong></span>}
                                                    {item.size && item.color && <span style={{ margin: '0 6px' }}>|</span>}
                                                    {item.color && <span>Color: <strong>{item.color}</strong></span>}
                                                </p>
                                            )}
                                            <p style={{ color: '#007600', fontSize: '0.82rem', marginBottom: 4 }}>In Stock</p>
                                            <p style={{ fontSize: '0.85rem', color: '#565959' }}>Qty: <strong>{item.quantity}</strong> &nbsp;|&nbsp; ${item.price.toFixed(2)} each</p>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <p style={{ fontWeight: 700, fontSize: '1rem' }}>${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="checkout-summary">
                <button
                    type="submit"
                    form="checkout-form"
                    className="btn-primary btn-place-order"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Place your order'}
                </button>
                <p className="summary-terms">By placing your order, you agree to FashionStore's privacy notice and conditions of use.</p>

                {/* Coupon code apply */}
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: 6, border: '1px solid #e7e7e7' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem' }}>🏷️ Have a coupon code?</p>
                    {couponApplied ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fff4', padding: '0.5rem 0.75rem', borderRadius: 4, border: '1px solid #c6f6d5' }}>
                            <span style={{ color: '#1e8c45', fontWeight: 700 }}>✅ {couponApplied} — {couponDiscount}% OFF</span>
                            <button type="button" onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: '#d00', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter coupon code"
                                    style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 4, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={applyingCoupon || !couponCode.trim()}
                                    style={{ padding: '0.5rem 1rem', background: '#febd69', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    {applyingCoupon ? '...' : 'Apply'}
                                </button>
                            </div>
                            {couponError && <p style={{ color: '#d00', fontSize: '0.82rem', marginTop: '0.4rem' }}>{couponError}</p>}
                        </>
                    )}
                </div>

                <div className="order-totals">
                    <h3>Order Summary</h3>
                    <div className="totals-row">
                        <span>Items ({cartCount}):</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                        <div className="totals-row" style={{ color: '#1e8c45' }}>
                            <span>Coupon ({couponApplied}):</span>
                            <span>-{couponDiscount}% (-${(cartTotal - discountedTotal).toFixed(2)})</span>
                        </div>
                    )}
                    <div className="totals-row">
                        <span>Shipping & handling:</span>
                        <span>$0.00</span>
                    </div>
                    <div className="totals-row">
                        <span>Estimated tax:</span>
                        <span>$0.00</span>
                    </div>
                    <div className="totals-row grand-total">
                        <span>Order total:</span>
                        <span>
                            {couponApplied && (
                                <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '0.4rem', fontWeight: 400 }}>
                                    ${cartTotal.toFixed(2)}
                                </span>
                            )}
                            <span style={{ color: couponApplied ? '#1e8c45' : 'inherit' }}>
                                ${discountedTotal.toFixed(2)}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
