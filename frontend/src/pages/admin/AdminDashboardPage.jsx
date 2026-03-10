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
            <h1 className="section-title mb-2">Admin <span>Dashboard</span></h1>
            <p className="section-subtitle">Overview of your store</p>

            {loading ? <Loader /> : (
                <>
                    {/* Stats Grid */}
                    <div className="grid gap-6 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))' }}>
                        {cards.map((card) => (
                            <Link key={card.label} to={card.link} className="glass-card p-7 no-underline">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-4xl">{card.icon}</span>
                                    <span className="w-[42px] h-[42px] rounded-full flex items-center justify-center"
                                        style={{ background: `${card.color}22` }}>
                                        <svg width="16" height="16" fill="none" stroke={card.color} strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M7 17l9.2-9.2M17 17V7H7" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="text-[2.25rem] font-extrabold" style={{ color: card.color }}>{card.value}</div>
                                <div className="text-text-sub text-sm font-medium mt-1">{card.label}</div>
                            </Link>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card p-7">
                        <h2 className="font-bold mb-5">Quick Actions</h2>
                        <div className="flex gap-4 flex-wrap">
                            <Link to="/admin/products" className="btn btn-primary">📦 Manage Products</Link>
                            <Link to="/admin/users" className="btn btn-secondary">👥 Manage Users</Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
