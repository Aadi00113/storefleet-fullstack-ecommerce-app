import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllProducts } from '../api/productService'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'

const CATEGORIES = [
    'Mobile', 'Electronics', 'Clothing', 'Home & Garden', 'Automotive',
    'Health & Beauty', 'Sports & Outdoors', 'Toys & Games', 'Books & Media',
    'Jewelry', 'Food & Grocery', 'Furniture', 'Shoes', 'Pet Supplies',
    'Office Supplies', 'Baby & Kids', 'Art & Collectibles', 'Travel & Luggage',
    'Music Instruments', 'Electrical Appliances', 'Handmade Crafts',
]

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const keyword = searchParams.get('keyword') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const minRating = searchParams.get('minRating') || ''

    const [localKeyword, setLocalKeyword] = useState(keyword)

    const fetchProducts = useCallback(() => {
        setLoading(true)
        const params = { page: currentPage }
        if (keyword) params.keyword = keyword
        if (category) params.category = category
        if (minPrice) params['price[gte]'] = minPrice
        if (maxPrice) params['price[lte]'] = maxPrice
        if (minRating) params['rating[gte]'] = minRating

        getAllProducts(params)
            .then((r) => {
                setProducts(r.data.products || [])
                setTotalPages(r.data.totalPages || 1)
                setTotalProducts(r.data.totalProducts || 0)
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [keyword, category, minPrice, maxPrice, minRating, currentPage])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    const applyFilter = (key, val) => {
        const next = new URLSearchParams(searchParams)
        if (val) next.set(key, val)
        else next.delete(key)
        next.delete('page')
        setCurrentPage(1)
        setSearchParams(next)
    }

    const clearFilters = () => {
        setLocalKeyword('')
        setSearchParams({})
        setCurrentPage(1)
    }

    return (
        <div className="container page-content page-enter">
            <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
                All <span>Products</span>
            </h1>
            <p className="section-subtitle">Browse our full catalog</p>

            <div className="products-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                {/* Sidebar Filters */}
                <aside className="products-sidebar" style={{
                    width: 240, flexShrink: 0, background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem', position: 'sticky', top: '90px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Filters</h3>
                        <button onClick={clearFilters} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>
                            Clear all
                        </button>
                    </div>

                    {/* Keyword Search */}
                    <div className="form-group">
                        <label className="form-label">Search</label>
                        <input
                            className="form-input"
                            value={localKeyword}
                            onChange={(e) => setLocalKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter('keyword', localKeyword)}
                            placeholder="Search products…"
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-input" value={category} onChange={(e) => applyFilter('category', e.target.value)}>
                            <option value="">All Categories</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="form-group">
                        <label className="form-label">Min Price (₹)</label>
                        <input className="form-input" type="number" value={minPrice} onChange={(e) => applyFilter('minPrice', e.target.value)} placeholder="0" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Max Price (₹)</label>
                        <input className="form-input" type="number" value={maxPrice} onChange={(e) => applyFilter('maxPrice', e.target.value)} placeholder="Any" />
                    </div>

                    {/* Min Rating */}
                    <div className="form-group">
                        <label className="form-label">Min Rating ⭐</label>
                        <select className="form-input" value={minRating} onChange={(e) => applyFilter('minRating', e.target.value)}>
                            <option value="">Any</option>
                            {[1, 2, 3, 4].map(r => <option key={r} value={r}>{r}+ stars</option>)}
                        </select>
                    </div>

                    <button className="btn btn-primary btn-full btn-sm" onClick={() => applyFilter('keyword', localKeyword)}>
                        Apply Search
                    </button>
                </aside>

                {/* Products Grid */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {loading ? (
                        <Loader />
                    ) : products.length > 0 ? (
                        <>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                                {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
                                {totalPages > 1 && <span> &mdash; page {currentPage} of {totalPages}</span>}
                            </p>
                            <div className="products-grid">
                                {products.map((p) => <ProductCard key={p._id} product={p} />)}
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0) }} />
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}>
                            <div style={{ fontSize: '3rem' }}>🔍</div>
                            <p style={{ marginTop: '1rem', fontSize: '1rem' }}>No products found. Try different filters.</p>
                            <button onClick={clearFilters} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>Clear Filters</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
