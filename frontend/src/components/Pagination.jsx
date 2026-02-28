export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    const pages = []
    for (let i = 1; i <= totalPages; i++) pages.push(i)

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <button
                className="btn btn-secondary btn-sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ← Prev
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-sm)',
                        border: p === currentPage ? 'none' : '1px solid var(--border-color)',
                        background: p === currentPage ? 'var(--accent-primary)' : 'transparent',
                        color: p === currentPage ? '#0a0e1a' : 'var(--text-secondary)',
                        fontWeight: p === currentPage ? 700 : 400,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all 0.15s ease',
                    }}
                >
                    {p}
                </button>
            ))}

            <button
                className="btn btn-secondary btn-sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next →
            </button>
        </div>
    )
}
