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

      {recommendedTools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader
            title="Recommandés"
            description="Les outils que j’utilise et recommande"
            href="/tools?sort=recommended"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="relative overflow-hidden bg-[var(--md-surface-container-low)] py-16">
          <div aria-hidden="true" className="absolute -right-24 top-4 h-64 w-64 rounded-full bg-[#D0BCFF]/30 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Catégories"
              description="Explorez par domaine"
              href="/categories"
              linkLabel="Toutes les catégories"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          title="Ajouts récents"
          description="Les derniers outils référencés"
          href="/tools"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </>
  )
}

function SectionHeader({
  title,
  description,
  href,
  linkLabel = 'Voir tout',
}: {
  title: string
  description: string
  href: string
  linkLabel?: string
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-[-0.02em] text-[var(--md-on-background)]">{title}</h2>
        <p className="mt-1 text-sm text-[var(--md-on-surface-variant)]">{description}</p>
      </div>
      <Link href={href} className="md-button md-button-outlined md-focus hidden sm:inline-flex">
        {linkLabel}
      </Link>
    </div>
  )
}
