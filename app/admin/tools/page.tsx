import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { TOOL_STATUS_LABELS, TOOL_STATUS_COLORS, formatDateShort, cn } from '@/lib/utils'
import { DeleteToolButton } from '@/components/admin/DeleteToolButton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gestion des outils' }
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

interface PageProps {
  searchParams: Promise<{
    q?: string
    categoryId?: string
    status?: string
    page?: string
    notice?: string
  }>
}

function buildPageHref(params: URLSearchParams, page: number) {
  const nextParams = new URLSearchParams(params.toString())
  if (page <= 1) {
    nextParams.delete('page')
  } else {
    nextParams.set('page', String(page))
  }

  const query = nextParams.toString()
  return query ? `/admin/tools?${query}` : '/admin/tools'
}

export default async function AdminToolsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)
  const query = params.q?.trim() ?? ''

  const where: Prisma.ToolWhereInput = {}

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { shortDescription: { contains: query, mode: 'insensitive' } },
      { longDescription: { contains: query, mode: 'insensitive' } },
    ]
  }

  if (params.categoryId) {
    where.categoryId = params.categoryId
  }

  if (params.status) {
    where.status = params.status as Prisma.ToolScalarWhereInput['status']
  }

  const [totalTools, allToolsCount, categories] = await Promise.all([
    prisma.tool.count({ where }),
    prisma.tool.count(),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, icon: true },
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalTools / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const tools = await prisma.tool.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { category: true },
  })
  const hasFilters = Boolean(query || params.categoryId || params.status)
  const pageParams = new URLSearchParams()
  if (query) pageParams.set('q', query)
  if (params.categoryId) pageParams.set('categoryId', params.categoryId)
  if (params.status) pageParams.set('status', params.status)
  const rangeStart = totalTools === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(safePage * PAGE_SIZE, totalTools)
  const notice =
    params.notice === 'created'
      ? 'Outil créé avec succès.'
      : params.notice === 'updated'
        ? 'Outil mis à jour avec succès.'
        : null

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Outils</h1>
          <p className="text-slate-500 text-sm mt-1">
            {hasFilters ? `${totalTools} résultat${totalTools > 1 ? 's' : ''}` : `${allToolsCount} outil${allToolsCount > 1 ? 's' : ''} référencé${allToolsCount > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/admin/tools/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvel outil
        </Link>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 mb-6">
          {notice}
        </div>
      )}

      <div className="glass-card rounded-xl p-5 mb-6">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label htmlFor="q" className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Recherche</label>
            <input
              id="q"
              name="q"
              defaultValue={query}
              placeholder="Titre, description courte, description longue"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Catégorie</label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={params.categoryId ?? ''}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">Toutes</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon ? `${category.icon} ` : ''}{category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Statut</label>
            <select
              id="status"
              name="status"
              defaultValue={params.status ?? ''}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">Tous</option>
              {Object.entries(TOOL_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4 flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-500">
              {totalTools > 0 ? `Affichage ${rangeStart}-${rangeEnd} sur ${totalTools}` : 'Aucun résultat'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {hasFilters && (
                <Link
                  href="/admin/tools"
                  className="px-3 py-2 text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Réinitialiser
                </Link>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                Filtrer
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {tools.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs text-slate-500 font-medium px-5 py-3 uppercase tracking-wider">Outil</th>
                <th className="text-left text-xs text-slate-500 font-medium px-5 py-3 uppercase tracking-wider hidden md:table-cell">Catégorie</th>
                <th className="text-left text-xs text-slate-500 font-medium px-5 py-3 uppercase tracking-wider hidden lg:table-cell">Statut</th>
                <th className="text-left text-xs text-slate-500 font-medium px-5 py-3 uppercase tracking-wider hidden xl:table-cell">Mis à jour</th>
                <th className="text-right text-xs text-slate-500 font-medium px-5 py-3 uppercase tracking-wider">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {tools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-400 flex-shrink-0">
                          {tool.title.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{tool.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {tool.isRecommended && <span className="text-xs text-amber-400">⭐</span>}
                            {tool.isFavorite && <span className="text-xs text-pink-400">❤️</span>}
                            {tool.hasDocker && <span className="text-xs text-slate-600">🐳</span>}
                            {tool.isSelfHosted && <span className="text-xs text-slate-600">🖥️</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-slate-400">{tool.category?.name ?? '—'}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={cn('text-xs px-2 py-1 rounded-full border', TOOL_STATUS_COLORS[tool.status])}>
                        {TOOL_STATUS_LABELS[tool.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-xs text-slate-600">{formatDateShort(tool.updatedAt)}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/tools/${tool.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors"
                          title="Voir"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/tools/${tool.id}/edit`}
                          className="p-1.5 text-slate-600 hover:text-indigo-400 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </Link>
                        <DeleteToolButton toolId={tool.id} toolTitle={tool.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-700/50 px-5 py-4">
                <p className="text-sm text-slate-500">
                  Page {safePage} sur {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={buildPageHref(pageParams, safePage - 1)}
                    aria-disabled={safePage <= 1}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      safePage <= 1
                        ? 'pointer-events-none bg-slate-900 text-slate-700'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    Précédent
                  </Link>
                  <Link
                    href={buildPageHref(pageParams, safePage + 1)}
                    aria-disabled={safePage >= totalPages}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      safePage >= totalPages
                        ? 'pointer-events-none bg-slate-900 text-slate-700'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    Suivant
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-slate-500 mb-4">
              {hasFilters ? 'Aucun outil ne correspond aux filtres actuels.' : 'Aucun outil pour l’instant.'}
            </p>
            {hasFilters ? (
              <Link href="/admin/tools" className="text-sm text-indigo-400 hover:text-indigo-300">
                Réinitialiser les filtres →
              </Link>
            ) : (
              <Link href="/admin/tools/new" className="text-sm text-indigo-400 hover:text-indigo-300">
                Ajouter le premier outil →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
