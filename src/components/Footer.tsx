'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';

export default function Footer() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            {/* Floating scroll-to-top button */}
            {visible && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="scroll-to-top-btn"
                    aria-label="Back to top"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>
            )}

        <footer className="footer">

            {/* Main columns */}
            <div className="footer-columns container">

                {/* Column 1 — Brand + Newsletter */}
                <div className="footer-col">
                    <Logo size="md" linked={true} style={{ marginBottom: '0.8rem' }} />
                    <p className="footer-tagline">Premium fashion for every occasion. Fast delivery, easy returns.</p>
                    <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                        <p className="newsletter-label">Subscribe to our newsletter</p>
                        <div className="newsletter-row">
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit">Subscribe</button>
                        </div>
                    </form>
                </div>

                {/* Column 2 — Get to Know Us */}
                <div className="footer-col">
                    <h4>Get to Know Us</h4>
                    <ul>
                        <li><a href="/about">About FashionStore</a></li>
                        <li><a href="/careers">Careers</a></li>
                        <li><a href="/about">Press Center</a></li>
                        <li><a href="/about">Investor Relations</a></li>
                        <li><a href="/shipping">Sustainability</a></li>
                        <li><a href="/developer">👨‍💻 Meet the Developer</a></li>
                    </ul>
                </div>

                {/* Column 3 — Shop With Us */}
                <div className="footer-col">
                    <h4>Shop With Us</h4>
                    <ul>
                        <li><a href="/category/men">Men&apos;s Fashion</a></li>
                        <li><a href="/category/women">Women&apos;s Fashion</a></li>
                        <li><a href="/category/kids">Kids&apos; Fashion</a></li>
                        <li><a href="/search">Best Sellers</a></li>
                        <li><a href="/search">New Arrivals</a></li>
                        <li><a href="/search">Sale &amp; Deals</a></li>
                    </ul>
                </div>

                {/* Column 4 — Let Us Help */}
                <div className="footer-col">
                    <h4>Let Us Help You</h4>
                    <ul>
                        <li><a href="/orders">Your Orders</a></li>
                        <li><a href="/cart">Your Cart</a></li>
                        <li><a href="/profile">Your Account</a></li>
                        <li><a href="/returns">Returns &amp; Replacements</a></li>
                        <li><a href="/shipping">Shipping Rates &amp; Policies</a></li>
                        <li><a href="/help">Help &amp; Customer Service</a></li>
                        <li><a href="mailto:huraira3076@gmail.com">📧 huraira3076@gmail.com</a></li>
                        <li><a href="tel:+923326871681">📞 +92 332 6871681</a></li>
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div className="footer-divider" />

            {/* Bottom bar */}
            <div className="footer-bottom container">
                <div className="footer-bottom-left">
                    <Logo size="sm" linked={true} style={{ opacity: 0.9 }} />
                    <span className="footer-copyright">© 2026 FashionStore. All rights reserved.</span>
                </div>
                <div className="footer-payment-icons">
                    <span title="Visa">💳 Visa</span>
                    <span title="Mastercard">💳 Mastercard</span>
                    <span title="PayPal">🅿 PayPal</span>
                    <span title="Cash on Delivery">💵 COD</span>
                </div>
                <div className="footer-bottom-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Use</a>
                    <a href="/privacy">Cookies</a>
                </div>
            </div>
        </footer>
        </>
    );
}
