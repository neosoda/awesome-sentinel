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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="md-card p-8 text-center sm:p-12">
        <div className="mb-4 text-5xl">⚠️</div>
        <h1 className="mb-3 text-3xl font-bold text-[var(--md-on-background)]">Chargement impossible</h1>
        <p className="mb-8 text-[var(--md-on-surface-variant)]">
          Une erreur inattendue a empêché l&apos;affichage de cette page publique.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => unstable_retry()}
            className="md-button md-button-primary md-focus"
          >
            Réessayer
          </button>
          <Link
            href="/tools"
            className="md-button md-button-tonal md-focus"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}
