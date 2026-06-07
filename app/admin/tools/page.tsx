import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { TOOL_STATUS_LABELS, TOOL_STATUS_COLORS, formatDateShort, cn } from '@/lib/utils'
import { DeleteToolButton } from '@/components/admin/DeleteToolButton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gestion des outils' }

export default async function AdminToolsPage() {
  const tools = await prisma.tool.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { category: true, tags: { include: { tag: true } } },
  })

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Outils</h1>
          <p className="text-slate-500 text-sm mt-1">{tools.length} outil{tools.length !== 1 ? 's' : ''} référencé{tools.length !== 1 ? 's' : ''}</p>
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

      <div className="glass-card rounded-xl overflow-hidden">
        {tools.length > 0 ? (
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
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-slate-500 mb-4">Aucun outil pour l'instant</p>
            <Link href="/admin/tools/new" className="text-sm text-indigo-400 hover:text-indigo-300">
              Ajouter le premier outil →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
