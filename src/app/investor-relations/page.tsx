import '../info-shared.css';

export default function InvestorPage() {
    const financials = [
        { metric: 'Founded', value: '2024', note: 'Lahore, Pakistan' },
        { metric: 'Customers', value: '50,000+', note: 'Across 40+ countries' },
        { metric: 'Products', value: '360+', note: 'Across 3 categories' },
        { metric: 'Growth Rate', value: '3× YoY', note: 'Since launch' },
    ];

    return (
        <div className="ip-page">
            <div className="ip-hero">
                <div className="ip-hero-badge">📈 Investor Relations</div>
                <h1>Investor Relations</h1>
                <p>FashionStore is a fast-growing e-commerce platform redefining online fashion retail in Pakistan and beyond. Explore our performance and vision.</p>
            </div>

            {/* Stats */}
            <div className="ip-stats">
                <div className="ip-stat-card">
                    <div className="ip-stat-value">3×</div>
                    <div className="ip-stat-label">YoY Growth</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">50K+</div>
                    <div className="ip-stat-label">Active Customers</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">40+</div>
                    <div className="ip-stat-label">Countries Reached</div>
                </div>
            </div>

            {/* Key metrics table */}
            <div className="ip-section">
                <div className="ip-section-title"><span>📊</span> Key Metrics</div>
                <table className="ip-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financials.map((f, i) => (
                            <tr key={i}>
                                <td>{f.metric}</td>
                                <td className="ip-table-green">{f.value}</td>
                                <td>{f.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vision & Opportunity */}
            <div className="ip-grid">
                <div className="ip-section">
                    <div className="ip-section-title"><span>🚀</span> Our Vision</div>
                    <p>To become Pakistan's #1 online fashion destination and expand across South Asia, offering premium clothing to millions of customers through technology-driven retail.</p>
                </div>
                <div className="ip-section">
                    <div className="ip-section-title"><span>💡</span> Market Opportunity</div>
                    <p>Pakistan's e-commerce market is expected to reach $10B by 2030. FashionStore is positioned at the heart of this growth with a scalable, tech-first approach to fashion retail.</p>
                </div>
            </div>

            {/* CTA */}
            <div className="ip-cta">
                <h2>Interested in Investing?</h2>
                <p>We're open to discussions with accredited investors who share our vision. Reach out to learn more about partnership opportunities.</p>
                <div className="ip-btn-group">
                    <a href="mailto:huraira3076@gmail.com" className="ip-btn-primary">📧 Contact Our Team</a>
                    <a href="/about" className="ip-btn-outline">🏪 Learn About Us</a>
                </div>
            </div>
        </div>
    );
}
