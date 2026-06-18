import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page introuvable — Awesome Sentinel',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="text-7xl mb-6">404</div>
        <h1 className="text-3xl font-bold text-slate-100 mb-4">Page introuvable</h1>
        <p className="text-slate-400 mb-8">
          La ressource demandée n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/tools"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors"
          >
            Ouvrir le catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}
