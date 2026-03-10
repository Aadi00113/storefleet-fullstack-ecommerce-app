import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/userService'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function LoginPage() {
    const { setUser } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await loginUser(form)
            setUser(res.data.user)
            toast.success('Welcome back!')
            navigate('/')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8 hero-bg">
            <div className="glass-card page-enter w-full max-w-[420px] p-10">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-2">🚀</div>
                    <h1 className="text-2xl font-extrabold mb-1">Welcome Back</h1>
                    <p className="text-text-sub text-sm">Sign in to your StoreFleet account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input className="form-input" type="email" name="email" value={form.email}
                            onChange={handleChange} placeholder="you@example.com" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input className="form-input" type="password" name="password" value={form.password}
                            onChange={handleChange} placeholder="••••••••" required />
                    </div>

                    <div className="text-right mb-5">
                        <Link to="/forgot-password" className="text-accent text-[0.8125rem]">
                            Forgot password?
                        </Link>
                    </div>

                    <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-6 text-text-sub text-sm">
                    New to StoreFleet?{' '}
                    <Link to="/register" className="text-accent font-semibold">Create an account</Link>
                </p>
            </div>
        </div>
    )
}
