import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { placeOrder } from '../api/orderService'
import { toast } from 'react-toastify'

export default function PlaceOrderPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const product = location.state?.product

    const [shipping, setShipping] = useState({
        address: '', state: '', country: 'IN', pincode: '', phoneNumber: ''
    })
    const [qty, setQty] = useState(1)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value })

    const totalPrice = product ? product.price * qty : 0
    const taxPrice = Math.round(totalPrice * 0.18)
    const shippingPrice = totalPrice > 999 ? 0 : 49
    const grandTotal = totalPrice + taxPrice + shippingPrice

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!product) return toast.error('No product selected')
        setLoading(true)
        try {
            await placeOrder({
                shippingInfo: {
                    ...shipping,
                    pincode: Number(shipping.pincode),
                    phoneNumber: Number(shipping.phoneNumber),
                },
                orderedItems: [{
                    name: product.name,
                    price: product.price,
                    quantity: qty,
                    image: product.images?.[0]?.url || 'placeholder',
                    product: product._id,
                }],
                paymentInfo: { id: `PAY_${Date.now()}`, status: true },
                paidAt: new Date(),
                itemsPrice: totalPrice,
                taxPrice,
                shippingPrice,
                totalPrice: grandTotal,
            })
            toast.success('Order placed successfully! 🎉')
            navigate('/')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container page-content page-enter" style={{ maxWidth: 900 }}>
            <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>Place <span>Order</span></h1>
            <p className="section-subtitle">Review your order details</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
                {/* Shipping Form */}
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                    <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Shipping Information</h2>
                    <form id="order-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Address</label>
                            <input className="form-input" name="address" value={shipping.address}
                                onChange={handleChange} placeholder="123 Main Street, Apt 4B" required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">State</label>
                                <input className="form-input" name="state" value={shipping.state}
                                    onChange={handleChange} placeholder="Maharashtra" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <input className="form-input" name="country" value={shipping.country}
                                    onChange={handleChange} placeholder="IN" required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Pincode</label>
                                <input className="form-input" name="pincode" type="number" value={shipping.pincode}
                                    onChange={handleChange} placeholder="400001" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input className="form-input" name="phoneNumber" type="number" value={shipping.phoneNumber}
                                    onChange={handleChange} placeholder="9876543210" required />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                        <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Order Summary</h2>
                        {product ? (
                            <>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <img
                                        src={product.images?.[0]?.url || 'https://placehold.co/60x60/131c2e/f59e0b?text=P'}
                                        style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                        alt={product.name}
                                    />
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4 }}>{product.name}</p>
                                        <p style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.9375rem' }}>₹{product.price?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input className="form-input" type="number" min={1} max={product.stock} value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))} style={{ width: 80 }} />
                                </div>

                                <div className="divider" />
                                {[['Items', `₹${totalPrice.toLocaleString()}`], ['Tax (18%)', `₹${taxPrice.toLocaleString()}`], ['Shipping', shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`]].map(([l, v]) => (
                                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        <span>{l}</span><span>{v}</span>
                                    </div>
                                ))}
                                <div className="divider" />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.0625rem' }}>
                                    <span>Total</span>
                                    <span className="gradient-text">₹{grandTotal.toLocaleString()}</span>
                                </div>
                            </>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No product selected.</p>
                        )}
                    </div>

                    <button form="order-form" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || !product}>
                        {loading ? 'Placing Order…' : '✓ Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    )
}
