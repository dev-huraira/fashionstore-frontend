import '../info-pages.css';

export default function ReturnsPage() {
    return (
        <div className="info-page">
            <div className="info-hero">
                <h1>Returns &amp; Replacements</h1>
                <p>Not happy with your purchase? No problem. We offer a simple, hassle-free 30-day return policy on all items.</p>
            </div>

            <div className="info-grid">
                <div className="info-section">
                    <h2>✅ What can be returned?</h2>
                    <ul>
                        <li>Items in original, unworn condition</li>
                        <li>Items with original tags still attached</li>
                        <li>Items returned within 30 days of delivery</li>
                        <li>Defective or wrong items (anytime)</li>
                    </ul>
                </div>
                <div className="info-section">
                    <h2>❌ What cannot be returned?</h2>
                    <ul>
                        <li>Items marked <strong>Final Sale</strong></li>
                        <li>Worn, washed, or damaged items</li>
                        <li>Items without original packaging</li>
                        <li>Underwear and swimwear (hygiene)</li>
                    </ul>
                </div>
            </div>

            <div className="info-section">
                <h2>📋 How to Return — Step by Step</h2>
                <ol style={{ paddingLeft: '1.25rem', lineHeight: 2 }}>
                    <li>Go to <a href="/orders" style={{ color: '#f90' }}><strong>Your Orders</strong></a> and select the item you wish to return.</li>
                    <li>Click <strong>"Return or Replace Items"</strong> and select a reason.</li>
                    <li>Print the free prepaid return label we email you.</li>
                    <li>Pack the item securely and drop it at any courier location.</li>
                    <li>Your refund will be processed within <strong>5–7 business days</strong> after we receive the item.</li>
                </ol>
            </div>

            <div className="info-grid">
                <div className="info-section">
                    <h2>💳 Refund Methods</h2>
                    <ul>
                        <li>Original payment method (default)</li>
                        <li>FashionStore credit (instant)</li>
                        <li>Bank transfer (3–5 days)</li>
                    </ul>
                </div>
                <div className="info-section">
                    <h2>🔄 Replacements</h2>
                    <p>Need a different size or color? Select <strong>"Replace"</strong> instead of "Return" and we will ship the replacement for free once we receive the original item.</p>
                </div>
            </div>

            <div className="info-section" style={{ textAlign: 'center' }}>
                <h2>Need help with a return?</h2>
                <p>Our support team is available around the clock to assist you.</p>
                <a href="/help" className="info-btn">Contact Support</a>
            </div>
        </div>
    );
}
