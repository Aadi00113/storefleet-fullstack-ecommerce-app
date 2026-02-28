import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductDetails, getProductReviews, rateProduct, deleteReview } from '../api/productService'
import StarRating from '../components/StarRating'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const PLACEHOLDER = 'https://placehold.co/500x400/131c2e/f59e0b?text=No+Image'

export default function ProductDetailPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImg, setSelectedImg] = useState(0)
    const [userRating, setUserRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const fetchProduct = () => {
        setLoading(true)
        getProductDetails(id)
            .then((r) => setProduct(r.data.productDetails))
            .catch(() => toast.error('Failed to load product'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchProduct() }, [id])

    const handleRate = async () => {
        if (!user) return toast.error('Login to leave a review')
        if (!userRating) return toast.error('Please select a rating')
        setSubmitting(true)
        try {
            await rateProduct(id, { rating: userRating, comment })
            toast.success('Review submitted!')
            setUserRating(0)
            setComment('')
            fetchProduct()
        } catch (e) {
            toast.error(e.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview({ productId: id, reviewId })
            toast.success('Review deleted')
            fetchProduct()
        } catch (e) {
            toast.error(e.message)
        }
    }

    if (loading) return <Loader />
    if (!product) return (
        <div className="container page-content" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Product not found.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>← Back to Products</Link>
        </div>
    )

    const images = product.images?.length ? product.images : [{ url: PLACEHOLDER }]

    return (
        <div className="container page-content page-enter">
            {/* Breadcrumb */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
                <span>/</span>
                <Link to="/products" style={{ color: 'var(--text-muted)' }}>Products</Link>
                <span>/</span>
                <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
            </div>

            {/* Main Grid */}
            <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                {/* Images */}
                <div>
                    <div style={{
                        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                        aspectRatio: '4/3', marginBottom: '0.75rem',
                    }}>
                        <img src={images[selectedImg]?.url || PLACEHOLDER} alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = PLACEHOLDER }} />
                    </div>
                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {images.map((img, i) => (
                                <div key={i}
                                    onClick={() => setSelectedImg(i)}
                                    style={{
                                        width: 60, height: 60, borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                                        cursor: 'pointer', border: i === selectedImg ? '2px solid var(--accent-primary)' : '2px solid var(--border-color)',
                                    }}>
                                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>{product.category}</span>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.75rem' }}>{product.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <StarRating rating={product.rating} size={20} />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                ({product.reviews?.length || 0} review{product.reviews?.length !== 1 ? 's' : ''})
                            </span>
                        </div>
                    </div>

                    <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                        ₹{product.price?.toLocaleString()}
                    </div>

                    <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                            padding: '0.3rem 0.875rem', borderRadius: '50px', fontSize: '0.8125rem', fontWeight: 600,
                            background: product.stock > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                            color: product.stock > 0 ? 'var(--success)' : 'var(--error)',
                        }}>
                            {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✕ Out of Stock'}
                        </span>
                    </div>

                    <div className="divider" />

                    <div>
                        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Description</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.description}</p>
                    </div>

                    <div className="divider" />

                    {/* Place Order Quick Link */}
                    {product.stock > 0 && (
                        <Link
                            to="/place-order"
                            state={{ product }}
                            className="btn btn-primary btn-lg"
                            style={{ alignSelf: 'flex-start' }}
                        >
                            🛒 Place Order
                        </Link>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Write Review */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.125rem' }}>Write a Review</h2>
                    {!user ? (
                        <p style={{ color: 'var(--text-muted)' }}>
                            <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Login</Link> to leave a review.
                        </p>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Your Rating</label>
                                <StarRating rating={userRating} onRate={setUserRating} size={28} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Comment (optional)</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience…"
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleRate} disabled={submitting}>
                                {submitting ? 'Submitting…' : 'Submit Review'}
                            </button>
                        </>
                    )}
                </div>

                {/* All Reviews */}
                <div>
                    <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.125rem' }}>
                        Customer Reviews ({product.reviews?.length || 0})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 400, overflowY: 'auto' }}>
                        {product.reviews?.length ? product.reviews.map((rev) => (
                            <div key={rev._id} style={{
                                background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)', padding: '0.875rem',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{rev.name}</span>
                                        <div style={{ marginTop: '2px' }}><StarRating rating={rev.rating} size={13} /></div>
                                    </div>
                                    {user && (user._id === rev.user || user.role === 'admin') && (
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(rev._id)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                                {rev.comment && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{rev.comment}</p>}
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
