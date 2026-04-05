'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/api';

export default function AdminLoginPage() {
    const router = useRouter();
    const { user, loading, refetch } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaChecked, setCaptchaChecked] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [rateLimited, setRateLimited] = useState(false);

    // If already logged in as admin, skip to dashboard
    useEffect(() => {
        if (!loading && user?.role === 'admin') {
            router.replace('/admin/dashboard');
        } else if (!loading && user?.role === 'user') {
            router.replace('/');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!captchaChecked) {
            setError('Please confirm you are not a robot.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/admin-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.status === 429) {
                setRateLimited(true);
                setError(data.message || 'Too many attempts. Try again in 15 minutes.');
                return;
            }

            if (!res.ok) {
                setError(data.message || 'Login failed.');
                return;
            }

            // Server set auth_token + admin_session cookies
            await refetch(); // update AuthContext
            router.push('/admin/dashboard');
        } catch {
            setError('Unable to connect. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            fontFamily: '"Inter", "Segoe UI", sans-serif',
        }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Logo / Brand */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 64,
                        height: 64,
                        background: 'linear-gradient(135deg, #ffd814, #f0a500)',
                        borderRadius: '16px',
                        fontSize: '1.75rem',
                        marginBottom: '1rem',
                        boxShadow: '0 8px 32px rgba(255,216,20,0.3)',
                    }}>
                        🛡️
                    </div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: '-0.02em',
                        margin: 0,
                    }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: '#8892a4', fontSize: '0.875rem', marginTop: '0.4rem' }}>
                        FashionStore · Authorized Personnel Only
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '2.25rem',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                }}>
                    {rateLimited && (
                        <div style={{
                            background: 'rgba(220,38,38,0.15)',
                            border: '1px solid rgba(220,38,38,0.4)',
                            borderLeft: '4px solid #dc2626',
                            borderRadius: '10px',
                            padding: '0.85rem 1rem',
                            marginBottom: '1.25rem',
                            color: '#fca5a5',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                        }}>
                            🚫 {error}
                        </div>
                    )}

                    {error && !rateLimited && (
                        <div style={{
                            background: 'rgba(220,38,38,0.12)',
                            border: '1px solid rgba(220,38,38,0.35)',
                            borderLeft: '4px solid #ef4444',
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                            marginBottom: '1.25rem',
                            color: '#fca5a5',
                            fontSize: '0.875rem',
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="admin@fashionstore.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '1.5px solid rgba(255,255,255,0.12)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,216,20,0.6)'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '1.5px solid rgba(255,255,255,0.12)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,216,20,0.6)'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                            />
                        </div>

                        {/* CAPTCHA Placeholder */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1.5px solid rgba(255,255,255,0.12)',
                            borderRadius: '10px',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}>
                            <input
                                type="checkbox"
                                id="captcha"
                                checked={captchaChecked}
                                onChange={e => setCaptchaChecked(e.target.checked)}
                                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#ffd814' }}
                            />
                            <label htmlFor="captcha" style={{ color: '#cbd5e1', fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none', flex: 1 }}>
                                I am not a robot
                            </label>
                            <span style={{ fontSize: '1.5rem' }}>🤖</span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting || rateLimited}
                            style={{
                                width: '100%',
                                padding: '0.85rem',
                                background: submitting || rateLimited
                                    ? 'rgba(255,216,20,0.4)'
                                    : 'linear-gradient(135deg, #ffd814, #f0a500)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#111',
                                fontWeight: 800,
                                fontSize: '1rem',
                                cursor: submitting || rateLimited ? 'not-allowed' : 'pointer',
                                transition: 'opacity 0.2s, transform 0.1s',
                                marginTop: '0.25rem',
                                letterSpacing: '0.01em',
                            }}
                            onMouseEnter={e => { if (!submitting && !rateLimited) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {submitting ? 'Signing in…' : 'Sign In to Admin Panel'}
                        </button>
                    </form>
                </div>

                {/* Footer note */}
                <p style={{ textAlign: 'center', color: '#4a5568', fontSize: '0.78rem', marginTop: '1.5rem' }}>
                    🔒 This area is restricted to authorized administrators only.
                    <br />Unauthorized access attempts are logged.
                </p>

                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a href="/" style={{ color: '#8892a4', fontSize: '0.82rem', textDecoration: 'none' }}>
                        ← Back to Store
                    </a>
                </p>
            </div>
        </div>
    );
}
