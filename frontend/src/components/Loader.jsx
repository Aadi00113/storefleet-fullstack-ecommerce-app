export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div
                className="w-11 h-11 rounded-full border-[3px] border-t-accent"
                style={{
                    borderColor: 'var(--border-color)',
                    borderTopColor: '#f59e0b',
                    animation: 'spin 0.8s linear infinite',
                }}
            />
            <p className="text-text-muted text-sm">Loading…</p>
        </div>
    )
}
