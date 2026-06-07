import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getToolBySlug } from '@/lib/actions/tools'
import {
  TOOL_TYPE_LABELS, TOOL_TYPE_COLORS,
  TOOL_STATUS_LABELS, TOOL_STATUS_COLORS,
  formatDate, cn
} from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) return { title: 'Outil introuvable' }
  return {
    title: `${tool.title} — Awesome Sentinel`,
    description: tool.shortDescription,
  }
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) notFound()

  const links = [
    { label: 'Site web', url: tool.websiteUrl, icon: '🌐' },
    { label: 'GitHub', url: tool.githubUrl, icon: '🐙' },
    { label: 'Documentation', url: tool.docsUrl, icon: '📖' },
    { label: 'Démo', url: tool.demoUrl, icon: '🚀' },
  ].filter((l) => l.url)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/tools" className="hover:text-slate-300 transition-colors">Catalogue</Link>
        <span>/</span>
        <span className="text-slate-300">{tool.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700/50">
              {tool.imageUrl ? (
                <Image src={tool.imageUrl} alt={tool.title} width={80} height={80} className="object-cover" unoptimized />
              ) : (
                <span className="text-4xl font-bold text-slate-400">{tool.title.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl font-bold text-slate-100">{tool.title}</h1>
                {tool.isRecommended && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2 py-1 rounded-full font-medium">
                    ⭐ Recommandé
                  </span>
                )}
                {tool.isFavorite && (
                  <span className="inline-flex items-center gap-1 bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs px-2 py-1 rounded-full font-medium">
                    ❤️ Favori
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">{tool.shortDescription}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={cn('text-sm px-3 py-1 rounded-full border font-medium', TOOL_TYPE_COLORS[tool.type])}>
              {TOOL_TYPE_LABELS[tool.type]}
            </span>
            <span className={cn('text-sm px-3 py-1 rounded-full border font-medium', TOOL_STATUS_COLORS[tool.status])}>
              {TOOL_STATUS_LABELS[tool.status]}
            </span>
            {tool.isSelfHosted && (
              <span className="text-sm px-3 py-1 rounded-full border bg-blue-500/10 text-blue-300 border-blue-500/20 font-medium">
                🖥️ Self-Hosted
              </span>
            )}
            {tool.hasDocker && (
              <span className="text-sm px-3 py-1 rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-500/20 font-medium">
                🐳 Docker
              </span>
            )}
            {tool.isOpenSource && (
              <span className="text-sm px-3 py-1 rounded-full border bg-green-500/10 text-green-300 border-green-500/20 font-medium">
                💻 Open Source
              </span>
            )}
          </div>

          {/* Long description */}
          {tool.longDescription && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Description</h2>
              <div className="prose-dark whitespace-pre-wrap">{tool.longDescription}</div>
            </div>
          )}

          {/* Tags */}
          {tool.tags.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg transition-colors border border-slate-700/50"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Public notes */}
          {tool.publicNotes && (
            <div className="glass-card rounded-xl p-6 border-l-4 border-indigo-500/50">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">📝 Notes</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{tool.publicNotes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Links */}
          {links.length > 0 && (
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Liens</h3>
              <div className="space-y-2">
                {links.map(({ label, url, icon }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-slate-300 hover:text-indigo-300 transition-colors group"
                  >
                    <span>{icon}</span>
                    <span className="group-hover:underline">{label}</span>
                    <svg className="w-3 h-3 ml-auto text-slate-600 group-hover:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Détails</h3>
            <dl className="space-y-3">
              {tool.category && (
                <div>
                  <dt className="text-xs text-slate-600 mb-0.5">Catégorie</dt>
                  <dd>
                    <Link href={`/categories/${tool.category.slug}`} className="text-sm text-indigo-400 hover:text-indigo-300">
                      {tool.category.icon} {tool.category.name}
                    </Link>
                  </dd>
                </div>
              )}
              {tool.license && (
                <div>
                  <dt className="text-xs text-slate-600 mb-0.5">Licence</dt>
                  <dd className="text-sm text-slate-300">{tool.license}</dd>
                </div>
              )}
              {tool.pricing && (
                <div>
                  <dt className="text-xs text-slate-600 mb-0.5">Prix / Modèle</dt>
                  <dd className="text-sm text-slate-300">{tool.pricing}</dd>
                </div>
              )}
              {tool.personalScore !== null && tool.personalScore !== undefined && (
                <div>
                  <dt className="text-xs text-slate-600 mb-0.5">Score personnel</dt>
                  <dd className="flex items-center gap-2">
                    <span className="score-badge text-white text-sm font-bold px-2.5 py-0.5 rounded-lg">
                      {tool.personalScore}/10
                    </span>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-slate-600 mb-0.5">Ajouté le</dt>
                <dd className="text-sm text-slate-400">{formatDate(tool.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-600 mb-0.5">Mis à jour le</dt>
                <dd className="text-sm text-slate-400">{formatDate(tool.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
