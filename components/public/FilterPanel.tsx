'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { TOOL_TYPE_LABELS, TOOL_STATUS_LABELS } from '@/lib/utils'
import type { Category } from '@prisma/client'

interface FilterPanelProps {
  categories: (Category & { _count: { tools: number } })[]
}

const TYPES = Object.entries(TOOL_TYPE_LABELS)
const STATUSES = Object.entries(TOOL_STATUS_LABELS)
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date d\'ajout' },
  { value: 'updated', label: 'Mise à jour' },
  { value: 'name', label: 'Nom A–Z' },
  { value: 'recommended', label: 'Recommandé' },
]

export function FilterPanel({ categories }: FilterPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const toggleBool = useCallback(
    (key: string) => {
      const current = searchParams.get(key)
      setParam(key, current === 'true' ? null : 'true')
    },
    [searchParams, setParam]
  )

  const current = {
    category: searchParams.get('category') ?? '',
    type: searchParams.get('type') ?? '',
    status: searchParams.get('status') ?? '',
    selfHosted: searchParams.get('selfHosted') === 'true',
    docker: searchParams.get('docker') === 'true',
    openSource: searchParams.get('openSource') === 'true',
    sort: searchParams.get('sort') ?? 'createdAt',
  }

  const hasFilters = current.category || current.type || current.status || current.selfHosted || current.docker || current.openSource

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="glass-card rounded-xl p-4 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-200 text-sm">Filtres</h2>
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="mb-5">
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Trier par</label>
          <select
            value={current.sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-5">
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Catégorie</label>
            <div className="space-y-1">
              <button
                onClick={() => setParam('category', null)}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!current.category ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
              >
                Toutes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setParam('category', current.category === cat.slug ? null : cat.slug)}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex justify-between items-center ${current.category === cat.slug ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                >
                  <span>{cat.icon && <span className="mr-1">{cat.icon}</span>}{cat.name}</span>
                  <span className="text-xs text-slate-600">{cat._count.tools}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type */}
        <div className="mb-5">
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Type</label>
          <select
            value={current.type}
            onChange={(e) => setParam('type', e.target.value || null)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">Tous les types</option>
            {TYPES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="mb-5">
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Statut</label>
          <select
            value={current.status}
            onChange={(e) => setParam('status', e.target.value || null)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">Tous les statuts</option>
            {STATUSES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Boolean toggles */}
        <div className="space-y-2">
          <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Options</label>
          {[
            { key: 'selfHosted', label: '🖥️ Self-Hosted', active: current.selfHosted },
            { key: 'docker', label: '🐳 Docker disponible', active: current.docker },
            { key: 'openSource', label: '💻 Open Source', active: current.openSource },
          ].map(({ key, label, active }) => (
            <button
              key={key}
              onClick={() => toggleBool(key)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${active ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 border border-transparent'}`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${active ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                {active && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
