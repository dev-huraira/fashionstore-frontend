import '../info-shared.css';

export default function SustainabilityPage() {
    const goals = [
        { icon: '♻️', title: 'Zero-Waste Packaging', desc: '100% recyclable packaging by end of 2025. No plastic fillers or foam.' },
        { icon: '🌱', title: 'Sustainable Sourcing', desc: 'Partnering only with suppliers who meet our environmental standards.' },
        { icon: '🚗', title: 'Carbon Offset', desc: 'Offsetting 100% of delivery carbon emissions through certified programs.' },
        { icon: '💧', title: 'Water Conservation', desc: 'Working with manufacturers who use water-efficient dyeing processes.' },
        { icon: '🤝', title: 'Fair Trade', desc: 'Ensuring fair wages and safe conditions across our entire supply chain.' },
        { icon: '📦', title: 'Minimal Packaging', desc: 'Right-sized boxes reduce waste and lower our transport emissions.' },
    ];

    return (
        <div className="ip-page">
            <div className="ip-hero">
                <div className="ip-hero-badge">🌿 Our Commitment</div>
                <h1>Sustainability</h1>
                <p>Fashion and responsibility go hand in hand at FashionStore. We are committed to building a greener, fairer future for fashion.</p>
            </div>

            {/* Stats */}
            <div className="ip-stats">
                <div className="ip-stat-card">
                    <div className="ip-stat-value">100%</div>
                    <div className="ip-stat-label">Recyclable Packaging</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">0</div>
                    <div className="ip-stat-label">Plastic Fillers Used</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">2026</div>
                    <div className="ip-stat-label">Zero-Waste Goal</div>
                </div>
            </div>

            {/* Goals grid */}
            <div className="ip-highlight-grid">
                {goals.map((g, i) => (
                    <div key={i} className="ip-highlight-card">
                        <div className="ip-highlight-icon">{g.icon}</div>
                        <h3>{g.title}</h3>
                        <p>{g.desc}</p>
                    </div>
                ))}
            </div>

            {/* Our Promise */}
            <div className="ip-grid">
                <div className="ip-section">
                    <div className="ip-section-title"><span>🌍</span> Our Promise</div>
                    <p>We believe the fashion industry has a responsibility to protect the planet. Every decision we make — from packaging to supplier selection — is guided by our environmental values.</p>
                    <p>We publish an annual sustainability report to hold ourselves accountable to these commitments.</p>
                </div>
                <div className="ip-section">
                    <div className="ip-section-title"><span>📅</span> 2025–2026 Targets</div>
                    <ul>
                        <li>Zero single-use plastic by Q4 2025</li>
                        <li>100% carbon-neutral deliveries</li>
                        <li>20% reduction in return shipments</li>
                        <li>Sustainable supplier certification for all partners</li>
                    </ul>
                </div>
            </div>

            {/* CTA */}
            <div className="ip-cta">
                <h2>Together We Can Do More</h2>
                <p>Want to learn more about our sustainability efforts or collaborate on green initiatives? We'd love to hear from you.</p>
                <div className="ip-btn-group">
                    <a href="mailto:huraira3076@gmail.com" className="ip-btn-primary">🌿 Get in Touch</a>
                    <a href="/about" className="ip-btn-outline">🏪 About Us</a>
                </div>
            </div>
        </div>
    );
}
