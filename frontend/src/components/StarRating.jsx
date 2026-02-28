export default function StarRating({ rating = 0, max = 5, onRate, size = 20 }) {
    const stars = Array.from({ length: max }, (_, i) => i + 1)

    return (
        <div style={{ display: 'inline-flex', gap: '2px' }}>
            {stars.map((star) => (
                <span
                    key={star}
                    onClick={() => onRate && onRate(star)}
                    style={{
                        fontSize: size,
                        cursor: onRate ? 'pointer' : 'default',
                        color: star <= Math.round(rating) ? '#f59e0b' : '#374151',
                        transition: 'color 0.15s ease, transform 0.1s ease',
                        display: 'inline-block',
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
