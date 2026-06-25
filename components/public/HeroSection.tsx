import Link from 'next/link'

const toolTiles = [
  { label: 'Docker', short: 'D', className: 'left-[26%] top-[6%] -rotate-3' },
  { label: 'Git', short: 'G', className: 'right-[14%] top-[14%] rotate-3' },
  { label: 'Next', short: 'N', className: 'left-[9%] top-[43%] -rotate-2' },
  { label: 'Kubernetes', short: 'K', className: 'left-[48%] top-[38%] rotate-2' },
  { label: 'Open source', short: 'O', className: 'right-[8%] top-[55%] -rotate-3' },
  { label: 'Database', short: 'DB', className: 'left-[35%] bottom-[2%] rotate-2' },
]

export function HeroSection({ toolCount }: { toolCount: number }) {
  return (
    <section className="px-4 pb-8 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#F8F2FF_0%,#F3EDF7_54%,#EEE6FA_100%)] px-6 py-14 shadow-[0_12px_40px_rgba(103,80,164,0.09)] sm:rounded-[48px] sm:px-10 lg:px-16 lg:py-20">
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-96 w-96 rounded-full bg-[#D0BCFF]/60 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-32 right-16 h-80 w-80 rounded-[45%] bg-[#EFB8C8]/45 blur-3xl" />
        <div aria-hidden="true" className="absolute left-[52%] top-20 h-56 w-80 rotate-12 rounded-[100px_28px_100px_100px] bg-[#E8DEF8]/80 blur-2xl" />

        <div className="relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 text-sm font-medium text-[var(--md-primary)]">
              {toolCount} outils référencés
            </p>
            <h1 className="max-w-xl text-5xl font-bold tracking-[-0.03em] text-[var(--md-on-background)] sm:text-6xl lg:text-7xl">
              Awesome
              <br />
              Sentinel
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--md-on-surface-variant)] sm:text-xl">
              Mon catalogue personnel d&apos;outils, d&apos;applications self-hosted, de SaaS et de projets open source.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--md-on-surface-variant)]">
              Filtrez, explorez, découvrez les meilleurs outils pour votre stack.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/tools" className="md-button md-button-primary md-focus">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Voir le catalogue
              </Link>
              <Link href="/categories" className="md-button md-button-tonal md-focus">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                Catégories
              </Link>
              <a
                href="https://github.com/neosoda/awesome-sentinel"
                target="_blank"
                rel="noopener noreferrer"
                className="md-button md-button-outlined md-focus"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

          <div className="relative hidden min-h-[390px] lg:block" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--md-primary)]/35" />
            <div className="absolute left-[18%] top-[13%] h-40 w-56 rounded-[80px_24px_80px_80px] bg-[#D0BCFF]/55" />
            <div className="absolute bottom-[8%] right-[5%] h-44 w-64 rounded-[90px_90px_30px_90px] bg-[#EFB8C8]/48" />
            {toolTiles.map((item) => (
              <div
                key={item.label}
                className={`absolute flex h-20 w-20 items-center justify-center rounded-[22px] border border-white/80 bg-white/90 text-lg font-bold text-[var(--md-primary)] shadow-[0_12px_30px_rgba(29,25,43,0.13)] backdrop-blur ${item.className}`}
                title={item.label}
              >
                {item.short}
              </div>
            ))}
            <div className="absolute left-[51%] top-[58%] flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[24px] bg-[var(--md-primary)] text-white shadow-xl">
              <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
