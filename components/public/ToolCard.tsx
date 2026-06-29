import Link from 'next/link'
import Image from 'next/image'
import type { Tool, Category, Tag, ToolTag } from '@prisma/client'
import {
  TOOL_TYPE_LABELS,
  TOOL_STATUS_LABELS,
  PUBLIC_TOOL_TYPE_COLORS,
  PUBLIC_TOOL_STATUS_COLORS,
  cn,
} from '@/lib/utils'

type ToolWithRelations = Tool & {
  category: Category | null
  tags: (ToolTag & { tag: Tag })[]
}

interface ToolCardProps {
  tool: ToolWithRelations
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} className="md-focus group block h-full rounded-[24px]">
      <article className="md-card md-interactive-card flex h-full min-h-[17rem] flex-col p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3 sm:gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--md-surface-container-high)] shadow-sm sm:h-14 sm:w-14">
            {tool.imageUrl ? (
              <Image
                src={tool.imageUrl}
                alt={tool.title}
                width={56}
                height={56}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-xl font-bold text-[var(--md-primary)] sm:text-2xl">
                {tool.title.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-bold leading-6 text-[var(--md-on-background)] transition-colors group-hover:text-[var(--md-primary)] sm:text-lg">
              {tool.title}
            </h3>
            {tool.category && (
              <span className="mt-1 block truncate text-xs font-medium text-[var(--md-primary)]">{tool.category.name}</span>
            )}
          </div>
          {tool.personalScore !== null && tool.personalScore !== undefined && (
            <div className="flex flex-shrink-0 items-center gap-1 text-xs font-bold text-[#7A5900]">
              <span aria-hidden="true" className="text-base text-[#E5A900]">★</span>
              {tool.personalScore}
            </div>
          )}
        </div>

        <p className="line-clamp-3 mb-4 flex-1 text-sm leading-6 text-[var(--md-on-surface-variant)]">
          {tool.shortDescription}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className={cn('md-chip border', PUBLIC_TOOL_TYPE_COLORS[tool.type])}>
            {TOOL_TYPE_LABELS[tool.type]}
          </span>
          <span className={cn('md-chip border', PUBLIC_TOOL_STATUS_COLORS[tool.status])}>
            {TOOL_STATUS_LABELS[tool.status]}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--md-outline-variant)] pt-4">
          {tool.isSelfHosted && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--md-on-surface-variant)]">
              <ServerIcon className="h-3 w-3" /> Self-Hosted
            </span>
          )}
          {tool.hasDocker && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--md-on-surface-variant)]">
              <DockerIcon className="h-3 w-3" /> Docker
            </span>
          )}
          {tool.isOpenSource && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--md-on-surface-variant)]">
              <CodeIcon className="h-3 w-3" /> Open Source
            </span>
          )}
          {tool.isRecommended && (
            <span className="ml-auto flex items-center gap-1 text-xs font-medium text-[var(--md-tertiary)]">
              <StarIcon className="h-3 w-3 fill-current" /> Recommandé
            </span>
          )}
          {tool.isFavorite && !tool.isRecommended && (
            <span className="ml-auto flex items-center gap-1 text-xs font-medium text-[var(--md-tertiary)]">
              <HeartIcon className="h-3 w-3 fill-current" /> Favori
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}

function ServerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  )
}

function DockerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.3 2.61-2.164.638-.72 1.14-1.563 1.45-2.47h.12c.753 0 1.482-.29 2.02-.81.303-.285.538-.634.69-1.02.032-.083.06-.167.084-.257a.875.875 0 0 0-.5-1.054z" />
    </svg>
  )
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
