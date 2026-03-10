export default function StarRating({ rating = 0, max = 5, onRate, size = 20 }) {
    const stars = Array.from({ length: max }, (_, i) => i + 1)

    return (
        <div className="inline-flex gap-0.5">
            {stars.map((star) => (
                <span
                    key={star}
                    onClick={() => onRate && onRate(star)}
                    className="inline-block transition-all duration-150"
                    style={{
                        fontSize: size,
                        cursor: onRate ? 'pointer' : 'default',
                        color: star <= Math.round(rating) ? '#f59e0b' : '#374151',
                    }}
                    onMouseEnter={(e) => onRate && (e.target.style.transform = 'scale(1.2)')}
                    onMouseLeave={(e) => onRate && (e.target.style.transform = 'scale(1)')}
                >
                    ★
                </span>
            ))}
        </div>
    )
}
