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
        try { await updateUserRole(id, { role }); toast.success('Role updated!'); fetchUsers() }
        catch (err) { toast.error(err.message) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user permanently?')) return
        try { await deleteUser(id); toast.success('User deleted'); fetchUsers() }
        catch (err) { toast.error(err.message) }
    }

    return (
        <div className="container page-content page-enter">
            <div className="mb-6">
                <h1 className="section-title mb-1">Admin — <span>Users</span></h1>
                <p className="text-text-muted text-sm">{users.length} registered users</p>
            </div>

            {loading ? <Loader /> : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th><th>Email</th><th>Role</th><th>User ID</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center text-text-muted py-8">No users found</td></tr>
                                ) : users.map((u) => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                                                    style={{
                                                        background: u.role === 'admin' ? 'linear-gradient(135deg,#a78bfa,#8b5cf6)' : 'var(--gradient-gold)',
                                                        color: u.role === 'admin' ? '#fff' : '#0a0e1a',
                                                    }}>
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-sm">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-text-sub text-sm">{u.email}</td>
                                        <td>
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
                                        <td className="text-text-muted text-xs font-mono">{u._id?.slice(-8)}…</td>
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
