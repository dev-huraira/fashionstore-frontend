import '../info-shared.css';

export default function ReturnsPage() {
    const steps = [
        { text: <>Go to <a href="/orders"><strong>Your Orders</strong></a> and select the item you wish to return.</> },
        { text: <>Click <strong>"Return or Replace Items"</strong> and choose your reason.</> },
        { text: <>Print the <strong>free prepaid return label</strong> we send to your email.</> },
        { text: <>Pack the item securely and drop it at any <strong>courier location</strong>.</> },
        { text: <>Refund processed within <strong>5–7 business days</strong> after we receive the item.</> },
    ];

    return (
        <div className="ip-page">
            <div className="ip-hero">
                <div className="ip-hero-badge">🔄 Hassle-Free Policy</div>
                <h1>Returns & Replacements</h1>
                <p>Not happy with your purchase? No problem. We offer a simple 30-day return policy on all items — completely free.</p>
            </div>

            {/* Stats */}
            <div className="ip-stats">
                <div className="ip-stat-card">
                    <div className="ip-stat-value">30</div>
                    <div className="ip-stat-label">Days to Return</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">FREE</div>
                    <div className="ip-stat-label">Return Pickup</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">5–7</div>
                    <div className="ip-stat-label">Days to Refund</div>
                </div>
            </div>

            {/* Can / Cannot */}
            <div className="ip-grid">
                <div className="ip-section">
                    <div className="ip-section-title"><span>✅</span> What Can Be Returned</div>
                    <ul>
                        <li>Items in original, unworn condition</li>
                        <li>Items with original tags still attached</li>
                        <li>Items returned within 30 days of delivery</li>
                        <li>Defective or wrong items (anytime)</li>
                    </ul>
                </div>
                <div className="ip-section">
                    <div className="ip-section-title"><span>❌</span> What Cannot Be Returned</div>
                    <ul>
                        <li>Items marked <strong>Final Sale</strong></li>
                        <li>Worn, washed, or damaged items</li>
                        <li>Items without original packaging</li>
                        <li>Underwear and swimwear (hygiene)</li>
                    </ul>
                </div>
            </div>

            {/* Step by step */}
            <div className="ip-section">
                <div className="ip-section-title"><span>📋</span> How to Return — Step by Step</div>
                {steps.map((s, i) => (
                    <div key={i} className="ip-step">
                        <div className="ip-step-num">{i + 1}</div>
                        <div className="ip-step-text">{s.text}</div>
                    </div>
                ))}
            </div>

            {/* Refund & Replacement */}
            <div className="ip-grid">
                <div className="ip-section">
                    <div className="ip-section-title"><span>💳</span> Refund Methods</div>
                    <ul>
                        <li>Original payment method <em>(default)</em></li>
                        <li>FashionStore credit <em>(instant)</em></li>
                        <li>Bank transfer <em>(3–5 days)</em></li>
                    </ul>
                </div>
                <div className="ip-section">
                    <div className="ip-section-title"><span>🔄</span> Replacements</div>
                    <p>Need a different size or color? Select <strong>"Replace"</strong> instead of "Return" and we'll ship the replacement for free once we receive the original.</p>
                </div>
            </div>

            {/* CTA */}
            <div className="ip-cta">
                <h2>Need Help With a Return?</h2>
                <p>Our support team is available around the clock. We'll get you sorted quickly.</p>
                <div className="ip-btn-group">
                    <a href="mailto:huraira3076@gmail.com" className="ip-btn-primary">📧 Email Support</a>
                    <a href="/orders" className="ip-btn-outline">📦 Go to My Orders</a>
                </div>
            </div>
        </div>
    );
}
