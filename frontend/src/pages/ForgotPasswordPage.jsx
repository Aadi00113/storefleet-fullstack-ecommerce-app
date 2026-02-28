import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/userService'
import { toast } from 'react-toastify'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await forgotPassword({ email })
            setSent(true)
            toast.success('Reset link sent to your email!')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--gradient-hero)' }}>
            <div className="glass-card page-enter" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔑</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Forgot Password</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enter your email to receive a password reset link</p>
                </div>

                {sent ? (
                    <div className="alert alert-success" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        ✅ Check your inbox! A reset link has been sent to <strong>{email}</strong>.
                        <br /><br />
                        <Link to="/login" className="btn btn-secondary btn-sm">Back to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input className="form-input" type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                        </div>
                        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                            {loading ? 'Sending…' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Remembered it?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    )
}
