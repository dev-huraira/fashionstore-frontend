import '../info-shared.css';

export default function CareersPage() {
    const jobs = [
        { title: 'Frontend Developer', dept: 'Engineering', type: 'Full-time', location: 'Remote' },
        { title: 'Product Designer', dept: 'Design', type: 'Full-time', location: 'Hybrid' },
        { title: 'Marketing Specialist', dept: 'Marketing', type: 'Full-time', location: 'On-site' },
        { title: 'Logistics Coordinator', dept: 'Operations', type: 'Full-time', location: 'On-site' },
        { title: 'Customer Support Agent', dept: 'Support', type: 'Part-time', location: 'Remote' },
    ];

    const perks = [
        { icon: '💰', title: 'Competitive Pay', desc: 'Market-rate salaries with annual reviews and bonuses.' },
        { icon: '🏠', title: 'Flexible Work', desc: 'Remote, hybrid, or on-site — you choose what works best.' },
        { icon: '🏥', title: 'Health Benefits', desc: 'Full health and wellness coverage for you and your family.' },
        { icon: '📚', title: 'Learning Budget', desc: 'PKR 50,000/year for courses, books, and conferences.' },
        { icon: '🏖️', title: 'Paid Time Off', desc: '21 days annual leave plus all national holidays.' },
        { icon: '🎁', title: 'Staff Discounts', desc: '40% off all FashionStore products year-round.' },
    ];

    return (
        <div className="ip-page">
            <div className="ip-hero">
                <div className="ip-hero-badge">🚀 We're Hiring</div>
                <h1>Careers at FashionStore</h1>
                <p>Join a fast-growing team passionate about fashion, technology, and customer experience. Build something great with us.</p>
            </div>

            {/* Stats */}
            <div className="ip-stats">
                <div className="ip-stat-card">
                    <div className="ip-stat-value">5</div>
                    <div className="ip-stat-label">Open Positions</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">3+</div>
                    <div className="ip-stat-label">Years Growing</div>
                </div>
                <div className="ip-stat-card">
                    <div className="ip-stat-value">100%</div>
                    <div className="ip-stat-label">Remote Friendly</div>
                </div>
            </div>

            {/* Perks */}
            <div className="ip-highlight-grid">
                {perks.map((p, i) => (
                    <div key={i} className="ip-highlight-card">
                        <div className="ip-highlight-icon">{p.icon}</div>
                        <h3>{p.title}</h3>
                        <p>{p.desc}</p>
                    </div>
                ))}
            </div>

            {/* Open Positions */}
            <div className="ip-section">
                <div className="ip-section-title"><span>💼</span> Open Positions</div>
                {jobs.map((job, i) => (
                    <div key={i} className="ip-job-card">
                        <div>
                            <div className="ip-job-title">{job.title}</div>
                            <div className="ip-job-dept">{job.dept}</div>
                        </div>
                        <div className="ip-job-badges">
                            <span className="ip-badge ip-badge-type">{job.type}</span>
                            <span className="ip-badge ip-badge-loc">{job.location}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="ip-cta">
                <h2>Ready to Join Us?</h2>
                <p>Email your CV with the position title in the subject line. We review every application personally.</p>
                <div className="ip-btn-group">
                    <a href="mailto:huraira3076@gmail.com" className="ip-btn-primary">📩 Apply Now</a>
                    <a href="/about" className="ip-btn-outline">🏪 Learn About Us</a>
                </div>
            </div>
        </div>
    );
}
