import type { Metadata } from 'next';
import './developer.css';

export const metadata: Metadata = {
    title: 'Meet the Developer — Muhammad Huraira | FashionStore',
    description: 'Muhammad Huraira is the Full Stack Web Developer behind FashionStore. Explore his skills in React, Next.js, Node.js, MongoDB, and more.',
};

const skills = [
    {
        icon: '⚛️',
        name: 'Frontend Development',
        desc: 'Building blazing-fast, pixel-perfect interfaces with React & Next.js, backed by TypeScript for type safety.',
        level: 'Expert',
        pct: 93,
        tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'CSS3'],
        colorA: '#6366f1',
        colorB: '#818cf8',
    },
    {
        icon: '🟢',
        name: 'Backend Development',
        desc: 'Designing scalable REST APIs and server-side logic with Node.js, Express, and JWT-based authentication.',
        level: 'Expert',
        pct: 90,
        tags: ['Node.js', 'Express.js', 'REST API', 'JWT', 'Middleware'],
        colorA: '#22c55e',
        colorB: '#4ade80',
    },
    {
        icon: '🍃',
        name: 'Database & Cloud',
        desc: 'Designing efficient data models in MongoDB with Mongoose, plus cloud file storage via Cloudinary.',
        level: 'Advanced',
        pct: 87,
        tags: ['MongoDB', 'Mongoose', 'Cloudinary', 'Firebase'],
        colorA: '#f97316',
        colorB: '#fb923c',
    },
    {
        icon: '🛡️',
        name: 'Authentication & Security',
        desc: 'Implementing secure, production-ready auth flows — HTTP-only cookies, role-based access, bcrypt hashing.',
        level: 'Advanced',
        pct: 88,
        tags: ['HTTP Cookies', 'bcrypt', 'RBAC', 'Secure Headers'],
        colorA: '#ec4899',
        colorB: '#f472b6',
    },
    {
        icon: '💳',
        name: 'Payment Integration',
        desc: 'Integrating Stripe Payment Intents for card payments alongside Cash on Delivery workflows.',
        level: 'Advanced',
        pct: 85,
        tags: ['Stripe API', 'Payment Intents', 'Webhooks', 'COD'],
        colorA: '#8b5cf6',
        colorB: '#a78bfa',
    },
    {
        icon: '🚀',
        name: 'DevOps & Tooling',
        desc: 'Version control, environment configuration, and build optimization for production deployments.',
        level: 'Intermediate',
        pct: 80,
        tags: ['Git', 'GitHub', 'Vercel', 'npm', 'ESLint'],
        colorA: '#3b82f6',
        colorB: '#60a5fa',
    },
];

const projects = [
    {
        icon: '🛍️',
        name: 'FashionStore E-Commerce Platform',
        desc: 'A fully-featured, production-ready multi-category fashion store with cart, wishlist, coupon system, Stripe payments, admin panel, real-time order management, and HTTP-only cookie authentication.',
        badge: 'Live',
        tags: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Botpress'],
        url: 'https://fashionsstore.vercel.app/',
    },
    {
        icon: '⚡',
        name: 'SharePulse — Secure File Sharing',
        desc: 'A fast and privacy-first file-sharing platform. Upload a file and get a unique 6-digit one-time key. The receiver enters the key to instantly download — key auto-expires after 10 minutes or one successful download.',
        badge: 'Live',
        tags: ['React', 'Vercel', 'One-Time Keys', 'Auto-Expiry', 'Privacy'],
        url: 'https://share-pulse.vercel.app/',
    },
    {
        icon: '🖼️',
        name: 'PixAura — All-in-One Image Tools',
        desc: 'A modern image utility web app — compress, resize, convert (PNG/JPG/WebP), and crop images without quality loss. Every tool you need for your images, all in one place.',
        badge: 'Live',
        tags: ['React', 'Next.js', 'Image Processing', 'Vercel', 'WebP'],
        url: 'https://pix-aura.vercel.app/',
    },
    {
        icon: '🤖',
        name: 'AI Chatbot Integration',
        desc: 'Custom-built FAQ chatbot with a dynamic knowledge base, fuzzy keyword matching, typing animation, and Botpress webchat for production AI support — all without backend API calls.',
        badge: 'Shipped',
        tags: ['Botpress', 'NLP', 'Next.js', 'Custom Knowledge Base'],
        url: null,
    },
    {
        icon: '🔐',
        name: 'Secure Cookie Auth System',
        desc: 'Migrated from localStorage JWT tokens to a fully server-managed HTTP-only cookie auth flow with role-based access control, admin middleware, and centralized AuthContext.',
        badge: 'Production',
        tags: ['HTTP Cookies', 'RBAC', 'JWT', 'bcrypt', 'Express'],
        url: null,
    },
];

export default function DeveloperPage() {
    return (
        <div className="dev-page">

            {/* ── Hero ── */}
            <section className="dev-hero">
                <div className="dev-hero-inner">

                    {/* Avatar */}
                    <div className="dev-avatar-wrapper">
                        <div className="dev-avatar-ring">
                            <img
                                src="/Huraira.jpg"
                                alt="Muhammad Huraira"
                                className="dev-avatar"
                            />
                        </div>
                        <div className="dev-status-dot" title="Available for work" />
                    </div>

                    {/* Identity */}
                    <h1 className="dev-name">Muhammad Huraira</h1>
                    <span className="dev-title">Full Stack Web Developer</span>

                    <p className="dev-bio">
                        I design and build end-to-end web applications — from elegant, responsive
                        user interfaces to secure, high-performance backend APIs. I built FashionStore
                        from the ground up using React, Next.js, Node.js, and MongoDB.
                    </p>

                    {/* CTAs */}
                    <div className="dev-hero-btns">
                        <a
                            href="mailto:huraira3076@gmail.com"
                            className="dev-btn-primary"
                            id="hero-email-btn"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"/>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                            Send Me an Email
                        </a>
                        <a
                            href="tel:+923326871681"
                            className="dev-btn-secondary"
                            id="hero-phone-btn"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.67 9.16a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.78 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            Call Me
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <div className="dev-stats-bar">
                <div className="dev-stats-inner">
                    <div className="dev-stat">
                        <span className="dev-stat-num">3+</span>
                        <span className="dev-stat-label">Years Coding</span>
                    </div>
                    <div className="dev-stat">
                        <span className="dev-stat-num">5+</span>
                        <span className="dev-stat-label">Projects Live</span>
                    </div>
                    <div className="dev-stat">
                        <span className="dev-stat-num">6</span>
                        <span className="dev-stat-label">Core Skills</span>
                    </div>
                    <div className="dev-stat">
                        <span className="dev-stat-num">100%</span>
                        <span className="dev-stat-label">Passion</span>
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="dev-content">

                {/* Skills */}
                <section aria-labelledby="skills-heading">
                    <div className="dev-section-heading">
                        <span />
                        <h2 id="skills-heading">Technical Skills</h2>
                    </div>

                    <div className="dev-skills-grid">
                        {skills.map((sk) => (
                            <div
                                key={sk.name}
                                className="dev-skill-card"
                                style={{
                                    '--card-color-a': sk.colorA,
                                    '--card-color-b': sk.colorB,
                                } as React.CSSProperties}
                            >
                                <span className="dev-skill-icon">{sk.icon}</span>
                                <div className="dev-skill-name">{sk.name}</div>
                                <p className="dev-skill-desc">{sk.desc}</p>

                                <div className="dev-skill-bar-row">
                                    <span className="dev-skill-level">{sk.level}</span>
                                    <span className="dev-skill-level">{sk.pct}%</span>
                                </div>
                                <div className="dev-skill-bar">
                                    <div
                                        className="dev-skill-fill"
                                        style={{ width: `${sk.pct}%` }}
                                    />
                                </div>

                                <div className="dev-tech-tags">
                                    {sk.tags.map((t) => (
                                        <span key={t} className="dev-tech-tag">{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                <section aria-labelledby="projects-heading">
                    <div className="dev-section-heading">
                        <span />
                        <h2 id="projects-heading">Featured Projects</h2>
                    </div>

                    {projects.map((p) => (
                        p.url ? (
                            <a
                                key={p.name}
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dev-project-card dev-project-card--link"
                            >
                                <div className="dev-project-icon">{p.icon}</div>
                                <div className="dev-project-info">
                                    <h3>
                                        {p.name}
                                        <span className="dev-project-ext-icon" aria-label="Opens in new tab">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                        </span>
                                    </h3>
                                    <p>{p.desc}</p>
                                    <div className="dev-project-footer">
                                        <span className="dev-project-badge">✓ {p.badge}</span>
                                        {p.tags.map((t: string) => (
                                            <span key={t} className="dev-tech-tag">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </a>
                        ) : (
                            <div key={p.name} className="dev-project-card">
                                <div className="dev-project-icon">{p.icon}</div>
                                <div className="dev-project-info">
                                    <h3>{p.name}</h3>
                                    <p>{p.desc}</p>
                                    <div className="dev-project-footer">
                                        <span className="dev-project-badge">✓ {p.badge}</span>
                                        {p.tags.map((t: string) => (
                                            <span key={t} className="dev-tech-tag">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </section>

                {/* Contact */}
                <section className="dev-contact-section" aria-labelledby="contact-heading">
                    <h2 id="contact-heading">Let&apos;s Work Together</h2>
                    <p>
                        Have a project in mind? Looking for a dedicated Full Stack Developer?
                        <br />I&apos;m available for freelance projects and full-time opportunities.
                    </p>

                    <div className="dev-contact-cards">
                        <a
                            href="mailto:huraira3076@gmail.com"
                            className="dev-contact-card"
                            id="contact-email-card"
                        >
                            <span className="dev-contact-card-icon">📧</span>
                            <div className="dev-contact-card-info">
                                <strong>Email</strong>
                                <span>huraira3076@gmail.com</span>
                            </div>
                        </a>

                        <a
                            href="tel:+923326871681"
                            className="dev-contact-card"
                            id="contact-phone-card"
                        >
                            <span className="dev-contact-card-icon">📞</span>
                            <div className="dev-contact-card-info">
                                <strong>Phone</strong>
                                <span>+92 332 6871681</span>
                            </div>
                        </a>
                    </div>

                    <a
                        href="mailto:huraira3076@gmail.com?subject=Project%20Inquiry%20—%20FashionStore&body=Hi%20Huraira%2C%0A%0AI%20came%20across%20your%20profile%20on%20FashionStore%20and%20would%20love%20to%20discuss%20a%20project%20with%20you.%0A%0A"
                        className="dev-btn-primary"
                        id="contact-main-btn"
                        style={{ display: 'inline-flex', margin: '0 auto' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                        Open Gmail — Let&apos;s Talk!
                    </a>
                </section>

            </div>
        </div>
    );
}
