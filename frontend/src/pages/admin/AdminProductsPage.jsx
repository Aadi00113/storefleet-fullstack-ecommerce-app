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
    const [editing, setEditing] = useState(null)
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
        setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, images: p.images?.length ? p.images : [{ public_id: 'placeholder', url: '' }] })
        setShowModal(true)
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleImgUrl = (e) => setForm({ ...form, images: [{ public_id: 'placeholder', url: e.target.value }] })

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editing) { await updateProduct(editing._id, form); toast.success('Product updated!') }
            else { await addProduct(form); toast.success('Product added!') }
            setShowModal(false); fetchProducts()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return
        try { await deleteProduct(id); toast.success('Product deleted'); fetchProducts() }
        catch (err) { toast.error(err.message) }
    }

    return (
        <div className="container page-content page-enter">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                    <h1 className="section-title mb-1">Admin — <span>Products</span></h1>
                    <p className="text-text-muted text-sm">{products.length} products in catalog</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
            </div>

            {loading ? <Loader /> : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product</th><th>Category</th><th>Price</th>
                                    <th>Stock</th><th>Rating</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center text-text-muted py-8">No products yet</td></tr>
                                ) : products.map((p) => (
                                    <tr key={p._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <img src={p.images?.[0]?.url || 'https://placehold.co/40x40/131c2e/f59e0b?text=P'}
                                                    className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                <span className="font-medium text-sm">{p.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-info">{p.category}</span></td>
                                        <td className="font-semibold text-accent">₹{p.price?.toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                                                {p.stock > 0 ? p.stock : 'Out'}
                                            </span>
                                        </td>
                                        <td><StarRating rating={p.rating} size={14} /></td>
                                        <td>
                                            <div className="flex gap-2">
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
                        <h2 className="font-bold mb-5">{editing ? 'Edit Product' : 'Add New Product'}</h2>
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
                            <div className="grid grid-cols-2 gap-4">
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
                                <label className="form-label">Image URL <span className="text-danger">*</span></label>
                                <input className="form-input" type="url" value={form.images[0]?.url || ''}
                                    onChange={handleImgUrl} placeholder="https://…" required />
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button className="btn btn-primary flex-1" type="submit" disabled={saving}>
                                    {saving ? 'Saving…' : editing ? 'Update' : 'Add Product'}
                                </button>
                                <button className="btn btn-secondary flex-1" type="button" onClick={() => setShowModal(false)}>
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
