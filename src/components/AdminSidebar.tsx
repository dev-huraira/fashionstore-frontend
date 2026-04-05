'use client';

import { useState } from 'react';
import Link from 'next/link';

type Props = { activePage: 'dashboard' | 'products' | 'orders' | 'users' | 'coupons' };

const NAV = [
    { label: 'Dashboard', href: '/admin/dashboard', page: 'dashboard', icon: '📊' },
    { label: 'Products',  href: '/admin/products', page: 'products', icon: '👗' },
    { label: 'Orders',    href: '/admin/orders', page: 'orders',  icon: '📦' },
    { label: 'Users',     href: '/admin/users', page: 'users',   icon: '👥' },
    { label: 'Coupons',   href: '/admin/coupons', page: 'coupons', icon: '🏷️' },
];

export default function AdminSidebar({ activePage }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* ── Hamburger button (mobile only) ── */}
            <button
                className="admin-hamburger"
                onClick={() => setOpen(true)}
                aria-label="Open admin menu"
            >
                <span /><span /><span />
            </button>

            {/* ── Overlay (mobile only) ── */}
            {open && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <div className={`sidebar ${open ? 'sidebar-open' : ''}`}>
                {/* Close button (mobile only) */}
                <button
                    className="admin-sidebar-close"
                    onClick={() => setOpen(false)}
                    aria-label="Close admin menu"
                >✕</button>

                <h2 className="sidebar-logo">Admin Panel</h2>

                <ul className="sidebar-nav">
                    {NAV.map(item => (
                        <li key={item.page} className={activePage === item.page ? 'active' : ''}>
                            <Link href={item.href} onClick={() => setOpen(false)}>
                                <span>{item.icon}</span> {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* User View — opens storefront as guest in new tab */}
                <div className="sidebar-user-view">
                    <button
                        className="user-view-btn"
                        onClick={() => window.open('/?guest=1', '_blank', 'noopener')}
                    >
                        <span>👁</span> User View
                    </button>
                </div>
            </div>
        </>
    );
}
