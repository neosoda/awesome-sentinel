import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getToolBySlug } from '@/lib/actions/tools'
import {
  TOOL_TYPE_LABELS,
  TOOL_STATUS_LABELS,
  PUBLIC_TOOL_TYPE_COLORS,
  PUBLIC_TOOL_STATUS_COLORS,
  formatDate,
  cn,
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
  ].filter((link) => link.url)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--md-on-surface-variant)]">
        <Link href="/tools" className="md-focus rounded-full px-2 py-1 text-[var(--md-primary)] hover:bg-[rgba(103,80,164,0.08)]">
          Catalogue
        </Link>
        <span aria-hidden="true">/</span>
        <span>{tool.title}</span>
      </nav>

      <header className="relative mb-10 overflow-hidden rounded-[32px] bg-[var(--md-surface-container)] p-6 sm:p-9">
        <div aria-hidden="true" className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#D0BCFF]/45 blur-3xl" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row">
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-[28px] bg-[var(--md-surface-container-high)] shadow-sm">
            {tool.imageUrl ? (
              <Image src={tool.imageUrl} alt={tool.title} width={96} height={96} className="h-full w-full object-cover" unoptimized />
            ) : (
              <span className="text-4xl font-bold text-[var(--md-primary)]">{tool.title.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-[-0.025em] text-[var(--md-on-background)] sm:text-5xl">
                {tool.title}
              </h1>
              {tool.isRecommended && (
                <span className="md-chip bg-[#F2E5A7] text-[#211B00]">★ Recommandé</span>
              )}
              {tool.isFavorite && (
                <span className="md-chip bg-[#FFD8E4] text-[#31111D]">♥ Favori</span>
              )}
            </div>
            <p className="max-w-3xl text-lg leading-8 text-[var(--md-on-surface-variant)]">{tool.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className={cn('md-chip border', PUBLIC_TOOL_TYPE_COLORS[tool.type])}>
                {TOOL_TYPE_LABELS[tool.type]}
              </span>
              <span className={cn('md-chip border', PUBLIC_TOOL_STATUS_COLORS[tool.status])}>
                {TOOL_STATUS_LABELS[tool.status]}
              </span>
              {tool.isSelfHosted && <span className="md-chip bg-[#D8E2FF] text-[#001A43]">Self-Hosted</span>}
              {tool.hasDocker && <span className="md-chip bg-[#CCE8E4] text-[#07201E]">Docker</span>}
              {tool.isOpenSource && <span className="md-chip bg-[#D5E8CF] text-[#10200D]">Open Source</span>}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-8">
          {tool.longDescription && (
            <section className="md-card p-6 sm:p-8">
              <h2 className="mb-4 text-2xl font-bold text-[var(--md-on-background)]">Description</h2>
              <div className="prose-material whitespace-pre-wrap">{tool.longDescription}</div>
            </section>
          )}

          {tool.tags.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--md-on-surface-variant)]">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="md-focus md-chip border border-[var(--md-outline-variant)] bg-transparent text-[var(--md-primary)] transition-colors hover:bg-[rgba(103,80,164,0.08)]"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {tool.publicNotes && (
            <section className="rounded-[24px] border-l-4 border-[var(--md-primary)] bg-[var(--md-secondary-container)] p-6">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--md-on-secondary-container)]">Notes</h2>
              <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--md-on-secondary-container)]">{tool.publicNotes}</p>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          {links.length > 0 && (
            <section className="md-card p-5">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--md-on-surface-variant)]">Liens</h2>
              <div className="space-y-2">
                {links.map(({ label, url, icon }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md-focus group flex min-h-11 items-center gap-3 rounded-full px-3 text-sm font-medium text-[var(--md-on-surface-variant)] transition-colors hover:bg-[rgba(103,80,164,0.08)] hover:text-[var(--md-primary)]"
                  >
                    <span aria-hidden="true">{icon}</span>
                    <span>{label}</span>
                    <svg className="ml-auto h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="md-card p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--md-on-surface-variant)]">Détails</h2>
            <dl className="space-y-4">
              {tool.category && (
                <Detail label="Catégorie">
                  <Link href={`/categories/${tool.category.slug}`} className="text-[var(--md-primary)] hover:underline">
                    {tool.category.icon} {tool.category.name}
                  </Link>
                </Detail>
              )}
              {tool.license && <Detail label="Licence">{tool.license}</Detail>}
              {tool.pricing && <Detail label="Prix / Modèle">{tool.pricing}</Detail>}
              {tool.personalScore !== null && tool.personalScore !== undefined && (
                <Detail label="Score personnel">
                  <span className="inline-flex rounded-full bg-[var(--md-primary)] px-3 py-1 text-sm font-bold text-white">
                    {tool.personalScore}/10
                  </span>
                </Detail>
              )}
              <Detail label="Ajouté le">{formatDate(tool.createdAt)}</Detail>
              <Detail label="Mis à jour le">{formatDate(tool.updatedAt)}</Detail>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mb-1 text-xs font-medium text-[var(--md-on-surface-variant)]">{label}</dt>
      <dd className="text-sm text-[var(--md-on-background)]">{children}</dd>
    </div>
  )
}
