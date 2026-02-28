import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-color)',
            marginTop: '4rem',
            padding: '2.5rem 0',
            background: 'var(--bg-secondary)',
        }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 800 }}>
                    <span>🚀</span>
                    <span className="gradient-text">StoreFleet</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Your one-stop e‑commerce destination
                </p>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Link to="/products" style={{ color: 'inherit' }}>Products</Link>
                    <Link to="/login" style={{ color: 'inherit' }}>Login</Link>
                    <Link to="/register" style={{ color: 'inherit' }}>Register</Link>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    © 2025 StoreFleet. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
