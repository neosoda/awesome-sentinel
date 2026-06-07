'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { deleteCategory } from '@/lib/actions/categories'
import type { Category } from '@prisma/client'

interface AdminCategoriesClientProps {
  categories: (Category & { _count: { tools: number } })[]
}

export function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Catégories</h1>
          <p className="text-slate-500 text-sm mt-1">{categories.length} catégorie{categories.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle catégorie
        </button>
      </div>

      {/* Form modal */}
      {(showForm || editingCategory) && (
        <div className="glass-card rounded-xl p-6 mb-6 border border-indigo-500/20">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">
            {editingCategory ? `Modifier — ${editingCategory.name}` : 'Nouvelle catégorie'}
          </h2>
          <CategoryForm
            category={editingCategory ?? undefined}
            onSuccess={() => { setShowForm(false); setEditingCategory(null) }}
          />
        </div>
      )}

      {/* List */}
      <div className="glass-card rounded-xl overflow-hidden">
        {categories.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs text-slate-500 font-medium px-5 py-3 uppercase tracking-wider">Nom</th>
                <th className="text-left text-xs text-slate-500 font-medium px-5 py-3 uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-center text-xs text-slate-500 font-medium px-5 py-3 uppercase tracking-wider">Outils</th>
                <th className="text-right text-xs text-slate-500 font-medium px-5 py-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm text-slate-200">{cat.icon} {cat.name}</span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <code className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{cat.slug}</code>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-sm text-slate-400">{cat._count.tools}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingCategory(cat); setShowForm(false) }}
                        className="p-1.5 text-slate-600 hover:text-indigo-400 transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <ConfirmDialog
                        title="Supprimer la catégorie"
                        description={`Supprimer "${cat.name}" ? Les outils liés perdront leur catégorie.`}
                        onConfirm={async () => {
                          await deleteCategory(cat.id)
                          router.refresh()
                        }}
                        trigger={
                          <button className="p-1.5 text-slate-600 hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <div className="text-3xl mb-3">📂</div>
            <p>Aucune catégorie</p>
          </div>
        )}
      </div>
    </div>
  )
}
