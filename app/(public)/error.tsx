'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function PublicError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-3">Chargement impossible</h1>
        <p className="text-slate-400 mb-8">
          Une erreur inattendue a empêché l&apos;affichage de cette page publique.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/tools"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}
