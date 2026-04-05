import './page.css';

export default function HelpPage() {
    const faqs = [
        { q: 'How do I track my order?', a: 'Go to "Your Orders" in your account dashboard. You will see a live tracking status for every order placed.' },
        { q: 'Can I change or cancel my order?', a: 'Orders can be changed or cancelled within 1 hour of placing them. Contact support immediately if you need to make a change.' },
        { q: 'What payment methods are accepted?', a: 'We accept Visa, Mastercard, and Cash on Delivery (COD). All card payments are encrypted and secured via Stripe.' },
        { q: 'How long does delivery take?', a: 'Standard orders arrive next day. Remote areas may take 2–3 business days. International orders take 7–14 days.' },
        { q: 'How do I return a product?', a: 'Visit our Returns & Replacements page and fill in the return form. We will arrange a free pickup within 30 days of purchase.' },
        { q: 'I received a wrong item. What do I do?', a: 'We are sorry! Please contact us within 48 hours with your order number and we will send the correct item at no extra charge.' },
    ];

    return (
        <div className="help-page">

            {/* Hero */}
            <div className="help-hero">
                <div className="help-hero-badge">⚡ Typically respond within 2 hours</div>
                <h1>Help & Customer Service</h1>
                <p>We are here for you 24/7. Browse our FAQ or reach out directly — we always respond fast.</p>
            </div>

            {/* Contact Cards */}
            <div className="help-contact-grid">
                <div className="help-contact-card">
                    <span className="help-contact-card-icon">💬</span>
                    <h3>Live Chat</h3>
                    <p>Available 24/7 on our website. Instant replies guaranteed.</p>
                </div>
                <div className="help-contact-card">
                    <span className="help-contact-card-icon">📧</span>
                    <h3>Email Us</h3>
                    <a href="mailto:huraira3076@gmail.com">huraira3076@gmail.com</a>
                </div>
                <div className="help-contact-card">
                    <span className="help-contact-card-icon">📞</span>
                    <h3>Call Us</h3>
                    <a href="tel:+923326871681">+92 332 6871681</a>
                </div>
            </div>

            {/* FAQ */}
            <div className="help-section">
                <div className="help-section-title">
                    <span>❓</span> Frequently Asked Questions
                </div>
                {faqs.map((faq, i) => (
                    <div key={i} className="help-faq-item">
                        <p className="help-faq-q">{faq.q}</p>
                        <p className="help-faq-a">{faq.a}</p>
                    </div>
                ))}
            </div>

            {/* CTA — Email Support */}
            <div className="help-cta-section">
                <h2>Still need help?</h2>
                <p>Our support team is standing by. Send us an email or give us a call — we will get back to you as fast as possible.</p>
                <div className="help-btn-group">
                    <a href="mailto:huraira3076@gmail.com" className="help-email-btn">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        Email Support
                    </a>
                    <a href="tel:+923326871681" className="help-phone-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Call Us Now
                    </a>
                </div>
                <div className="help-response-badge">
                    ✅ &nbsp;Average response time: under 2 hours
                </div>
            </div>

        </div>
    );
}
