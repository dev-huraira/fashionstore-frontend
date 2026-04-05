'use client';

import '../profile-section.css';
import '../../orders/page.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

interface Address {
    _id: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

const EMPTY_FORM = { fullName: '', phone: '', address: '', city: '', postalCode: '', country: '', isDefault: false };

function AddressForm({
    initial,
    onSave,
    onCancel,
    saving,
    error,
}: {
    initial: typeof EMPTY_FORM;
    onSave: (data: typeof EMPTY_FORM) => void;
    onCancel: () => void;
    saving: boolean;
    error: string;
}) {
    const [form, setForm] = useState(initial);
    const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div className="ps-edit-form" style={{ padding: '1.25rem 1.35rem' }}>
            {[
                { key: 'fullName', label: 'Full Name', type: 'text', required: true },
                { key: 'phone', label: 'Phone Number', type: 'tel', required: false },
                { key: 'address', label: 'Street Address', type: 'text', required: true },
                { key: 'city', label: 'City', type: 'text', required: true },
                { key: 'postalCode', label: 'Postal Code', type: 'text', required: true },
                { key: 'country', label: 'Country', type: 'text', required: true },
            ].map(({ key, label, type, required }) => (
                <div key={key}>
                    <label>{label}{required && ' *'}</label>
                    <input
                        type={type}
                        value={(form as any)[key]}
                        onChange={e => set(key, e.target.value)}
                        required={required}
                    />
                </div>
            ))}
            <div style={{ marginTop: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                    type="checkbox"
                    id="isDefault"
                    checked={form.isDefault}
                    onChange={e => set('isDefault', e.target.checked)}
                    style={{ width: 'auto' }}
                />
                <label htmlFor="isDefault" style={{ marginTop: 0, fontWeight: 400, fontSize: '0.9rem' }}>
                    Make this my default address
                </label>
            </div>
            {error && <p className="ps-error">⚠ {error}</p>}
            <div className="ps-form-actions">
                <button className="ps-save-btn" onClick={() => onSave(form)} disabled={saving}>
                    {saving ? 'Saving…' : 'Save address'}
                </button>
                <button className="ps-cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default function AddressesPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/addresses`, { credentials: 'include' })
            .then(r => { if (r.status === 401) { router.push('/login?redirect=/profile/addresses'); return null; } return r.json(); })
            .then(data => { if (data) setAddresses(Array.isArray(data) ? data : []); })
            .catch(() => setAddresses([]))
            .finally(() => setLoading(false));
    }, [router]);

    const handleAdd = async (form: typeof EMPTY_FORM) => {
        setFormError(''); setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to add address');
            setAddresses(Array.isArray(data) ? data : []);
            setShowAddForm(false);
        } catch (e: any) {
            setFormError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = async (id: string, form: typeof EMPTY_FORM) => {
        setFormError(''); setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/addresses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update address');
            setAddresses(Array.isArray(data) ? data : []);
            setEditingId(null);
        } catch (e: any) {
            setFormError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/addresses/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAddresses(Array.isArray(data) ? data : []);
            setDeleteConfirm(null);
        } catch {}
    };

    const handleSetDefault = async (id: string) => {
        const addr = addresses.find(a => a._id === id);
        if (!addr) return;
        await handleEdit(id, { ...addr, isDefault: true });
    };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading…</div>;

    return (
        <div className="container profile-section-page">
            <a href="/profile" className="back-link">← Your Account</a>
            <h1>Your Addresses</h1>

            <div className="addr-cards-grid">
                {addresses.map(addr => (
                    <div key={addr._id} className={`addr-card${addr.isDefault ? ' default-addr' : ''}`}>
                        {addr.isDefault && <span className="addr-card-badge">Default</span>}
                        {editingId === addr._id ? (
                            <AddressForm
                                initial={{ fullName: addr.fullName, phone: addr.phone, address: addr.address, city: addr.city, postalCode: addr.postalCode, country: addr.country, isDefault: addr.isDefault }}
                                onSave={form => handleEdit(addr._id, form)}
                                onCancel={() => { setEditingId(null); setFormError(''); }}
                                saving={saving}
                                error={formError}
                            />
                        ) : (
                            <>
                                <p className="addr-card-name">{addr.fullName}</p>
                                <p>{addr.address}</p>
                                <p>{addr.city}, {addr.postalCode}</p>
                                <p>{addr.country}</p>
                                {addr.phone && <p>📞 {addr.phone}</p>}
                                <div className="addr-card-actions">
                                    <button className="addr-action-btn" onClick={() => { setEditingId(addr._id); setFormError(''); }}>Edit</button>
                                    {!addr.isDefault && (
                                        <button className="addr-action-btn" onClick={() => handleSetDefault(addr._id)}>
                                            Set as Default
                                        </button>
                                    )}
                                    <button className="addr-action-btn danger" onClick={() => setDeleteConfirm(addr._id)}>Remove</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Add address button / form */}
            {showAddForm ? (
                <div className="ps-card">
                    <div className="ps-card-header">
                        <h3>New Address</h3>
                    </div>
                    <AddressForm
                        initial={EMPTY_FORM}
                        onSave={handleAdd}
                        onCancel={() => { setShowAddForm(false); setFormError(''); }}
                        saving={saving}
                        error={formError}
                    />
                </div>
            ) : (
                <button className="add-addr-btn" onClick={() => setShowAddForm(true)}>
                    + Add a new address
                </button>
            )}

            {/* Delete confirmation */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
                        <h3 style={{ marginTop: 0 }}>Remove this address?</h3>
                        <p style={{ color: '#555', fontSize: '0.92rem' }}>Are you sure you want to remove this address? This cannot be undone.</p>
                        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                            <button className="ps-cancel-btn" onClick={() => setDeleteConfirm(null)}>Keep</button>
                            <button
                                className="ps-save-btn"
                                style={{ background: '#c40000' }}
                                onClick={() => handleDelete(deleteConfirm)}
                            >Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
