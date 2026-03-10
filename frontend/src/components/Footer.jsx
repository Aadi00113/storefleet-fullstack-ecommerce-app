import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="border-t mt-16 py-10 bg-secondary" style={{ borderColor: 'var(--border-color)' }}>
            <div className="container flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-xl font-extrabold">
                    <span>🚀</span>
                    <span className="gradient-text">StoreFleet</span>
                </div>
                <p className="text-text-muted text-sm">Your one-stop e‑commerce destination</p>
                <div className="flex gap-8 text-[0.85rem] text-text-sub">
                    <Link to="/products">Products</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
                <p className="text-text-muted text-xs mt-2">© 2025 StoreFleet. All rights reserved.</p>
            </div>
        </footer>
    )
}
