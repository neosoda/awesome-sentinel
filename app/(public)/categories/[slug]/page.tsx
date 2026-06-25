import { notFound } from 'next/navigation'
import { ToolCard } from '@/components/public/ToolCard'
import { PageHeader } from '@/components/public/PageHeader'
import { getCategoryBySlug } from '@/lib/actions/categories'
import { getTools } from '@/lib/actions/tools'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Catégorie introuvable' }
  return {
    title: `${category.name} — Awesome Sentinel`,
    description: category.description ?? `Outils dans la catégorie ${category.name}`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const tools = await getTools({ categoryId: category.id })

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        title={category.name}
        description={category.description}
        meta={`${tools.length} outil${tools.length !== 1 ? 's' : ''}`}
        icon={category.icon ?? undefined}
      />

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="md-card py-20 text-center">
          <div className="mb-4 text-5xl">📂</div>
          <p className="text-[var(--md-on-surface-variant)]">Aucun outil dans cette catégorie.</p>
        </div>
      )}
    </div>
  )
}
