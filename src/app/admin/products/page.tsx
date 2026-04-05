'use client';

import { useState, useEffect } from 'react';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';
import ImageUpload from '@/components/ImageUpload';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { API_BASE } from '@/lib/api';
import './products.css';

type FormData = {
    name: string;
    price: number;
    description: string;
    category: string;
    subCategory: string;
    images: string[];
    sizes: string[];
    colors: string[];
    features: string;  // newline-separated string in UI
    discount: number;
};

const defaultForm: FormData = {
    name: '',
    price: 0,
    description: '',
    category: 'Men',
    subCategory: '',
    images: [],
    sizes: [],
    colors: [],
    features: '',
    discount: 0,
};

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');
    const [deleting, setDeleting] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState<FormData>(defaultForm);

    // tag input helpers
    const [sizeInput, setSizeInput] = useState('');
    const [colorInput, setColorInput] = useState('');

    const addTag = (field: 'sizes' | 'colors', value: string, setter: (v: string) => void) => {
        const trimmed = value.trim();
        if (trimmed && !formData[field].includes(trimmed)) {
            setFormData(prev => ({ ...prev, [field]: [...prev[field], trimmed] }));
        }
        setter('');
    };

    const removeTag = (field: 'sizes' | 'colors', tag: string) => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter(t => t !== tag) }));
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/products`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleDelete = async () => {
        if (!deleteTargetId) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_BASE}/api/products/${deleteTargetId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete');
            setProducts(prev => prev.filter(p => p._id !== deleteTargetId));
            setDeleteTargetId(null);
        } catch (err: any) {
            setError(err.message);
            setDeleteTargetId(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingProduct
            ? `${API_BASE}/api/products/${editingProduct._id}`
            : `${API_BASE}/api/products`;

        const featuresArray = formData.features
            .split('\n')
            .map(f => f.trim())
            .filter(Boolean);

        try {
            const res = await fetch(url, {
                method: editingProduct ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ...formData, features: featuresArray })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save product');
            setShowModal(false);
            setEditingProduct(null);
            setFormData(defaultForm);
            setSizeInput('');
            setColorInput('');
            fetchProducts();
        } catch (err: any) {
            if (err.message.toLowerCase().includes('authorized') || err.message.toLowerCase().includes('expired')) {
                alert('Session expired. Please log in again.');
                // Clear admin cookie; the server HTTP-only cookie is cleared via /api/auth/logout
                document.cookie = 'admin_session=; path=/; max-age=0; SameSite=Strict';
                window.location.href = '/admin/login';
            } else {
                alert(err.message);
            }
        }
    };

    const openEdit = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            subCategory: product.subCategory || '',
            images: product.images || [],
            sizes: product.sizes || [],
            colors: product.colors || [],
            features: (product.features || []).join('\n'),
            discount: product.discount || 0,
        });
        setSizeInput('');
        setColorInput('');
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingProduct(null);
        setFormData(defaultForm);
        setSizeInput('');
        setColorInput('');
        setShowModal(true);
    };

    return (
        <AdminGuard>
            <div className="admin-container">
                <AdminSidebar activePage="products" />

                <div className="main-content">
                    <header className="admin-header">
                        <h1>Product Management</h1>
                        <button className="btn-primary add-product-btn" onClick={openAdd}>+ Add New Product</button>
                    </header>

                    {error && <div style={{ color: '#d00', padding: '1rem' }}>{error}</div>}

                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>
                    ) : (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Discount</th>
                                        <th>Sizes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                <img
                                                    src={product.images[0]?.startsWith('/') ? `${API_BASE}${product.images[0]}` : product.images[0] || 'https://via.placeholder.com/40'}
                                                    alt={product.name}
                                                    className="table-img"
                                                />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.category}{product.subCategory ? ` / ${product.subCategory}` : ''}</td>
                                            <td>${product.price}</td>
                                            <td>{product.discount ? `-${product.discount}%` : '-'}</td>
                                            <td>{(product.sizes || []).join(', ') || '-'}</td>
                                            <td className="actions">
                                                <button className="btn-edit" onClick={() => openEdit(product)}>Edit</button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => { setDeleteTargetId(product._id); setDeleteTargetName(product.name); }}
                                                >Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ maxWidth: '600px' }}>
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit}>

                                {/* ─── Basic Fields ─── */}
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Product Name *</label>
                                        <input type="text" value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Price ($) *</label>
                                        <input type="number" step="0.01" value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
                                    </div>
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Discount (%)</label>
                                        <input type="number" min="0" max="100" value={formData.discount}
                                            onChange={e => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Kids">Kids</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Sub-Category (Department)</label>
                                    <select value={formData.subCategory}
                                        onChange={e => setFormData({ ...formData, subCategory: e.target.value })}>
                                        <option value="">None</option>
                                        <option value="Tops & Tees">Tops &amp; Tees</option>
                                        <option value="Bottoms">Bottoms</option>
                                        <option value="Activewear">Activewear</option>
                                        <option value="Shoes">Shoes</option>
                                    </select>
                                </div>

                                {/* ─── Sizes Tag Input ─── */}
                                <div className="form-group">
                                    <label>Sizes <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#666' }}>(type and press Enter)</span></label>
                                    <div className="tag-input-wrapper">
                                        {formData.sizes.map(s => (
                                            <span key={s} className="tag">
                                                {s}
                                                <button type="button" onClick={() => removeTag('sizes', s)}>×</button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            placeholder="e.g. S, M, L, XL"
                                            value={sizeInput}
                                            onChange={e => setSizeInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTag('sizes', sizeInput, setSizeInput);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* ─── Colors Tag Input ─── */}
                                <div className="form-group">
                                    <label>Colors <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#666' }}>(type and press Enter)</span></label>
                                    <div className="tag-input-wrapper">
                                        {formData.colors.map(c => (
                                            <span key={c} className="tag">
                                                {c}
                                                <button type="button" onClick={() => removeTag('colors', c)}>×</button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            placeholder="e.g. Black, White, Navy"
                                            value={colorInput}
                                            onChange={e => setColorInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTag('colors', colorInput, setColorInput);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* ─── Description ─── */}
                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea rows={3} value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                                </div>

                                {/* ─── Features / Bullet Points ─── */}
                                <div className="form-group">
                                    <label>Features / Bullet Points <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#666' }}>(one per line)</span></label>
                                    <textarea
                                        rows={4}
                                        placeholder={"100% Premium Cotton\nMachine Wash\nClassic Fit"}
                                        value={formData.features}
                                        onChange={e => setFormData({ ...formData, features: e.target.value })}
                                    />
                                </div>

                                {/* ─── Image Upload ─── */}
                                <ImageUpload
                                    onUploadSuccess={(url) => setFormData({ ...formData, images: [url] })}
                                    label="Product Image"
                                />

                                {formData.images[0] && (
                                    <div className="image-preview">
                                        <img
                                            src={formData.images[0].startsWith('/') ? `${API_BASE}${formData.images[0]}` : formData.images[0]}
                                            alt="Preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Save Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                isOpen={!!deleteTargetId}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTargetName}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTargetId(null)}
                loading={deleting}
            />
        </AdminGuard>
    );
}
