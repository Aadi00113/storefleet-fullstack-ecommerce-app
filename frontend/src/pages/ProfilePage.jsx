import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile, updatePassword } from '../api/userService'
import { toast } from 'react-toastify'

export default function ProfilePage() {
    const { user, setUser } = useAuth()
    const [tab, setTab] = useState('info')

    // Update profile state
    const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' })
    const [profileLoading, setProfileLoading] = useState(false)

    // Update password state
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [pwLoading, setPwLoading] = useState(false)

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setProfileLoading(true)
        try {
            const res = await updateUserProfile(profileForm)
            setUser(res.data.updatedUserDetails)
            toast.success('Profile updated successfully!')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setProfileLoading(false)
        }
    }

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()
        if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('New passwords do not match')
        setPwLoading(true)
        try {
            await updatePassword(pwForm)
            toast.success('Password changed successfully!')
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            toast.error(err.message)
        } finally {
            setPwLoading(false)
        }
    }

    return (
        <div className="container page-content page-enter" style={{ maxWidth: 700 }}>
            <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>My <span>Profile</span></h1>
            <p className="section-subtitle">Manage your account settings</p>

            {/* Avatar card */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                    width: 70, height: 70, borderRadius: '50%', background: 'var(--gradient-gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 800, color: '#0a0e1a', flexShrink: 0,
                }}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>{user?.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.email}</p>
                    <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-info'}`} style={{ marginTop: '0.375rem' }}>
                        {user?.role}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {[['info', '👤 Edit Profile'], ['password', '🔒 Change Password']].map(([key, label]) => (
                    <button key={key} className={`tab-btn${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>{label}</button>
                ))}
            </div>

            {/* Edit Profile */}
            {tab === 'info' && (
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                placeholder="Your name" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input className="form-input" type="email" value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                placeholder="you@example.com" required />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={profileLoading}>
                            {profileLoading ? 'Saving…' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {/* Change Password */}
            {tab === 'password' && (
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input className="form-input" type="password" value={pwForm.currentPassword}
                                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                                placeholder="••••••••" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input className="form-input" type="password" value={pwForm.newPassword}
                                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                                placeholder="••••••••" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input className="form-input" type="password" value={pwForm.confirmPassword}
                                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                                placeholder="••••••••" required />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={pwLoading}>
                            {pwLoading ? 'Updating…' : 'Update Password'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
