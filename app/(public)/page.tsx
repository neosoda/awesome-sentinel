import { HeroSection } from '@/components/public/HeroSection'
import { ToolCard } from '@/components/public/ToolCard'
import { CategoryCard } from '@/components/public/CategoryCard'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Awesome Sentinel — Catalogue d\'outils & applications self-hosted',
}

async function getHomeData() {
  const [toolCount, recommendedTools, recentTools, categories] = await Promise.all([
    prisma.tool.count(),
    prisma.tool.findMany({
      where: { isRecommended: true },
      take: 6,
      orderBy: { updatedAt: 'desc' },
      include: { category: true, tags: { include: { tag: true } } },
    }),
    prisma.tool.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { category: true, tags: { include: { tag: true } } },
    }),
    prisma.category.findMany({
      take: 6,
      orderBy: { name: 'asc' },
      include: { _count: { select: { tools: true } } },
    }),
  ])
  return { toolCount, recommendedTools, recentTools, categories }
}

export default async function HomePage() {
  const { toolCount, recommendedTools, recentTools, categories } = await getHomeData()

  return (
    <>
      <HeroSection toolCount={toolCount} />

      {/* Recommended */}
      {recommendedTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">⭐ Recommandés</h2>
              <p className="text-slate-500 text-sm mt-1">Les outils que j&apos;utilise et recommande</p>
            </div>
            <Link href="/tools?sort=recommended" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/40">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">📂 Catégories</h2>
              <p className="text-slate-500 text-sm mt-1">Explorez par domaine</p>
            </div>
            <Link href="/categories" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Toutes les catégories →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Recent additions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/40">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">🆕 Ajouts récents</h2>
            <p className="text-slate-500 text-sm mt-1">Les derniers outils référencés</p>
          </div>
          <Link href="/tools" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            Tout voir →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </>
  )
}
