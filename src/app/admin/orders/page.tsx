'use client';

import { useState, useEffect } from 'react';
import './orders.css';
import { API_BASE } from '@/lib/api';
import { STATUS_COLORS, ALL_STATUSES } from '@/lib/orderConstants';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingId, setUpdatingId] = useState('');
    const [successId, setSuccessId] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/orders`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    // Apply search + status filter whenever orders, search or statusFilter change
    useEffect(() => {
        let result = orders;
        if (statusFilter !== 'all') {
            result = result.filter(o => o.status === statusFilter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(o =>
                o._id.toLowerCase().includes(q) ||
                o.user?.name?.toLowerCase().includes(q) ||
                o.user?.email?.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [search, statusFilter, orders]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        if (!newStatus || newStatus === 'update') return;
        setUpdatingId(orderId);
        try {
            const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to update status');
            }
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            setSuccessId(orderId);
            setTimeout(() => setSuccessId(''), 2500);
        } catch (err: any) {
            alert('Failed to update status: ' + err.message);
        } finally {
            setUpdatingId('');
        }
    };

    return (
        <AdminGuard>
            <div className="admin-container">
                <AdminSidebar activePage="orders" />

                <div className="main-content">
                    <header className="admin-header">
                        <h1>Order Management</h1>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
                        </span>
                    </header>

                    {error && (
                        <div style={{ color: '#d00', padding: '1rem', background: '#fff5f5', borderRadius: 6, marginBottom: '1rem' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="table-container">
                        <div className="table-filters">
                            <input
                                type="text"
                                placeholder="Search by Order ID or Customer..."
                                className="search-input"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                {ALL_STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                                Loading orders...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                No orders found.
                            </div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Update Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(order => (
                                        <tr key={order._id} style={{
                                            background: successId === order._id ? '#f0fff4' : undefined,
                                            transition: 'background 0.4s'
                                        }}>
                                            <td>
                                                <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </strong>
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </td>
                                            <td>
                                                <div>{order.user?.name || 'Unknown'}</div>
                                                <div className="text-small text-muted">
                                                    {order.user?.email || ''}
                                                </div>
                                            </td>
                                            <td>${(order.totalAmount || 0).toFixed(2)}</td>
                                            <td>{order.paymentMethod || 'N/A'}</td>
                                            <td>
                                                <span style={{
                                                    background: STATUS_COLORS[order.status] || '#999',
                                                    color: '#fff',
                                                    padding: '3px 12px',
                                                    borderRadius: 12,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                    display: 'inline-block'
                                                }}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                {successId === order._id ? (
                                                    <span style={{ color: '#1e8c45', fontSize: '0.85rem', fontWeight: 600 }}>
                                                        ✓ Updated
                                                    </span>
                                                ) : (
                                                    <select
                                                        className="status-update-select"
                                                        disabled={updatingId === order._id}
                                                        value="update"
                                                        onChange={e => handleStatusUpdate(order._id, e.target.value)}
                                                    >
                                                        <option value="update" disabled>
                                                            {updatingId === order._id ? 'Updating...' : 'Update Status...'}
                                                        </option>
                                                        {ALL_STATUSES
                                                            .filter(s => s !== order.status)
                                                            .map(s => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                    </select>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
