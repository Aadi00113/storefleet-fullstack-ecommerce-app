import { useEffect, useState } from 'react'
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../../api/productService'
import Loader from '../../components/Loader'
import StarRating from '../../components/StarRating'
import { toast } from 'react-toastify'

const CATEGORIES = [
    'Mobile', 'Electronics', 'Clothing', 'Home & Garden', 'Automotive',
    'Health & Beauty', 'Sports & Outdoors', 'Toys & Games', 'Books & Media',
    'Jewelry', 'Food & Grocery', 'Furniture', 'Shoes', 'Pet Supplies',
    'Office Supplies', 'Baby & Kids', 'Art & Collectibles', 'Travel & Luggage',
    'Music Instruments', 'Electrical Appliances', 'Handmade Crafts',
]

const emptyForm = {
    name: '', description: '', price: '', category: 'Mobile', stock: '',
    images: [{ public_id: 'placeholder', url: '' }]
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null) // null = add mode
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)

    const fetchProducts = () => {
        setLoading(true)
        getAllProducts({}).then((r) => setProducts(r.data.products || [])).catch(() => { }).finally(() => setLoading(false))
    }

    useEffect(() => { fetchProducts() }, [])

    const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
    const openEdit = (p) => {
        setEditing(p)
        setForm({
            name: p.name, description: p.description, price: p.price, category: p.category,
            stock: p.stock, images: p.images?.length ? p.images : [{ public_id: 'placeholder', url: '' }]
        })
        setShowModal(true)
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleImgUrl = (e) => setForm({ ...form, images: [{ public_id: 'placeholder', url: e.target.value }] })

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editing) {
                await updateProduct(editing._id, form)
                toast.success('Product updated!')
            } else {
                await addProduct(form)
                toast.success('Product added!')
            }
            setShowModal(false)
            fetchProducts()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return
        try {
            await deleteProduct(id)
            toast.success('Product deleted')
            fetchProducts()
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="container page-content page-enter">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Admin — <span>Products</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{products.length} products in catalog</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
            </div>

            {loading ? <Loader /> : (
                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No products yet</td></tr>
                                ) : products.map((p) => (
                                    <tr key={p._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <img src={p.images?.[0]?.url || 'https://placehold.co/40x40/131c2e/f59e0b?text=P'}
                                                    style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt="" />
                                                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{p.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-info">{p.category}</span></td>
                                        <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>₹{p.price?.toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                                                {p.stock > 0 ? p.stock : 'Out'}
                                            </span>
                                        </td>
                                        <td><StarRating rating={p.rating} size={14} /></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal-box">
                        <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>
                            {editing ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description (min 10 chars)</label>
                                <textarea className="form-input" name="description" value={form.description}
                                    onChange={handleChange} rows={3} required minLength={10} style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Price (₹)</label>
                                    <input className="form-input" type="number" name="price" value={form.price} onChange={handleChange} required min={0} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stock</label>
                                    <input className="form-input" type="number" name="stock" value={form.stock} onChange={handleChange} required min={0} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL (optional)</label>
                                <input className="form-input" type="url" value={form.images[0]?.url || ''}
                                    onChange={handleImgUrl} placeholder="https://…" />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button className="btn btn-primary" type="submit" disabled={saving} style={{ flex: 1 }}>
                                    {saving ? 'Saving…' : editing ? 'Update' : 'Add Product'}
                                </button>
                                <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
