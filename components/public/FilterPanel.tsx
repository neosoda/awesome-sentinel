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

const fieldLabelClass = 'mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--md-on-surface-variant)]'

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
      const currentValue = searchParams.get(key)
      setParam(key, currentValue === 'true' ? null : 'true')
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
    <aside className="w-full flex-shrink-0 lg:w-72">
      <div className="md-card sticky top-24 p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--md-on-background)]">Filtres</h2>
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="md-focus rounded-full px-2 py-1 text-xs font-medium text-[var(--md-primary)] transition-colors hover:bg-[rgba(103,80,164,0.1)]"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div className="mb-6">
          <label className={fieldLabelClass}>Trier par</label>
          <select
            value={current.sort}
            onChange={(event) => setParam('sort', event.target.value)}
            className="md-filled-field px-3 text-sm"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {categories.length > 0 && (
          <div className="mb-6">
            <label className={fieldLabelClass}>Catégorie</label>
            <div className="space-y-1.5">
              <CategoryButton
                active={!current.category}
                label="Toutes"
                onClick={() => setParam('category', null)}
              />
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  active={current.category === category.slug}
                  label={`${category.icon ? `${category.icon} ` : ''}${category.name}`}
                  count={category._count.tools}
                  onClick={() => setParam('category', current.category === category.slug ? null : category.slug)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className={fieldLabelClass}>Type</label>
          <select
            value={current.type}
            onChange={(event) => setParam('type', event.target.value || null)}
            className="md-filled-field px-3 text-sm"
          >
            <option value="">Tous les types</option>
            {TYPES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className={fieldLabelClass}>Statut</label>
          <select
            value={current.status}
            onChange={(event) => setParam('status', event.target.value || null)}
            className="md-filled-field px-3 text-sm"
          >
            <option value="">Tous les statuts</option>
            {STATUSES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className={fieldLabelClass}>Options</label>
          {[
            { key: 'selfHosted', label: 'Self-Hosted', active: current.selfHosted },
            { key: 'docker', label: 'Docker disponible', active: current.docker },
            { key: 'openSource', label: 'Open Source', active: current.openSource },
          ].map(({ key, label, active }) => (
            <button
              key={key}
              onClick={() => toggleBool(key)}
              className={`md-focus flex min-h-11 w-full items-center gap-2 rounded-full border px-3 py-2 text-left text-sm font-medium transition-all active:scale-95 ${
                active
                  ? 'border-transparent bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)]'
                  : 'border-transparent bg-[var(--md-surface-container-high)] text-[var(--md-on-surface-variant)] hover:bg-[rgba(103,80,164,0.1)]'
              }`}
            >
              <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded ${active ? 'bg-[var(--md-primary)]' : 'bg-[var(--md-outline-variant)]'}`}>
                {active && (
                  <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function CategoryButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`md-focus flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-sm font-medium transition-colors ${
        active
          ? 'bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)]'
          : 'text-[var(--md-on-surface-variant)] hover:bg-[rgba(103,80,164,0.08)] hover:text-[var(--md-primary)]'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && <span className="text-xs opacity-70">{count}</span>}
    </button>
  )
}
