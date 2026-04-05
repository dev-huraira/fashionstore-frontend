'use client';

import '../profile-section.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/api';

const CARD_GRADIENTS = [
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    'linear-gradient(135deg, #005c99 0%, #003366 100%)',
    'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
    'linear-gradient(135deg, #6d1a36 0%, #a4133c 100%)',
];

const EMPTY_FORM = { cardName: '', cardNumber: '', expiry: '', cvv: '' };

function maskCard(num: string) {
    const d = num.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
}

export default function PaymentsPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [cards, setCards] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState('');

    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (!user) { router.push('/login?redirect=/profile/payments'); return; }

        // Load saved cards from localStorage (UI-only feature, not security-sensitive)
        const saved = localStorage.getItem('savedPaymentCards');
        if (saved) setCards(JSON.parse(saved));

        // Fetch orders to show recent payment methods
        fetch(`${API_BASE}/api/orders/myorders`, { credentials: 'include' })
            .then(r => r.ok ? r.json() : [])
            .then(data => setOrders(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, [user, loading, router]);

    const handleAddCard = () => {
        setError('');
        const digits = form.cardNumber.replace(/\D/g, '');
        if (!form.cardName.trim()) { setError('Card holder name is required.'); return; }
        if (digits.length < 13) { setError('Enter a valid card number.'); return; }
        if (!form.expiry.match(/^\d{2}\/\d{2}$/)) { setError('Expiry must be MM/YY.'); return; }
        if (form.cvv.length < 3) { setError('CVV must be 3–4 digits.'); return; }

        const newCard = {
            id: Date.now(),
            cardName: form.cardName,
            last4: digits.slice(-4),
            expiry: form.expiry,
            brand: digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : 'Card',
        };
        const updated = [...cards, newCard];
        setCards(updated);
        localStorage.setItem('savedPaymentCards', JSON.stringify(updated));
        setForm(EMPTY_FORM);
        setShowForm(false);
    };

    const handleRemove = (id: number) => {
        const updated = cards.filter(c => c.id !== id);
        setCards(updated);
        localStorage.setItem('savedPaymentCards', JSON.stringify(updated));
    };

    const recentMethods = [...new Set(orders.map(o => o.paymentMethod).filter(Boolean))];

    return (
        <div className="container profile-section-page">
            <a href="/profile" className="back-link">← Your Account</a>
            <h1>Your Payments</h1>

            {/* Saved Cards */}
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#111' }}>Saved Cards</h2>

            {cards.length === 0 && !showForm && (
                <div className="ps-card" style={{ padding: '1.5rem', textAlign: 'center', color: '#666' }}>
                    <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>💳</p>
                    <p>No saved cards yet. Add one below.</p>
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                {cards.map((card, idx) => (
                    <div
                        key={card.id}
                        className="payment-visual-card"
                        style={{ background: CARD_GRADIENTS[idx % CARD_GRADIENTS.length] }}
                    >
                        <div className="card-chip">💳</div>
                        <div className="card-number">•••• •••• •••• {card.last4}</div>
                        <div className="card-footer">
                            <span>{card.cardName}</span>
                            <span>{card.expiry}</span>
                            <span>{card.brand}</span>
                        </div>
                        <button
                            onClick={() => handleRemove(card.id)}
                            style={{
                                position: 'absolute', top: 10, right: 10,
                                background: 'rgba(255,255,255,0.15)', border: 'none',
                                borderRadius: '50%', width: 26, height: 26, cursor: 'pointer',
                                color: '#fff', fontSize: '0.8rem', lineHeight: '26px', textAlign: 'center',
                            }}
                        >✕</button>
                    </div>
                ))}
            </div>

            {showForm ? (
                <div className="ps-card">
                    <div className="ps-card-header"><h3>Add a Card</h3></div>
                    <div className="ps-edit-form">
                        <label>Card Holder Name</label>
                        <input type="text" value={form.cardName} onChange={e => setForm(f => ({ ...f, cardName: e.target.value }))} placeholder="Name on card" />
                        <label>Card Number</label>
                        <input
                            type="text"
                            maxLength={19}
                            value={form.cardNumber}
                            onChange={e => setForm(f => ({ ...f, cardNumber: maskCard(e.target.value) }))}
                            placeholder="1234 5678 9012 3456"
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label>Expiry (MM/YY)</label>
                                <input
                                    type="text"
                                    maxLength={5}
                                    value={form.expiry}
                                    onChange={e => {
                                        let v = e.target.value.replace(/\D/g, '');
                                        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                        setForm(f => ({ ...f, expiry: v }));
                                    }}
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div>
                                <label>CVV</label>
                                <input
                                    type="password"
                                    maxLength={4}
                                    value={form.cvv}
                                    onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '') }))}
                                    placeholder="•••"
                                />
                            </div>
                        </div>
                        {error && <p className="ps-error">⚠ {error}</p>}
                        <div className="ps-form-actions">
                            <button className="ps-save-btn" onClick={handleAddCard}>Add Card</button>
                            <button className="ps-cancel-btn" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setError(''); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            ) : (
                <button className="add-addr-btn" onClick={() => setShowForm(true)}>+ Add a payment card</button>
            )}

            {/* Recent Payment Methods */}
            {recentMethods.length > 0 && (
                <>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '1.5rem 0 1rem', color: '#111' }}>
                        Payment Methods Used
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {recentMethods.map((method, i) => (
                            <div key={i} style={{
                                border: '1px solid #ddd', borderRadius: 8, padding: '0.75rem 1.25rem',
                                background: '#fafafa', fontSize: '0.9rem', fontWeight: 600, color: '#333',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}>
                                {method === 'COD' ? '💵' : '💳'} {method === 'COD' ? 'Cash on Delivery' : method}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
