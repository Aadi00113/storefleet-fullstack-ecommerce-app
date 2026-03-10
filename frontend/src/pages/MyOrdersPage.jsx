import { useEffect, useState } from 'react'
import { getMyOrders } from '../api/orderService'
import Loader from '../components/Loader'

const statusBadge = (s) => {
    if (s === 'Delivered') return 'badge-success'
    if (s === 'Shipped') return 'badge-info'
    return 'badge-warning'
}

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null)

    useEffect(() => {
        getMyOrders()
            .then((r) => setOrders(r.data.orders || []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="container page-content page-enter max-w-[900px]">
            <h1 className="section-title mb-2">My <span>Orders</span></h1>
            <p className="section-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

            {loading ? <Loader /> : orders.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-text-muted text-lg">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order._id} className="glass-card overflow-hidden">
                            {/* Order header */}
                            <div
                                className="flex items-center justify-between p-5 cursor-pointer"
                                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                            >
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div>
                                        <p className="text-text-muted text-xs font-mono">
                                            Order #{order._id?.slice(-8)}…
                                        </p>
                                        <p className="text-text-muted text-xs mt-0.5">
                                            {new Date(order.paidAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`badge ${statusBadge(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                    <div className="font-bold text-accent text-lg">
                                        ₹{order.totalPrice?.toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-text-muted text-xl">
                                    {expanded === order._id ? '▲' : '▼'}
                                </span>
                            </div>

                            {/* Order details (expanded) */}
                            {expanded === order._id && (
                                <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--border-color)' }}>
                                    <div className="grid gap-6 mt-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                        {/* Items */}
                                        <div>
                                            <h3 className="font-semibold mb-3 text-sm">Ordered Items</h3>
                                            <div className="flex flex-col gap-3">
                                                {order.orderedItems?.map((item) => (
                                                    <div key={item._id} className="flex items-center gap-3">
                                                        <img
                                                            src={item.image || 'https://placehold.co/48x48/131c2e/f59e0b?text=P'}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                            alt={item.name}
                                                        />
                                                        <div>
                                                            <p className="font-medium text-sm">{item.name}</p>
                                                            <p className="text-text-muted text-xs">
                                                                ₹{item.price?.toLocaleString()} × {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping & Price breakdown */}
                                        <div>
                                            <h3 className="font-semibold mb-3 text-sm">Shipping Address</h3>
                                            <p className="text-text-sub text-sm leading-relaxed">
                                                {order.shippingInfo?.address},<br />
                                                {order.shippingInfo?.state} — {order.shippingInfo?.pincode}<br />
                                                {order.shippingInfo?.country}<br />
                                                📞 {order.shippingInfo?.phoneNumber}
                                            </p>

                                            <div className="divider" />

                                            {[
                                                ['Items', `₹${order.itemsPrice?.toLocaleString()}`],
                                                ['Tax', `₹${order.taxPrice?.toLocaleString()}`],
                                                ['Shipping', order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`],
                                            ].map(([l, v]) => (
                                                <div key={l} className="flex justify-between text-sm text-text-sub mb-1">
                                                    <span>{l}</span><span>{v}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between font-bold mt-2">
                                                <span>Total</span>
                                                <span className="gradient-text">₹{order.totalPrice?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
