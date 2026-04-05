'use client';

import '../profile-section.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
}

function EditableRow({
    label,
    valueLabel,
    value,
    type = 'text',
    onSave,
}: {
    label: string;
    valueLabel: string;
    value: string;
    type?: string;
    onSave: (val: string) => Promise<string | null>;
}) {
    const [editing, setEditing] = useState(false);
    const [input, setInput] = useState(value);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => { setInput(value); }, [value]);

    const handleSave = async () => {
        setSaving(true); setSuccess(''); setError('');
        const err = await onSave(input);
        setSaving(false);
        if (err) { setError(err); }
        else { setSuccess('Saved successfully.'); setEditing(false); setTimeout(() => setSuccess(''), 3000); }
    };

    return (
        <div className="ps-card">
            <div className="ps-card-header">
                <div>
                    <h3>{label}</h3>
                    {!editing && <p>{valueLabel}: <strong>{value || 'Not set'}</strong></p>}
                    {success && <p className="ps-success">✓ {success}</p>}
                </div>
                <button className="ps-edit-btn" onClick={() => { setEditing(e => !e); setError(''); }}>
                    {editing ? 'Cancel' : 'Edit'}
                </button>
            </div>
            {editing && (
                <div className="ps-edit-form">
                    <label>New {label}</label>
                    <input
                        type={type}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                        autoFocus
                    />
                    {error && <p className="ps-error">⚠ {error}</p>}
                    <div className="ps-form-actions">
                        <button className="ps-save-btn" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving…' : 'Save changes'}
                        </button>
                        <button className="ps-cancel-btn" onClick={() => { setEditing(false); setInput(value); }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ChangePasswordCard() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (form.newPassword !== form.confirmPassword) { setError('New passwords do not match.'); return; }
        if (form.newPassword.length < 6) { setError('New password must be at least 6 characters.'); return; }
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to change password');
            setSuccess('Password changed successfully!');
            setOpen(false);
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(''), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="ps-card">
            <div className="ps-card-header">
                <div>
                    <h3>Password</h3>
                    {!open && <p>••••••••••••</p>}
                    {success && <p className="ps-success">✓ {success}</p>}
                </div>
                <button className="ps-edit-btn" onClick={() => { setOpen(o => !o); setError(''); }}>
                    {open ? 'Cancel' : 'Edit'}
                </button>
            </div>
            {open && (
                <form className="ps-edit-form" onSubmit={handleSubmit}>
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required autoFocus />
                    <label>New Password</label>
                    <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
                    <label>Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                    {error && <p className="ps-error">⚠ {error}</p>}
                    <div className="ps-form-actions">
                        <button type="submit" className="ps-save-btn" disabled={saving}>
                            {saving ? 'Saving…' : 'Save password'}
                        </button>
                        <button type="button" className="ps-cancel-btn" onClick={() => { setOpen(false); setForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function LoginSecurityPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile>({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' })
            .then(r => { if (r.status === 401) { router.push('/login?redirect=/profile/login-security'); return null; } return r.json(); })
            .then(data => {
                if (data) setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [router]);

    const updateField = (field: keyof UserProfile) => {
        return async (value: string): Promise<string | null> => {
            try {
                const res = await fetch(`${API_BASE}/api/auth/me`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ [field]: value }),
                });
                const data = await res.json();
                if (!res.ok) return data.message || 'Failed to save';
                setProfile(p => ({ ...p, [field]: value }));
                return null;
            } catch {
                return 'Something went wrong. Please try again.';
            }
        };
    };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading…</div>;

    return (
        <div className="container profile-section-page">
            <a href="/profile" className="back-link">← Your Account</a>
            <h1>Login &amp; Security</h1>

            <EditableRow
                label="Name"
                valueLabel="Name"
                value={profile.name}
                onSave={updateField('name')}
            />
            <EditableRow
                label="Email"
                valueLabel="Email"
                value={profile.email}
                type="email"
                onSave={updateField('email')}
            />
            <EditableRow
                label="Mobile Number"
                valueLabel="Phone"
                value={profile.phone}
                type="tel"
                onSave={updateField('phone')}
            />
            <ChangePasswordCard />
        </div>
    );
}
