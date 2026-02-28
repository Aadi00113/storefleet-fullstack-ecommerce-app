import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/userService'
import { toast } from 'react-toastify'

export default function ResetPasswordPage() {
    const { token } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({ password: '', confirmPassword: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
        setLoading(true)
        try {
            await resetPassword(token, form)
            toast.success('Password reset successfully! Please log in.')
            navigate('/login')
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
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Reset Password</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input className="form-input" type="password" name="password" value={form.password}
                            onChange={handleChange} placeholder="••••••••" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input className="form-input" type="password" name="confirmPassword" value={form.confirmPassword}
                            onChange={handleChange} placeholder="••••••••" required />
                    </div>
                    <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
                        {loading ? 'Resetting…' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
