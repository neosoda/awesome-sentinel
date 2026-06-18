'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TagForm } from '@/components/admin/TagForm'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { deleteTag } from '@/lib/actions/tags'
import type { Tag } from '@prisma/client'

interface AdminTagsClientProps {
  tags: (Tag & { _count: { tools: number } })[]
}

export function AdminTagsClient({ tags }: AdminTagsClientProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [query, setQuery] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const filteredTags = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return tags

    return tags.filter((tag) =>
      [tag.name, tag.slug].some((value) => value.toLowerCase().includes(normalizedQuery))
    )
  }, [tags, query])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Tags</h1>
          <p className="text-slate-500 text-sm mt-1">{tags.length} tag{tags.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setEditingTag(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau tag
        </button>
      </div>

      {(showForm || editingTag) && (
        <div className="glass-card rounded-xl p-6 mb-6 border border-indigo-500/20">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">
            {editingTag ? `Modifier — ${editingTag.name}` : 'Nouveau tag'}
          </h2>
          <TagForm
            tag={editingTag ?? undefined}
            onSuccess={(message) => {
              setActionError(null)
              setNotice(message)
              setShowForm(false)
              setEditingTag(null)
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingTag(null)
            }}
          />
        </div>
      )}

      <div className="glass-card rounded-xl p-4 mb-6">
        <label htmlFor="tag-search" className="block text-xs text-slate-500 uppercase tracking-wider mb-2">
          Rechercher
        </label>
        <input
          id="tag-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nom ou slug"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 mb-6">
          {actionError}
        </div>
      )}

      {notice && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 mb-6">
          {notice}
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        {filteredTags.length > 0 ? (
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2 group"
                >
                  <span className="text-sm text-slate-300">#{tag.name}</span>
                  <span className="text-xs text-slate-600 bg-slate-700 px-1.5 py-0.5 rounded">{tag._count.tools}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingTag(tag); setShowForm(false) }}
                      className="p-0.5 text-slate-600 hover:text-indigo-400 transition-colors"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <ConfirmDialog
                      title="Supprimer le tag"
                      description={`Supprimer "#${tag.name}" ?`}
                      onConfirm={async () => {
                        setActionError(null)
                        setNotice(null)
                        const result = await deleteTag(tag.id)
                        if (result.success) {
                          setNotice('Tag supprimé avec succès.')
                          router.refresh()
                          return
                        }
                        setActionError(result.error)
                      }}
                      trigger={
                        <button className="p-0.5 text-slate-600 hover:text-red-400 transition-colors">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <div className="text-3xl mb-3">🏷️</div>
            <p>{query ? 'Aucun tag ne correspond à cette recherche.' : 'Aucun tag'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
