import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TOOL_STATUS_LABELS } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

async function getDashboardStats() {
  const [totalTools, totalCategories, totalTags, byStatus, recentTools] = await Promise.all([
    prisma.tool.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.tool.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.tool.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { category: true },
    }),
  ])
  return { totalTools, totalCategories, totalTags, byStatus, recentTools }
}

export default async function AdminDashboardPage() {
  const { totalTools, totalCategories, totalTags, byStatus, recentTools } = await getDashboardStats()

  const stats = [
    { label: 'Outils', value: totalTools, href: '/admin/tools', color: 'from-indigo-500 to-purple-600', icon: '📦' },
    { label: 'Catégories', value: totalCategories, href: '/admin/categories', color: 'from-blue-500 to-cyan-600', icon: '📂' },
    { label: 'Tags', value: totalTags, href: '/admin/tags', color: 'from-emerald-500 to-teal-600', icon: '🏷️' },
  ]

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Vue d&apos;ensemble de votre catalogue</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, href, color, icon }) => (
          <Link key={label} href={href} className="group block">
            <div className="glass-card rounded-xl p-6 hover:bg-slate-800/60 transition-all tool-card-glow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{icon}</span>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color}`} />
              </div>
              <div className={`text-3xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {value}
              </div>
              <div className="text-sm text-slate-400 mt-1">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Répartition par statut</h2>
          <div className="space-y-3">
            {byStatus.map(({ status, _count }) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{TOOL_STATUS_LABELS[status] ?? status}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.round((_count.id / totalTools) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">{_count.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent tools */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Récemment modifiés</h2>
            <Link href="/admin/tools" className="text-xs text-indigo-400 hover:text-indigo-300">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentTools.map((tool) => (
              <Link key={tool.id} href={`/admin/tools/${tool.id}/edit`} className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-400 flex-shrink-0">
                  {tool.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 group-hover:text-indigo-300 truncate transition-colors">{tool.title}</p>
                  <p className="text-xs text-slate-600 truncate">{tool.category?.name ?? 'Sans catégorie'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/tools/new" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter un outil
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors">
            Gérer les catégories
          </Link>
          <Link href="/admin/tags" className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors">
            Gérer les tags
          </Link>
        </div>
      </div>
    </div>
  )
}
