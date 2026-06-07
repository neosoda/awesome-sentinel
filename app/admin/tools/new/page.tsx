import { ToolForm } from '@/components/admin/ToolForm'
import { getCategories } from '@/lib/actions/categories'
import { getTags } from '@/lib/actions/tags'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Nouvel outil' }

export default async function NewToolPage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()])

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Nouvel outil</h1>
        <p className="text-slate-500 text-sm mt-1">Ajoutez un nouvel outil au catalogue</p>
      </div>
      <ToolForm categories={categories} tags={tags} />
    </div>
  )
}
