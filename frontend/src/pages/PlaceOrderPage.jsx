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
                shippingInfo: { ...shipping, pincode: Number(shipping.pincode), phoneNumber: Number(shipping.phoneNumber) },
                orderedItems: [{ name: product.name, price: product.price, quantity: qty, image: product.images?.[0]?.url || 'placeholder', product: product._id }],
                paymentInfo: { id: `PAY_${Date.now()}`, status: true },
                paidAt: new Date(),
                itemsPrice: totalPrice, taxPrice, shippingPrice, totalPrice: grandTotal,
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
        <div className="container page-content page-enter max-w-[900px]">
            <h1 className="section-title mb-2">Place <span>Order</span></h1>
            <p className="section-subtitle">Review your order details</p>

            <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 340px' }}>
                {/* Shipping Form */}
                <div className="glass-card p-7">
                    <h2 className="font-bold mb-5">Shipping Information</h2>
                    <form id="order-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Address</label>
                            <input className="form-input" name="address" value={shipping.address}
                                onChange={handleChange} placeholder="123 Main Street, Apt 4B" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-2 gap-4">
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
                    <div className="glass-card p-6 mb-4">
                        <h2 className="font-bold mb-4 text-base">Order Summary</h2>
                        {product ? (
                            <>
                                <div className="flex gap-3 items-center mb-4 pb-4"
                                    style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <img
                                        src={product.images?.[0]?.url || 'https://placehold.co/60x60/131c2e/f59e0b?text=P'}
                                        className="w-14 h-14 rounded-lg object-cover" alt={product.name}
                                    />
                                    <div>
                                        <p className="font-semibold text-sm leading-snug">{product.name}</p>
                                        <p className="text-accent font-bold text-[0.9375rem]">₹{product.price?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input className="form-input w-20" type="number" min={1} max={product.stock}
                                        value={qty} onChange={(e) => setQty(Number(e.target.value))} />
                                </div>

                                <div className="divider" />
                                {[['Items', `₹${totalPrice.toLocaleString()}`], ['Tax (18%)', `₹${taxPrice.toLocaleString()}`], ['Shipping', shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`]].map(([l, v]) => (
                                    <div key={l} className="flex justify-between mb-2 text-sm text-text-sub">
                                        <span>{l}</span><span>{v}</span>
                                    </div>
                                ))}
                                <div className="divider" />
                                <div className="flex justify-between font-bold text-[1.0625rem]">
                                    <span>Total</span>
                                    <span className="gradient-text">₹{grandTotal.toLocaleString()}</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-text-muted">No product selected.</p>
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
