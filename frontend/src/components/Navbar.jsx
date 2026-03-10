import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../api/userService'
import { toast } from 'react-toastify'

export default function Navbar() {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await logoutUser()
            setUser(null)
            toast.success('Logged out successfully')
            navigate('/')
            setMenuOpen(false)
        } catch {
            toast.error('Logout failed')
        }
    }

    const close = () => setMenuOpen(false)

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand" onClick={close}>
                    <span className="brand-icon">🚀</span>
                    <span className="brand-name">StoreFleet</span>
                </Link>

                {/* Desktop links */}
                <div className="navbar-links">
                    <Link to="/products" className="nav-link">Products</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="nav-link nav-link-admin">Admin</Link>
                    )}
                </div>

                <div className="navbar-actions">
                    {/* Desktop user menu / auth buttons */}
                    {user ? (
                        <div className="user-menu">
                            <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                            <div className="user-dropdown">
                                <div className="user-info">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-role">{user.role}</span>
                                </div>
                                <div className="dropdown-divider" />
                                <Link to="/profile" className="dropdown-item" onClick={close}>My Profile</Link>
                                <Link to="/my-orders" className="dropdown-item" onClick={close}>📦 My Orders</Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin/dashboard" className="dropdown-item" onClick={close}>Dashboard</Link>
                                        <Link to="/admin/products" className="dropdown-item" onClick={close}>Manage Products</Link>
                                        <Link to="/admin/users" className="dropdown-item" onClick={close}>Manage Users</Link>
                                        <Link to="/admin/orders" className="dropdown-item" onClick={close}>Manage Orders</Link>
                                    </>
                                )}
                                <div className="dropdown-divider" />
                                <button onClick={handleLogout} className="dropdown-item dropdown-item-danger">Logout</button>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </div>
                    )}

                    {/* Hamburger — mobile only */}
                    <button
                        className={`hamburger${menuOpen ? ' hamburger-open' : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* Mobile slide-down menu */}
            <div className={`mobile-menu${menuOpen ? ' mobile-menu-open' : ''}`}>
                <Link to="/products" className="mobile-nav-link" onClick={close}>🛍️ Products</Link>
                {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" className="mobile-nav-link mobile-nav-admin" onClick={close}>⚙️ Admin Dashboard</Link>
                )}
                <div className="mobile-divider" />
                {user ? (
                    <>
                        <div className="mobile-user-info">
                            <span style={{ fontWeight: 600 }}>{user.name}</span>
                            <span className="mobile-user-role">{user.role}</span>
                        </div>
                        <Link to="/profile" className="mobile-nav-link" onClick={close}>👤 My Profile</Link>
                        <Link to="/my-orders" className="mobile-nav-link" onClick={close}>📦 My Orders</Link>
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin/products" className="mobile-nav-link" onClick={close}>📦 Manage Products</Link>
                                <Link to="/admin/users" className="mobile-nav-link" onClick={close}>👥 Manage Users</Link>
                                <Link to="/admin/orders" className="mobile-nav-link" onClick={close}>🗒️ Manage Orders</Link>
                            </>
                        )}
                        <div className="mobile-divider" />
                        <button onClick={handleLogout} className="mobile-nav-link mobile-nav-danger">🚪 Logout</button>
                    </>
                ) : (
                    <div className="flex gap-3 p-3">
                        <Link to="/login" className="btn btn-secondary btn-sm flex-1 justify-center" onClick={close}>Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm flex-1 justify-center" onClick={close}>Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
