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
        <div className="min-h-screen flex items-center justify-center p-8 hero-bg">
            <div className="glass-card page-enter w-full max-w-[420px] p-10">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-2">🔑</div>
                    <h1 className="text-2xl font-extrabold mb-1">Forgot Password</h1>
                    <p className="text-text-sub text-sm">Enter your email to receive a password reset link</p>
                </div>

                {sent ? (
                    <div className="alert alert-success text-center py-6">
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

                <p className="text-center mt-6 text-text-sub text-sm">
                    Remembered it?{' '}
                    <Link to="/login" className="text-accent font-semibold">Sign in</Link>
                </p>
            </div>
        </div>
    )
}
