import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import './ProductCard.css'

const PLACEHOLDER = 'https://placehold.co/300x220/131c2e/f59e0b?text=No+Image'

export default function ProductCard({ product }) {
    const imgUrl = product.images?.[0]?.url || PLACEHOLDER

    return (
        <Link to={`/product/${product._id}`} className="product-card glass-card">
            <div className="product-card-img-wrap">
                <img
                    src={imgUrl}
                    alt={product.name}
                    className="product-card-img"
                    onError={(e) => { e.target.src = PLACEHOLDER }}
                />
                <div className="product-card-category">{product.category}</div>
                {product.stock === 0 && (
                    <div className="product-card-out-badge">Out of Stock</div>
                )}
            </div>

            <div className="product-card-body">
                <h3 className="product-card-name">{product.name}</h3>
                <div className="product-card-rating">
                    <StarRating rating={product.rating} size={14} />
                    <span className="product-card-rating-text">{product.rating?.toFixed(1)}</span>
                </div>
                <div className="product-card-footer">
                    <span className="product-card-price">₹{product.price?.toLocaleString()}</span>
                    <span className="product-card-stock">
                        {product.stock > 0 ? `${product.stock} left` : 'Unavailable'}
                    </span>
                </div>
            </div>
        </Link>
    )
}
