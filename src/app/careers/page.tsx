import '../info-pages.css';

export default function CareersPage() {
    const jobs = [
        { title: 'Frontend Developer', dept: 'Engineering', type: 'Full-time', location: 'Remote' },
        { title: 'Product Designer', dept: 'Design', type: 'Full-time', location: 'Hybrid' },
        { title: 'Marketing Specialist', dept: 'Marketing', type: 'Full-time', location: 'On-site' },
        { title: 'Logistics Coordinator', dept: 'Operations', type: 'Full-time', location: 'On-site' },
        { title: 'Customer Support Agent', dept: 'Support', type: 'Part-time', location: 'Remote' },
    ];

    return (
        <div className="info-page">
            <div className="info-hero">
                <h1>Careers at FashionStore</h1>
                <p>Join a fast-growing team passionate about fashion, technology, and customer experience. We are always looking for talented people.</p>
            </div>

            <div className="info-grid">
                <div className="info-section">
                    <h2>🌟 Why Work With Us?</h2>
                    <ul>
                        <li>Competitive salaries &amp; equity</li>
                        <li>Flexible work arrangements</li>
                        <li>Health &amp; wellness benefits</li>
                        <li>Learning &amp; development budget</li>
                        <li>Fun, inclusive culture</li>
                    </ul>
                </div>
                <div className="info-section">
                    <h2>📈 Our Culture</h2>
                    <p>At FashionStore, we value creativity, collaboration, and ownership. Everyone's voice matters, and we celebrate wins together as a team.</p>
                </div>
            </div>

            <div className="info-section">
                <h2>💼 Open Positions</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.75rem' }}>
                    <thead>
                        <tr style={{ background: '#f3f3f3' }}>
                            {['Role', 'Department', 'Type', 'Location'].map(h => (
                                <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((j, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #e7e7e7' }}>
                                <td style={{ padding: '0.7rem 0.75rem', fontWeight: 600, fontSize: '0.92rem' }}>{j.title}</td>
                                <td style={{ padding: '0.7rem 0.75rem', fontSize: '0.9rem', color: '#555' }}>{j.dept}</td>
                                <td style={{ padding: '0.7rem 0.75rem', fontSize: '0.9rem', color: '#555' }}>{j.type}</td>
                                <td style={{ padding: '0.7rem 0.75rem', fontSize: '0.9rem', color: '#555' }}>{j.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="info-section" style={{ textAlign: 'center' }}>
                <h2>📩 Apply Today</h2>
                <p>Email your CV to <strong>careers@fashionstore.com</strong> with the position title in the subject line.</p>
                <a href="mailto:careers@fashionstore.com" className="info-btn">Apply Now</a>
            </div>
        </div>
    );
}
