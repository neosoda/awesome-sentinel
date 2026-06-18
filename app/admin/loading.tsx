export default function AdminLoading() {
  return (
    <div className="max-w-6xl animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-48 rounded-lg bg-slate-800" />
        <div className="h-4 w-72 rounded bg-slate-800/80" />
      </div>

      <div className="glass-card rounded-xl p-5 mb-6 h-32" />
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="border-b border-slate-700/50 px-5 py-4">
          <div className="h-4 w-40 rounded bg-slate-800" />
        </div>
        <div className="divide-y divide-slate-700/30">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="px-5 py-4">
              <div className="h-12 rounded-lg bg-slate-800/80" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
