import { notFound } from 'next/navigation'
import { ToolCard } from '@/components/public/ToolCard'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          {category.icon && <span className="text-4xl">{category.icon}</span>}
          <h1 className="text-3xl font-bold text-slate-100">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-slate-400 max-w-2xl">{category.description}</p>
        )}
        <p className="text-slate-500 text-sm mt-2">{tools.length} outil{tools.length !== 1 ? 's' : ''}</p>
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-slate-500">Aucun outil dans cette catégorie.</p>
        </div>
      )}
    </div>
  )
}
