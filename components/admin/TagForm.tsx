'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { tagSchema, type TagFormData } from '@/lib/validations/tag'
import { createTag, updateTag } from '@/lib/actions/tags'
import { slugify } from '@/lib/utils'
import type { Tag } from '@prisma/client'

interface TagFormProps {
  tag?: Tag
  onSuccess?: (message: string) => void
  onCancel?: () => void
}

export function TagForm({ tag, onSuccess, onCancel }: TagFormProps) {
  const router = useRouter()
  const isEdit = !!tag
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag ?? {},
  })

  const name = useWatch({ control, name: 'name' })
  useEffect(() => {
    if (!isEdit && name) setValue('slug', slugify(name))
  }, [name, isEdit, setValue])

  const onSubmit = async (data: TagFormData) => {
    setSubmitError(null)
    const result = isEdit
      ? await updateTag(tag.id, data)
      : await createTag(data)

    if (result.success) {
      onSuccess?.(isEdit ? 'Tag mis à jour avec succès.' : 'Tag créé avec succès.')
      router.refresh()
    } else {
      setSubmitError(result.error)
    }
  }

  const inputClass = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all'
  const labelClass = 'block text-xs font-medium text-slate-400 mb-1.5'
  const errorClass = 'text-xs text-red-400 mt-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nom *</label>
          <input {...register('name')} placeholder="ex: docker" className={inputClass} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Slug *</label>
          <input {...register('slug')} placeholder="ex: docker" className={inputClass} />
          {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
        </div>
      </div>
      {submitError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {submitError}
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50">
          {isEdit ? 'Enregistrer' : 'Créer'}
        </button>
      </div>
    </form>
  )
}
