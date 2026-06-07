import { getCategories } from '@/lib/actions/categories'
import { AdminCategoriesClient } from '@/components/admin/AdminCategoriesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Catégories' }

export default async function AdminCategoriesPage() {
  const categories = await getCategories()
  return (
    <div className="max-w-3xl">
      <AdminCategoriesClient categories={categories} />
    </div>
  )
}
