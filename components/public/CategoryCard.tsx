import Link from 'next/link'
import type { Category } from '@prisma/client'

interface CategoryCardProps {
  category: Category & { _count: { tools: number } }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className="glass-card rounded-xl p-6 h-full transition-all duration-300 hover:translate-y-[-2px] hover:bg-slate-800/60 tool-card-glow">
        <div className="flex items-center gap-4 mb-3">
          {category.icon ? (
            <span className="text-3xl">{category.icon}</span>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
              {category.name}
            </h3>
            <span className="text-xs text-slate-500">{category._count.tools} outil{category._count.tools !== 1 ? 's' : ''}</span>
          </div>
        </div>
        {category.description && (
          <p className="text-sm text-slate-400 line-clamp-2">{category.description}</p>
        )}
      </div>
    </Link>
  )
}
