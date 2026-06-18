export default function PublicLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-10 w-64 rounded-xl bg-slate-800" />
        <div className="h-4 w-80 max-w-full rounded bg-slate-800/80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-4 h-72" />
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-card rounded-xl p-5 h-56" />
          ))}
        </div>
      </div>
    </div>
  )
}
