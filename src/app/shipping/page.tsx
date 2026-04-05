import '../info-pages.css';

export default function ShippingPage() {
    const rates = [
        { method: 'Next-Day Delivery', time: 'Next business day', cost: 'FREE on all orders', notes: 'Order before 3 PM' },
        { method: 'Standard Delivery', time: '2–4 business days', cost: 'FREE on orders over $25', notes: '$2.99 below $25' },
        { method: 'Express Delivery', time: 'Same day (metro areas)', cost: '$4.99 flat', notes: 'Order before 12 PM' },
        { method: 'International', time: '7–14 business days', cost: 'Calculated at checkout', notes: 'Available to 40+ countries' },
    ];

    return (
        <div className="info-page">
            <div className="info-hero">
                <h1>Shipping Rates &amp; Policies</h1>
                <p>Fast, reliable, and affordable shipping on every order. We partner with leading couriers to get your fashion to you quickly.</p>
            </div>

            <div className="info-section">
                <h2>🚚 Shipping Options</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.75rem' }}>
                    <thead>
                        <tr style={{ background: '#f3f3f3' }}>
                            {['Method', 'Delivery Time', 'Cost', 'Notes'].map(h => (
                                <th key={h} style={{ padding: '0.65rem 0.75rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rates.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #e7e7e7' }}>
                                <td style={{ padding: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>{r.method}</td>
                                <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#444' }}>{r.time}</td>
                                <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#007600', fontWeight: 600 }}>{r.cost}</td>
                                <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>{r.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="info-grid">
                <div className="info-section">
                    <h2>📍 Tracking Your Order</h2>
                    <p>Once your order is dispatched, you will receive an email with a tracking link. You can also track your order from <a href="/orders" style={{ color: '#f90' }}>Your Orders</a> page at any time.</p>
                </div>
                <div className="info-section">
                    <h2>🌍 International Shipping</h2>
                    <p>We ship to over 40 countries worldwide. International duties and taxes may apply and are calculated at checkout. Delivery typically takes 7–14 business days.</p>
                </div>
            </div>

            <div className="info-section">
                <h2>📦 Packaging</h2>
                <p>All orders are shipped in 100% recyclable packaging. We use minimal packaging to reduce waste while keeping your items safe during transit.</p>
            </div>

            <div className="info-section" style={{ textAlign: 'center' }}>
                <h2>Questions about your shipment?</h2>
                <a href="/help" className="info-btn">Contact Support</a>
            </div>
        </div>
    );
}
