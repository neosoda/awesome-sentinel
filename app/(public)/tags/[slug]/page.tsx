import { notFound } from 'next/navigation'
import { ToolCard } from '@/components/public/ToolCard'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-indigo-300 mb-4">
          <span className="text-lg font-bold">#{tag.name}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Outils tagués « {tag.name} »</h1>
        <p className="text-slate-500">{tools.length} outil{tools.length !== 1 ? 's' : ''}</p>
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🏷️</div>
          <p className="text-slate-500">Aucun outil avec ce tag.</p>
        </div>
      )}
    </div>
  )
}
