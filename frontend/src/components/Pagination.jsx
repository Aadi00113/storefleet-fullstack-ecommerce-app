export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    const pages = []
    for (let i = 1; i <= totalPages; i++) pages.push(i)

    return (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
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
                    className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer border"
                    style={{
                        background: p === currentPage ? '#f59e0b' : 'transparent',
                        color: p === currentPage ? '#0a0e1a' : 'var(--text-secondary)',
                        fontWeight: p === currentPage ? 700 : 400,
                        borderColor: p === currentPage ? 'transparent' : 'var(--border-color)',
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
