import '../info-pages.css';

export default function AboutPage() {
    return (
        <div className="info-page">
            <div className="info-hero">
                <h1>About FashionStore</h1>
                <p>We are a premium online fashion destination built to bring you the best in Men's, Women's, and Kids' clothing — fast, affordable, and always stylish.</p>
            </div>

            <div className="info-grid">
                <div className="info-section">
                    <h2>🏪 Our Story</h2>
                    <p>Founded in 2024, FashionStore started with a simple mission: make premium fashion accessible to everyone. From humble beginnings as a local boutique, we transformed into a full-scale online store serving thousands of customers.</p>
                </div>
                <div className="info-section">
                    <h2>🌍 Our Mission</h2>
                    <p>We believe everyone deserves to look and feel their best. We carefully curate our collections to offer high-quality garments at prices that don't break the bank.</p>
                </div>
            </div>

            <div className="info-section">
                <h2>✨ Why Shop With Us?</h2>
                <ul>
                    <li>🚀 Free next-day delivery on all orders</li>
                    <li>🔄 30-day hassle-free returns</li>
                    <li>🛡️ Secure payment with multiple options</li>
                    <li>💬 Dedicated 24/7 customer support</li>
                    <li>🌿 Sustainable sourcing and eco-friendly packaging</li>
                </ul>
            </div>

            <div className="info-grid">
                <div className="info-section">
                    <h2>📦 Fast Delivery</h2>
                    <p>We partner with top logistics companies to ensure your order arrives as quickly as possible. Most orders arrive the very next day.</p>
                </div>
                <div className="info-section">
                    <h2>♻️ Sustainability</h2>
                    <p>We are committed to reducing our carbon footprint. Our packaging is 100% recyclable and we partner with sustainable suppliers.</p>
                </div>
            </div>

            <div className="info-section" style={{ textAlign: 'center' }}>
                <h2>🤝 Join Our Community</h2>
                <p>Over 50,000 happy customers and counting. Be part of the FashionStore family.</p>
                <a href="/search" className="info-btn">Shop Now</a>
            </div>

            <div className="info-section" style={{ textAlign: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '2rem' }}>
                <h2>📬 Get in Touch</h2>
                <p style={{ marginBottom: '0.5rem' }}>📧 <a href="mailto:huraira3076@gmail.com" style={{ color: '#0066c0' }}>huraira3076@gmail.com</a></p>
                <p>📞 <a href="tel:+923326871681" style={{ color: '#0066c0' }}>+92 332 6871681</a></p>
            </div>
        </div>
    );
}
