import { CategoryCard } from '@/components/public/CategoryCard'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Catégories</h1>
        <p className="text-slate-500">{categories.length} catégorie{categories.length !== 1 ? 's' : ''}</p>
      </div>
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-slate-500">Aucune catégorie pour l'instant.</p>
        </div>
      )}
    </div>
  )
}
