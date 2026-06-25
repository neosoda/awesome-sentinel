import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos — Awesome Sentinel',
  description: 'Awesome Sentinel, un catalogue personnel d’outils et d’applications.',
}

const contentItems = [
  { emoji: '🖥️', label: 'Applications self-hosted' },
  { emoji: '☁️', label: 'SaaS & outils en ligne' },
  { emoji: '💻', label: 'Outils CLI & dev' },
  { emoji: '🔒', label: 'Sécurité & réseau' },
  { emoji: '🤖', label: 'Outils IA & automatisation' },
  { emoji: '📊', label: 'Monitoring & observabilité' },
]

const stackItems = [
  { label: 'Next.js 16', desc: 'App Router' },
  { label: 'TypeScript', desc: 'Strict mode' },
  { label: 'Prisma', desc: 'ORM' },
  { label: 'PostgreSQL', desc: 'Base de données' },
  { label: 'Tailwind CSS', desc: 'Styles' },
  { label: 'Composants React', desc: 'UI sur mesure' },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="relative mb-12 overflow-hidden rounded-[40px] bg-[var(--md-secondary-container)] px-6 py-14 text-center sm:px-12">
        <div aria-hidden="true" className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#D0BCFF]/60 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#EFB8C8]/45 blur-3xl" />
        <div className="relative">
          <h1 className="text-5xl font-bold tracking-[-0.03em] text-[var(--md-on-secondary-container)] sm:text-6xl">
            Awesome Sentinel
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--md-on-secondary-container)]/80">
            Mon catalogue personnel d&apos;outils &amp; applications
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard title="Objectif">
          <p>
            Awesome Sentinel est un catalogue personnel regroupant tous les outils, applications self-hosted,
            SaaS, projets open source et bibliothèques que j&apos;utilise, teste ou surveille.
            L&apos;idée est d&apos;avoir un point d&apos;entrée unique, bien organisé et consultable rapidement.
          </p>
        </InfoCard>

        <InfoCard title="Contenu">
          <ul className="space-y-3">
            {contentItems.map(({ emoji, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--md-secondary-container)]" aria-hidden="true">
                  {emoji}
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard title="Stack technique">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stackItems.map(({ label, desc }) => (
              <div key={label} className="rounded-2xl bg-[var(--md-surface-container-high)] p-4">
                <div className="text-sm font-bold text-[var(--md-on-background)]">{label}</div>
                <div className="mt-1 text-xs text-[var(--md-on-surface-variant)]">{desc}</div>
              </div>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="Confidentialité">
          <p>
            Ce catalogue est public en lecture. L&apos;administration est accessible uniquement
            via Authentik (reverse proxy). Aucun compte utilisateur n&apos;est créé sur ce site.
          </p>
        </InfoCard>
      </div>
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="md-card p-6 sm:p-8">
      <h2 className="mb-4 text-2xl font-bold text-[var(--md-on-background)]">{title}</h2>
      <div className="text-sm leading-7 text-[var(--md-on-surface-variant)]">{children}</div>
    </section>
  )
}
