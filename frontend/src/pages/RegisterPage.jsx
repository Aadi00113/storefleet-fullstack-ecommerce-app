import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from '../api/userService'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function RegisterPage() {
    const { setUser } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await signupUser(form)
            setUser(res.data.user)
            toast.success('Account created! Welcome to StoreFleet 🎉')
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
                    <h1 className="text-2xl font-extrabold mb-1">Create Account</h1>
                    <p className="text-text-sub text-sm">Join StoreFleet today — it's free</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" type="text" name="name" value={form.name}
                            onChange={handleChange} placeholder="John Doe" required minLength={2} maxLength={30} />
                    </div>
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

                    <button className="btn btn-primary btn-full mt-2" type="submit" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-text-sub text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent font-semibold">Sign in</Link>
                </p>
            </div>
        </div>
    )
}
