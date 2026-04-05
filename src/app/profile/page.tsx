'use client';

import './page.css';
import '../orders/page.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push('/login?message=Sign in to access your account&redirect=/profile');
        }
    }, [user, loading, router]);

    const userName = user?.name?.split(' ')[0] || 'there';

    const cards = [
        { href: '/orders', icon: '📦', title: 'Your Orders', desc: 'Track, return, or buy things again' },
        { href: '/profile/login-security', icon: '🛡️', title: 'Login & Security', desc: 'Edit login, name, and mobile number' },
        { href: '/developer', icon: '👨‍💻', title: 'Meet the Developer', desc: 'Learn about the developer who built FashionStore' },
        { href: '/profile/addresses', icon: '📍', title: 'Your Addresses', desc: 'Edit addresses for orders and gifts' },
        { href: '/profile/payments', icon: '💳', title: 'Your Payments', desc: 'Manage payment methods and settings' },
        { href: '/help', icon: '✉️', title: 'Customer Service', desc: 'Browse self service options, help articles or contact us' },
    ];

    return (
        <div className="container profile-page-wrapper">
            <div className="profile-greeting">
                <h1>Hello, {userName} 👋</h1>
                <p>Manage your FashionStore account, orders, and preferences</p>
            </div>

            <div className="account-grid">
                {cards.map(card => (
                    <a key={card.href} href={card.href} className="account-card">
                        <div className="account-card-icon">{card.icon}</div>
                        <div className="account-card-content">
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>
                        </div>
                        <span className="account-card-arrow">›</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
