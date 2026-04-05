'use client';

import { useState, useEffect } from 'react';
import '../products/products.css';
import { API_BASE } from '@/lib/api';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
};

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');
    const [deleting, setDeleting] = useState(false);

    const [roleConfirmTarget, setRoleConfirmTarget] = useState<User | null>(null);
    const [roleConfirmNewRole, setRoleConfirmNewRole] = useState('');
    const [roleUpdating, setRoleUpdating] = useState(false);


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/users`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
            setUsers(data);
            setFiltered(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        let result = users;
        if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(u =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [search, roleFilter, users]);

    const handleDelete = async () => {
        if (!deleteTargetId) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${deleteTargetId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error((await res.json()).message);
            setUsers(prev => prev.filter(u => u._id !== deleteTargetId));
            setDeleteTargetId(null);
        } catch (e: any) {
            setDeleteTargetId(null);
            alert('Failed to delete user: ' + e.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleRoleToggle = (user: User) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        setRoleConfirmTarget(user);
        setRoleConfirmNewRole(newRole);
    };

    const confirmRoleChange = async () => {
        if (!roleConfirmTarget) return;
        setRoleUpdating(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${roleConfirmTarget._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ role: roleConfirmNewRole })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers(prev => prev.map(u => u._id === roleConfirmTarget._id ? { ...u, role: roleConfirmNewRole } : u));
            setRoleConfirmTarget(null);
        } catch (e: any) {
            alert('Failed to update role: ' + e.message);
            setRoleConfirmTarget(null);
        } finally {
            setRoleUpdating(false);
        }
    };

    return (
        <AdminGuard>
            <div className="admin-container">
                <AdminSidebar activePage="users" />

                <div className="main-content">
                    <header className="admin-header">
                        <h1>User Management</h1>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
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
                                placeholder="Search by name or email..."
                                className="search-input"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <select
                                className="filter-select"
                                value={roleFilter}
                                onChange={e => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Loading users...</div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No users found.</div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((user, i) => (
                                        <tr key={user._id}>
                                            <td style={{ color: '#888', fontSize: '0.85rem' }}>{i + 1}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                    <div style={{
                                                        width: 34, height: 34, borderRadius: '50%',
                                                        background: user.role === 'admin' ? '#febd69' : '#232f3e',
                                                        color: '#fff', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
                                                    }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <strong>{user.name}</strong>
                                                </div>
                                            </td>
                                            <td style={{ color: '#555' }}>{user.email}</td>
                                            <td>
                                                <span style={{
                                                    background: user.role === 'admin' ? '#febd69' : '#e7e7e7',
                                                    color: user.role === 'admin' ? '#111' : '#444',
                                                    padding: '2px 12px', borderRadius: 12,
                                                    fontSize: '0.82rem', fontWeight: 700, textTransform: 'capitalize'
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td style={{ color: '#666', whiteSpace: 'nowrap' }}>
                                                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="actions">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleRoleToggle(user)}
                                                    title={`Make ${user.role === 'admin' ? 'regular user' : 'admin'}`}
                                                >
                                                    {user.role === 'admin' ? '⬇ Demote' : '⬆ Make Admin'}
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => { setDeleteTargetId(user._id); setDeleteTargetName(user.name); }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={!!deleteTargetId}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteTargetName}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTargetId(null)}
                loading={deleting}
            />

            <DeleteConfirmModal
                isOpen={!!roleConfirmTarget}
                title={`${roleConfirmNewRole === 'admin' ? '⬆ Promote to Admin' : '⬇ Demote to User'}`}
                message={`Change ${roleConfirmTarget?.name ?? ''}'s role to "${roleConfirmNewRole}"? They will ${roleConfirmNewRole === 'admin' ? 'gain full admin access' : 'lose admin privileges'}.`}
                onConfirm={confirmRoleChange}
                onCancel={() => setRoleConfirmTarget(null)}
                loading={roleUpdating}
            />
        </AdminGuard>
    );
}
