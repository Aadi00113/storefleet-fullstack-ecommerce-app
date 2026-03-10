import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductDetails, rateProduct, deleteReview } from '../api/productService'
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
            setUserRating(0); setComment('')
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
        <div className="container page-content text-center pt-16">
            <p className="text-text-muted text-lg">Product not found.</p>
            <Link to="/products" className="btn btn-primary mt-4">← Back to Products</Link>
        </div>
    )

    const images = product.images?.length ? product.images : [{ url: PLACEHOLDER }]

    return (
        <div className="container page-content page-enter">
            {/* Breadcrumb */}
            <div className="flex gap-2 text-[0.85rem] text-text-muted mb-6">
                <Link to="/" className="text-text-muted hover:text-accent">Home</Link>
                <span>/</span>
                <Link to="/products" className="text-text-muted hover:text-accent">Products</Link>
                <span>/</span>
                <span className="text-text-main">{product.name}</span>
            </div>

            {/* Main Grid */}
            <div className="product-detail-grid grid grid-cols-2 gap-12 mb-12">
                {/* Images */}
                <div>
                    <div className="rounded-2xl overflow-hidden mb-3"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', aspectRatio: '4/3' }}>
                        <img src={images[selectedImg]?.url || PLACEHOLDER} alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = PLACEHOLDER }} />
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2">
                            {images.map((img, i) => (
                                <div key={i} onClick={() => setSelectedImg(i)}
                                    className="w-[60px] h-[60px] rounded-lg overflow-hidden cursor-pointer"
                                    style={{ border: i === selectedImg ? '2px solid #f59e0b' : '2px solid var(--border-color)' }}>
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4">
                    <div>
                        <span className="badge badge-info mb-3">{product.category}</span>
                        <h1 className="text-[1.75rem] font-extrabold leading-snug mb-3">{product.name}</h1>
                        <div className="flex items-center gap-2">
                            <StarRating rating={product.rating} size={20} />
                            <span className="text-text-muted text-sm">
                                ({product.reviews?.length || 0} review{product.reviews?.length !== 1 ? 's' : ''})
                            </span>
                        </div>
                    </div>

                    <div className="text-[2.25rem] font-extrabold text-accent">
                        ₹{product.price?.toLocaleString()}
                    </div>

                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.8125rem] font-semibold w-fit"
                        style={{
                            background: product.stock > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                            color: product.stock > 0 ? 'var(--success)' : 'var(--error)',
                        }}>
                        {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✕ Out of Stock'}
                    </span>

                    <div className="divider" />

                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-text-sub leading-relaxed">{product.description}</p>
                    </div>

                    <div className="divider" />

                    {product.stock > 0 && (
                        <Link to="/place-order" state={{ product }} className="btn btn-primary btn-lg self-start">
                            🛒 Place Order
                        </Link>
                    )}
                </div>
            </div>

            {/* Reviews */}
            <div className="reviews-grid grid grid-cols-2 gap-8">
                {/* Write Review */}
                <div className="glass-card p-6">
                    <h2 className="font-bold mb-4 text-lg">Write a Review</h2>
                    {!user ? (
                        <p className="text-text-muted">
                            <Link to="/login" className="text-accent">Login</Link> to leave a review.
                        </p>
                    ) : (
                        <>
                            <div className="mb-4">
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
                    <h2 className="font-bold mb-4 text-lg">
                        Customer Reviews ({product.reviews?.length || 0})
                    </h2>
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                        {product.reviews?.length ? product.reviews.map((rev) => (
                            <div key={rev._id} className="rounded-xl p-3.5"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <span className="font-semibold text-sm">{rev.name}</span>
                                        <div className="mt-0.5"><StarRating rating={rev.rating} size={13} /></div>
                                    </div>
                                    {user && (user._id === rev.user || user.role === 'admin') && (
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(rev._id)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                                {rev.comment && <p className="text-text-sub text-sm mt-1">{rev.comment}</p>}
                            </div>
                        )) : (
                            <p className="text-text-muted">No reviews yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
