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
            <section className="hero-bg py-20 text-center relative overflow-hidden">
                {/* decorative orbs */}
                <div className="absolute w-[400px] h-[400px] rounded-full -top-24 -left-24 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent)' }} />
                <div className="absolute w-[300px] h-[300px] rounded-full -bottom-12 -right-12 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent)' }} />

                <div className="container relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full mb-6 text-[0.8rem] font-semibold tracking-widest text-accent"
                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        🚀 NEW ARRIVALS EVERY WEEK
                    </div>

                    <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-tight mb-6">
                        Shop Smarter with{' '}
                        <span className="gradient-text">StoreFleet</span>
                    </h1>
                    <p className="text-lg text-text-sub max-w-xl mx-auto mb-10">
                        Discover thousands of products across all categories. Fast delivery, unbeatable prices, seamless shopping.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/products" className="btn btn-primary btn-lg">Browse All Products →</Link>
                        <Link to="/register" className="btn btn-secondary btn-lg">Join StoreFleet</Link>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-12 justify-center mt-14 flex-wrap">
                        {[['10K+', 'Products'], ['50K+', 'Customers'], ['99%', 'Satisfaction'], ['24h', 'Delivery']].map(([n, l]) => (
                            <div key={l} className="text-center">
                                <div className="text-[1.75rem] font-extrabold text-accent">{n}</div>
                                <div className="text-[0.8125rem] text-text-muted font-medium">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-12 bg-secondary">
                <div className="container">
                    <h2 className="section-title">Shop by <span>Category</span></h2>
                    <p className="section-subtitle">Find exactly what you need</p>
                    <div className="flex gap-3 flex-wrap">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat}
                                to={`/products?category=${encodeURIComponent(cat)}`}
                                className="px-5 py-2 rounded-full text-sm text-text-sub whitespace-nowrap transition-all duration-200 hover:text-accent hover:border-accent"
                                style={{ border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)' }}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-12">
                <div className="container">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <h2 className="section-title">Featured <span>Products</span></h2>
                        <Link to="/products" className="btn btn-secondary btn-sm">View All →</Link>
                    </div>

                    {loading ? <Loader /> : (
                        products.length > 0 ? (
                            <div className="products-grid">
                                {products.map((p) => <ProductCard key={p._id} product={p} />)}
                            </div>
                        ) : (
                            <div className="text-center text-text-muted py-12">
                                No products yet.{' '}
                                <Link to="/login" className="text-accent">Add some as admin →</Link>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 bg-secondary">
                <div className="container">
                    <div className="rounded-[24px] p-12 text-center border"
                        style={{
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(139,92,246,0.1))',
                            borderColor: 'rgba(245,158,11,0.2)',
                        }}>
                        <h2 className="text-[1.75rem] font-bold mb-3">Ready to start shopping?</h2>
                        <p className="text-text-sub mb-6">Create your free account and start exploring thousands of products.</p>
                        <Link to="/register" className="btn btn-primary">Get Started — It's Free</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
