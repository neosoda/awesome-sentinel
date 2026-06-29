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
  { value: 'createdAt', label: "Date d'ajout" },
  { value: 'updated', label: 'Mise à jour' },
  { value: 'name', label: 'Nom A-Z' },
  { value: 'recommended', label: 'Recommandé' },
]

const fieldLabelClass =
  'mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--md-on-surface-variant)]'

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
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    },
    [router, pathname, searchParams],
  )

  const toggleBool = useCallback(
    (key: string) => {
      const currentValue = searchParams.get(key)
      setParam(key, currentValue === 'true' ? null : 'true')
    },
    [searchParams, setParam],
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

  const hasFilters =
    current.category ||
    current.type ||
    current.status ||
    current.selfHosted ||
    current.docker ||
    current.openSource

  return (
    <aside className="w-full min-w-0 xl:w-[19rem] xl:flex-shrink-0">
      <div className="md-card p-4 sm:p-5 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <h2 className="text-base font-bold text-[var(--md-on-background)]">Filtres</h2>
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="md-focus flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--md-primary)] transition-colors hover:bg-[rgba(103,80,164,0.1)]"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:block">
          <div className="xl:mb-6">
            <label className={fieldLabelClass}>Trier par</label>
            <select
              value={current.sort}
              onChange={(event) => setParam('sort', event.target.value)}
              className="md-filled-field min-h-12 px-3 text-sm xl:min-h-14"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 xl:block">
            <div className="xl:mb-6">
              <label className={fieldLabelClass}>Type</label>
              <select
                value={current.type}
                onChange={(event) => setParam('type', event.target.value || null)}
                className="md-filled-field min-h-12 px-3 text-sm xl:min-h-14"
              >
                <option value="">Tous les types</option>
                {TYPES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="xl:mb-6">
              <label className={fieldLabelClass}>Statut</label>
              <select
                value={current.status}
                onChange={(event) => setParam('status', event.target.value || null)}
                className="md-filled-field min-h-12 px-3 text-sm xl:min-h-14"
              >
                <option value="">Tous les statuts</option>
                {STATUSES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mt-5 xl:mb-6 xl:mt-0">
            <label className={fieldLabelClass}>Catégorie</label>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:px-5 xl:mx-0 xl:block xl:max-h-72 xl:space-y-1.5 xl:overflow-y-auto xl:px-0 xl:pb-0">
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

        <div className="mt-4 xl:mt-0">
          <label className={fieldLabelClass}>Options</label>
          <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
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
                <span
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded ${
                    active ? 'bg-[var(--md-primary)]' : 'bg-[var(--md-outline-variant)]'
                  }`}
                >
                  {active && (
                    <svg
                      className="h-2.5 w-2.5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="min-w-0 truncate">{label}</span>
              </button>
            ))}
          </div>
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
      className={`md-focus flex min-h-10 w-auto flex-none items-center justify-between gap-3 whitespace-nowrap rounded-full px-3 py-2 text-left text-sm font-medium transition-colors xl:w-full xl:whitespace-normal ${
        active
          ? 'bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)]'
          : 'text-[var(--md-on-surface-variant)] hover:bg-[rgba(103,80,164,0.08)] hover:text-[var(--md-primary)]'
      }`}
    >
      <span className="min-w-0 xl:truncate">{label}</span>
      {count !== undefined && <span className="text-xs opacity-70">{count}</span>}
    </button>
  )
}
