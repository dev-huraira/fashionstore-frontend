import '../info-shared.css';

export default function PressPage() {
    const releases = [
        { date: 'March 2025', title: 'FashionStore Reaches 50,000 Customers Milestone', tag: 'Growth' },
        { date: 'January 2025', title: 'FashionStore Launches International Shipping to 40+ Countries', tag: 'Expansion' },
        { date: 'November 2024', title: 'FashionStore Introduces Cash on Delivery Across Pakistan', tag: 'Product' },
        { date: 'August 2024', title: 'FashionStore Officially Launches Online Store', tag: 'Launch' },
    ];

    return (
        <div className="ip-page">
            <div className="ip-hero">
                <div className="ip-hero-badge">📰 Newsroom</div>
                <h1>Press Center</h1>
                <p>The latest news, press releases, and media resources from FashionStore. For press inquiries, contact our media team directly.</p>
            </div>

            {/* Stats */}
            <div className="ip-stats">
                <div className="ip-stat-card">
                    <div className="ip-stat-value">50K+</div>
                    <div className="ip-stat-label">Customers Served</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">2024</div>
                    <div className="ip-stat-label">Year Founded</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">40+</div>
                    <div className="ip-stat-label">Countries</div>
                </div>
            </div>

            {/* Press releases */}
            <div className="ip-section">
                <div className="ip-section-title"><span>📣</span> Press Releases</div>
                {releases.map((r, i) => (
                    <div key={i} className="ip-job-card">
                        <div>
                            <div className="ip-job-title">{r.title}</div>
                            <div className="ip-job-dept">{r.date}</div>
                        </div>
                        <span className="ip-badge ip-badge-dept">{r.tag}</span>
                    </div>
                ))}
            </div>

            {/* Brand kit + Contacts */}
            <div className="ip-grid">
                <div className="ip-section">
                    <div className="ip-section-title"><span>🎨</span> Brand Assets</div>
                    <p>Download our official logos, brand guidelines, and product images for editorial and media use.</p>
                    <ul>
                        <li>Logo files (SVG, PNG, dark/light)</li>
                        <li>Brand color palette & typography</li>
                        <li>Approved product photography</li>
                        <li>Executive headshots</li>
                    </ul>
                </div>
                <div className="ip-section">
                    <div className="ip-section-title"><span>📬</span> Media Contact</div>
                    <p>For interviews, quotes, or press enquiries, reach our communications team:</p>
                    <p>📧 <a href="mailto:huraira3076@gmail.com">huraira3076@gmail.com</a></p>
                    <p>📞 <a href="tel:+923326871681">+92 332 6871681</a></p>
                    <p style={{marginTop:'0.5rem', fontSize:'0.82rem', color:'#9ca3af'}}>We respond to media queries within 24 hours.</p>
                </div>
            </div>

            {/* CTA */}
            <div className="ip-cta">
                <h2>Want to Feature FashionStore?</h2>
                <p>We'd love to connect with journalists, bloggers, and content creators. Reach out and let's tell our story together.</p>
                <div className="ip-btn-group">
                    <a href="mailto:huraira3076@gmail.com" className="ip-btn-primary">📧 Press Inquiry</a>
                    <a href="/about" className="ip-btn-outline">🏪 About Us</a>
                </div>
            </div>
        </div>
    );
}
