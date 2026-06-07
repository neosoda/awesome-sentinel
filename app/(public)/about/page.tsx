import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos — Awesome Sentinel',
  description: 'Awesome Sentinel, un catalogue personnel d\'outils et d\'applications.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold gradient-text mb-4">Awesome Sentinel</h1>
        <p className="text-xl text-slate-400">Mon catalogue personnel d'outils & applications</p>
      </div>

      <div className="space-y-8 text-slate-400 leading-relaxed">
        <div className="glass-card rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4">🎯 Objectif</h2>
          <p>
            Awesome Sentinel est un catalogue personnel regroupant tous les outils, applications self-hosted,
            SaaS, projets open source et bibliothèques que j'utilise, teste ou surveille.
            L'idée est d'avoir un point d'entrée unique, bien organisé et consultable rapidement.
          </p>
        </div>

        <div className="glass-card rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4">📦 Contenu</h2>
          <ul className="space-y-2">
            {[
              { emoji: '🖥️', label: 'Applications self-hosted' },
              { emoji: '☁️', label: 'SaaS & outils en ligne' },
              { emoji: '💻', label: 'Outils CLI & dev' },
              { emoji: '🔒', label: 'Sécurité & réseau' },
              { emoji: '🤖', label: 'Outils IA & automatisation' },
              { emoji: '📊', label: 'Monitoring & observabilité' },
            ].map(({ emoji, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span>{emoji}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4">⚡ Stack technique</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Next.js 14', desc: 'App Router' },
              { label: 'TypeScript', desc: 'Strict mode' },
              { label: 'Prisma', desc: 'ORM' },
              { label: 'PostgreSQL', desc: 'Base de données' },
              { label: 'Tailwind CSS', desc: 'Styles' },
              { label: 'shadcn/ui', desc: 'Composants' },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-slate-800/60 rounded-lg p-3">
                <div className="text-sm font-semibold text-slate-200">{label}</div>
                <div className="text-xs text-slate-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4">🔒 Confidentialité</h2>
          <p>
            Ce catalogue est public en lecture. L'administration est accessible uniquement
            via Authentik (reverse proxy). Aucun compte utilisateur n'est créé sur ce site.
          </p>
        </div>
      </div>
    </div>
  )
}
