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
        <div className="min-h-screen flex items-center justify-center p-8 hero-bg">
            <div className="glass-card page-enter w-full max-w-[420px] p-10">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-2">🔒</div>
                    <h1 className="text-2xl font-extrabold mb-1">Reset Password</h1>
                    <p className="text-text-sub text-sm">Enter your new password below</p>
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
                    <button className="btn btn-primary btn-full mt-2" type="submit" disabled={loading}>
                        {loading ? 'Resetting…' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
