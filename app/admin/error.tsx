'use client'

import { useEffect } from 'react'

export default function AdminError({
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
    <div className="max-w-3xl">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-3">Erreur d’administration</h1>
        <p className="text-slate-300 mb-6">
          L&apos;écran admin n&apos;a pas pu être rendu correctement. Réessayez avant toute nouvelle action.
        </p>
        <button
          onClick={() => unstable_retry()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Recharger ce segment
        </button>
      </div>
    </div>
  )
}
