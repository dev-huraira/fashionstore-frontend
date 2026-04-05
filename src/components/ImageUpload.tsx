'use client';

import { useState } from 'react';
import { API_BASE } from '@/lib/api';

interface ImageUploadProps {
    onUploadSuccess: (imageUrl: string) => void;
    label?: string;
}

export default function ImageUpload({ onUploadSuccess, label = 'Upload Image' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/api/upload`, {
                method: 'POST',
                body: formData,
                // NO need for headers, browser sets multipart boundary automatically
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to upload image');
            }

            onUploadSuccess(data.image);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-upload-wrapper" style={{ margin: '1rem 0' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    style={{
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: uploading ? 'not-allowed' : 'pointer'
                    }}
                />
                {uploading && <div className="spinner-small" style={{ width: '20px', height: '20px', border: '2px solid #f3f3f3', borderTop: '2px solid #ffd814', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>}
            </div>
            {error && <p style={{ color: '#d00', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
        </div>
    );
}
