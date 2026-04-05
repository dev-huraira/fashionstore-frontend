import '../info-shared.css';

export default function AboutPage() {
    return (
        <div className="ip-page">
            <div className="ip-hero">
                <div className="ip-hero-badge">🏪 Est. 2024</div>
                <h1>About FashionStore</h1>
                <p>A premium online fashion destination bringing you the best in Men's, Women's, and Kids' clothing — fast, affordable, and always stylish.</p>
            </div>

            {/* Stats */}
            <div className="ip-stats">
                <div className="ip-stat-card">
                    <div className="ip-stat-value">50K+</div>
                    <div className="ip-stat-label">Happy Customers</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">360+</div>
                    <div className="ip-stat-label">Products Available</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">40+</div>
                    <div className="ip-stat-label">Countries Shipped To</div>
                </div>
            </div>

            {/* Story & Mission */}
            <div className="ip-grid">
                <div className="ip-section">
                    <div className="ip-section-title"><span>🏪</span> Our Story</div>
                    <p>Founded in 2024, FashionStore started with a simple mission: make premium fashion accessible to everyone. From humble beginnings as a local boutique, we transformed into a full-scale online store serving thousands of customers across Pakistan and beyond.</p>
                </div>
                <div className="ip-section">
                    <div className="ip-section-title"><span>🌍</span> Our Mission</div>
                    <p>We believe everyone deserves to look and feel their best. We carefully curate our collections to offer high-quality garments at prices that don't break the bank — without ever compromising on style.</p>
                </div>
            </div>

            {/* Why shop */}
            <div className="ip-highlight-grid">
                <div className="ip-highlight-card">
                    <div className="ip-highlight-icon">🚀</div>
                    <h3>Free Next-Day Delivery</h3>
                    <p>Fast shipping on every order, no minimum required.</p>
                </div>
                <div className="ip-highlight-card">
                    <div className="ip-highlight-icon">🔄</div>
                    <h3>30-Day Returns</h3>
                    <p>Hassle-free returns and free replacements on all items.</p>
                </div>
                <div className="ip-highlight-card">
                    <div className="ip-highlight-icon">🛡️</div>
                    <h3>Secure Payments</h3>
                    <p>Stripe-encrypted cards and Cash on Delivery available.</p>
                </div>
                <div className="ip-highlight-card">
                    <div className="ip-highlight-icon">💬</div>
                    <h3>24/7 Support</h3>
                    <p>Live chat and email support around the clock.</p>
                </div>
                <div className="ip-highlight-card">
                    <div className="ip-highlight-icon">🌿</div>
                    <h3>Eco-Friendly</h3>
                    <p>100% recyclable packaging and sustainable sourcing.</p>
                </div>
                <div className="ip-highlight-card">
                    <div className="ip-highlight-icon">🏷️</div>
                    <h3>Best Prices</h3>
                    <p>Premium quality without the premium price tag.</p>
                </div>
            </div>

            {/* CTA */}
            <div className="ip-cta">
                <h2>Join the FashionStore Family</h2>
                <p>Over 50,000 happy customers and counting. Be part of something stylish.</p>
                <div className="ip-btn-group">
                    <a href="/search" className="ip-btn-primary">🛍️ Shop Now</a>
                    <a href="/help" className="ip-btn-outline">📞 Contact Us</a>
                </div>
            </div>
        </div>
    );
}
