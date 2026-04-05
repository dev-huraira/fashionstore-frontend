'use client';

import './page.css';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { API_BASE } from '@/lib/api';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const redirectPath = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; terms?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!email.trim()) newErrors.email = 'Enter your email.';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address.';
        if (!password) newErrors.password = 'Enter your password.';
        if (!termsAccepted) newErrors.terms = 'You must agree to the Terms of Use and Privacy Notice to continue.';
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrors({ general: data.message || 'Sign in failed. Please try again.' });
            } else {
                // Cookie set by server — dispatch event so AuthContext re-fetches
                window.dispatchEvent(new Event('authChange'));
                router.push(redirectPath);
            }
        } catch {
            setErrors({ general: 'Unable to connect to the server. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Sign In</h1>

                {/* Professional info banner */}
                {message && (
                    <div className="info-banner">
                        <span className="info-banner-icon">🔒</span>
                        <span className="info-banner-text">{message}</span>
                    </div>
                )}

                {errors.general && <div className="error-banner">{errors.general}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email or mobile phone number</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="error-msg">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="error-msg">{errors.password}</span>}
                    </div>

                    {/* Terms & Privacy Checkbox */}
                    <div className="terms-checkbox-group">
                        <label className="terms-label">
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => {
                                    setTermsAccepted(e.target.checked);
                                    if (e.target.checked && errors.terms) {
                                        setErrors(prev => ({ ...prev, terms: undefined }));
                                    }
                                }}
                                className="terms-checkbox"
                            />
                            <span className="terms-text">
                                I agree to FashionStore&apos;s{' '}
                                <Link href="/terms" className="terms-link">Conditions of Use</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="terms-link">Privacy Notice</Link>.
                            </span>
                        </label>
                        {errors.terms && <span className="error-msg">{errors.terms}</span>}
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Signing in...' : 'Continue'}
                    </button>
                </form>
            </div>

            <div className="divider">
                <h5>New to FashionStore?</h5>
            </div>

            <Link href="/register" style={{ textDecoration: 'none', width: '100%', maxWidth: '350px', display: 'flex', justifyContent: 'center' }}>
                <button className="btn-create-account">Create your FashionStore account</button>
            </Link>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
