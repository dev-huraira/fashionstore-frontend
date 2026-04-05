import '../info-shared.css';

export default function ShippingPage() {
    const rates = [
        { method: '🚚 Next-Day Delivery', time: 'Next business day', cost: 'FREE on all orders', notes: 'Order before 3 PM' },
        { method: '📦 Standard Delivery', time: '2–4 business days',  cost: 'FREE over $25',    notes: '$2.99 below $25' },
        { method: '⚡ Express (Same-Day)',  time: 'Same day (metro)',   cost: '$4.99 flat',       notes: 'Order before 12 PM' },
        { method: '🌍 International',       time: '7–14 business days',cost: 'Calculated at checkout', notes: '40+ countries' },
    ];

    return (
        <div className="ip-page">
            <div className="ip-hero">
                <div className="ip-hero-badge">🚚 Fast & Reliable</div>
                <h1>Shipping Rates & Policies</h1>
                <p>Fast, reliable, and affordable shipping on every order. We partner with leading couriers to get your fashion to you quickly.</p>
            </div>

            {/* Stats */}
            <div className="ip-stats">
                <div className="ip-stat-card">
                    <div className="ip-stat-value">FREE</div>
                    <div className="ip-stat-label">Next-Day Delivery</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">40+</div>
                    <div className="ip-stat-label">Countries Served</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">24h</div>
                    <div className="ip-stat-label">Dispatch Time</div>
                </div>
            </div>

            {/* Shipping table */}
            <div className="ip-section">
                <div className="ip-section-title"><span>🚚</span> Shipping Options</div>
                <table className="ip-table">
                    <thead>
                        <tr>
                            {['Method', 'Delivery Time', 'Cost', 'Notes'].map(h => (
                                <th key={h}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rates.map((r, i) => (
                            <tr key={i}>
                                <td>{r.method}</td>
                                <td>{r.time}</td>
                                <td className="ip-table-green">{r.cost}</td>
                                <td>{r.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tracking + International */}
            <div className="ip-grid">
                <div className="ip-section">
                    <div className="ip-section-title"><span>📍</span> Tracking Your Order</div>
                    <p>Once dispatched, you'll receive an email with a tracking link. You can also track at any time from <a href="/orders">Your Orders</a>.</p>
                </div>
                <div className="ip-section">
                    <div className="ip-section-title"><span>🌍</span> International Shipping</div>
                    <p>We ship to 40+ countries worldwide. International duties and taxes are calculated at checkout. Delivery takes 7–14 business days.</p>
                </div>
            </div>

            {/* Packaging */}
            <div className="ip-section">
                <div className="ip-section-title"><span>♻️</span> Eco-Friendly Packaging</div>
                <p>All orders are shipped in <strong>100% recyclable packaging</strong>. We use minimal materials to reduce waste while keeping your items safe in transit. Our goal is zero-waste packaging by 2026.</p>
            </div>

            {/* CTA */}
            <div className="ip-cta">
                <h2>Questions About Your Shipment?</h2>
                <p>Our support team operates 24/7 and typically responds within 2 hours.</p>
                <div className="ip-btn-group">
                    <a href="mailto:huraira3076@gmail.com" className="ip-btn-primary">📧 Contact Support</a>
                    <a href="/orders" className="ip-btn-outline">📦 Track My Order</a>
                </div>
            </div>
        </div>
    );
}
