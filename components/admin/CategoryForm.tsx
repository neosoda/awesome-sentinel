'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { categorySchema, type CategoryFormData } from '@/lib/validations/category'
import { createCategory, updateCategory } from '@/lib/actions/categories'
import { slugify } from '@/lib/utils'
import type { Category } from '@prisma/client'

interface CategoryFormProps {
  category?: Category
  onSuccess?: (message: string) => void
  onCancel?: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const router = useRouter()
  const isEdit = !!category
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? { ...category, description: category.description ?? '', icon: category.icon ?? '' }
      : {},
  })

  const name = useWatch({ control, name: 'name' })
  useEffect(() => {
    if (!isEdit && name) setValue('slug', slugify(name))
  }, [name, isEdit, setValue])

  const onSubmit = async (data: CategoryFormData) => {
    setSubmitError(null)
    const result = isEdit
      ? await updateCategory(category.id, data)
      : await createCategory(data)

    if (result.success) {
      onSuccess?.(isEdit ? 'Catégorie mise à jour avec succès.' : 'Catégorie créée avec succès.')
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
          <input {...register('name')} placeholder="ex: Monitoring" className={inputClass} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Slug *</label>
          <input {...register('slug')} placeholder="ex: monitoring" className={inputClass} />
          {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Icône (emoji)</label>
          <input {...register('icon')} placeholder="ex: 📊" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <input {...register('description')} placeholder="Description courte..." className={inputClass} />
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
