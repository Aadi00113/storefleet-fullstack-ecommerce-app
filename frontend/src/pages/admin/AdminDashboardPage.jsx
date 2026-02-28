import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts } from '../../api/productService'
import { getAllUsers } from '../../api/userService'
import Loader from '../../components/Loader'

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ users: 0, products: 0, categories: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getAllProducts({}), getAllUsers()])
            .then(([prodRes, userRes]) => {
                const products = prodRes.data.products || []
                const users = userRes.data.allUsers || []
                const categories = new Set(products.map((p) => p.category)).size
                setStats({ users: users.length, products: products.length, categories })
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const cards = [
        { label: 'Total Products', value: stats.products, icon: '📦', color: '#f59e0b', link: '/admin/products' },
        { label: 'Total Users', value: stats.users, icon: '👥', color: '#3b82f6', link: '/admin/users' },
        { label: 'Categories', value: stats.categories, icon: '🏷️', color: '#10b981', link: '/admin/products' },
    ]

    return (
        <div className="container page-content page-enter">
            <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>Admin <span>Dashboard</span></h1>
            <p className="section-subtitle">Overview of your store</p>

            {loading ? <Loader /> : (
                <>
                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {cards.map((card) => (
                            <Link key={card.label} to={card.link} className="glass-card" style={{ padding: '1.75rem', textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '2rem' }}>{card.icon}</span>
                                    <span style={{ width: 42, height: 42, borderRadius: '50%', background: `${card.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="16" height="16" fill="none" stroke={card.color} strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M7 17l9.2-9.2M17 17V7H7" />
                                        </svg>
                                    </span>
                                </div>
                                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginTop: '0.25rem' }}>{card.label}</div>
                            </Link>
                        ))}
                    </div>

                    {/* Quick Links */}
                    <div className="glass-card" style={{ padding: '1.75rem' }}>
                        <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Quick Actions</h2>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link to="/admin/products" className="btn btn-primary">📦 Manage Products</Link>
                            <Link to="/admin/users" className="btn btn-secondary">👥 Manage Users</Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
