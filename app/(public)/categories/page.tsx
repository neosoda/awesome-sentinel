import { CategoryCard } from '@/components/public/CategoryCard'
import { PageHeader } from '@/components/public/PageHeader'
import { getCategories } from '@/lib/actions/categories'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Catégories — Awesome Sentinel',
  description: 'Explorez les outils par catégorie.',
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        title="Catégories"
        description="Explorez le catalogue par domaine et trouvez rapidement les outils adaptés à votre besoin."
        meta={`${categories.length} catégorie${categories.length !== 1 ? 's' : ''}`}
      />
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="md-card py-20 text-center">
          <div className="mb-4 text-5xl">📂</div>
          <p className="text-[var(--md-on-surface-variant)]">Aucune catégorie pour l&apos;instant.</p>
        </div>
      )}
    </div>
  )
}
