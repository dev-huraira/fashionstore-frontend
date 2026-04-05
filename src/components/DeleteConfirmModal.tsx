'use client';

import { useEffect } from 'react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function DeleteConfirmModal({
    isOpen,
    title = 'Confirm Delete',
    message,
    onConfirm,
    onCancel,
    loading = false,
}: DeleteConfirmModalProps) {
    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.55)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.18s ease',
                backdropFilter: 'blur(3px)',
            }}
            onClick={onCancel}
        >
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>

            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '2rem',
                    width: '100%',
                    maxWidth: '420px',
                    margin: '1rem',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                    animation: 'slideUp 0.22s ease',
                    textAlign: 'center',
                }}
            >
                {/* Icon */}
                <div style={{
                    width: 64, height: 64,
                    background: '#fff1f0',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    fontSize: '2rem',
                }}>
                    🗑️
                </div>

                {/* Title */}
                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#111',
                    marginBottom: '0.5rem',
                }}>
                    {title}
                </h2>

                {/* Message */}
                <p style={{
                    fontSize: '0.95rem',
                    color: '#555',
                    marginBottom: '1.75rem',
                    lineHeight: 1.5,
                }}>
                    {message}
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '0.7rem 1.25rem',
                            border: '1.5px solid #e5e7eb',
                            background: '#f9fafb',
                            color: '#374151',
                            borderRadius: '10px',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'background 0.18s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#f9fafb')}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '0.7rem 1.25rem',
                            border: 'none',
                            background: loading ? '#f87171' : '#dc2626',
                            color: '#fff',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.18s, transform 0.1s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#b91c1c'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#dc2626'; }}
                    >
                        {loading ? (
                            <>
                                <span style={{
                                    width: 16, height: 16,
                                    border: '2px solid rgba(255,255,255,0.4)',
                                    borderTop: '2px solid white',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    animation: 'spin 0.7s linear infinite',
                                }} />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
