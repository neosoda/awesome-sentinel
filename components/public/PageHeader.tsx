export function PageHeader({
  title,
  description,
  meta,
  icon,
}: {
  title: string
  description?: string | null
  meta?: string
  icon?: string
}) {
  return (
    <header className="mb-10 max-w-3xl">
      <div className="flex items-center gap-4">
        {icon && (
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[var(--md-secondary-container)] text-3xl">
            {icon}
          </span>
        )}
        <h1 className="text-4xl font-bold tracking-[-0.025em] text-[var(--md-on-background)] sm:text-5xl">
          {title}
        </h1>
      </div>
      {description && (
        <p className="mt-4 text-lg leading-8 text-[var(--md-on-surface-variant)]">{description}</p>
      )}
      {meta && (
        <p className="mt-3 text-sm font-medium text-[var(--md-primary)]">{meta}</p>
      )}
    </header>
  )
}
