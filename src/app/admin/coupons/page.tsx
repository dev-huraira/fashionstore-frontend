'use client';

import { useState, useEffect } from 'react';
import '../products/products.css';
import { API_BASE } from '@/lib/api';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

type Coupon = {
    _id: string;
    code: string;
    discount: number;
    expiryDate: string;
    active: boolean;
};

const emptyForm = { code: '', discount: 10, expiryDate: '', active: true };

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteTargetCode, setDeleteTargetCode] = useState('');
    const [deleting, setDeleting] = useState(false);


    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/coupons`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setCoupons(data);
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const openCreate = () => { setEditingCoupon(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (c: Coupon) => {
        setEditingCoupon(c);
        setForm({ code: c.code, discount: c.discount, expiryDate: c.expiryDate.slice(0, 10), active: c.active });
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingCoupon
                ? `${API_BASE}/api/coupons/${editingCoupon._id}`
                : `${API_BASE}/api/coupons`;
            const method = editingCoupon ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setShowModal(false);
            fetchCoupons();
        } catch (e: any) { alert(e.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!deleteTargetId) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_BASE}/api/coupons/${deleteTargetId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error((await res.json()).message);
            setCoupons(prev => prev.filter(c => c._id !== deleteTargetId));
            setDeleteTargetId(null);
        } catch (e: any) {
            setDeleteTargetId(null);
            alert(e.message);
        } finally {
            setDeleting(false);
        }
    };

    const toggleActive = async (c: Coupon) => {
        try {
            const res = await fetch(`${API_BASE}/api/coupons/${c._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ active: !c.active }),
            });
            if (!res.ok) throw new Error((await res.json()).message);
            setCoupons(prev => prev.map(x => x._id === c._id ? { ...x, active: !c.active } : x));
        } catch (e: any) { alert(e.message); }
    };

    const isExpired = (date: string) => new Date(date) < new Date();

    return (
        <AdminGuard>
            <div className="admin-container">
                <AdminSidebar activePage="coupons" />

                <div className="main-content">
                    <header className="admin-header">
                        <h1>Coupon Management</h1>
                        <button className="btn-primary add-product-btn" onClick={openCreate}>+ Create New Coupon</button>
                    </header>

                    {error && <div style={{ color: '#d00', padding: '1rem', background: '#fff5f5', borderRadius: 6, marginBottom: '1rem' }}>⚠️ {error}</div>}

                    <div className="table-container">
                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Loading coupons...</div>
                        ) : coupons.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No coupons yet. Click &quot;+ Create New Coupon&quot; to add one.</div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Discount (%)</th>
                                        <th>Expiry Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map(c => {
                                        const expired = isExpired(c.expiryDate);
                                        const statusLabel = expired ? 'Expired' : c.active ? 'Active' : 'Inactive';
                                        const statusColor = expired ? '#d00' : c.active ? '#1e8c45' : '#f0a500';
                                        return (
                                            <tr key={c._id}>
                                                <td><strong style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: 1 }}>{c.code}</strong></td>
                                                <td><span style={{ fontWeight: 700, color: '#f90' }}>{c.discount}% OFF</span></td>
                                                <td>{new Date(c.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                <td>
                                                    <span style={{ background: statusColor, color: '#fff', padding: '2px 12px', borderRadius: 12, fontSize: '0.82rem', fontWeight: 600 }}>
                                                        {statusLabel}
                                                    </span>
                                                </td>
                                                <td className="actions">
                                                    <button className="btn-edit" onClick={() => openEdit(c)}>Edit</button>
                                                    <button
                                                        className="btn-edit"
                                                        style={{ color: c.active ? '#d00' : '#1e8c45', borderColor: c.active ? '#ffcdd2' : '#c8e6c9' }}
                                                        onClick={() => toggleActive(c)}
                                                    >
                                                        {c.active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => { setDeleteTargetId(c._id); setDeleteTargetCode(c.code); }}
                                                    >Delete</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Coupon Code</label>
                                <input
                                    required
                                    placeholder="E.g. SAVE20"
                                    value={form.code}
                                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                    disabled={!!editingCoupon}
                                    style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: 1 }}
                                />
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>Customers enter this code at checkout</small>
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Discount (%)</label>
                                    <input
                                        type="number" required min={1} max={100}
                                        value={form.discount}
                                        onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input
                                        type="date" required
                                        value={form.expiryDate}
                                        onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox" id="active"
                                    checked={form.active}
                                    onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                                    style={{ width: 'auto' }}
                                />
                                <label htmlFor="active" style={{ margin: 0 }}>Active (customers can use this coupon)</label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : editingCoupon ? 'Save Changes' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmModal
                isOpen={!!deleteTargetId}
                title="Delete Coupon"
                message={`Are you sure you want to delete coupon "${deleteTargetCode}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTargetId(null)}
                loading={deleting}
            />
        </AdminGuard>
    );
}
