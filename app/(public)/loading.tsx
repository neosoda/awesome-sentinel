export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <div className="h-12 w-64 rounded-2xl bg-[var(--md-surface-container-high)]" />
        <div className="h-5 w-96 max-w-full rounded-full bg-[var(--md-surface-container)]" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="md-card h-72 p-4" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-3 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="md-card h-64 p-5" />
          ))}
        </div>
      </div>
    </div>
  )
}
