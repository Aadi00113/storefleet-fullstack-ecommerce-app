import { useEffect, useState } from 'react'
import { getAllUsers, updateUserRole, deleteUser } from '../../api/userService'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = () => {
        setLoading(true)
        getAllUsers().then((r) => setUsers(r.data.allUsers || [])).catch(() => { }).finally(() => setLoading(false))
    }

    useEffect(() => { fetchUsers() }, [])

    const handleRoleChange = async (id, role) => {
        try {
            await updateUserRole(id, { role })
            toast.success('Role updated!')
            fetchUsers()
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user permanently?')) return
        try {
            await deleteUser(id)
            toast.success('User deleted')
            fetchUsers()
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="container page-content page-enter">
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Admin — <span>Users</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{users.length} registered users</p>
            </div>

            {loading ? <Loader /> : (
                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>User ID</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No users found</td></tr>
                                ) : users.map((u) => (
                                    <tr key={u._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: '50%',
                                                    background: u.role === 'admin' ? 'linear-gradient(135deg, #a78bfa, #8b5cf6)' : 'var(--gradient-gold)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, fontSize: '0.875rem',
                                                    color: u.role === 'admin' ? '#fff' : '#0a0e1a',
                                                    flexShrink: 0,
                                                }}>
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.email}</td>
                                        <td >
                                            <select
                                                className="form-input"
                                                style={{ width: 'auto', padding: '0.3rem 0.5rem', paddingRight: '1.75rem', fontSize: '0.8125rem' }}
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            >
                                                <option value="user">user</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                            {u._id?.slice(-8)}…
                                        </td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
