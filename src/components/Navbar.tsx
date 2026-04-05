'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from './Logo';

const categories = [
  {
    label: 'Men',
    href: '/category/men',
    sub: [
      { label: 'Tops & Tees', href: '/category/men?sub=Tops+%26+Tees' },
      { label: 'Bottoms', href: '/category/men?sub=Bottoms' },
      { label: 'Activewear', href: '/category/men?sub=Activewear' },
      { label: 'Shoes', href: '/category/men?sub=Shoes' },
    ],
  },
  {
    label: 'Women',
    href: '/category/women',
    sub: [
      { label: 'Tops & Tees', href: '/category/women?sub=Tops+%26+Tees' },
      { label: 'Bottoms', href: '/category/women?sub=Bottoms' },
      { label: 'Activewear', href: '/category/women?sub=Activewear' },
      { label: 'Shoes', href: '/category/women?sub=Shoes' },
    ],
  },
  {
    label: 'Kids',
    href: '/category/kids',
    sub: [
      { label: 'Tops & Tees', href: '/category/kids?sub=Tops+%26+Tees' },
      { label: 'Bottoms', href: '/category/kids?sub=Bottoms' },
      { label: 'Activewear', href: '/category/kids?sub=Activewear' },
      { label: 'Shoes', href: '/category/kids?sub=Shoes' },
    ],
  },
];

export default function Navbar({ guestMode = false }: { guestMode?: boolean }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCatIndex, setOpenCatIndex] = useState<number | null>(null);
  const [navHidden, setNavHidden] = useState(false);
  const router = useRouter();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Close mobile menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      if (diff > 8) {
        // Scrolling down — hide
        setNavHidden(true);
        setMobileMenuOpen(false);
      } else if (diff < -8) {
        // Scrolling up — show
        setNavHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const confirmSignOut = async () => {
    setShowLogoutModal(false);
    await logout(); // calls backend /api/auth/logout, clears cookies, redirects to /
  };

  const cancelSignOut = () => setShowLogoutModal(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);
  const closeMobileMenu = () => { setMobileMenuOpen(false); setOpenCatIndex(null); };

  return (
    <>
      <header className={`navbar${navHidden ? ' navbar-hidden' : ''}`}>
        {/* ── Main Nav Bar ── */}
        <div className="nav-container container">

          {/* Hamburger (mobile only) */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>

          {/* Logo */}
          <div className="nav-logo">
            <Logo size="md" linked={true} />
          </div>

          {/* Mobile Cart (always visible on mobile, hidden for admin) */}
          {!(user?.role === 'admin') && (
          <a
            href="/cart"
            className="mobile-cart-btn"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                router.push('/login?message=Sign in to view your shopping cart&redirect=/cart');
              }
            }}
            aria-label="Cart"
          >
            <div className="cart-icon-wrapper" style={{ position: 'relative', display: 'flex' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </a>
          )}

          {/* Search */}
          {!guestMode && (
          <form onSubmit={handleSearch} className="nav-search">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              aria-label="Search products"
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>
          )}

          {/* Desktop Nav Links */}
          {!guestMode && (
          <div className="nav-links">
            {user ? (
              <div className="user-info-container">
                <div className="user-info" onClick={toggleDropdown}>
                  <span className="hello-text">Hello, {user?.name.split(' ')[0]}</span>
                  <span className="account-text">
                    Account
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-overlay" onClick={closeDropdown} />
                    <div className="dropdown-menu">
                      {user?.role !== 'admin' && (
                        <>
                          <Link href="/profile" onClick={closeDropdown}>Your Account</Link>
                          <Link href="/orders" onClick={closeDropdown}>Your Orders</Link>
                          <div className="dropdown-divider" />
                        </>
                      )}
                      {user?.role === 'admin' && (
                        <>
                          <Link href="/admin/dashboard" onClick={closeDropdown}>Admin Dashboard</Link>
                          <div className="dropdown-divider" />
                        </>
                      )}
                      <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="nav-item nav-signin-btn">Sign In</Link>
            )}


            {user?.role === 'admin' && (
              <Link href="/admin" className="nav-item admin-link">Admin</Link>
            )}

            {!(user?.role === 'admin') && (
            <a
              href="/wishlist"
              className="nav-item nav-icon-item"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  router.push('/login?message=Sign in to view your wishlist&redirect=/wishlist');
                }
              }}
              aria-label="Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="nav-icon-label">Wishlist</span>
            </a>
            )}

            {!(user?.role === 'admin') && (
            <a
              href="/cart"
              className="nav-item nav-icon-item cart-nav-item"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  router.push('/login?message=Sign in to view your shopping cart&redirect=/cart');
                }
              }}
              aria-label="Cart"
            >
              <div className="cart-icon-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span className="nav-icon-label">Cart</span>
            </a>
            )}
          </div>
          )}
        </div>

        {/* ── Secondary Nav (Desktop Categories) ── */}
        <nav className="nav-sub" aria-label="Categories">
          <ul>
            {categories.map((cat) => (
              <li key={cat.label} className="nav-sub-item">
                <Link href={cat.href}>{cat.label}</Link>
                <div className="nav-sub-dropdown">
                  <Link href={cat.href} className="nav-sub-all">All {cat.label}</Link>
                  {cat.sub.map((s) => (
                    <Link key={s.label} href={s.href}>{s.label}</Link>
                  ))}
                </div>
              </li>
            ))}
            <li><Link href="/best-sellers">Best Sellers</Link></li>
            <li><Link href="/search">New Arrivals</Link></li>
            <li><Link href="/search">Sale</Link></li>
          </ul>
        </nav>

        {/* ── Mobile Overlay ── */}
        {mobileMenuOpen && (
          <div className="mobile-overlay" onClick={closeMobileMenu} aria-hidden="true" />
        )}

        {/* ── Mobile Slide-In Menu ── */}
        <div
          ref={mobileMenuRef}
          className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
          aria-hidden={!mobileMenuOpen}
        >
          {/* Mobile Menu Header */}
          <div className="mobile-menu-header">
            <Logo size="sm" linked={false} />
            <button className="mobile-menu-close" onClick={closeMobileMenu} aria-label="Close menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mobile-search">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button type="submit" className="mobile-search-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>

          {/* Mobile User */}
          <div className="mobile-menu-user">
            {user ? (
              <span className="mobile-hello">Hello, {user.name.split(' ')[0]}!</span>
            ) : (
              <Link href="/login" onClick={closeMobileMenu} className="mobile-signin-btn">Sign In / Register</Link>
            )}
          </div>

          {/* Mobile Categories */}
          <div className="mobile-menu-section">
            <p className="mobile-menu-section-title">Shop by Category</p>
            {categories.map((cat, idx) => (
              <div key={cat.label} className="mobile-cat-group">
                <button
                  className="mobile-cat-header"
                  onClick={() => setOpenCatIndex(openCatIndex === idx ? null : idx)}
                  aria-expanded={openCatIndex === idx}
                >
                  <span>All {cat.label}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: openCatIndex === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.22s' }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openCatIndex === idx && (
                  <div className="mobile-cat-sub">
                    <Link href={cat.href} onClick={closeMobileMenu} className="mobile-cat-all-link">
                      → View All {cat.label}
                    </Link>
                    {cat.sub.map((s) => (
                      <Link key={s.label} href={s.href} onClick={closeMobileMenu} className="mobile-cat-sub-link">
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Nav Links */}
          <div className="mobile-menu-section">
            <p className="mobile-menu-section-title">My Account</p>
            {user && user.role !== 'admin' && (
              <>
                <Link href="/profile" onClick={closeMobileMenu} className="mobile-nav-link">Your Account</Link>
                <Link href="/orders" onClick={closeMobileMenu} className="mobile-nav-link">Your Orders</Link>
                <Link href="/wishlist" onClick={closeMobileMenu} className="mobile-nav-link">Wishlist</Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin/dashboard" onClick={closeMobileMenu} className="mobile-nav-link admin-link">Admin Dashboard</Link>
            )}
            {user && (
              <button
                onClick={() => { closeMobileMenu(); setShowLogoutModal(true); }}
                className="mobile-signout-btn"
              >
                Sign Out
              </button>
            )}
          </div>

          <div className="mobile-menu-section">
            <p className="mobile-menu-section-title">Explore</p>
            <Link href="/best-sellers" onClick={closeMobileMenu} className="mobile-nav-link">Best Sellers</Link>
            <Link href="/search" onClick={closeMobileMenu} className="mobile-nav-link">New Arrivals</Link>
            <Link href="/search" onClick={closeMobileMenu} className="mobile-nav-link">Sale & Deals</Link>
          </div>
        </div>

      </header>

      {/* ── Logout Modal (outside <header> to avoid stacking context clipping) ── */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Sign Out</h3>
            <p>Are you sure you want to sign out of your account?</p>
            <div className="modal-actions">
              <button onClick={cancelSignOut} className="btn-secondary">Cancel</button>
              <button onClick={confirmSignOut} className="btn-primary">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
