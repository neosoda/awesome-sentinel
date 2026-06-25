import { notFound } from 'next/navigation'
import { ToolCard } from '@/components/public/ToolCard'
import { PageHeader } from '@/components/public/PageHeader'
import { getTagBySlug } from '@/lib/actions/tags'
import { getTools } from '@/lib/actions/tools'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) return { title: 'Tag introuvable' }
  return {
    title: `#${tag.name} — Awesome Sentinel`,
    description: `Outils tagués ${tag.name}`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  const tools = await getTools({ tagSlug: slug })

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        title={`Outils tagués « ${tag.name} »`}
        description={`Parcourez tous les outils associés au tag #${tag.name}.`}
        meta={`${tools.length} outil${tools.length !== 1 ? 's' : ''}`}
      />

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="md-card py-20 text-center">
          <div className="mb-4 text-5xl">🏷️</div>
          <p className="text-[var(--md-on-surface-variant)]">Aucun outil avec ce tag.</p>
        </div>
      )}
    </div>
  )
}
