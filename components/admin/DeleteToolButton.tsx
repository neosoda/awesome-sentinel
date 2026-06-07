'use client'

import { useRouter } from 'next/navigation'
import { ConfirmDialog } from './ConfirmDialog'
import { deleteTool } from '@/lib/actions/tools'

interface DeleteToolButtonProps {
  toolId: string
  toolTitle: string
}

export function DeleteToolButton({ toolId, toolTitle }: DeleteToolButtonProps) {
  const router = useRouter()

  return (
    <ConfirmDialog
      title="Supprimer l'outil"
      description={`Êtes-vous sûr de vouloir supprimer "${toolTitle}" ? Cette action est irréversible.`}
      confirmLabel="Supprimer"
      onConfirm={async () => {
        await deleteTool(toolId)
        router.refresh()
      }}
      trigger={
        <button className="p-1.5 text-slate-600 hover:text-red-400 transition-colors" title="Supprimer">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      }
    />
  )
}
