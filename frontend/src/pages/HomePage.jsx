import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts } from '../api/productService'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'

const CATEGORIES = [
    'Mobile', 'Electronics', 'Clothing', 'Home & Garden', 'Automotive',
    'Health & Beauty', 'Sports & Outdoors', 'Toys & Games', 'Books & Media',
    'Jewelry', 'Food & Grocery', 'Furniture', 'Shoes',
]

export default function HomePage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllProducts({ limit: 8 })
            .then((r) => setProducts(r.data.products || []))
            .catch(() => { setProducts([]); setLoading(false) })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="page-enter">
            {/* Hero */}
            <section style={{
                background: 'var(--gradient-hero)',
                padding: '5rem 0 4rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* decorative circles */}
                <div style={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent)',
                    top: '-100px', left: '-100px', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent)',
                    bottom: '-50px', right: '-50px', pointerEvents: 'none',
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-block', padding: '0.375rem 1rem',
                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: '50px', marginBottom: '1.5rem',
                        fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)',
                        letterSpacing: '0.05em',
                    }}>
                        🚀 NEW ARRIVALS EVERY WEEK
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                        Shop Smarter with{' '}
                        <span className="gradient-text">StoreFleet</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 2.5rem' }}>
                        Discover thousands of products across all categories. Fast delivery, unbeatable prices, seamless shopping.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Browse All Products →
                        </Link>
                        <Link to="/register" className="btn btn-secondary btn-lg">
                            Join StoreFleet
                        </Link>
                    </div>

                    {/* Stats row */}
                    <div style={{
                        display: 'flex', gap: '3rem', justifyContent: 'center',
                        marginTop: '3.5rem', flexWrap: 'wrap',
                    }}>
                        {[['10K+', 'Products'], ['50K+', 'Customers'], ['99%', 'Satisfaction'], ['24h', 'Delivery']].map(([n, l]) => (
                            <div key={l} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{n}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section style={{ padding: '3rem 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 className="section-title">Shop by <span>Category</span></h2>
                    <p className="section-subtitle">Find exactly what you need</p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat}
                                to={`/products?category=${encodeURIComponent(cat)}`}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '50px',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    background: 'rgba(255,255,255,0.03)',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--accent-primary)'
                                    e.currentTarget.style.color = 'var(--accent-primary)'
                                    e.currentTarget.style.background = 'rgba(245,158,11,0.05)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-color)'
                                    e.currentTarget.style.color = 'var(--text-secondary)'
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                                }}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 className="section-title">Featured <span>Products</span></h2>
                        </div>
                        <Link to="/products" className="btn btn-secondary btn-sm">View All →</Link>
                    </div>

                    {loading ? <Loader /> : (
                        products.length > 0 ? (
                            <div className="products-grid">
                                {products.map((p) => <ProductCard key={p._id} product={p} />)}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                                No products yet. <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Add some as admin →</Link>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{ padding: '3rem 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(139,92,246,0.1))',
                        border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                    }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                            Ready to start shopping?
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Create your free account and start exploring thousands of products.
                        </p>
                        <Link to="/register" className="btn btn-primary">Get Started — It's Free</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
