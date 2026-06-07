import { notFound } from 'next/navigation'
import { ToolForm } from '@/components/admin/ToolForm'
import { getToolById } from '@/lib/actions/tools'
import { getCategories } from '@/lib/actions/categories'
import { getTags } from '@/lib/actions/tags'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const tool = await getToolById(id)
  return { title: tool ? `Modifier — ${tool.title}` : 'Outil introuvable' }
}

export default async function EditToolPage({ params }: PageProps) {
  const { id } = await params
  const [tool, categories, tags] = await Promise.all([
    getToolById(id),
    getCategories(),
    getTags(),
  ])

  if (!tool) notFound()

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Modifier — {tool.title}</h1>
        <p className="text-slate-500 text-sm mt-1">Modifiez les informations de cet outil</p>
      </div>
      <ToolForm categories={categories} tags={tags} tool={tool} />
    </div>
  )
}
