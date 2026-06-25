import Link from 'next/link'
import type { Category } from '@prisma/client'

interface CategoryCardProps {
  category: Category & { _count: { tools: number } }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="md-focus group block h-full rounded-[24px]">
      <article className="md-card md-interactive-card h-full p-5">
        <div className="mb-4 flex items-center gap-4">
          {category.icon ? (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--md-secondary-container)] text-2xl">
              {category.icon}
            </span>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--md-secondary-container)]">
              <svg className="h-6 w-6 text-[var(--md-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[var(--md-on-background)] transition-colors group-hover:text-[var(--md-primary)]">
              {category.name}
            </h3>
            <span className="text-xs text-[var(--md-on-surface-variant)]">
              {category._count.tools} outil{category._count.tools !== 1 ? 's' : ''}
            </span>
          </div>
          <span className="rounded-full bg-[var(--md-secondary-container)] px-2.5 py-1 text-xs font-bold text-[var(--md-primary)]">
            {category._count.tools}
          </span>
        </div>
        {category.description && (
          <p className="line-clamp-2 text-sm leading-6 text-[var(--md-on-surface-variant)]">
            {category.description}
          </p>
        )}
      </article>
    </Link>
  )
}
