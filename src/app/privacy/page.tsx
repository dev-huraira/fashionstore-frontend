import '../info-pages.css';

export default function PrivacyPage() {
    return (
        <div className="info-page">
            <div className="info-hero">
                <h1>Privacy Policy</h1>
                <p>Your privacy is important to us. This policy explains what data we collect, how we use it, and your rights.</p>
            </div>

            <div className="info-section">
                <h2>📋 Information We Collect</h2>
                <ul>
                    <li><strong>Account Information:</strong> Name, email address, phone number, and password (hashed).</li>
                    <li><strong>Order Information:</strong> Shipping address, billing address, and order history.</li>
                    <li><strong>Payment Information:</strong> We never store full card details. Payments are processed securely by our payment partners.</li>
                    <li><strong>Usage Data:</strong> Pages visited, products viewed, and search queries — used to improve your experience.</li>
                    <li><strong>Cookies:</strong> We use cookies to keep you logged in and remember your preferences.</li>
                </ul>
            </div>

            <div className="info-grid">
                <div className="info-section">
                    <h2>🔒 How We Use Your Data</h2>
                    <ul>
                        <li>Process and deliver your orders</li>
                        <li>Send order confirmations and updates</li>
                        <li>Personalise your shopping experience</li>
                        <li>Improve our products and services</li>
                        <li>Prevent fraud and ensure security</li>
                    </ul>
                </div>
                <div className="info-section">
                    <h2>🤝 Data Sharing</h2>
                    <p>We never sell your personal data. We only share data with trusted third parties who help us operate our service (e.g. delivery couriers, payment processors) under strict confidentiality agreements.</p>
                </div>
            </div>

            <div className="info-section">
                <h2>🛡️ Your Rights</h2>
                <ul>
                    <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
                    <li><strong>Correction:</strong> Update incorrect information in your account settings.</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time.</li>
                </ul>
            </div>

            <div className="info-section">
                <h2>🍪 Cookies</h2>
                <p>We use essential cookies to keep you logged in and functional cookies to improve performance. You can disable non-essential cookies in your browser settings. Note that disabling cookies may affect your shopping experience.</p>
            </div>

            <div className="info-section">
                <h2>📅 Policy Updates</h2>
                <p>We may update this policy from time to time. We will notify you of significant changes via email. Last updated: <strong>March 2026</strong>.</p>
            </div>

            <div className="info-section" style={{ textAlign: 'center' }}>
                <h2>Questions about your privacy?</h2>
                <a href="mailto:privacy@fashionstore.com" className="info-btn">Contact Privacy Team</a>
            </div>
        </div>
    );
}
