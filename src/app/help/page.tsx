import '../info-pages.css';

export default function HelpPage() {
    const faqs = [
        { q: 'How do I track my order?', a: 'Go to "Your Orders" in your account dashboard. You will see a tracking status for every order.' },
        { q: 'Can I change or cancel my order?', a: 'Orders can be changed or cancelled within 1 hour of placing them. Contact support immediately if you need to make a change.' },
        { q: 'What payment methods are accepted?', a: 'We accept Visa, Mastercard, PayPal, and Cash on Delivery (COD).' },
        { q: 'How long does delivery take?', a: 'Standard orders arrive next day. Remote areas may take 2–3 business days.' },
        { q: 'How do I return a product?', a: 'Visit our Returns & Replacements page and fill in the return form. We will arrange a free pickup.' },
        { q: 'I received a wrong item. What do I do?', a: 'We are sorry! Please contact us within 48 hours and we will send the correct item at no extra charge.' },
    ];

    return (
        <div className="info-page">
            <div className="info-hero">
                <h1>Help &amp; Customer Service</h1>
                <p>We are here for you 24/7. Browse our FAQ or reach out directly — we typically respond within 2 hours.</p>
            </div>

            {/* Contact Cards */}
            <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '1.5rem' }}>
                <div className="contact-card">
                    <div className="icon">💬</div>
                    <h3>Live Chat</h3>
                    <p>Available 24/7 on our website</p>
                </div>
                <div className="contact-card">
                    <div className="icon">📧</div>
                    <h3>Email Us</h3>
                    <p><a href="mailto:huraira3076@gmail.com" style={{color:'inherit'}}>huraira3076@gmail.com</a></p>
                </div>
                <div className="contact-card">
                    <div className="icon">📞</div>
                    <h3>Call Us</h3>
                    <p><a href="tel:+923326871681" style={{color:'inherit'}}>+92 332 6871681</a></p>
                </div>
            </div>

            <div className="info-section">
                <h2>❓ Frequently Asked Questions</h2>
                {faqs.map((faq, i) => (
                    <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #f0f0f0' : 'none', paddingBottom: '1rem', marginBottom: '1rem' }}>
                        <p style={{ fontWeight: 700, color: '#232f3e', marginBottom: '0.3rem' }}>{faq.q}</p>
                        <p style={{ marginTop: 0 }}>{faq.a}</p>
                    </div>
                ))}
            </div>

            <div className="info-section" style={{ textAlign: 'center' }}>
                <h2>Still need help?</h2>
                <p>Our team is always ready to assist. Send us an email and we will get back to you right away.</p>
                <a href="mailto:huraira3076@gmail.com" className="info-btn">Email Support</a>
            </div>
        </div>
    );
}
