import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accès refusé — Awesome Sentinel',
  robots: 'noindex',
}

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">🔒</div>
        <h1 className="text-4xl font-extrabold text-slate-100 mb-4">Accès refusé</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          L'administration est protégée par Authentik.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          ← Retour au catalogue
        </Link>
      </div>
    </div>
  )
}
