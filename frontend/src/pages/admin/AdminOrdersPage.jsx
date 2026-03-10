import { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus } from '../../api/orderService'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered']

const statusBadge = (s) => {
    if (s === 'Delivered') return 'badge-success'
    if (s === 'Shipped') return 'badge-info'
    return 'badge-warning'
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)

    const fetchOrders = () => {
        setLoading(true)
        getAllOrders()
            .then((r) => setOrders(r.data.orders || []))
            .catch(() => toast.error('Failed to load orders'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchOrders() }, [])

    const handleStatusChange = async (id, status) => {
        setUpdating(id)
        try {
            await updateOrderStatus(id, status)
            toast.success(`Order marked as ${status}`)
            fetchOrders()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setUpdating(null)
        }
    }

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)

    return (
        <div className="container page-content page-enter">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                    <h1 className="section-title mb-1">Admin — <span>Orders</span></h1>
                    <p className="text-text-muted text-sm">
                        {orders.length} orders · Total Revenue:{' '}
                        <span className="text-accent font-bold">₹{totalRevenue.toLocaleString()}</span>
                    </p>
                </div>
            </div>

            {loading ? <Loader /> : (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Paid At</th>
                                    <th>Update Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center text-text-muted py-8">
                                            No orders yet
                                        </td>
                                    </tr>
                                ) : orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="text-text-muted text-xs font-mono">
                                            {order._id?.slice(-8)}…
                                        </td>
                                        <td>
                                            <div className="font-medium text-sm">{order.user?.name || 'N/A'}</div>
                                            <div className="text-text-muted text-xs">{order.user?.email}</div>
                                        </td>
                                        <td className="text-sm">
                                            {order.orderedItems?.map((item) => (
                                                <div key={item._id} className="text-text-sub">
                                                    {item.name} × {item.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="font-bold text-accent">
                                            ₹{order.totalPrice?.toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={`badge ${statusBadge(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="text-text-muted text-xs">
                                            {new Date(order.paidAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td>
                                            <select
                                                className="form-input"
                                                style={{ width: 'auto', padding: '0.3rem 0.5rem', paddingRight: '1.75rem', fontSize: '0.8125rem' }}
                                                value={order.orderStatus}
                                                disabled={updating === order._id || order.orderStatus === 'Delivered'}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
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
