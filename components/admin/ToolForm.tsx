'use client'

import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toolSchema, type ToolFormData } from '@/lib/validations/tool'
import { createTool, updateTool } from '@/lib/actions/tools'
import { TOOL_TYPE_LABELS, TOOL_STATUS_LABELS, slugify } from '@/lib/utils'
import type { Category, Tag, Tool, ToolTag } from '@prisma/client'

interface ToolFormProps {
  categories: Category[]
  tags: Tag[]
  tool?: Tool & { tags: (ToolTag & { tag: Tag })[] }
}

export function ToolForm({ categories, tags, tool }: ToolFormProps) {
  const router = useRouter()
  const isEdit = !!tool

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ToolFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(toolSchema) as any,
    defaultValues: tool
      ? {
          ...tool,
          websiteUrl: tool.websiteUrl ?? '',
          githubUrl: tool.githubUrl ?? '',
          docsUrl: tool.docsUrl ?? '',
          demoUrl: tool.demoUrl ?? '',
          imageUrl: tool.imageUrl ?? '',
          categoryId: tool.categoryId ?? '',
          license: tool.license ?? '',
          pricing: tool.pricing ?? '',
          longDescription: tool.longDescription ?? '',
          publicNotes: tool.publicNotes ?? '',
          personalScore: tool.personalScore ?? undefined,
          tagIds: tool.tags.map((t) => t.tagId),
        }
      : {
          type: 'other',
          status: 'to_test',
          isFavorite: false,
          isRecommended: false,
          isSelfHosted: false,
          hasDocker: false,
          isOpenSource: false,
          tagIds: [],
        },
  })

  const title = watch('title')
  const selectedTagIds = watch('tagIds') ?? []

  // Auto-generate slug from title (create mode only)
  useEffect(() => {
    if (!isEdit && title) {
      setValue('slug', slugify(title))
    }
  }, [title, isEdit, setValue])

  const toggleTag = (tagId: string) => {
    const current = selectedTagIds
    if (current.includes(tagId)) {
      setValue('tagIds', current.filter((id) => id !== tagId))
    } else {
      setValue('tagIds', [...current, tagId])
    }
  }

  const onSubmit = async (data: ToolFormData) => {
    const result = isEdit
      ? await updateTool(tool.id, data)
      : await createTool(data)

    if (result.success) {
      router.push('/admin/tools')
      router.refresh()
    } else {
      alert(result.error)
    }
  }

  const inputClass = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all'
  const labelClass = 'block text-xs font-medium text-slate-400 mb-1.5'
  const errorClass = 'text-xs text-red-400 mt-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic info */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Informations de base</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Titre *</label>
            <input {...register('title')} placeholder="ex: Portainer" className={inputClass} />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input {...register('slug')} placeholder="ex: portainer" className={inputClass} />
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description courte *</label>
            <input {...register('shortDescription')} placeholder="Une phrase qui résume l'outil..." className={inputClass} />
            {errors.shortDescription && <p className={errorClass}>{errors.shortDescription.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description longue</label>
            <textarea {...register('longDescription')} rows={5} placeholder="Description détaillée..." className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Notes publiques</label>
            <textarea {...register('publicNotes')} rows={3} placeholder="Notes visibles par les visiteurs..." className={inputClass} />
          </div>
        </div>
      </div>

      {/* URLs */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Liens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'websiteUrl' as const, label: '🌐 Site web' },
            { name: 'githubUrl' as const, label: '🐙 GitHub' },
            { name: 'docsUrl' as const, label: '📖 Documentation' },
            { name: 'demoUrl' as const, label: '🚀 Démo' },
            { name: 'imageUrl' as const, label: '🖼️ Image / Logo URL' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className={labelClass}>{label}</label>
              <input {...register(name)} type="url" placeholder="https://..." className={inputClass} />
              {errors[name] && <p className={errorClass}>{errors[name]?.message}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Classification */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Classification</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Catégorie</label>
            <select {...register('categoryId')} className={inputClass}>
              <option value="">Sans catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select {...register('type')} className={inputClass}>
              {Object.entries(TOOL_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Statut</label>
            <select {...register('status')} className={inputClass}>
              {Object.entries(TOOL_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Score personnel (0-10)</label>
            <input {...register('personalScore')} type="number" min="0" max="10" step="1" placeholder="ex: 8" className={inputClass} />
            {errors.personalScore && <p className={errorClass}>{errors.personalScore.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Licence</label>
            <input {...register('license')} placeholder="MIT, Apache 2.0, GPLv3..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Prix / Modèle économique</label>
            <input {...register('pricing')} placeholder="Gratuit, Freemium, Open Source..." className={inputClass} />
          </div>
        </div>

        {/* Tags */}
        <div className="mt-5">
          <label className={labelClass}>Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`text-sm px-3 py-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  #{tag.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Boolean flags */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Options</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { name: 'isSelfHosted' as const, label: '🖥️ Self-Hosted' },
            { name: 'hasDocker' as const, label: '🐳 Docker disponible' },
            { name: 'isOpenSource' as const, label: '💻 Open Source' },
            { name: 'isRecommended' as const, label: '⭐ Recommandé' },
            { name: 'isFavorite' as const, label: '❤️ Favori' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer group">
              <input
                {...register(name)}
                type="checkbox"
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          )}
          {isEdit ? 'Enregistrer les modifications' : 'Créer l\'outil'}
        </button>
      </div>
    </form>
  )
}
