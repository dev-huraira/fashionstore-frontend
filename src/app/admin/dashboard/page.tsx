'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';
import { STATUS_COLORS } from '@/lib/orderConstants';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';

type Stats = {
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalCoupons: number;
    totalRevenue: number;
    recentOrders: any[];
};



export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/admin/stats`, {
                    credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
                setStats(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = stats ? [
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: '💰', color: '#febd69' },
        { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: '📦', color: '#4caf50' },
        { label: 'Total Products', value: stats.totalProducts.toLocaleString(), icon: '👗', color: '#2196f3' },
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥', color: '#9c27b0' },
        { label: 'Active Coupons', value: stats.totalCoupons.toLocaleString(), icon: '🏷️', color: '#ff5722' },
    ] : [];

    return (
        <AdminGuard>
            <div className="admin-container">
                <AdminSidebar activePage="dashboard" />

                <div className="main-content">
                    <header className="admin-header">
                        <h1>Dashboard Overview</h1>
                        <div className="user-profile">Admin User</div>
                    </header>

                    {error && <div style={{ color: '#d00', padding: '1rem', background: '#fff5f5', borderRadius: 6, marginBottom: '1rem' }}>⚠️ {error}</div>}

                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Loading dashboard data...</div>
                    ) : (
                        <>
                            {/* ── Stats Cards ── */}
                            <div className="dashboard-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                                {cards.map(card => (
                                    <div key={card.label} className="card" style={{ borderTop: `4px solid ${card.color}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>{card.label}</h3>
                                            <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                                        </div>
                                        <p className="card-value" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#232f3e', margin: 0 }}>{card.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ── Quick Links ── */}
                            <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Manage Products', href: '/admin/products', icon: '👗' },
                                    { label: 'Manage Orders', href: '/admin/orders', icon: '📦' },
                                    { label: 'Manage Users', href: '/admin/users', icon: '👥' },
                                    { label: 'Manage Coupons', href: '/admin/coupons', icon: '🏷️' },
                                ].map(link => (
                                    <Link key={link.href} href={link.href} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                        background: '#232f3e', color: '#fff', padding: '0.6rem 1.25rem',
                                        borderRadius: 6, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                                        transition: 'background 0.2s'
                                    }}
                                        onMouseOver={e => (e.currentTarget.style.background = '#37475a')}
                                        onMouseOut={e => (e.currentTarget.style.background = '#232f3e')}
                                    >
                                        {link.icon} {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* ── Recent Orders ── */}
                            <div className="dashboard-charts">
                                <div className="chart-container" style={{ width: '100%' }}>
                                    <h3>Recent Orders</h3>
                                    {stats?.recentOrders?.length === 0 ? (
                                        <p style={{ color: '#888', padding: '1rem 0' }}>No orders yet.</p>
                                    ) : (
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats?.recentOrders?.map((order: any) => (
                                                    <tr key={order._id}>
                                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                            #{order._id.slice(-6).toUpperCase()}
                                                        </td>
                                                        <td>{order.user?.name || 'Unknown'}</td>
                                                        <td>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                        <td>${(order.totalAmount || 0).toFixed(2)}</td>
                                                        <td>
                                                            <span className={`status ${order.status}`} style={{
                                                                background: STATUS_COLORS[order.status] || '#999',
                                                                color: '#fff', padding: '2px 10px',
                                                                borderRadius: 12, fontSize: '0.8rem', fontWeight: 600
                                                            }}>
                                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                    <Link href="/admin/orders" style={{ display: 'inline-block', marginTop: '1rem', color: '#f90', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                                        View all orders →
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
