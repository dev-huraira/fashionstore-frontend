import '../info-pages.css';

export default function TermsPage() {
    return (
        <div className="info-page">
            <div className="info-hero">
                <h1>Terms of Use</h1>
                <p>Please read these terms carefully before using FashionStore. By accessing our website or placing an order, you agree to these terms.</p>
            </div>

            <div className="info-section">
                <h2>1. Acceptance of Terms</h2>
                <p>By using FashionStore, you confirm that you are at least 18 years old (or have parental consent) and agree to be bound by these Terms of Use and our Privacy Policy.</p>
            </div>

            <div className="info-section">
                <h2>2. Account Responsibilities</h2>
                <ul>
                    <li>You are responsible for maintaining the confidentiality of your account password.</li>
                    <li>You agree to provide accurate, current, and complete information during registration.</li>
                    <li>You must notify us immediately of any unauthorised use of your account.</li>
                    <li>We reserve the right to suspend accounts that violate these terms.</li>
                </ul>
            </div>

            <div className="info-section">
                <h2>3. Orders &amp; Payments</h2>
                <ul>
                    <li>By placing an order, you make an offer to purchase the selected items at the listed price.</li>
                    <li>We reserve the right to refuse or cancel any order for any reason, including pricing errors.</li>
                    <li>Prices are listed in USD and include applicable taxes unless stated otherwise.</li>
                    <li>Payment must be completed at checkout. Orders are confirmed only after payment is successfully processed.</li>
                </ul>
            </div>

            <div className="info-section">
                <h2>4. Intellectual Property</h2>
                <p>All content on this website — including text, images, logos, and graphics — is the property of FashionStore and protected by applicable copyright and trademark laws. You may not reproduce, distribute, or use any content without our written permission.</p>
            </div>

            <div className="info-section">
                <h2>5. Limitation of Liability</h2>
                <p>FashionStore shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service. Our total liability shall not exceed the amount paid for the relevant order.</p>
            </div>

            <div className="info-section">
                <h2>6. Changes to Terms</h2>
                <p>We may update these terms from time to time. Continued use of our service after changes constitutes your acceptance of the updated terms. Last updated: <strong>March 2026</strong>.</p>
            </div>

            <div className="info-section" style={{ textAlign: 'center' }}>
                <h2>Have a legal question?</h2>
                <a href="mailto:legal@fashionstore.com" className="info-btn">Contact Legal Team</a>
            </div>
        </div>
    );
}
