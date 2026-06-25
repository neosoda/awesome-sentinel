import { Suspense } from 'react'
import { ToolCard } from '@/components/public/ToolCard'
import { FilterPanel } from '@/components/public/FilterPanel'
import { SearchBar } from '@/components/public/SearchBar'
import { PageHeader } from '@/components/public/PageHeader'
import { getTools } from '@/lib/actions/tools'
import { getCategories } from '@/lib/actions/categories'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Catalogue — Awesome Sentinel',
  description: 'Explorez tous les outils référencés dans Awesome Sentinel.',
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    type?: string
    status?: string
    selfHosted?: string
    docker?: string
    openSource?: string
    sort?: string
  }>
}

export default async function ToolsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const [tools, categories] = await Promise.all([
    getTools({
      search: params.q,
      categoryId: params.category
        ? (await import('@/lib/prisma').then(({ prisma }) =>
            prisma.category.findUnique({ where: { slug: params.category } }).then((c) => c?.id ?? undefined)
          ))
        : undefined,
      type: params.type,
      status: params.status,
      isSelfHosted: params.selfHosted === 'true' ? true : undefined,
      hasDocker: params.docker === 'true' ? true : undefined,
      isOpenSource: params.openSource === 'true' ? true : undefined,
      sortBy: params.sort ?? 'createdAt',
    }),
    getCategories(),
  ])

  const hasFilters = params.q || params.category || params.type || params.status || params.selfHosted || params.docker || params.openSource

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        title="Catalogue"
        description="Recherchez, filtrez et comparez les outils référencés dans Awesome Sentinel."
        meta={`${tools.length} outil${tools.length !== 1 ? 's' : ''} trouvé${tools.length !== 1 ? 's' : ''}${hasFilters ? ' avec vos filtres' : ' dans la base'}`}
      />

      <div className="mb-8">
        <Suspense>
          <SearchBar defaultValue={params.q ?? ''} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-7 lg:flex-row">
        <Suspense>
          <FilterPanel categories={categories} />
        </Suspense>

        <div className="flex-1 min-w-0">
          {tools.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="md-card flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 text-5xl">🔍</div>
              <h3 className="mb-2 text-xl font-bold text-[var(--md-on-background)]">Aucun outil trouvé</h3>
              <p className="text-sm text-[var(--md-on-surface-variant)]">Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
